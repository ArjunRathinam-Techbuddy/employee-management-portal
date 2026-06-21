import { useEffect, useState, useCallback } from 'react';
import { Box, Typography, TextField, MenuItem, Alert, Snackbar } from '@mui/material';
import { leaveService } from '../services/leaveService';
import { LeaveApprovalTable } from '../components/leave/LeaveApprovalTable';
import { RejectDialog } from '../components/leave/RejectDialog';

const STATUS_OPTIONS = ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', ''];

export default function LeaveApprovalPage() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [rejectTarget, setRejectTarget] = useState(null);
  const [toast, setToast] = useState('');
  const [approveError, setApproveError] = useState('');

  const fetchLeaves = useCallback(() => {
    setLoading(true);
    const params = statusFilter ? { status: statusFilter, size: 50 } : { size: 50 };
    return leaveService.listAll(params)
      .then((data) => setLeaves(data.data))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  useEffect(() => { fetchLeaves(); }, [fetchLeaves]);

  const handleApprove = async (lr) => {
    setApproveError('');
    try {
      await leaveService.approve(lr.id);
      setToast(`Approved ${lr.employeeName}'s leave request`);
      fetchLeaves();
    } catch (err) {
      setApproveError(err.response?.data?.message || 'Could not approve request.');
    }
  };

  const handleRejectConfirm = async (reason) => {
    await leaveService.reject(rejectTarget.id, { rejectReason: reason });
    setToast(`Rejected ${rejectTarget.employeeName}'s leave request`);
    setRejectTarget(null);
    fetchLeaves();
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Leave Requests</Typography>
        <TextField
          label="Status" select size="small"
          value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ minWidth: 180 }}
        >
          {STATUS_OPTIONS.map((s) => (
            <MenuItem key={s || 'all'} value={s}>{s || 'All'}</MenuItem>
          ))}
        </TextField>
      </Box>

      {approveError && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setApproveError('')}>{approveError}</Alert>}

      <LeaveApprovalTable
        data={leaves}
        loading={loading}
        onApprove={handleApprove}
        onReject={setRejectTarget}
      />

      <RejectDialog
        leave={rejectTarget}
        onConfirm={handleRejectConfirm}
        onClose={() => setRejectTarget(null)}
      />

      <Snackbar
        open={!!toast}
        autoHideDuration={3000}
        onClose={() => setToast('')}
        message={toast}
      />
    </>
  );
}
