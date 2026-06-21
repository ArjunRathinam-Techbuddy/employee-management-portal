package com.employeeportal.mapper;

import com.employeeportal.dto.leave.LeaveResponse;
import com.employeeportal.entity.LeaveRequest;
import org.springframework.stereotype.Component;

import java.time.temporal.ChronoUnit;

@Component
public class LeaveMapper {

    public LeaveResponse toResponse(LeaveRequest lr) {
        return new LeaveResponse(
                lr.getId(),
                lr.getEmployee().getId(),
                lr.getEmployee().getFirstName() + " " + lr.getEmployee().getLastName(),
                lr.getLeaveType(),
                lr.getStartDate(),
                lr.getEndDate(),
                ChronoUnit.DAYS.between(lr.getStartDate(), lr.getEndDate()) + 1,
                lr.getReason(),
                lr.getStatus(),
                lr.getReviewedBy() != null ? lr.getReviewedBy().getEmail() : null,
                lr.getReviewedAt(),
                lr.getRejectReason(),
                lr.getCreatedAt()
        );
    }
}
