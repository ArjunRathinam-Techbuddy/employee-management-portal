import { useState } from 'react';
import { Box, TextField, MenuItem, Button, Grid, Alert } from '@mui/material';

const EMPTY_FORM = {
  firstName: '', lastName: '', departmentId: '', designation: '',
  dateOfJoining: '', salary: '', phone: '', address: '', managerId: '',
};

export function EmployeeForm({ initialValues, departments, onSubmit, submitLabel }) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initialValues });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((errs) => ({ ...errs, [field]: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = 'Required';
    if (!form.lastName.trim()) errs.lastName = 'Required';
    if (!form.departmentId) errs.departmentId = 'Required';
    if (!form.designation.trim()) errs.designation = 'Required';
    if (!form.dateOfJoining) errs.dateOfJoining = 'Required';
    if (!form.salary || Number(form.salary) <= 0) errs.salary = 'Must be a positive number';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        departmentId: Number(form.departmentId),
        designation: form.designation.trim(),
        dateOfJoining: form.dateOfJoining,
        salary: Number(form.salary),
        phone: form.phone || null,
        address: form.address || null,
        managerId: form.managerId ? Number(form.managerId) : null,
      };
      await onSubmit(payload);
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong. Please try again.';
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="First Name" fullWidth required
            value={form.firstName} onChange={handleChange('firstName')}
            error={!!errors.firstName} helperText={errors.firstName}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Last Name" fullWidth required
            value={form.lastName} onChange={handleChange('lastName')}
            error={!!errors.lastName} helperText={errors.lastName}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Department" select fullWidth required
            value={form.departmentId} onChange={handleChange('departmentId')}
            error={!!errors.departmentId} helperText={errors.departmentId}
          >
            {departments.map((d) => (
              <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Designation" fullWidth required
            value={form.designation} onChange={handleChange('designation')}
            error={!!errors.designation} helperText={errors.designation}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Date of Joining" type="date" fullWidth required
            InputLabelProps={{ shrink: true }}
            value={form.dateOfJoining} onChange={handleChange('dateOfJoining')}
            error={!!errors.dateOfJoining} helperText={errors.dateOfJoining}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Salary" type="number" fullWidth required
            value={form.salary} onChange={handleChange('salary')}
            error={!!errors.salary} helperText={errors.salary}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Phone" fullWidth value={form.phone} onChange={handleChange('phone')} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Manager Employee ID" type="number" fullWidth
            value={form.managerId} onChange={handleChange('managerId')}
            helperText="Optional — internal employee ID of the manager"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Address" fullWidth multiline rows={2}
            value={form.address} onChange={handleChange('address')}
          />
        </Grid>
      </Grid>

      <Button type="submit" variant="contained" sx={{ mt: 3 }} disabled={submitting}>
        {submitting ? 'Saving…' : submitLabel}
      </Button>
    </Box>
  );
}
