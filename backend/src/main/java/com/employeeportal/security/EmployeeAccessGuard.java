package com.employeeportal.security;

import com.employeeportal.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("employeeAccessGuard")
@RequiredArgsConstructor
public class EmployeeAccessGuard {

    private final EmployeeRepository employeeRepository;

    public boolean isSelf(Long employeeId, Authentication authentication) {
        if (!(authentication.getPrincipal() instanceof UserPrincipal principal)) {
            return false;
        }
        return employeeRepository.findById(employeeId)
                .map(emp -> emp.getUser() != null && emp.getUser().getId().equals(principal.getId()))
                .orElse(false);
    }
}
