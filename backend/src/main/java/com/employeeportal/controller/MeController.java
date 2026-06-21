package com.employeeportal.controller;

import com.employeeportal.dto.employee.EmployeeResponse;
import com.employeeportal.dto.employee.MyProfileUpdateRequest;
import com.employeeportal.security.UserPrincipal;
import com.employeeportal.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/me")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class MeController {

    private final EmployeeService employeeService;

    @GetMapping("/profile")
    public ResponseEntity<EmployeeResponse> getProfile(Authentication auth) {
        Long userId = ((UserPrincipal) auth.getPrincipal()).getId();
        return ResponseEntity.ok(employeeService.getMyProfile(userId));
    }

    @PutMapping("/profile")
    public ResponseEntity<EmployeeResponse> updateProfile(
            @RequestBody MyProfileUpdateRequest request, Authentication auth) {
        Long userId = ((UserPrincipal) auth.getPrincipal()).getId();
        return ResponseEntity.ok(employeeService.updateMyProfile(userId, request));
    }
}
