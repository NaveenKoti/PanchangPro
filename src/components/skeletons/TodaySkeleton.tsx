import React from 'react';
import { Box, Grid, useTheme } from '@mui/material';
import { VedaTimeSkeleton } from '../VedaTimeSkeleton';

export const TodaySkeleton: React.FC = React.memo(() => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  return (
    <Box sx={{ p: 2, maxWidth: 1200, mx: 'auto', bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', minHeight: '100vh' }}>
      <Grid container spacing={2}>
        {/* Tithi Card */}
        <Grid item xs={12} md={8}>
          <VedaTimeSkeleton variant="tithi-card" />
        </Grid>
        
        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <VedaTimeSkeleton height={48} />
            <VedaTimeSkeleton height={48} />
            <VedaTimeSkeleton height={48} />
          </Box>
        </Grid>
        
        {/* Panchang Details */}
        <Grid item xs={12} md={6}>
          <VedaTimeSkeleton variant="list-item" />
          <VedaTimeSkeleton variant="list-item" />
          <VedaTimeSkeleton variant="list-item" />
        </Grid>
        
        {/* Additional Info */}
        <Grid item xs={12} md={6}>
          <VedaTimeSkeleton variant="detail-panel" />
        </Grid>
      </Grid>
    </Box>
  );
});

export default TodaySkeleton;
