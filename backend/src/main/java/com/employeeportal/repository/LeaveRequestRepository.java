package com.employeeportal.repository;

import com.employeeportal.dto.report.LeaveSummaryDto;
import com.employeeportal.dto.report.UpcomingLeaveDto;
import com.employeeportal.entity.LeaveRequest;
import com.employeeportal.entity.enums.LeaveStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {

    Page<LeaveRequest> findByEmployeeId(Long employeeId, Pageable pageable);

    Page<LeaveRequest> findByStatus(LeaveStatus status, Pageable pageable);

    Page<LeaveRequest> findByEmployeeIdAndStatus(Long employeeId, LeaveStatus status, Pageable pageable);

    @Query("""
            SELECT lr FROM LeaveRequest lr
            WHERE lr.employee.id = :employeeId
              AND lr.status IN ('PENDING', 'APPROVED')
              AND lr.startDate <= :endDate
              AND lr.endDate >= :startDate
            """)
    List<LeaveRequest> findOverlapping(
            @Param("employeeId") Long employeeId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("""
            SELECT new com.employeeportal.dto.report.LeaveSummaryDto(lr.status, COUNT(lr))
            FROM LeaveRequest lr
            GROUP BY lr.status
            """)
    List<LeaveSummaryDto> leaveSummaryByStatus();

    @Query("""
            SELECT new com.employeeportal.dto.report.UpcomingLeaveDto(
                e.id, CONCAT(e.firstName, ' ', e.lastName), d.name,
                lr.startDate, lr.endDate, CAST(lr.leaveType AS string))
            FROM LeaveRequest lr
            JOIN lr.employee e
            JOIN e.department d
            WHERE lr.status = 'APPROVED'
              AND lr.startDate BETWEEN :today AND :until
            ORDER BY lr.startDate
            """)
    List<UpcomingLeaveDto> findUpcomingApprovedLeaves(
            @Param("today") LocalDate today,
            @Param("until") LocalDate until);
}
