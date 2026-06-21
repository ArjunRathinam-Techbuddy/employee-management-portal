import { Paper, Typography } from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

export function HeadcountChart({ data }) {
  return (
    <Paper variant="outlined" sx={{ p: 3, height: 360 }}>
      <Typography variant="h6" mb={2}>Headcount by Department</Typography>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="departmentName" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="activeCount" name="Active" fill="#2952A3" />
          <Bar dataKey="inactiveCount" name="Inactive" fill="#B0B8C1" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}
