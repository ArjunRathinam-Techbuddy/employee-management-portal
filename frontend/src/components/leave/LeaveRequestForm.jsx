import { useState } from 'react';
import {
  Box, TextField, MenuItem, Button, Grid, Alert,
} from '@mui/material';

const LEAVE_TYPES = ['SICK', 'CASUAL', 'ANNUAL'];
const MAX_DURATION_DAYS = 30;

function tomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

export function LeaveRequestForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({ leaveType: 'CASUAL', startDate: '', endDate: '', reason: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((errs) => ({ ...errs, [field]: undefined }));
  };

  const validate = () => {
    const errs = {};
    const today = new Date(); today.setHours(0, 0, 0, 0);

    if (!form.startDate) {
      errs.startDate = 'Required';
    } else if (new Date(form.startDate) <= today) {
      errs.startDate = 'Must be a future date';
    }

    if (!form.endDate) {
      errs.endDate = 'Required';
    } else if (form.startDate && new Date(form.endDate) < new Date(form.startDate)) {
      errs.endDate = 'Cannot be before start date';
    }

    if (form.startDate && form.endDate && !errs.startDate && !errs.endDate) {
      const days = Math.round((new Date(form.endDate) - new Date(form.startDate)) / 86400000) + 1;
      if (days > MAX_DURATION_DAYS) {
        errs.endDate = `Duration cannot exceed ${MAX_DURATION_DAYS} days`;
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit({
        leaveType: form.leaveType,
        startDate: form.startDate,
        endDate: form.endDate,
        reason: form.reason || null,
      });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Could not submit leave request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField label="Leave Type" select fullWidth value={form.leaveType} onChange={handleChange('leaveType')}>
            {LEAVE_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Start Date" type="date" fullWidth required
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: tomorrowISO() }}
            value={form.startDate} onChange={handleChange('startDate')}
            error={!!errors.startDate} helperText={errors.startDate}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="End Date" type="date" fullWidth required
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: form.startDate || tomorrowISO() }}
            value={form.endDate} onChange={handleChange('endDate')}
            error={!!errors.endDate} helperText={errors.endDate}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Reason" fullWidth multiline rows={2}
            value={form.reason} onChange={handleChange('reason')}
          />
        </Grid>
      </Grid>

      <Box display="flex" gap={1} mt={3}>
        <Button type="submit" variant="contained" disabled={submitting}>
          {submitting ? 'Submitting…' : 'Submit Request'}
        </Button>
        <Button onClick={onCancel} disabled={submitting}>Cancel</Button>
      </Box>
    </Box>
  );
}
