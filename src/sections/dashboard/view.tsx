import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export function DashboardView() {
  return (
    <DashboardContent>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4">Dashboard</Typography>
        <Typography sx={{ color: 'text.secondary' }}>Welcome back!</Typography>
      </Box>
    </DashboardContent>
  );
}
