package com.employeeportal.dto.report;

public record HeadcountByDepartmentDto(
        Long departmentId,
        String departmentName,
        long activeCount,
        long inactiveCount
) {}
