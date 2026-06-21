import { useEffect, useState, useCallback } from 'react';
import { Typography } from '@mui/material';
import { auditService } from '../services/auditService';
import { AuditLogFilters } from '../components/audit/AuditLogFilters';
import { AuditLogTable } from '../components/audit/AuditLogTable';

const DEFAULT_FILTERS = { entityType: '', userId: '', from: '', to: '', page: 0, size: 20 };

export default function AuditLogPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [result, setResult] = useState({ content: [], totalElements: 0 });
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: filters.page,
        size: filters.size,
        ...(filters.entityType && { entityType: filters.entityType }),
        ...(filters.userId && { userId: filters.userId }),
        ...(filters.from && { from: new Date(filters.from).toISOString() }),
        ...(filters.to && { to: new Date(filters.to).toISOString() }),
      };
      const data = await auditService.list(params);
      setResult(data);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  return (
    <>
      <Typography variant="h4" mb={3}>Audit Logs</Typography>
      <AuditLogFilters
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(DEFAULT_FILTERS)}
      />
      <AuditLogTable
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
