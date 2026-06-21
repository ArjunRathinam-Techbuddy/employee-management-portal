package com.employeeportal.dto.report;

import com.employeeportal.entity.enums.LeaveStatus;

public record LeaveSummaryDto(
        LeaveStatus status,
        long count
) {}
