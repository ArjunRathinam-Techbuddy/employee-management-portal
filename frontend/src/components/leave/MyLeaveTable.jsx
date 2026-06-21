import {
  Table, TableHead, TableBody, TableRow, TableCell, Paper, TableContainer,
  Button, CircularProgress, Tooltip,
} from '@mui/material';
import { LeaveStatusChip } from './LeaveStatusChip';

export function MyLeaveTable({ data, loading, onCancel }) {
  return (
    <Paper variant="outlined">
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
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
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}><CircularProgress size={28} /></TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>No leave requests yet</TableCell>
              </TableRow>
            ) : (
              data.map((lr) => (
                <TableRow key={lr.id} hover>
                  <TableCell>{lr.leaveType}</TableCell>
                  <TableCell>{lr.startDate}</TableCell>
                  <TableCell>{lr.endDate}</TableCell>
                  <TableCell align="right">{lr.durationDays}</TableCell>
                  <TableCell sx={{ maxWidth: 240, color: 'text.secondary' }}>{lr.reason || '—'}</TableCell>
                  <TableCell><LeaveStatusChip status={lr.status} /></TableCell>
                  <TableCell align="right">
                    <Tooltip title={lr.status !== 'PENDING' ? 'Only pending requests can be cancelled' : ''}>
                      <span>
                        <Button
                          size="small"
                          color="error"
                          disabled={lr.status !== 'PENDING'}
                          onClick={() => onCancel(lr)}
                        >
                          Cancel
                        </Button>
                      </span>
                    </Tooltip>
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
