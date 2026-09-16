import React from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import { VedaTimeSkeleton } from '../VedaTimeSkeleton';

export const SettingsSkeleton: React.FC = React.memo(() => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  return (
    <Box sx={{ p: 2, pb: 8, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', minHeight: '100vh' }}>
      {/* Header */}
      <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
        <VedaTimeSkeleton width={200} height={32} />
      </Paper>
      
      {/* Settings Sections */}
      <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
        <VedaTimeSkeleton width="60%" height={24} sx={{ mb: 2 }} />
        <VedaTimeSkeleton variant="list-item" />
        <VedaTimeSkeleton variant="list-item" />
        <VedaTimeSkeleton variant="list-item" />
      </Paper>
      
      <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
        <VedaTimeSkeleton width="60%" height={24} sx={{ mb: 2 }} />
        <VedaTimeSkeleton variant="list-item" />
        <VedaTimeSkeleton variant="list-item" />
        <VedaTimeSkeleton variant="list-item" />
      </Paper>
    </Box>
  );
});

export default SettingsSkeleton;
