import {
  Paper, Typography, Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, TextField, Box, CircularProgress,
} from '@mui/material';

export function UpcomingLeavesTable({ data, days, onDaysChange, loading }) {
  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Upcoming Approved Leaves</Typography>
        <TextField
          label="Window (days)" type="number" size="small"
          value={days} onChange={(e) => onDaysChange(Number(e.target.value) || 30)}
          sx={{ width: 140 }}
        />
      </Box>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Employee</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Start</TableCell>
              <TableCell>End</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} align="center" sx={{ py: 3 }}><CircularProgress size={24} /></TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={5} align="center" sx={{ py: 3 }}>No upcoming leaves in this window</TableCell></TableRow>
            ) : (
              data.map((lr, idx) => (
                <TableRow key={`${lr.employeeId}-${lr.startDate}-${idx}`} hover>
                  <TableCell>{lr.employeeName}</TableCell>
                  <TableCell>{lr.departmentName}</TableCell>
                  <TableCell>{lr.leaveType}</TableCell>
                  <TableCell>{lr.startDate}</TableCell>
                  <TableCell>{lr.endDate}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
