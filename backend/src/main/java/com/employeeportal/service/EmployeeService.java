package com.employeeportal.service;

import com.employeeportal.annotation.Auditable;
import com.employeeportal.dto.employee.EmployeeRequest;
import com.employeeportal.dto.employee.EmployeeResponse;
import com.employeeportal.dto.employee.MyProfileUpdateRequest;
import com.employeeportal.entity.Department;
import com.employeeportal.entity.Employee;
import com.employeeportal.entity.User;
import com.employeeportal.entity.enums.LeaveStatus;
import com.employeeportal.entity.enums.UserRole;
import com.employeeportal.exception.BusinessRuleViolationException;
import com.employeeportal.exception.ResourceNotFoundException;
import com.employeeportal.mapper.EmployeeMapper;
import com.employeeportal.repository.DepartmentRepository;
import com.employeeportal.repository.EmployeeRepository;
import com.employeeportal.repository.LeaveRequestRepository;
import com.employeeportal.repository.UserRepository;
import com.employeeportal.service.spec.EmployeeSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final EmployeeMapper employeeMapper;
    private final EmployeeCodeGenerator codeGenerator;
    private final PasswordGenerator passwordGenerator;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Auditable(action = "CREATE", entityType = "EMPLOYEE")
    @Transactional
    public EmployeeResponse create(EmployeeRequest request) {
        Department department = departmentRepository.findById(request.departmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found: " + request.departmentId()));

        Employee manager = resolveManager(request.managerId(), null);
        User user = resolveUser(request.userId());
        if (user == null && request.email() != null && !request.email().isBlank()) {
            user = createUserForEmployee(request.email());
        }

        Employee employee = Employee.builder()
                .employeeCode(codeGenerator.generate())
                .firstName(request.firstName())
                .lastName(request.lastName())
                .department(department)
                .designation(request.designation())
                .dateOfJoining(request.dateOfJoining())
                .salary(request.salary())
                .phone(request.phone())
                .address(request.address())
                .manager(manager)
                .user(user)
                .active(true)
                .build();

        return employeeMapper.toResponse(employeeRepository.save(employee));
    }

    @Transactional(readOnly = true)
    public EmployeeResponse getById(Long id) {
        return employeeMapper.toResponse(findActiveOrThrow(id));
    }

    @Transactional(readOnly = true)
    public Page<EmployeeResponse> list(Long departmentId, String designation, Boolean active, String search, Pageable pageable) {
        return employeeRepository
                .findAll(EmployeeSpecification.filter(departmentId, designation, active, search), pageable)
                .map(employeeMapper::toResponse);
    }

    @Auditable(action = "UPDATE", entityType = "EMPLOYEE")
    @Transactional
    public EmployeeResponse update(Long id, EmployeeRequest request) {
        Employee employee = findActiveOrThrow(id);

        Department department = departmentRepository.findById(request.departmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found: " + request.departmentId()));

        Employee manager = resolveManager(request.managerId(), id);
        User user = resolveUser(request.userId());

        employee.setFirstName(request.firstName());
        employee.setLastName(request.lastName());
        employee.setDepartment(department);
        employee.setDesignation(request.designation());
        employee.setDateOfJoining(request.dateOfJoining());
        employee.setSalary(request.salary());
        employee.setPhone(request.phone());
        employee.setAddress(request.address());
        employee.setManager(manager);
        employee.setUser(user);

        return employeeMapper.toResponse(employeeRepository.save(employee));
    }

    @Auditable(action = "SOFT_DELETE", entityType = "EMPLOYEE")
    @Transactional
    public void softDelete(Long id) {
        Employee employee = findActiveOrThrow(id);
        employee.setActive(false);
        employeeRepository.save(employee);

        // Revoke login
        if (employee.getUser() != null) {
            employee.getUser().setActive(false);
            userRepository.save(employee.getUser());
        }

        // Reject all pending leave requests
        leaveRequestRepository.findByEmployeeIdAndStatus(id, LeaveStatus.PENDING, org.springframework.data.domain.Pageable.unpaged())
                .forEach(lr -> {
                    lr.setStatus(LeaveStatus.REJECTED);
                    lr.setRejectReason("Auto-rejected: employee deactivated");
                    leaveRequestRepository.save(lr);
                });
    }

    @Auditable(action = "REACTIVATE", entityType = "EMPLOYEE")
    @Transactional
    public void reactivate(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + id));
        employee.setActive(true);
        employeeRepository.save(employee);
    }

    @Transactional(readOnly = true)
    public EmployeeResponse getMyProfile(Long userId) {
        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("No employee record linked to this user"));
        return employeeMapper.toResponse(employee);
    }

    @Auditable(action = "SELF_UPDATE_PROFILE", entityType = "EMPLOYEE")
    @Transactional
    public EmployeeResponse updateMyProfile(Long userId, MyProfileUpdateRequest request) {
        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("No employee record linked to this user"));
        employee.setPhone(request.phone());
        employee.setAddress(request.address());
        return employeeMapper.toResponse(employeeRepository.save(employee));
    }

    private User createUserForEmployee(String email) {
        if (userRepository.existsByEmail(email)) {
            throw new BusinessRuleViolationException("A user with this email already exists: " + email);
        }
        String tempPassword = passwordGenerator.generate();
        User user = User.builder()
                .email(email)
                .passwordHash(passwordEncoder.encode(tempPassword))
                .role(UserRole.EMPLOYEE)
                .active(true)
                .failedAttempts(0)
                .build();
        user = userRepository.save(user);

        // "Welcome email" — console log accepted per assignment scope (no mail infra).
        log.info("WELCOME_EMAIL to={} subject=\"Your Employee Portal account\" tempPassword={}",
                email, tempPassword);

        return user;
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    private Employee findActiveOrThrow(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + id));
        if (!employee.isActive()) {
            throw new ResourceNotFoundException("Employee not found: " + id);
        }
        return employee;
    }

    private Employee resolveManager(Long managerId, Long selfId) {
        if (managerId == null) return null;
        if (managerId.equals(selfId)) {
            throw new BusinessRuleViolationException("Employee cannot be their own manager");
        }
        return employeeRepository.findById(managerId)
                .orElseThrow(() -> new ResourceNotFoundException("Manager not found: " + managerId));
    }

    private User resolveUser(Long userId) {
        if (userId == null) return null;
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
    }
}
