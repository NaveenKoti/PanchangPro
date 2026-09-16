import React from 'react';
import { Box, Tabs, Tab, Paper, useTheme } from '@mui/material';
import { VedaTimeSkeleton } from '../VedaTimeSkeleton';

export const FastsSkeleton: React.FC = React.memo(() => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  return (
    <Box sx={{ p: 2, pb: 8, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', minHeight: '100vh' }}>
      {/* Tabs */}
      <Paper elevation={0} sx={{ mb: 2 }}>
        <Tabs value={0} centered>
          {[0, 1, 2].map((i) => (
            <Tab key={i} label={<VedaTimeSkeleton width={80} height={24} />} disabled />
          ))}
        </Tabs>
      </Paper>
      
      {/* List Items */}
      {[...Array(8)].map((_, i) => (
        <Box key={i} sx={{ mb: 1 }}>
          <VedaTimeSkeleton variant="list-item" />
        </Box>
      ))}
    </Box>
  );
});

export default FastsSkeleton;
