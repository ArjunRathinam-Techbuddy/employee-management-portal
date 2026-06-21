package com.employeeportal.controller;

import com.employeeportal.dto.auth.CurrentUserResponse;
import com.employeeportal.dto.auth.LoginRequest;
import com.employeeportal.dto.auth.LoginResponse;
import com.employeeportal.dto.auth.RefreshRequest;
import com.employeeportal.dto.auth.TokenResponse;
import com.employeeportal.repository.EmployeeRepository;
import com.employeeportal.security.UserPrincipal;
import com.employeeportal.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final EmployeeRepository employeeRepository;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refresh(@Valid @RequestBody RefreshRequest request) {
        return ResponseEntity.ok(authService.refresh(request.refreshToken()));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@Valid @RequestBody RefreshRequest request) {
        authService.logout(request.refreshToken());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<CurrentUserResponse> me(Authentication authentication) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        Long employeeId = employeeRepository.findByUserId(principal.getId())
                .map(e -> e.getId())
                .orElse(null);
        return ResponseEntity.ok(new CurrentUserResponse(
                principal.getId(), principal.getUsername(), principal.getRole(), employeeId));
    }
}
