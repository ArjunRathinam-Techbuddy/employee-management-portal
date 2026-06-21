package com.employeeportal.dto.employee;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

public record EmployeeResponse(
        Long id,
        String employeeCode,
        String firstName,
        String lastName,
        Long departmentId,
        String departmentName,
        String designation,
        LocalDate dateOfJoining,
        BigDecimal salary,
        String phone,
        String address,
        String profilePhotoUrl,
        Long managerId,
        String managerName,
        boolean active,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {}
