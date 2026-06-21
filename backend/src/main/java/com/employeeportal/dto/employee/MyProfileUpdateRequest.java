package com.employeeportal.dto.employee;

public record MyProfileUpdateRequest(
        String phone,
        String address
) {}
