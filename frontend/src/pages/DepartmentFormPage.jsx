import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Typography, Box, CircularProgress, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { departmentService } from '../services/departmentService';
import { DepartmentForm } from '../components/department/DepartmentForm';

export default function DepartmentFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState(isEdit ? null : {});
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    departmentService.getById(id)
      .then((dept) => setInitialValues({
        name: dept.name,
        description: dept.description || '',
        headEmployeeId: dept.headEmployeeId || '',
      }))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleSubmit = async (payload) => {
    if (isEdit) {
      await departmentService.update(id, payload);
    } else {
      await departmentService.create(payload);
    }
    navigate('/departments');
  };

  if (loading || initialValues === null) {
    return <Box display="flex" justifyContent="center" mt={6}><CircularProgress /></Box>;
  }

  return (
    <>
      <Button startIcon={<ArrowBackIcon />} component={Link} to="/departments" sx={{ mb: 2 }}>
        Back to Departments
      </Button>
      <Typography variant="h4" mb={3}>{isEdit ? 'Edit Department' : 'Add Department'}</Typography>
      <DepartmentForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitLabel={isEdit ? 'Save Changes' : 'Create Department'}
      />
    </>
  );
}
