package com.employeeportal.service;

import com.employeeportal.annotation.Auditable;
import com.employeeportal.dto.leave.LeaveDecisionDto;
import com.employeeportal.dto.leave.LeaveRequestDto;
import com.employeeportal.dto.leave.LeaveResponse;
import com.employeeportal.entity.Employee;
import com.employeeportal.entity.LeaveRequest;
import com.employeeportal.entity.User;
import com.employeeportal.entity.enums.LeaveStatus;
import com.employeeportal.exception.BusinessRuleViolationException;
import com.employeeportal.exception.ResourceNotFoundException;
import com.employeeportal.mapper.LeaveMapper;
import com.employeeportal.repository.EmployeeRepository;
import com.employeeportal.repository.LeaveRequestRepository;
import com.employeeportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class LeaveService {

    private static final long MAX_DURATION_DAYS = 30;

    private final LeaveRequestRepository leaveRequestRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final LeaveMapper leaveMapper;

    @Auditable(action = "CREATE", entityType = "LEAVE_REQUEST")
    @Transactional
    public LeaveResponse create(Long employeeId, LeaveRequestDto dto) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + employeeId));

        validateDates(dto.startDate(), dto.endDate());

        boolean overlaps = !leaveRequestRepository
                .findOverlapping(employeeId, dto.startDate(), dto.endDate())
                .isEmpty();
        if (overlaps) {
            throw new BusinessRuleViolationException("Leave dates overlap with an existing request");
        }

        LeaveRequest leave = LeaveRequest.builder()
                .employee(employee)
                .leaveType(dto.leaveType())
                .startDate(dto.startDate())
                .endDate(dto.endDate())
                .reason(dto.reason())
                .status(LeaveStatus.PENDING)
                .build();

        return leaveMapper.toResponse(leaveRequestRepository.save(leave));
    }

    @Transactional(readOnly = true)
    public LeaveResponse getById(Long id) {
        return leaveMapper.toResponse(findOrThrow(id));
    }

    @Transactional(readOnly = true)
    public Page<LeaveResponse> listForEmployee(Long employeeId, LeaveStatus status, Pageable pageable) {
        Page<LeaveRequest> page = status != null
                ? leaveRequestRepository.findByEmployeeIdAndStatus(employeeId, status, pageable)
                : leaveRequestRepository.findByEmployeeId(employeeId, pageable);
        return page.map(leaveMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<LeaveResponse> listAll(LeaveStatus status, Pageable pageable) {
        Page<LeaveRequest> page = status != null
                ? leaveRequestRepository.findByStatus(status, pageable)
                : leaveRequestRepository.findAll(pageable);
        return page.map(leaveMapper::toResponse);
    }

    @Auditable(action = "APPROVE", entityType = "LEAVE_REQUEST")
    @Transactional
    public LeaveResponse approve(Long id, Long reviewerUserId) {
        LeaveRequest leave = findPendingOrThrow(id);
        User reviewer = resolveReviewer(reviewerUserId);

        leave.setStatus(LeaveStatus.APPROVED);
        leave.setReviewedBy(reviewer);
        leave.setReviewedAt(OffsetDateTime.now());

        return leaveMapper.toResponse(leaveRequestRepository.save(leave));
    }

    @Auditable(action = "REJECT", entityType = "LEAVE_REQUEST")
    @Transactional
    public LeaveResponse reject(Long id, Long reviewerUserId, LeaveDecisionDto dto) {
        LeaveRequest leave = findPendingOrThrow(id);
        User reviewer = resolveReviewer(reviewerUserId);

        leave.setStatus(LeaveStatus.REJECTED);
        leave.setReviewedBy(reviewer);
        leave.setReviewedAt(OffsetDateTime.now());
        leave.setRejectReason(dto.rejectReason());

        return leaveMapper.toResponse(leaveRequestRepository.save(leave));
    }

    @Auditable(action = "CANCEL", entityType = "LEAVE_REQUEST")
    @Transactional
    public LeaveResponse cancel(Long id) {
        LeaveRequest leave = findPendingOrThrow(id);
        leave.setStatus(LeaveStatus.CANCELLED);
        return leaveMapper.toResponse(leaveRequestRepository.save(leave));
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    private void validateDates(LocalDate start, LocalDate end) {
        if (start.isBefore(LocalDate.now().plusDays(1))) {
            throw new BusinessRuleViolationException("Leave start date must be in the future");
        }
        if (end.isBefore(start)) {
            throw new BusinessRuleViolationException("End date cannot be before start date");
        }
        long duration = ChronoUnit.DAYS.between(start, end) + 1;
        if (duration > MAX_DURATION_DAYS) {
            throw new BusinessRuleViolationException("Leave duration cannot exceed " + MAX_DURATION_DAYS + " days");
        }
    }

    private LeaveRequest findPendingOrThrow(Long id) {
        LeaveRequest leave = findOrThrow(id);
        if (leave.getStatus() != LeaveStatus.PENDING) {
            throw new BusinessRuleViolationException("Only pending leave requests can be modified");
        }
        return leave;
    }

    private LeaveRequest findOrThrow(Long id) {
        return leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found: " + id));
    }

    private User resolveReviewer(Long reviewerUserId) {
        return userRepository.findById(reviewerUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Reviewer not found: " + reviewerUserId));
    }
}
