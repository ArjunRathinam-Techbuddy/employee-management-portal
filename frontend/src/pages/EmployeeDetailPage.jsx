import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Box, Typography, Paper, Grid, Chip, Button, CircularProgress, Divider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { employeeService } from '../services/employeeService';

function Field({ label, value }) {
  return (
    <Grid item xs={12} sm={6}>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="body1">{value ?? '—'}</Typography>
    </Grid>
  );
}

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    employeeService.getById(id)
      .then(setEmployee)
      .catch(() => setError('Employee not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <Box display="flex" justifyContent="center" mt={6}><CircularProgress /></Box>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <>
      <Button startIcon={<ArrowBackIcon />} component={Link} to="/employees" sx={{ mb: 2 }}>
        Back to Employees
      </Button>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography variant="h5">{employee.firstName} {employee.lastName}</Typography>
            <Typography color="text.secondary">{employee.employeeCode} · {employee.designation}</Typography>
          </Box>
          <Box display="flex" gap={1} alignItems="center">
            <Chip
              label={employee.active ? 'Active' : 'Inactive'}
              color={employee.active ? 'success' : 'default'}
              size="small"
            />
            <Button
              startIcon={<EditIcon />}
              variant="outlined"
              size="small"
              onClick={() => navigate(`/employees/${id}/edit`)}
            >
              Edit
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Field label="Department" value={employee.departmentName} />
          <Field label="Date of Joining" value={employee.dateOfJoining} />
          <Field label="Salary" value={employee.salary ? `₹${Number(employee.salary).toLocaleString('en-IN')}` : null} />
          <Field label="Manager" value={employee.managerName} />
          <Field label="Phone" value={employee.phone} />
          <Field label="Address" value={employee.address} />
        </Grid>
      </Paper>
    </>
  );
}
