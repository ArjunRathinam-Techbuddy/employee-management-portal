package com.employeeportal.service;

import com.employeeportal.dto.audit.AuditLogResponse;
import com.employeeportal.entity.AuditLog;
import com.employeeportal.entity.User;
import com.employeeportal.mapper.AuditMapper;
import com.employeeportal.repository.AuditLogRepository;
import com.employeeportal.repository.UserRepository;
import com.employeeportal.service.spec.AuditLogSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;
    private final AuditMapper auditMapper;

    // REQUIRES_NEW: audit write must not roll back with the business transaction,
    // and must not block it either if audit insert fails.
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void record(Long userId, String action, String entityType, Long entityId,
                        String oldValueJson, String newValueJson, String ipAddress) {
        User user = userId != null ? userRepository.findById(userId).orElse(null) : null;

        AuditLog log = AuditLog.builder()
                .user(user)
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .oldValue(oldValueJson)
                .newValue(newValueJson)
                .ipAddress(ipAddress)
                .build();

        auditLogRepository.save(log);
    }

    @Transactional(readOnly = true)
    public Page<AuditLogResponse> list(String entityType, Long userId, OffsetDateTime from, OffsetDateTime to, Pageable pageable) {
        return auditLogRepository
                .findAll(AuditLogSpecification.filter(entityType, userId, from, to), pageable)
                .map(auditMapper::toResponse);
    }
}
