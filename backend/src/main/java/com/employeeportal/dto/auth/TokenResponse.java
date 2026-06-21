package com.employeeportal.dto.auth;

public record TokenResponse(
        String accessToken,
        String refreshToken
) {}
