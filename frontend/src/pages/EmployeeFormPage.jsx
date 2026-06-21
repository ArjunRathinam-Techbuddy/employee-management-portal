import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Typography, Box, CircularProgress, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { employeeService } from '../services/employeeService';
import { departmentService } from '../services/departmentService';
import { EmployeeForm } from '../components/employee/EmployeeForm';

export default function EmployeeFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [initialValues, setInitialValues] = useState(isEdit ? null : {});
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    departmentService.list().then(setDepartments).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    employeeService.getById(id)
      .then((emp) => setInitialValues({
        firstName: emp.firstName,
        lastName: emp.lastName,
        departmentId: emp.departmentId,
        designation: emp.designation,
        dateOfJoining: emp.dateOfJoining,
        salary: emp.salary,
        phone: emp.phone || '',
        address: emp.address || '',
        managerId: emp.managerId || '',
      }))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleSubmit = async (payload) => {
    if (isEdit) {
      await employeeService.update(id, payload);
      navigate(`/employees/${id}`);
    } else {
      const created = await employeeService.create(payload);
      navigate(`/employees/${created.id}`);
    }
  };

  if (loading || initialValues === null) {
    return <Box display="flex" justifyContent="center" mt={6}><CircularProgress /></Box>;
  }

  return (
    <>
      <Button
        startIcon={<ArrowBackIcon />}
        component={Link}
        to={isEdit ? `/employees/${id}` : '/employees'}
        sx={{ mb: 2 }}
      >
        Back
      </Button>
      <Typography variant="h4" mb={3}>{isEdit ? 'Edit Employee' : 'Add Employee'}</Typography>
      <EmployeeForm
        initialValues={initialValues}
        departments={departments}
        onSubmit={handleSubmit}
        submitLabel={isEdit ? 'Save Changes' : 'Create Employee'}
      />
    </>
  );
}
