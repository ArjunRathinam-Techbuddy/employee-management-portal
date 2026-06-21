package com.employeeportal.dto.department;

import java.time.OffsetDateTime;

public record DepartmentResponse(
        Long id,
        String name,
        String description,
        Long headEmployeeId,
        String headEmployeeName,
        long employeeCount,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {}
