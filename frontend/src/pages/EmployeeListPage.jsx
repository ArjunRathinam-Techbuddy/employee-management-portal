import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { employeeService } from '../services/employeeService';
import { departmentService } from '../services/departmentService';
import { EmployeeFilters } from '../components/employee/EmployeeFilters';
import { EmployeeTable } from '../components/employee/EmployeeTable';
import { downloadCsv } from '../utils/csvExport';

const DEFAULT_FILTERS = { search: '', departmentId: '', active: '', page: 0, size: 20 };

const CSV_COLUMNS = [
  { label: 'Employee Code', value: 'employeeCode' },
  { label: 'First Name', value: 'firstName' },
  { label: 'Last Name', value: 'lastName' },
  { label: 'Department', value: 'departmentName' },
  { label: 'Designation', value: 'designation' },
  { label: 'Date of Joining', value: 'dateOfJoining' },
  { label: 'Salary', value: 'salary' },
  { label: 'Phone', value: 'phone' },
  { label: 'Status', value: (e) => (e.active ? 'Active' : 'Inactive') },
];

export default function EmployeeListPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [result, setResult] = useState({ data: [], totalElements: 0 });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    departmentService.list().then(setDepartments).catch(() => {});
  }, []);

  const buildParams = useCallback((overrides = {}) => ({
    page: filters.page,
    size: filters.size,
    ...(filters.search && { search: filters.search }),
    ...(filters.departmentId && { departmentId: filters.departmentId }),
    ...(filters.active !== '' && { active: filters.active }),
    ...overrides,
  }), [filters]);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const data = await employeeService.list(buildParams());
      setResult(data);
    } finally {
      setLoading(false);
    }
  }, [buildParams]);

  useEffect(() => {
    const timeout = setTimeout(fetchEmployees, filters.search ? 350 : 0);
    return () => clearTimeout(timeout);
  }, [fetchEmployees]);

  const handleExport = async () => {
    setExporting(true);
    try {
      // Export the full filtered result set, not just the current page.
      const data = await employeeService.list(buildParams({ page: 0, size: 10000 }));
      downloadCsv(`employees-${new Date().toISOString().split('T')[0]}.csv`, data.data, CSV_COLUMNS);
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Employees</Typography>
        <Button startIcon={<DownloadIcon />} variant="outlined" onClick={handleExport} disabled={exporting}>
          {exporting ? 'Exporting…' : 'Export CSV'}
        </Button>
      </Box>
      <EmployeeFilters
        filters={filters}
        onChange={setFilters}
        departments={departments}
        onAddNew={() => navigate('/employees/new')}
      />
      <EmployeeTable
        data={result.data}
        loading={loading}
        page={filters.page}
        size={filters.size}
        totalElements={result.totalElements}
        onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
        onSizeChange={(size) => setFilters((f) => ({ ...f, size, page: 0 }))}
      />
    </>
  );
}
