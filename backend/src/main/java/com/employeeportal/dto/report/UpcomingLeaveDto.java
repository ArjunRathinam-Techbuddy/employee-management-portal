package com.employeeportal.dto.report;

import java.time.LocalDate;

public record UpcomingLeaveDto(
        Long employeeId,
        String employeeName,
        String departmentName,
        LocalDate startDate,
        LocalDate endDate,
        String leaveType
) {}
