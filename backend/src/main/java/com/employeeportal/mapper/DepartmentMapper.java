package com.employeeportal.mapper;

import com.employeeportal.dto.department.DepartmentResponse;
import com.employeeportal.entity.Department;
import org.springframework.stereotype.Component;

@Component
public class DepartmentMapper {

    public DepartmentResponse toResponse(Department d, String headEmployeeName, long employeeCount) {
        return new DepartmentResponse(
                d.getId(),
                d.getName(),
                d.getDescription(),
                d.getHeadEmployeeId(),
                headEmployeeName,
                employeeCount,
                d.getCreatedAt(),
                d.getUpdatedAt()
        );
    }
}
