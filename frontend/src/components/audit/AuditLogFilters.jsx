import { Box, TextField, MenuItem, Button } from '@mui/material';

const ENTITY_TYPES = ['', 'EMPLOYEE', 'DEPARTMENT', 'LEAVE_REQUEST', 'USER'];

export function AuditLogFilters({ filters, onChange, onReset }) {
  const handleField = (field) => (e) => onChange({ ...filters, [field]: e.target.value, page: 0 });

  return (
    <Box display="flex" gap={2} mb={2} alignItems="center" flexWrap="wrap">
      <TextField
        label="Entity Type" select size="small"
        value={filters.entityType} onChange={handleField('entityType')}
        sx={{ minWidth: 170 }}
      >
        {ENTITY_TYPES.map((t) => (
          <MenuItem key={t || 'all'} value={t}>{t || 'All'}</MenuItem>
        ))}
      </TextField>
      <TextField
        label="User ID" type="number" size="small"
        value={filters.userId} onChange={handleField('userId')}
        sx={{ width: 120 }}
      />
      <TextField
        label="From" type="datetime-local" size="small"
        InputLabelProps={{ shrink: true }}
        value={filters.from} onChange={handleField('from')}
      />
      <TextField
        label="To" type="datetime-local" size="small"
        InputLabelProps={{ shrink: true }}
        value={filters.to} onChange={handleField('to')}
      />
      <Button onClick={onReset}>Clear</Button>
    </Box>
  );
}
