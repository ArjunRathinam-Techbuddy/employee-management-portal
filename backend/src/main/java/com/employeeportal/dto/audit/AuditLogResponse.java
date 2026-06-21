package com.employeeportal.dto.audit;

import java.time.OffsetDateTime;

public record AuditLogResponse(
        Long id,
        Long userId,
        String userEmail,
        String action,
        String entityType,
        Long entityId,
        String oldValue,
        String newValue,
        String ipAddress,
        OffsetDateTime createdAt
) {}
