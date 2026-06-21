import {
  Paper, Typography, Table, TableHead, TableBody, TableRow, TableCell, TableContainer,
} from '@mui/material';

function formatINR(value) {
  return value != null ? `₹${Number(value).toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : '—';
}

export function SalaryStatsTable({ data }) {
  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Typography variant="h6" mb={2}>Salary Statistics by Department</Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Department</TableCell>
              <TableCell align="right">Employees</TableCell>
              <TableCell align="right">Min</TableCell>
              <TableCell align="right">Max</TableCell>
              <TableCell align="right">Average</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow><TableCell colSpan={5} align="center" sx={{ py: 3 }}>No data</TableCell></TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.departmentId} hover>
                  <TableCell>{row.departmentName}</TableCell>
                  <TableCell align="right">{row.employeeCount}</TableCell>
                  <TableCell align="right">{formatINR(row.minSalary)}</TableCell>
                  <TableCell align="right">{formatINR(row.maxSalary)}</TableCell>
                  <TableCell align="right">{formatINR(row.avgSalary)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
