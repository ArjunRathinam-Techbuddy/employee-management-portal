package com.employeeportal.dto.leave;

import com.employeeportal.entity.enums.LeaveType;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record LeaveRequestDto(
        @NotNull LeaveType leaveType,
        @NotNull @Future LocalDate startDate,
        @NotNull LocalDate endDate,
        String reason
) {}
