package com.employeeportal.mapper;

import com.employeeportal.dto.employee.EmployeeResponse;
import com.employeeportal.dto.employee.EmployeeSummaryResponse;
import com.employeeportal.entity.Employee;
import org.springframework.stereotype.Component;

@Component
public class EmployeeMapper {

    public EmployeeResponse toResponse(Employee e) {
        Employee mgr = e.getManager();
        return new EmployeeResponse(
                e.getId(),
                e.getEmployeeCode(),
                e.getFirstName(),
                e.getLastName(),
                e.getDepartment().getId(),
                e.getDepartment().getName(),
                e.getDesignation(),
                e.getDateOfJoining(),
                e.getSalary(),
                e.getPhone(),
                e.getAddress(),
                e.getProfilePhotoUrl(),
                mgr != null ? mgr.getId() : null,
                mgr != null ? mgr.getFirstName() + " " + mgr.getLastName() : null,
                e.isActive(),
                e.getCreatedAt(),
                e.getUpdatedAt()
        );
    }

    public EmployeeSummaryResponse toSummary(Employee e) {
        return new EmployeeSummaryResponse(
                e.getId(),
                e.getEmployeeCode(),
                e.getFirstName(),
                e.getLastName(),
                e.getDepartment().getName(),
                e.getDesignation(),
                e.isActive()
        );
    }
}
