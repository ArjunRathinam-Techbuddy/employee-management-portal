import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Grid, Box, Button, CircularProgress } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ApartmentIcon from '@mui/icons-material/Apartment';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { reportService } from '../services/reportService';
import { auditService } from '../services/auditService';
import { StatCard } from '../components/dashboard/StatCard';
import { RecentActivityFeed } from '../components/dashboard/RecentActivityFeed';
import { HeadcountChart } from '../components/report/HeadcountChart';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [headcount, setHeadcount] = useState([]);
  const [leaveSummary, setLeaveSummary] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);

  useEffect(() => {
    Promise.all([reportService.headcount(), reportService.leaveSummary()])
      .then(([hc, ls]) => { setHeadcount(hc); setLeaveSummary(ls); })
      .finally(() => setLoading(false));

    auditService.list({ page: 0, size: 8 })
      .then((res) => setActivity(res.data))
      .finally(() => setActivityLoading(false));
  }, []);

  if (loading) {
    return <Box display="flex" justifyContent="center" mt={6}><CircularProgress /></Box>;
  }

  const totalActive = headcount.reduce((sum, d) => sum + d.activeCount, 0);
  const totalDepartments = headcount.length;
  const pendingLeaves = leaveSummary.find((l) => l.status === 'PENDING')?.count || 0;

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Admin Dashboard</Typography>
        <Box display="flex" gap={1}>
          <Button startIcon={<PersonAddIcon />} variant="contained" onClick={() => navigate('/employees/new')}>
            Add Employee
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={4}>
          <StatCard label="Active Employees" value={totalActive} icon={<PeopleIcon />} color="#2952A3" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard label="Departments" value={totalDepartments} icon={<ApartmentIcon />} color="#5B6B7C" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard label="Pending Leave Requests" value={pendingLeaves} icon={<EventNoteIcon />} color="#B8860B" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <HeadcountChart data={headcount} />
        </Grid>
        <Grid item xs={12} md={5}>
          <RecentActivityFeed logs={activity} loading={activityLoading} />
        </Grid>
      </Grid>
    </>
  );
}
