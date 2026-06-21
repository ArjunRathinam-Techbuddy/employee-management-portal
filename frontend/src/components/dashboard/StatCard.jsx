import { Paper, Typography, Box } from '@mui/material';

export function StatCard({ label, value, icon, color = 'primary.main' }) {
  return (
    <Paper variant="outlined" sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box
        sx={{
          width: 48, height: 48, borderRadius: 2, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          bgcolor: color, color: '#fff', flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="h5" fontWeight={700}>{value}</Typography>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
      </Box>
    </Paper>
  );
}
