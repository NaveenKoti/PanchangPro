import React from 'react';
import { Box, Grid, useTheme } from '@mui/material';
import { VedaTimeSkeleton } from '../VedaTimeSkeleton';

export const CalendarSkeleton: React.FC = React.memo(() => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  return (
    <Box sx={{ p: 2, maxWidth: 1200, mx: 'auto', bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', minHeight: '100vh' }}>
      {/* Month Navigation */}
      <VedaTimeSkeleton height={56} />
      
      {/* Calendar Grid */}
      <Box sx={{ mt: 2 }}>
        <VedaTimeSkeleton variant="calendar-grid" />
      </Box>
      
      {/* Legend */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {[...Array(4)].map((_, i) => (
          <Grid item xs={6} md={3} key={i}>
            <VedaTimeSkeleton height={48} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
});

export default CalendarSkeleton;
