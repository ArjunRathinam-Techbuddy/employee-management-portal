package com.employeeportal.service;

import com.employeeportal.dto.report.HeadcountByDepartmentDto;
import com.employeeportal.dto.report.LeaveSummaryDto;
import com.employeeportal.dto.report.NewJoinerDto;
import com.employeeportal.dto.report.SalaryBandDto;
import com.employeeportal.dto.report.SalaryStatsDto;
import com.employeeportal.dto.report.UpcomingLeaveDto;
import com.employeeportal.repository.EmployeeRepository;
import com.employeeportal.repository.LeaveRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportService {

    private static final int DEFAULT_UPCOMING_WINDOW_DAYS = 30;

    // Bands chosen to suit INR salary ranges seeded in this dataset; adjust if scaling up.
    private static final BigDecimal BAND_1 = new BigDecimal("50000");
    private static final BigDecimal BAND_2 = new BigDecimal("75000");
    private static final BigDecimal BAND_3 = new BigDecimal("100000");

    private final EmployeeRepository employeeRepository;
    private final LeaveRequestRepository leaveRequestRepository;

    public List<HeadcountByDepartmentDto> headcountByDepartment() {
        return employeeRepository.headcountByDepartment();
    }

    public List<SalaryStatsDto> salaryStatsByDepartment() {
        return employeeRepository.salaryStatsByDepartment();
    }

    public List<LeaveSummaryDto> leaveSummaryByStatus() {
        return leaveRequestRepository.leaveSummaryByStatus();
    }

    public List<UpcomingLeaveDto> upcomingLeaves(Integer days) {
        int window = (days != null && days > 0) ? days : DEFAULT_UPCOMING_WINDOW_DAYS;
        LocalDate today = LocalDate.now();
        return leaveRequestRepository.findUpcomingApprovedLeaves(today, today.plusDays(window));
    }

    public List<SalaryBandDto> salaryBand() {
        Map<String, Long> bands = new LinkedHashMap<>();
        bands.put("Below 50K", 0L);
        bands.put("50K-75K", 0L);
        bands.put("75K-100K", 0L);
        bands.put("Above 100K", 0L);

        for (BigDecimal salary : employeeRepository.findActiveSalaries()) {
            String band;
            if (salary.compareTo(BAND_1) < 0) band = "Below 50K";
            else if (salary.compareTo(BAND_2) < 0) band = "50K-75K";
            else if (salary.compareTo(BAND_3) < 0) band = "75K-100K";
            else band = "Above 100K";
            bands.merge(band, 1L, Long::sum);
        }

        return bands.entrySet().stream()
                .map(e -> new SalaryBandDto(e.getKey(), e.getValue()))
                .toList();
    }

    public List<NewJoinerDto> newJoiners(LocalDate from, LocalDate to) {
        LocalDate effectiveFrom = from != null ? from : LocalDate.now().minusMonths(1);
        LocalDate effectiveTo = to != null ? to : LocalDate.now();
        return employeeRepository.findNewJoiners(effectiveFrom, effectiveTo);
    }
}
