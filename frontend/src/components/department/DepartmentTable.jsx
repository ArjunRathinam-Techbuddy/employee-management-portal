import {
  Table, TableHead, TableBody, TableRow, TableCell, Paper, TableContainer,
  IconButton, CircularProgress, Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

export function DepartmentTable({ data, loading, onDelete }) {
  const navigate = useNavigate();

  return (
    <Paper variant="outlined">
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Head</TableCell>
              <TableCell align="right">Employees</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={28} />
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  No departments found
                </TableCell>
              </TableRow>
            ) : (
              data.map((dept) => (
                <TableRow key={dept.id} hover>
                  <TableCell>{dept.name}</TableCell>
                  <TableCell sx={{ maxWidth: 320, color: 'text.secondary' }}>
                    {dept.description || '—'}
                  </TableCell>
                  <TableCell>{dept.headEmployeeName || '—'}</TableCell>
                  <TableCell align="right">{dept.employeeCount}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => navigate(`/departments/${dept.id}/edit`)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <Tooltip title={dept.employeeCount > 0 ? 'Cannot delete: employees assigned' : 'Delete'}>
                      <span>
                        <IconButton
                          size="small"
                          disabled={dept.employeeCount > 0}
                          onClick={() => onDelete(dept)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
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
