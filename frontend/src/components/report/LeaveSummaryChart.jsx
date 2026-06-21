import { Paper, Typography } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const STATUS_COLORS = {
  PENDING: '#B8860B',
  APPROVED: '#2E7D32',
  REJECTED: '#C62828',
  CANCELLED: '#9E9E9E',
};

export function LeaveSummaryChart({ data }) {
  const chartData = data.map((d) => ({ name: d.status, value: d.count }));

  return (
    <Paper variant="outlined" sx={{ p: 3, height: 360 }}>
      <Typography variant="h6" mb={2}>Leave Requests by Status</Typography>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#999'} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
}
