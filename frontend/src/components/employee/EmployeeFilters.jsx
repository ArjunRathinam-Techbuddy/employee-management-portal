import { Box, TextField, MenuItem, Button } from '@mui/material';

export function EmployeeFilters({ filters, onChange, departments, onAddNew }) {
  const handleField = (field) => (e) => onChange({ ...filters, [field]: e.target.value, page: 0 });

  return (
    <Box display="flex" gap={2} mb={2} alignItems="center" flexWrap="wrap">
      <TextField
        label="Search name or code"
        size="small"
        value={filters.search}
        onChange={handleField('search')}
        sx={{ minWidth: 220 }}
      />
      <TextField
        label="Department"
        size="small"
        select
        value={filters.departmentId}
        onChange={handleField('departmentId')}
        sx={{ minWidth: 180 }}
      >
        <MenuItem value="">All</MenuItem>
        {departments.map((d) => (
          <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
        ))}
      </TextField>
      <TextField
        label="Status"
        size="small"
        select
        value={filters.active}
        onChange={handleField('active')}
        sx={{ minWidth: 140 }}
      >
        <MenuItem value="">All</MenuItem>
        <MenuItem value="true">Active</MenuItem>
        <MenuItem value="false">Inactive</MenuItem>
      </TextField>
      <Box flexGrow={1} />
      <Button variant="contained" onClick={onAddNew}>Add Employee</Button>
    </Box>
  );
}
