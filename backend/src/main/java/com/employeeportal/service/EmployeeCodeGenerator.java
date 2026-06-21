package com.employeeportal.service;

import com.employeeportal.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EmployeeCodeGenerator {

    private static final String PREFIX = "EMP";

    private final EmployeeRepository employeeRepository;

    public String generate() {
        long count = employeeRepository.countByEmployeeCodeStartingWith(PREFIX);
        String candidate;
        long next = count + 1;
        do {
            candidate = PREFIX + String.format("%03d", next);
            next++;
        } while (employeeRepository.existsByEmployeeCode(candidate));
        return candidate;
    }
}
