import { Typography } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import AdminDashboardPage from './AdminDashboardPage';

export default function DashboardPage() {
  const { user } = useAuth();

  if (user?.role === 'ADMIN') {
    return <AdminDashboardPage />;
  }

  return (
    <>
      <Typography variant="h4" mb={1}>Welcome, {user?.email}</Typography>
      <Typography color="text.secondary">Role: {user?.role}</Typography>
    </>
  );
}
