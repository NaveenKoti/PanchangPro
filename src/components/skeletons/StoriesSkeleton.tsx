/**
 * StoriesSkeleton - Loading skeleton for Stories screen
 * Matches the layout of StoriesScreen with branded saffron shimmer
 */

import React from 'react';
import { Box, Paper, Skeleton, useTheme } from '@mui/material';

export const StoriesSkeleton: React.FC = React.memo(() => {
  const theme = useTheme();
  const saffronBase = theme.palette.primary.main;
  const shimmerBg = `${saffronBase}20`;

  const cardSx = {
    borderRadius: 3,
    border: `1px solid ${saffronBase}15`,
    overflow: 'hidden',
    mb: 2,
    bgcolor: 'background.paper',
  };

  return (
    <Box sx={{ px: 2, pt: 2.5, pb: 2, maxWidth: 600, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Skeleton
          variant="text"
          width={160}
          height={32}
          sx={{ bgcolor: shimmerBg, mx: 'auto', mb: 0.5 }}
          animation="wave"
        />
        <Skeleton
          variant="text"
          width={200}
          height={20}
          sx={{ bgcolor: shimmerBg, mx: 'auto' }}
          animation="wave"
        />
      </Box>

      {/* Card 1: Tithi Meaning */}
      <Box sx={cardSx}>
        <Box
          sx={{
            px: 2.5,
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${saffronBase}10`,
            bgcolor: `${saffronBase}08`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Skeleton
              variant="circular"
              width={16}
              height={16}
              sx={{ bgcolor: shimmerBg }}
              animation="wave"
            />
            <Skeleton
              variant="text"
              width={100}
              height={14}
              sx={{ bgcolor: shimmerBg }}
              animation="wave"
            />
          </Box>
          <Skeleton
            variant="circular"
            width={24}
            height={24}
            sx={{ bgcolor: shimmerBg }}
            animation="wave"
          />
        </Box>
        <Box sx={{ px: 2.5, py: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
            <Skeleton
              variant="rectangular"
              width={44}
              height={44}
              sx={{ bgcolor: shimmerBg, borderRadius: 2.5, flexShrink: 0 }}
              animation="wave"
            />
            <Box sx={{ flex: 1 }}>
              <Skeleton
                variant="text"
                width={120}
                height={28}
                sx={{ bgcolor: shimmerBg, mb: 0.25 }}
                animation="wave"
              />
              <Skeleton
                variant="text"
                width={80}
                height={18}
                sx={{ bgcolor: shimmerBg }}
                animation="wave"
              />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Skeleton
              variant="rectangular"
              width={90}
              height={24}
              sx={{ bgcolor: shimmerBg, borderRadius: 1.5 }}
              animation="wave"
            />
            <Skeleton
              variant="rectangular"
              width={60}
              height={24}
              sx={{ bgcolor: shimmerBg, borderRadius: 1.5 }}
              animation="wave"
            />
          </Box>
          <Skeleton
            variant="text"
            width="70%"
            height={20}
            sx={{ bgcolor: shimmerBg, mb: 0.75 }}
            animation="wave"
          />
          <Skeleton
            variant="text"
            width="90%"
            height={18}
            sx={{ bgcolor: shimmerBg, mb: 0.5 }}
            animation="wave"
          />
          <Skeleton
            variant="text"
            width="60%"
            height={18}
            sx={{ bgcolor: shimmerBg }}
            animation="wave"
          />
        </Box>
      </Box>

      {/* Card 2: Nakshatra Wisdom */}
      <Box sx={cardSx}>
        <Box
          sx={{
            px: 2.5,
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${saffronBase}10`,
            bgcolor: `${saffronBase}08`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Skeleton
              variant="circular"
              width={16}
              height={16}
              sx={{ bgcolor: shimmerBg }}
              animation="wave"
            />
            <Skeleton
              variant="text"
              width={120}
              height={14}
              sx={{ bgcolor: shimmerBg }}
              animation="wave"
            />
          </Box>
          <Skeleton
            variant="circular"
            width={24}
            height={24}
            sx={{ bgcolor: shimmerBg }}
            animation="wave"
          />
        </Box>
        <Box sx={{ px: 2.5, py: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
            <Skeleton
              variant="rectangular"
              width={44}
              height={44}
              sx={{ bgcolor: shimmerBg, borderRadius: 2.5, flexShrink: 0 }}
              animation="wave"
            />
            <Box sx={{ flex: 1 }}>
              <Skeleton
                variant="text"
                width={130}
                height={28}
                sx={{ bgcolor: shimmerBg, mb: 0.25 }}
                animation="wave"
              />
              <Skeleton
                variant="text"
                width={160}
                height={18}
                sx={{ bgcolor: shimmerBg }}
                animation="wave"
              />
            </Box>
          </Box>
          <Skeleton
            variant="text"
            width="95%"
            height={18}
            sx={{ bgcolor: shimmerBg, mb: 0.5 }}
            animation="wave"
          />
          <Skeleton
            variant="text"
            width="85%"
            height={18}
            sx={{ bgcolor: shimmerBg, mb: 0.5 }}
            animation="wave"
          />
          <Skeleton
            variant="text"
            width="50%"
            height={18}
            sx={{ bgcolor: shimmerBg }}
            animation="wave"
          />
        </Box>
      </Box>

      {/* Card 3: Festival (optional) */}
      <Box sx={cardSx}>
        <Box
          sx={{
            px: 2.5,
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${saffronBase}10`,
            bgcolor: `${saffronBase}08`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Skeleton
              variant="circular"
              width={16}
              height={16}
              sx={{ bgcolor: shimmerBg }}
              animation="wave"
            />
            <Skeleton
              variant="text"
              width={80}
              height={14}
              sx={{ bgcolor: shimmerBg }}
              animation="wave"
            />
          </Box>
          <Skeleton
            variant="circular"
            width={24}
            height={24}
            sx={{ bgcolor: shimmerBg }}
            animation="wave"
          />
        </Box>
        <Box sx={{ px: 2.5, py: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
            <Skeleton
              variant="rectangular"
              width={44}
              height={44}
              sx={{ bgcolor: shimmerBg, borderRadius: 2.5, flexShrink: 0 }}
              animation="wave"
            />
            <Box sx={{ flex: 1 }}>
              <Skeleton
                variant="text"
                width={140}
                height={28}
                sx={{ bgcolor: shimmerBg, mb: 0.5 }}
                animation="wave"
              />
              <Skeleton
                variant="rectangular"
                width={70}
                height={22}
                sx={{ bgcolor: shimmerBg, borderRadius: 1.5 }}
                animation="wave"
              />
            </Box>
          </Box>
          <Skeleton
            variant="text"
            width="90%"
            height={18}
            sx={{ bgcolor: shimmerBg, mb: 0.5 }}
            animation="wave"
          />
          <Skeleton
            variant="text"
            width="65%"
            height={18}
            sx={{ bgcolor: shimmerBg }}
            animation="wave"
          />
        </Box>
      </Box>

      {/* Card 4: Today's Verse */}
      <Box
        sx={{
          ...cardSx,
          background: `linear-gradient(135deg, ${saffronBase}10 0%, transparent 100%)`,
        }}
      >
        <Box
          sx={{
            px: 2.5,
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${saffronBase}10`,
            bgcolor: `${saffronBase}08`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Skeleton
              variant="circular"
              width={16}
              height={16}
              sx={{ bgcolor: shimmerBg }}
              animation="wave"
            />
            <Skeleton
              variant="text"
              width={100}
              height={14}
              sx={{ bgcolor: shimmerBg }}
              animation="wave"
            />
          </Box>
          <Skeleton
            variant="circular"
            width={24}
            height={24}
            sx={{ bgcolor: shimmerBg }}
            animation="wave"
          />
        </Box>
        <Box sx={{ px: 2.5, py: 2.5 }}>
          <Skeleton
            variant="text"
            width="80%"
            height={22}
            sx={{ bgcolor: shimmerBg, mb: 0.5 }}
            animation="wave"
          />
          <Skeleton
            variant="text"
            width="60%"
            height={22}
            sx={{ bgcolor: shimmerBg, mb: 2 }}
            animation="wave"
          />
          <Skeleton
            variant="text"
            width="95%"
            height={18}
            sx={{ bgcolor: shimmerBg, mb: 0.5 }}
            animation="wave"
          />
          <Skeleton
            variant="text"
            width="75%"
            height={18}
            sx={{ bgcolor: shimmerBg, mb: 1.5 }}
            animation="wave"
          />
          <Skeleton
            variant="text"
            width={120}
            height={14}
            sx={{ bgcolor: shimmerBg }}
            animation="wave"
          />
        </Box>
      </Box>

      {/* Card 5: Solar Timings */}
      <Box sx={cardSx}>
        <Box
          sx={{
            px: 2.5,
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${saffronBase}10`,
            bgcolor: `${saffronBase}08`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Skeleton
              variant="circular"
              width={16}
              height={16}
              sx={{ bgcolor: shimmerBg }}
              animation="wave"
            />
            <Skeleton
              variant="text"
              width={90}
              height={14}
              sx={{ bgcolor: shimmerBg }}
              animation="wave"
            />
          </Box>
        </Box>
        <Box
          sx={{
            px: 2.5,
            py: 2.5,
            display: 'flex',
            gap: 3,
          }}
        >
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Skeleton
              variant="circular"
              width={32}
              height={32}
              sx={{ bgcolor: shimmerBg, mx: 'auto', mb: 0.5 }}
              animation="wave"
            />
            <Skeleton
              variant="text"
              width={70}
              height={18}
              sx={{ bgcolor: shimmerBg, mx: 'auto', mb: 0.25 }}
              animation="wave"
            />
            <Skeleton
              variant="text"
              width={60}
              height={24}
              sx={{ bgcolor: shimmerBg, mx: 'auto' }}
              animation="wave"
            />
          </Box>
          <Box
            sx={{
              width: 2,
              minWidth: 2,
              bgcolor: `${saffronBase}20`,
              my: 1,
              borderRadius: 1,
            }}
          />
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Skeleton
              variant="circular"
              width={32}
              height={32}
              sx={{ bgcolor: shimmerBg, mx: 'auto', mb: 0.5 }}
              animation="wave"
            />
            <Skeleton
              variant="text"
              width={70}
              height={18}
              sx={{ bgcolor: shimmerBg, mx: 'auto', mb: 0.25 }}
              animation="wave"
            />
            <Skeleton
              variant="text"
              width={60}
              height={24}
              sx={{ bgcolor: shimmerBg, mx: 'auto' }}
              animation="wave"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
});

export default StoriesSkeleton;
