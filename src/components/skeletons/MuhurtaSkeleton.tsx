/**
 * MuhurtaSkeleton - Loading skeleton for Muhurta screen
 * Matches the layout of MuhurtaScreen with branded saffron shimmer
 */

import React from 'react';
import { Box, Paper, Skeleton, useTheme } from '@mui/material';
import { useBreakpoints } from '../../hooks/useBreakpoints';

export const MuhurtaSkeleton: React.FC = React.memo(() => {
  const theme = useTheme();
  const { isMobile } = useBreakpoints();
  const saffronBase = theme.palette.primary?.main || '#E8722A';
  const shimmerBg = `${saffronBase}20`;

  return (
    <Box
      sx={{
        px: isMobile ? 2 : 3,
        pt: 2,
        pb: 2,
        maxWidth: 800,
        mx: 'auto',
      }}
    >
      {/* Current Muhurta Hero Skeleton */}
      <Paper
        elevation={0}
        sx={{
          p: isMobile ? 2 : 3,
          mb: 3,
          borderRadius: 3,
          bgcolor: shimmerBg,
          border: `1px solid ${saffronBase}30`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Skeleton
            variant="circular"
            width={48}
            height={48}
            sx={{ bgcolor: shimmerBg, flexShrink: 0 }}
            animation="wave"
          />
          <Box sx={{ flex: 1 }}>
            <Skeleton
              variant="text"
              width={100}
              height={16}
              sx={{ bgcolor: shimmerBg, mb: 0.5 }}
              animation="wave"
            />
            <Skeleton
              variant="text"
              width="60%"
              height={32}
              sx={{ bgcolor: shimmerBg, mb: 1 }}
              animation="wave"
            />
            <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
              <Skeleton
                variant="rectangular"
                width={90}
                height={24}
                sx={{ bgcolor: shimmerBg, borderRadius: 2 }}
                animation="wave"
              />
              <Skeleton
                variant="rectangular"
                width={80}
                height={24}
                sx={{ bgcolor: shimmerBg, borderRadius: 2 }}
                animation="wave"
              />
            </Box>
            <Skeleton
              variant="rectangular"
              width="100%"
              height={6}
              sx={{ bgcolor: shimmerBg, borderRadius: 3 }}
              animation="wave"
            />
            <Skeleton
              variant="text"
              width={150}
              height={16}
              sx={{ bgcolor: shimmerBg, mt: 0.5 }}
              animation="wave"
            />
          </Box>
        </Box>
      </Paper>

      {/* Solar Timing Info */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        {[0, 1].map((i) => (
          <Paper
            key={i}
            elevation={0}
            sx={{
              flex: 1,
              minWidth: 140,
              p: 1.5,
              borderRadius: 2,
              bgcolor: shimmerBg,
              border: `1px solid ${saffronBase}15`,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Skeleton
              variant="circular"
              width={20}
              height={20}
              sx={{ bgcolor: shimmerBg }}
              animation="wave"
            />
            <Box>
              <Skeleton
                variant="text"
                width={60}
                height={14}
                sx={{ bgcolor: shimmerBg, mb: 0.25 }}
                animation="wave"
              />
              <Skeleton
                variant="text"
                width={50}
                height={20}
                sx={{ bgcolor: shimmerBg }}
                animation="wave"
              />
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Day Choghadiyas Section */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <Skeleton
            variant="circular"
            width={20}
            height={20}
            sx={{ bgcolor: shimmerBg }}
            animation="wave"
          />
          <Skeleton
            variant="text"
            width={120}
            height={24}
            sx={{ bgcolor: shimmerBg }}
            animation="wave"
          />
        </Box>
        {[...Array(4)].map((_, i) => (
          <Paper
            key={`day-${i}`}
            elevation={0}
            sx={{
              p: isMobile ? 1.5 : 2,
              mb: 1,
              bgcolor: shimmerBg,
              border: `1px solid ${saffronBase}25`,
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                <Skeleton
                  variant="circular"
                  width={8}
                  height={8}
                  sx={{ bgcolor: shimmerBg, flexShrink: 0 }}
                  animation="wave"
                />
                <Box sx={{ flex: 1 }}>
                  <Skeleton
                    variant="text"
                    width={80}
                    height={20}
                    sx={{ bgcolor: shimmerBg, mb: 0.25 }}
                    animation="wave"
                  />
                  <Skeleton
                    variant="text"
                    width={120}
                    height={16}
                    sx={{ bgcolor: shimmerBg }}
                    animation="wave"
                  />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Skeleton
                  variant="rectangular"
                  width={60}
                  height={22}
                  sx={{ bgcolor: shimmerBg, borderRadius: 1 }}
                  animation="wave"
                />
                <Skeleton
                  variant="rectangular"
                  width={40}
                  height={22}
                  sx={{ bgcolor: shimmerBg, borderRadius: 1 }}
                  animation="wave"
                />
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Night Choghadiyas Section */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <Skeleton
            variant="circular"
            width={20}
            height={20}
            sx={{ bgcolor: shimmerBg }}
            animation="wave"
          />
          <Skeleton
            variant="text"
            width={130}
            height={24}
            sx={{ bgcolor: shimmerBg }}
            animation="wave"
          />
        </Box>
        {[...Array(3)].map((_, i) => (
          <Paper
            key={`night-${i}`}
            elevation={0}
            sx={{
              p: isMobile ? 1.5 : 2,
              mb: 1,
              bgcolor: shimmerBg,
              border: `1px solid ${saffronBase}25`,
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                <Skeleton
                  variant="circular"
                  width={8}
                  height={8}
                  sx={{ bgcolor: shimmerBg, flexShrink: 0 }}
                  animation="wave"
                />
                <Box sx={{ flex: 1 }}>
                  <Skeleton
                    variant="text"
                    width={70}
                    height={20}
                    sx={{ bgcolor: shimmerBg, mb: 0.25 }}
                    animation="wave"
                  />
                  <Skeleton
                    variant="text"
                    width={110}
                    height={16}
                    sx={{ bgcolor: shimmerBg }}
                    animation="wave"
                  />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Skeleton
                  variant="rectangular"
                  width={60}
                  height={22}
                  sx={{ bgcolor: shimmerBg, borderRadius: 1 }}
                  animation="wave"
                />
                <Skeleton
                  variant="rectangular"
                  width={40}
                  height={22}
                  sx={{ bgcolor: shimmerBg, borderRadius: 1 }}
                  animation="wave"
                />
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Legend */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mt: 2,
          borderRadius: 2,
          bgcolor: shimmerBg,
          border: `1px solid ${saffronBase}15`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <Skeleton
            variant="circular"
            width={18}
            height={18}
            sx={{ bgcolor: shimmerBg }}
            animation="wave"
          />
          <Skeleton
            variant="text"
            width={80}
            height={20}
            sx={{ bgcolor: shimmerBg }}
            animation="wave"
          />
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 1,
          }}
        >
          {[...Array(6)].map((_, i) => (
            <Box
              key={i}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                p: 1,
                borderRadius: 1.5,
                bgcolor: `${saffronBase}10`,
              }}
            >
              <Skeleton
                variant="circular"
                width={10}
                height={10}
                sx={{ bgcolor: shimmerBg, flexShrink: 0 }}
                animation="wave"
              />
              <Box sx={{ flex: 1 }}>
                <Skeleton
                  variant="text"
                  width={60}
                  height={16}
                  sx={{ bgcolor: shimmerBg, mb: 0.25 }}
                  animation="wave"
                />
                <Skeleton
                  variant="text"
                  width={80}
                  height={12}
                  sx={{ bgcolor: shimmerBg }}
                  animation="wave"
                />
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
});

export default MuhurtaSkeleton;
