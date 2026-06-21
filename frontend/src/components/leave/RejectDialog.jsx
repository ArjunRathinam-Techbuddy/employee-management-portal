import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  Button, TextField, Alert,
} from '@mui/material';

export function RejectDialog({ leave, onConfirm, onClose }) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    setError('');
    setSubmitting(true);
    try {
      await onConfirm(reason || null);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reject request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={!!leave} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Reject leave request</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <DialogContentText sx={{ mb: 2 }}>
          Rejecting {leave?.employeeName}'s {leave?.leaveType} leave ({leave?.startDate} to {leave?.endDate}).
        </DialogContentText>
        <TextField
          label="Reason (optional)"
          fullWidth
          multiline
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>Cancel</Button>
        <Button onClick={handleConfirm} color="error" variant="contained" disabled={submitting}>
          {submitting ? 'Rejecting…' : 'Reject'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
