package com.employeeportal.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Auditable {
    String action();       // e.g. "CREATE", "UPDATE", "DELETE", "APPROVE", "REJECT", "CANCEL"
    String entityType();   // e.g. "EMPLOYEE", "DEPARTMENT", "LEAVE_REQUEST"
}
