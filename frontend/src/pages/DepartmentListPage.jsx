import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions, Alert,
} from '@mui/material';
import { departmentService } from '../services/departmentService';
import { DepartmentTable } from '../components/department/DepartmentTable';

export default function DepartmentListPage() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  const fetchDepartments = useCallback(() => {
    setLoading(true);
    return departmentService.list()
      .then(setDepartments)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchDepartments(); }, [fetchDepartments]);

  const handleConfirmDelete = async () => {
    setDeleteError('');
    try {
      await departmentService.remove(pendingDelete.id);
      setPendingDelete(null);
      fetchDepartments();
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Could not delete department.');
    }
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Departments</Typography>
        <Button variant="contained" onClick={() => navigate('/departments/new')}>
          Add Department
        </Button>
      </Box>

      <DepartmentTable data={departments} loading={loading} onDelete={setPendingDelete} />

      <Dialog open={!!pendingDelete} onClose={() => setPendingDelete(null)}>
        <DialogTitle>Delete department?</DialogTitle>
        <DialogContent>
          {deleteError && <Alert severity="error" sx={{ mb: 2 }}>{deleteError}</Alert>}
          <DialogContentText>
            This will permanently delete "{pendingDelete?.name}". This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPendingDelete(null)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
