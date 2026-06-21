package com.employeeportal.dto.department;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record DepartmentRequest(
        @NotBlank @Size(max = 100) String name,
        String description,
        Long headEmployeeId
) {}
