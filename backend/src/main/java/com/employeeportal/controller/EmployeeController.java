package com.employeeportal.controller;

import com.employeeportal.dto.common.PagedResponse;
import com.employeeportal.dto.employee.EmployeeRequest;
import com.employeeportal.dto.employee.EmployeeResponse;
import com.employeeportal.dto.leave.LeaveResponse;
import com.employeeportal.entity.enums.LeaveStatus;
import com.employeeportal.service.EmployeeService;
import com.employeeportal.service.LeaveService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;
    private final LeaveService leaveService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EmployeeResponse> create(@Valid @RequestBody EmployeeRequest request) {
        return ResponseEntity.status(201).body(employeeService.create(request));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @employeeAccessGuard.isSelf(#id, authentication)")
    public ResponseEntity<EmployeeResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getById(id));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PagedResponse<EmployeeResponse>> list(
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) String designation,
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 20, sort = "id") Pageable pageable) {
        var page = employeeService.list(departmentId, designation, active, search, pageable);
        return ResponseEntity.ok(PagedResponse.from(page));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EmployeeResponse> update(@PathVariable Long id, @Valid @RequestBody EmployeeRequest request) {
        return ResponseEntity.ok(employeeService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> softDelete(@PathVariable Long id) {
        employeeService.softDelete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/reactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> reactivate(@PathVariable Long id) {
        employeeService.reactivate(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/leave-history")
    @PreAuthorize("hasRole('ADMIN') or @employeeAccessGuard.isSelf(#id, authentication)")
    public ResponseEntity<PagedResponse<LeaveResponse>> leaveHistory(
            @PathVariable Long id,
            @RequestParam(required = false) LeaveStatus status,
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
        var page = leaveService.listForEmployee(id, status, pageable);
        return ResponseEntity.ok(PagedResponse.from(page));
    }
}
