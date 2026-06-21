package com.employeeportal.dto.auth;

public record CurrentUserResponse(
        Long id,
        String email,
        String role,
        Long employeeId
) {}
