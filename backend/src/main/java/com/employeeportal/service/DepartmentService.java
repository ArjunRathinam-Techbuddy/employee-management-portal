package com.employeeportal.service;

import com.employeeportal.annotation.Auditable;
import com.employeeportal.dto.department.DepartmentRequest;
import com.employeeportal.dto.department.DepartmentResponse;
import com.employeeportal.entity.Department;
import com.employeeportal.entity.Employee;
import com.employeeportal.exception.BusinessRuleViolationException;
import com.employeeportal.exception.ResourceNotFoundException;
import com.employeeportal.mapper.DepartmentMapper;
import com.employeeportal.repository.DepartmentRepository;
import com.employeeportal.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;
    private final DepartmentMapper departmentMapper;

    @Auditable(action = "CREATE", entityType = "DEPARTMENT")
    @Transactional
    public DepartmentResponse create(DepartmentRequest request) {
        if (departmentRepository.existsByName(request.name())) {
            throw new BusinessRuleViolationException("Department name already exists: " + request.name());
        }

        Department department = Department.builder()
                .name(request.name())
                .description(request.description())
                .build();

        department = departmentRepository.save(department);

        if (request.headEmployeeId() != null) {
            assignHead(department, request.headEmployeeId());
            department = departmentRepository.save(department);
        }

        return toResponse(department);
    }

    @Transactional(readOnly = true)
    public DepartmentResponse getById(Long id) {
        return toResponse(findOrThrow(id));
    }

    @Transactional(readOnly = true)
    public List<DepartmentResponse> list() {
        return departmentRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Auditable(action = "UPDATE", entityType = "DEPARTMENT")
    @Transactional
    public DepartmentResponse update(Long id, DepartmentRequest request) {
        Department department = findOrThrow(id);

        departmentRepository.findByName(request.name()).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new BusinessRuleViolationException("Department name already exists: " + request.name());
            }
        });

        department.setName(request.name());
        department.setDescription(request.description());

        if (request.headEmployeeId() != null) {
            assignHead(department, request.headEmployeeId());
        } else {
            department.setHeadEmployeeId(null);
        }

        return toResponse(departmentRepository.save(department));
    }

    @Auditable(action = "DELETE", entityType = "DEPARTMENT")
    @Transactional
    public void delete(Long id) {
        findOrThrow(id);
        if (employeeRepository.existsByDepartmentIdAndActiveTrue(id)) {
            throw new BusinessRuleViolationException(
                    "Cannot delete department with active employees assigned");
        }
        departmentRepository.deleteById(id);
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    private void assignHead(Department department, Long headEmployeeId) {
        Employee head = employeeRepository.findById(headEmployeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + headEmployeeId));

        if (!head.getDepartment().getId().equals(department.getId())) {
            throw new BusinessRuleViolationException(
                    "Department head must belong to the department they are assigned to head");
        }

        department.setHeadEmployeeId(headEmployeeId);
    }

    private Department findOrThrow(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found: " + id));
    }

    private DepartmentResponse toResponse(Department department) {
        String headName = null;
        if (department.getHeadEmployeeId() != null) {
            headName = employeeRepository.findById(department.getHeadEmployeeId())
                    .map(e -> e.getFirstName() + " " + e.getLastName())
                    .orElse(null);
        }
        long employeeCount = employeeRepository.countByDepartmentId(department.getId());
        return departmentMapper.toResponse(department, headName, employeeCount);
    }
}
