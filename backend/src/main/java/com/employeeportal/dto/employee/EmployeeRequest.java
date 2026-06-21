package com.employeeportal.dto.employee;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public record EmployeeRequest(
        @NotBlank @Size(max = 100) String firstName,
        @NotBlank @Size(max = 100) String lastName,
        @NotNull Long departmentId,
        @NotBlank @Size(max = 100) String designation,
        @NotNull @PastOrPresent LocalDate dateOfJoining,
        @NotNull @Positive BigDecimal salary,
        @Size(max = 20) String phone,
        String address,
        Long managerId,
        Long userId,
        @Email String email
) {}
