package com.employeeportal.service;

import com.employeeportal.dto.auth.LoginRequest;
import com.employeeportal.dto.auth.LoginResponse;
import com.employeeportal.dto.auth.TokenResponse;
import com.employeeportal.entity.RefreshToken;
import com.employeeportal.entity.User;
import com.employeeportal.exception.AccountLockedException;
import com.employeeportal.exception.InvalidCredentialsException;
import com.employeeportal.exception.TokenRefreshException;
import com.employeeportal.repository.RefreshTokenRepository;
import com.employeeportal.repository.UserRepository;
import com.employeeportal.security.JwtService;
import com.employeeportal.security.UserPrincipal;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.util.Base64;
import java.util.HexFormat;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final long LOCK_DURATION_MINUTES = 15;

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuditService auditService;
    private final HttpServletRequest httpServletRequest;

    @Value("${jwt.refresh-expiry-ms}")
    private long refreshExpiryMs;

    @Transactional
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (user.isLocked()) {
            throw new AccountLockedException("Account locked. Try again after " + user.getLockedUntil());
        }

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            registerFailedAttempt(user);
            throw new InvalidCredentialsException("Invalid email or password");
        }

        if (!user.isActive()) {
            throw new InvalidCredentialsException("Account is deactivated");
        }

        user.setFailedAttempts(0);
        user.setLockedUntil(null);
        user.setLastLoginAt(OffsetDateTime.now());
        userRepository.save(user);

        UserPrincipal principal = new UserPrincipal(user);
        String accessToken = jwtService.generateAccessToken(principal);
        String rawRefreshToken = issueRefreshToken(user);

        auditService.record(user.getId(), "LOGIN", "USER", user.getId(),
                null, null, httpServletRequest.getRemoteAddr());

        return new LoginResponse(accessToken, rawRefreshToken, user.getEmail(), user.getRole().name());
    }

    @Transactional
    public TokenResponse refresh(String rawRefreshToken) {
        String hash = hash(rawRefreshToken);

        RefreshToken stored = refreshTokenRepository.findByTokenHash(hash)
                .orElseThrow(() -> new TokenRefreshException("Invalid refresh token"));

        if (stored.isRevoked() || stored.isExpired()) {
            throw new TokenRefreshException("Refresh token expired or revoked");
        }

        // Rotate: revoke old, issue new
        stored.setRevoked(true);
        refreshTokenRepository.save(stored);

        User user = stored.getUser();
        UserPrincipal principal = new UserPrincipal(user);
        String newAccessToken = jwtService.generateAccessToken(principal);
        String newRawRefreshToken = issueRefreshToken(user);

        return new TokenResponse(newAccessToken, newRawRefreshToken);
    }

    @Transactional
    public void logout(String rawRefreshToken) {
        refreshTokenRepository.findByTokenHash(hash(rawRefreshToken))
                .ifPresent(rt -> {
                    rt.setRevoked(true);
                    refreshTokenRepository.save(rt);
                    auditService.record(rt.getUser().getId(), "LOGOUT", "USER", rt.getUser().getId(),
                            null, null, httpServletRequest.getRemoteAddr());
                });
    }

    private void registerFailedAttempt(User user) {
        int attempts = user.getFailedAttempts() + 1;
        user.setFailedAttempts(attempts);
        if (attempts >= MAX_FAILED_ATTEMPTS) {
            user.setLockedUntil(OffsetDateTime.now().plusMinutes(LOCK_DURATION_MINUTES));
        }
        userRepository.save(user);
    }

    private String issueRefreshToken(User user) {
        String raw = generateSecureToken();
        RefreshToken token = RefreshToken.builder()
                .user(user)
                .tokenHash(hash(raw))
                .expiresAt(OffsetDateTime.now().plus(java.time.Duration.ofMillis(refreshExpiryMs)))
                .revoked(false)
                .build();
        refreshTokenRepository.save(token);
        return raw;
    }

    private String generateSecureToken() {
        byte[] bytes = new byte[64];
        new SecureRandom().nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hash(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashed = digest.digest(value.getBytes());
            return HexFormat.of().formatHex(hashed);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }
}
