package com.employeeportal.repository;

import com.employeeportal.dto.report.HeadcountByDepartmentDto;
import com.employeeportal.dto.report.SalaryStatsDto;
import com.employeeportal.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long>, JpaSpecificationExecutor<Employee> {

    Optional<Employee> findByEmployeeCode(String employeeCode);

    boolean existsByEmployeeCode(String employeeCode);

    Optional<Employee> findByUserId(Long userId);

    long countByEmployeeCodeStartingWith(String prefix);

    boolean existsByDepartmentId(Long departmentId);

    boolean existsByDepartmentIdAndActiveTrue(Long departmentId);

    long countByDepartmentId(Long departmentId);

    @Query("""
            SELECT new com.employeeportal.dto.report.HeadcountByDepartmentDto(
                d.id, d.name,
                SUM(CASE WHEN e.active = true THEN 1 ELSE 0 END),
                SUM(CASE WHEN e.active = false THEN 1 ELSE 0 END))
            FROM Department d
            LEFT JOIN Employee e ON e.department.id = d.id
            GROUP BY d.id, d.name
            ORDER BY d.name
            """)
    List<HeadcountByDepartmentDto> headcountByDepartment();

    @Query("""
            SELECT new com.employeeportal.dto.report.SalaryStatsDto(
                d.id, d.name, MIN(e.salary), MAX(e.salary), AVG(e.salary), COUNT(e))
            FROM Employee e
            JOIN e.department d
            WHERE e.active = true
            GROUP BY d.id, d.name
            ORDER BY d.name
            """)
    List<SalaryStatsDto> salaryStatsByDepartment();

    @Query("SELECT e.salary FROM Employee e WHERE e.active = true")
    List<java.math.BigDecimal> findActiveSalaries();

    @Query("""
            SELECT new com.employeeportal.dto.report.NewJoinerDto(
                e.id, e.employeeCode, CONCAT(e.firstName, ' ', e.lastName), d.name, e.dateOfJoining)
            FROM Employee e
            JOIN e.department d
            WHERE e.dateOfJoining BETWEEN :from AND :to
            ORDER BY e.dateOfJoining DESC
            """)
    List<com.employeeportal.dto.report.NewJoinerDto> findNewJoiners(
            @org.springframework.data.repository.query.Param("from") java.time.LocalDate from,
            @org.springframework.data.repository.query.Param("to") java.time.LocalDate to);
}
