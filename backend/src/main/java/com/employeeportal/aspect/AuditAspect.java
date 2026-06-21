package com.employeeportal.aspect;

import com.employeeportal.annotation.Auditable;
import com.employeeportal.security.UserPrincipal;
import com.employeeportal.service.AuditService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.lang.reflect.Method;

@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
public class AuditAspect {

    private final AuditService auditService;
    private final ObjectMapper objectMapper;

    @Around("@annotation(auditable)")
    public Object audit(ProceedingJoinPoint joinPoint, Auditable auditable) throws Throwable {
        Object result;
        try {
            result = joinPoint.proceed();
        } catch (Throwable ex) {
            // Failed operations are not audited as state changes; rethrow untouched.
            throw ex;
        }

        try {
            recordAudit(joinPoint, auditable, result);
        } catch (Exception e) {
            // Audit failure must never break the business operation.
            log.error("Audit logging failed for {}.{}: {}",
                    joinPoint.getSignature().getDeclaringTypeName(),
                    joinPoint.getSignature().getName(), e.getMessage());
        }

        return result;
    }

    private void recordAudit(ProceedingJoinPoint joinPoint, Auditable auditable, Object result) {
        Long userId = currentUserId();
        String ipAddress = currentIpAddress();
        Long entityId = extractId(result, joinPoint.getArgs());
        String newValueJson = toJsonSafely(result);

        auditService.record(
                userId,
                auditable.action(),
                auditable.entityType(),
                entityId,
                null, // old-value snapshot omitted at MVP scope; see service-level pre-fetch note
                newValueJson,
                ipAddress
        );
    }

    private Long currentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserPrincipal principal) {
            return principal.getId();
        }
        return null;
    }

    private String currentIpAddress() {
        var attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attrs == null) return null;
        HttpServletRequest request = attrs.getRequest();
        String forwarded = request.getHeader("X-Forwarded-For");
        return forwarded != null ? forwarded.split(",")[0].trim() : request.getRemoteAddr();
    }

    private Long extractId(Object result, Object[] args) {
        Long fromResult = tryExtractIdField(result);
        if (fromResult != null) return fromResult;

        // Fallback: many service methods take the entity id as the first arg (update/delete/approve/etc.)
        if (args.length > 0 && args[0] instanceof Long id) {
            return id;
        }
        return null;
    }

    private Long tryExtractIdField(Object obj) {
        if (obj == null) return null;
        try {
            Method getId = obj.getClass().getMethod("id");
            Object value = getId.invoke(obj);
            return value instanceof Long ? (Long) value : null;
        } catch (NoSuchMethodException e) {
            return null;
        } catch (Exception e) {
            return null;
        }
    }

    private String toJsonSafely(Object obj) {
        if (obj == null) return null;
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            return null;
        }
    }
}
