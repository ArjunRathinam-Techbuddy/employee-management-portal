package com.employeeportal.dto.report;

import java.time.LocalDate;

public record NewJoinerDto(
        Long employeeId,
        String employeeCode,
        String fullName,
        String departmentName,
        LocalDate dateOfJoining
) {}
