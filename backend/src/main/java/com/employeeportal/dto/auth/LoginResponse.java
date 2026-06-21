package com.employeeportal.dto.auth;

public record LoginResponse(
        String accessToken,
        String refreshToken,
        String email,
        String role
) {}
