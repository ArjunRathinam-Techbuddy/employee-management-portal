import {
  Table, TableHead, TableBody, TableRow, TableCell, Paper, TableContainer,
  Button, CircularProgress, Box, Tooltip,
} from '@mui/material';
import { LeaveStatusChip } from './LeaveStatusChip';

export function LeaveApprovalTable({ data, loading, onApprove, onReject }) {
  return (
    <Paper variant="outlined">
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Employee</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Start</TableCell>
              <TableCell>End</TableCell>
              <TableCell align="right">Days</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}><CircularProgress size={28} /></TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>No leave requests found</TableCell>
              </TableRow>
            ) : (
              data.map((lr) => (
                <TableRow key={lr.id} hover>
                  <TableCell>{lr.employeeName}</TableCell>
                  <TableCell>{lr.leaveType}</TableCell>
                  <TableCell>{lr.startDate}</TableCell>
                  <TableCell>{lr.endDate}</TableCell>
                  <TableCell align="right">{lr.durationDays}</TableCell>
                  <TableCell sx={{ maxWidth: 220, color: 'text.secondary' }}>{lr.reason || '—'}</TableCell>
                  <TableCell><LeaveStatusChip status={lr.status} /></TableCell>
                  <TableCell align="right">
                    {lr.status === 'PENDING' ? (
                      <Box display="flex" gap={1} justifyContent="flex-end">
                        <Button size="small" color="success" variant="outlined" onClick={() => onApprove(lr)}>
                          Approve
                        </Button>
                        <Button size="small" color="error" variant="outlined" onClick={() => onReject(lr)}>
                          Reject
                        </Button>
                      </Box>
                    ) : (
                      <Tooltip title={lr.reviewedByEmail ? `Reviewed by ${lr.reviewedByEmail}` : ''}>
                        <span style={{ color: 'inherit' }}>—</span>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
