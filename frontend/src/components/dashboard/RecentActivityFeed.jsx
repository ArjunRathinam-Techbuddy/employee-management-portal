import { Paper, Typography, List, ListItem, ListItemText, Chip, Box, CircularProgress } from '@mui/material';

const ACTION_COLORS = {
  CREATE: 'success', UPDATE: 'info', SOFT_DELETE: 'error', DELETE: 'error',
  REACTIVATE: 'success', APPROVE: 'success', REJECT: 'error', CANCEL: 'warning',
  LOGIN: 'default', LOGOUT: 'default', SELF_UPDATE_PROFILE: 'info',
};

export function RecentActivityFeed({ logs, loading }) {
  return (
    <Paper variant="outlined" sx={{ p: 3, height: 360, overflow: 'auto' }}>
      <Typography variant="h6" mb={2}>Recent Activity</Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}><CircularProgress size={24} /></Box>
      ) : logs.length === 0 ? (
        <Typography color="text.secondary">No recent activity</Typography>
      ) : (
        <List dense disablePadding>
          {logs.map((log) => (
            <ListItem key={log.id} disableGutters divider>
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Chip label={log.action} size="small" color={ACTION_COLORS[log.action] || 'default'} />
                    <Typography variant="body2">{log.entityType} #{log.entityId ?? '—'}</Typography>
                  </Box>
                }
                secondary={`${log.userEmail || 'system'} · ${new Date(log.createdAt).toLocaleString()}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}
