import {
  Table, TableHead, TableBody, TableRow, TableCell, TablePagination,
  Chip, IconButton, Paper, TableContainer, CircularProgress, Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';

export function EmployeeTable({ data, loading, page, size, totalElements, onPageChange, onSizeChange }) {
  const navigate = useNavigate();

  return (
    <Paper variant="outlined">
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Designation</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={28} />
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  No employees found
                </TableCell>
              </TableRow>
            ) : (
              data.map((emp) => (
                <TableRow key={emp.id} hover>
                  <TableCell>{emp.employeeCode}</TableCell>
                  <TableCell>{emp.firstName} {emp.lastName}</TableCell>
                  <TableCell>{emp.departmentName}</TableCell>
                  <TableCell>{emp.designation}</TableCell>
                  <TableCell>
                    <Chip
                      label={emp.active ? 'Active' : 'Inactive'}
                      color={emp.active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => navigate(`/employees/${emp.id}`)}>
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => navigate(`/employees/${emp.id}/edit`)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box>
        <TablePagination
          component="div"
          count={totalElements}
          page={page}
          onPageChange={(_, newPage) => onPageChange(newPage)}
          rowsPerPage={size}
          onRowsPerPageChange={(e) => onSizeChange(parseInt(e.target.value, 10))}
          rowsPerPageOptions={[10, 20, 50]}
        />
      </Box>
    </Paper>
  );
}
