import { useState } from 'react';
import {
  Table, TableHead, TableBody, TableRow, TableCell, TablePagination,
  Chip, IconButton, Paper, TableContainer, CircularProgress, Box, Collapse, Typography,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const ACTION_COLORS = {
  CREATE: 'success',
  UPDATE: 'info',
  SOFT_DELETE: 'error',
  DELETE: 'error',
  REACTIVATE: 'success',
  APPROVE: 'success',
  REJECT: 'error',
  CANCEL: 'warning',
  LOGIN: 'default',
  LOGOUT: 'default',
};

function prettyJson(raw) {
  if (!raw) return null;
  try {
    return JSON.stringify(JSON.parse(raw), null, 2);
  } catch {
    return raw;
  }
}

function LogRow({ log }) {
  const [open, setOpen] = useState(false);
  const hasPayload = log.oldValue || log.newValue;

  return (
    <>
      <TableRow hover>
        <TableCell sx={{ width: 40 }}>
          {hasPayload && (
            <IconButton size="small" onClick={() => setOpen((o) => !o)}>
              {open ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
            </IconButton>
          )}
        </TableCell>
        <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
        <TableCell>{log.userEmail || '—'}</TableCell>
        <TableCell>
          <Chip label={log.action} size="small" color={ACTION_COLORS[log.action] || 'default'} />
        </TableCell>
        <TableCell>{log.entityType}</TableCell>
        <TableCell>{log.entityId ?? '—'}</TableCell>
        <TableCell>{log.ipAddress || '—'}</TableCell>
      </TableRow>
      {hasPayload && (
        <TableRow>
          <TableCell colSpan={7} sx={{ py: 0, borderBottom: open ? undefined : 'none' }}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ py: 2, px: 2 }}>
                {log.oldValue && (
                  <>
                    <Typography variant="caption" color="text.secondary">Old Value</Typography>
                    <pre style={{ margin: 0, fontSize: 12, whiteSpace: 'pre-wrap' }}>{prettyJson(log.oldValue)}</pre>
                  </>
                )}
                {log.newValue && (
                  <>
                    <Typography variant="caption" color="text.secondary">New Value</Typography>
                    <pre style={{ margin: 0, fontSize: 12, whiteSpace: 'pre-wrap' }}>{prettyJson(log.newValue)}</pre>
                  </>
                )}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export function AuditLogTable({ data, loading, page, size, totalElements, onPageChange, onSizeChange }) {
  return (
    <Paper variant="outlined">
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Timestamp</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Entity Type</TableCell>
              <TableCell>Entity ID</TableCell>
              <TableCell>IP Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}><CircularProgress size={28} /></TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>No audit log entries found</TableCell>
              </TableRow>
            ) : (
              data.map((log) => <LogRow key={log.id} log={log} />)
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalElements}
        page={page}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        rowsPerPage={size}
        onRowsPerPageChange={(e) => onSizeChange(parseInt(e.target.value, 10))}
        rowsPerPageOptions={[20, 50, 100]}
      />
    </Paper>
  );
}
