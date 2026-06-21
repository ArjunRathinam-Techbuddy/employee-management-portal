import { Chip } from '@mui/material';

const COLOR_MAP = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'error',
  CANCELLED: 'default',
};

export function LeaveStatusChip({ status }) {
  return <Chip label={status} color={COLOR_MAP[status] || 'default'} size="small" />;
}
