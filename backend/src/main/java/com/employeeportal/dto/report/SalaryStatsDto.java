package com.employeeportal.dto.report;

import java.math.BigDecimal;

public record SalaryStatsDto(
        Long departmentId,
        String departmentName,
        BigDecimal minSalary,
        BigDecimal maxSalary,
        BigDecimal avgSalary,
        long employeeCount
) {}
