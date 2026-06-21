package com.employeeportal.dto.employee;

public record EmployeeSummaryResponse(
        Long id,
        String employeeCode,
        String firstName,
        String lastName,
        String departmentName,
        String designation,
        boolean active
) {}
