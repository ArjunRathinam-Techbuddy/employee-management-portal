package com.employeeportal.controller;

import com.employeeportal.dto.report.HeadcountByDepartmentDto;
import com.employeeportal.dto.report.LeaveSummaryDto;
import com.employeeportal.dto.report.NewJoinerDto;
import com.employeeportal.dto.report.SalaryBandDto;
import com.employeeportal.dto.report.SalaryStatsDto;
import com.employeeportal.dto.report.UpcomingLeaveDto;
import com.employeeportal.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/headcount")
    public ResponseEntity<List<HeadcountByDepartmentDto>> headcount() {
        return ResponseEntity.ok(reportService.headcountByDepartment());
    }

    @GetMapping("/salary-stats")
    public ResponseEntity<List<SalaryStatsDto>> salaryStats() {
        return ResponseEntity.ok(reportService.salaryStatsByDepartment());
    }

    @GetMapping("/salary-band")
    public ResponseEntity<List<SalaryBandDto>> salaryBand() {
        return ResponseEntity.ok(reportService.salaryBand());
    }

    @GetMapping("/leave-summary")
    public ResponseEntity<List<LeaveSummaryDto>> leaveSummary() {
        return ResponseEntity.ok(reportService.leaveSummaryByStatus());
    }

    @GetMapping("/new-joiners")
    public ResponseEntity<List<NewJoinerDto>> newJoiners(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(reportService.newJoiners(from, to));
    }

    @GetMapping("/upcoming-leaves")
    public ResponseEntity<List<UpcomingLeaveDto>> upcomingLeaves(
            @RequestParam(required = false) Integer days) {
        return ResponseEntity.ok(reportService.upcomingLeaves(days));
    }
}
