import { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, Button, MenuItem, TextField, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions, Alert, Collapse,
} from '@mui/material';
import { leaveService } from '../services/leaveService';
import { LeaveRequestForm } from '../components/leave/LeaveRequestForm';
import { MyLeaveTable } from '../components/leave/MyLeaveTable';

const STATUS_OPTIONS = ['', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'];

export default function MyLeavesPage() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [pendingCancel, setPendingCancel] = useState(null);
  const [cancelError, setCancelError] = useState('');

  const fetchLeaves = useCallback(() => {
    setLoading(true);
    const params = statusFilter ? { status: statusFilter, size: 50 } : { size: 50 };
    return leaveService.myLeaves(params)
      .then((data) => setLeaves(data.data))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  useEffect(() => { fetchLeaves(); }, [fetchLeaves]);

  const handleCreate = async (payload) => {
    await leaveService.create(payload);
    setShowForm(false);
    fetchLeaves();
  };

  const handleConfirmCancel = async () => {
    setCancelError('');
    try {
      await leaveService.cancel(pendingCancel.id);
      setPendingCancel(null);
      fetchLeaves();
    } catch (err) {
      setCancelError(err.response?.data?.message || 'Could not cancel request.');
    }
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">My Leave Requests</Typography>
        {!showForm && (
          <Button variant="contained" onClick={() => setShowForm(true)}>
            New Leave Request
          </Button>
        )}
      </Box>

      <Collapse in={showForm}>
        <Box mb={4} p={3} component="div" sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <LeaveRequestForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </Box>
      </Collapse>

      <TextField
        label="Filter by Status" select size="small"
        value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
        sx={{ minWidth: 180, mb: 2 }}
      >
        {STATUS_OPTIONS.map((s) => (
          <MenuItem key={s || 'all'} value={s}>{s || 'All'}</MenuItem>
        ))}
      </TextField>

      <MyLeaveTable data={leaves} loading={loading} onCancel={setPendingCancel} />

      <Dialog open={!!pendingCancel} onClose={() => setPendingCancel(null)}>
        <DialogTitle>Cancel leave request?</DialogTitle>
        <DialogContent>
          {cancelError && <Alert severity="error" sx={{ mb: 2 }}>{cancelError}</Alert>}
          <DialogContentText>
            This will cancel your {pendingCancel?.leaveType} leave from {pendingCancel?.startDate} to {pendingCancel?.endDate}.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPendingCancel(null)}>Keep Request</Button>
          <Button onClick={handleConfirmCancel} color="error" variant="contained">Cancel Request</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
