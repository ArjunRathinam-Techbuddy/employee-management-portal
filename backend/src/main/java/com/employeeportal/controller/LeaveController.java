package com.employeeportal.controller;

import com.employeeportal.dto.common.PagedResponse;
import com.employeeportal.dto.leave.LeaveDecisionDto;
import com.employeeportal.dto.leave.LeaveRequestDto;
import com.employeeportal.dto.leave.LeaveResponse;
import com.employeeportal.entity.enums.LeaveStatus;
import com.employeeportal.exception.ResourceNotFoundException;
import com.employeeportal.repository.EmployeeRepository;
import com.employeeportal.security.UserPrincipal;
import com.employeeportal.service.LeaveService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/leaves")
@RequiredArgsConstructor
public class LeaveController {

    private final LeaveService leaveService;
    private final EmployeeRepository employeeRepository;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<LeaveResponse> create(@Valid @RequestBody LeaveRequestDto dto, Authentication auth) {
        Long employeeId = currentEmployeeId(auth);
        return ResponseEntity.status(201).body(leaveService.create(employeeId, dto));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @leaveAccessGuard.isOwner(#id, authentication)")
    public ResponseEntity<LeaveResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(leaveService.getById(id));
    }

    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PagedResponse<LeaveResponse>> myLeaves(
            @RequestParam(required = false) LeaveStatus status,
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable,
            Authentication auth) {
        Long employeeId = currentEmployeeId(auth);
        var page = leaveService.listForEmployee(employeeId, status, pageable);
        return ResponseEntity.ok(PagedResponse.from(page));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PagedResponse<LeaveResponse>> listAll(
            @RequestParam(required = false) LeaveStatus status,
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
        var page = leaveService.listAll(status, pageable);
        return ResponseEntity.ok(PagedResponse.from(page));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LeaveResponse> approve(@PathVariable Long id, Authentication auth) {
        Long reviewerUserId = ((UserPrincipal) auth.getPrincipal()).getId();
        return ResponseEntity.ok(leaveService.approve(id, reviewerUserId));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LeaveResponse> reject(
            @PathVariable Long id, @Valid @RequestBody LeaveDecisionDto dto, Authentication auth) {
        Long reviewerUserId = ((UserPrincipal) auth.getPrincipal()).getId();
        return ResponseEntity.ok(leaveService.reject(id, reviewerUserId, dto));
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasRole('ADMIN') or @leaveAccessGuard.isOwner(#id, authentication)")
    public ResponseEntity<LeaveResponse> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(leaveService.cancel(id));
    }

    private Long currentEmployeeId(Authentication auth) {
        Long userId = ((UserPrincipal) auth.getPrincipal()).getId();
        return employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("No employee record linked to this user"))
                .getId();
    }
}
