package com.employeeportal.security;

import com.employeeportal.repository.LeaveRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("leaveAccessGuard")
@RequiredArgsConstructor
public class LeaveAccessGuard {

    private final LeaveRequestRepository leaveRequestRepository;

    public boolean isOwner(Long leaveId, Authentication authentication) {
        if (!(authentication.getPrincipal() instanceof UserPrincipal principal)) {
            return false;
        }
        return leaveRequestRepository.findById(leaveId)
                .map(lr -> lr.getEmployee().getUser() != null
                        && lr.getEmployee().getUser().getId().equals(principal.getId()))
                .orElse(false);
    }
}
