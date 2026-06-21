package com.employeeportal.dto.leave;

import jakarta.validation.constraints.Size;

public record LeaveDecisionDto(
        @Size(max = 500) String rejectReason
) {}
