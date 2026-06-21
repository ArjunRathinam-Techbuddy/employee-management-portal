package com.employeeportal.dto.leave;

import com.employeeportal.entity.enums.LeaveStatus;
import com.employeeportal.entity.enums.LeaveType;

import java.time.LocalDate;
import java.time.OffsetDateTime;

public record LeaveResponse(
        Long id,
        Long employeeId,
        String employeeName,
        LeaveType leaveType,
        LocalDate startDate,
        LocalDate endDate,
        long durationDays,
        String reason,
        LeaveStatus status,
        String reviewedByEmail,
        OffsetDateTime reviewedAt,
        String rejectReason,
        OffsetDateTime createdAt
) {}
