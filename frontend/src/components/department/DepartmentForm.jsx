import { useState } from 'react';
import { Box, TextField, Button, Grid, Alert } from '@mui/material';

const EMPTY_FORM = { name: '', description: '', headEmployeeId: '' };

export function DepartmentForm({ initialValues, onSubmit, submitLabel }) {
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
    if (!form.name.trim()) errs.name = 'Required';
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
        name: form.name.trim(),
        description: form.description || null,
        headEmployeeId: form.headEmployeeId ? Number(form.headEmployeeId) : null,
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
            label="Department Name" fullWidth required
            value={form.name} onChange={handleChange('name')}
            error={!!errors.name} helperText={errors.name}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Head Employee ID" type="number" fullWidth
            value={form.headEmployeeId} onChange={handleChange('headEmployeeId')}
            helperText="Must be an employee already in this department"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Description" fullWidth multiline rows={3}
            value={form.description} onChange={handleChange('description')}
          />
        </Grid>
      </Grid>

      <Button type="submit" variant="contained" sx={{ mt: 3 }} disabled={submitting}>
        {submitting ? 'Saving…' : submitLabel}
      </Button>
    </Box>
  );
}
