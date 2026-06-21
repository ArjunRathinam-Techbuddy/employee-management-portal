import { useEffect, useState, useCallback } from 'react';
import { Typography, Grid, Box, CircularProgress, Alert } from '@mui/material';
import { reportService } from '../services/reportService';
import { HeadcountChart } from '../components/report/HeadcountChart';
import { LeaveSummaryChart } from '../components/report/LeaveSummaryChart';
import { SalaryStatsTable } from '../components/report/SalaryStatsTable';
import { UpcomingLeavesTable } from '../components/report/UpcomingLeavesTable';

export default function ReportsPage() {
  const [headcount, setHeadcount] = useState([]);
  const [salaryStats, setSalaryStats] = useState([]);
  const [leaveSummary, setLeaveSummary] = useState([]);
  const [upcomingLeaves, setUpcomingLeaves] = useState([]);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [upcomingLoading, setUpcomingLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([
      reportService.headcount(),
      reportService.salaryStats(),
      reportService.leaveSummary(),
      reportService.upcomingLeaves(days),
    ])
      .then(([hc, ss, ls, ul]) => {
        setHeadcount(hc);
        setSalaryStats(ss);
        setLeaveSummary(ls);
        setUpcomingLeaves(ul);
      })
      .catch(() => setError('Could not load report data.'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDaysChange = useCallback((newDays) => {
    setDays(newDays);
    setUpcomingLoading(true);
    reportService.upcomingLeaves(newDays)
      .then(setUpcomingLeaves)
      .finally(() => setUpcomingLoading(false));
  }, []);

  if (loading) {
    return <Box display="flex" justifyContent="center" mt={6}><CircularProgress /></Box>;
  }

  return (
    <>
      <Typography variant="h4" mb={3}>Reports</Typography>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <HeadcountChart data={headcount} />
        </Grid>
        <Grid item xs={12} md={6}>
          <LeaveSummaryChart data={leaveSummary} />
        </Grid>
        <Grid item xs={12}>
          <SalaryStatsTable data={salaryStats} />
        </Grid>
        <Grid item xs={12}>
          <UpcomingLeavesTable
            data={upcomingLeaves}
            days={days}
            onDaysChange={handleDaysChange}
            loading={upcomingLoading}
          />
        </Grid>
      </Grid>
    </>
  );
}
