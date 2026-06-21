import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function UnauthorizedPage() {
  return (
    <Box textAlign="center" mt={10}>
      <Typography variant="h4" mb={2}>403 — Not authorized</Typography>
      <Typography color="text.secondary" mb={3}>
        You don't have permission to view this page.
      </Typography>
      <Button component={Link} to="/dashboard" variant="contained">
        Back to Dashboard
      </Button>
    </Box>
  );
}
