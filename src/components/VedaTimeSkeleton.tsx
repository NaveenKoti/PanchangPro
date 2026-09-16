import React from 'react';
import { Skeleton, Box, SkeletonProps } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export type VedaTimeSkeletonVariant = 'tithi-card' | 'calendar-grid' | 'list-item' | 'table-row' | 'detail-panel';

interface VedaTimeSkeletonProps extends Omit<SkeletonProps, 'variant'> {
  variant?: VedaTimeSkeletonVariant | 'default';
  height?: number;
  width?: number | string;
}

const VedaTimeSkeletonContent: React.FC<{ variant: VedaTimeSkeletonVariant }> = ({ variant }) => {
  const theme = useTheme();
  const saffronBase = theme.palette.primary?.main || theme.palette.primary.main;
  const shimmerBg = `${saffronBase}20`;

  switch (variant) {
    case 'tithi-card':
      return (
        <Box sx={{ p: 3 }}>
          <Skeleton
            animation="wave"
            width="40%"
            height={32}
            sx={{ mb: 1.5, bgcolor: shimmerBg }}
          />
          <Skeleton
            animation="wave"
            width="70%"
            height={24}
            sx={{ mb: 1, bgcolor: shimmerBg }}
          />
          <Skeleton
            animation="wave"
            width="60%"
            height={20}
            sx={{ mb: 2, bgcolor: shimmerBg }}
          />
          <Skeleton
            animation="wave"
            width="30%"
            height={20}
            sx={{ mb: 1, bgcolor: shimmerBg }}
          />
        </Box>
      );

    case 'calendar-grid':
      return (
        <Box sx={{ p: 1 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
            {[...Array(35)].map((_, i) => (
              <Skeleton
                key={i}
                animation="wave"
                variant="rectangular"
                width="100%"
                height={48}
                sx={{ borderRadius: 2, bgcolor: shimmerBg }}
              />
            ))}
          </Box>
        </Box>
      );

    case 'list-item':
      return (
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Skeleton animation="wave" variant="circular" width={40} height={40} sx={{ bgcolor: shimmerBg }} />
          <Box sx={{ flex: 1 }}>
            <Skeleton animation="wave" width="60%" height={20} sx={{ mb: 0.5, bgcolor: shimmerBg }} />
            <Skeleton animation="wave" width="40%" height={16} sx={{ bgcolor: shimmerBg }} />
          </Box>
        </Box>
      );

    case 'table-row':
      return (
        <Box sx={{ p: 1, display: 'flex', gap: 2, alignItems: 'center' }}>
          <Skeleton animation="wave" width="30%" height={20} sx={{ bgcolor: shimmerBg }} />
          <Skeleton animation="wave" width="25%" height={20} sx={{ bgcolor: shimmerBg }} />
          <Skeleton animation="wave" width="20%" height={20} sx={{ bgcolor: shimmerBg }} />
          <Skeleton animation="wave" width="15%" height={20} sx={{ bgcolor: shimmerBg }} />
        </Box>
      );

    case 'detail-panel':
      return (
        <Box sx={{ p: 3 }}>
          <Skeleton animation="wave" width="50%" height={28} sx={{ mb: 2, bgcolor: shimmerBg }} />
          <Box sx={{ pl: 2, borderLeft: `3px solid ${saffronBase}` }}>
            <Skeleton animation="wave" width="80%" height={20} sx={{ mb: 1, bgcolor: shimmerBg }} />
            <Skeleton animation="wave" width="70%" height={20} sx={{ mb: 1, bgcolor: shimmerBg }} />
            <Skeleton animation="wave" width="60%" height={20} sx={{ bgcolor: shimmerBg }} />
          </Box>
        </Box>
      );

    default:
      return null;
  }
};

export const VedaTimeSkeleton: React.FC<VedaTimeSkeletonProps> = ({ variant = 'default', height = 120, width, ...props }) => {
  const theme = useTheme();
  const saffronBase = theme.palette.primary?.main || theme.palette.primary.main;

  const shimmerGradient = `linear-gradient(90deg, transparent 0%, ${saffronBase}30 50%, transparent 100%)`;

  if (variant === 'default') {
    return (
      <Skeleton
        animation="wave"
        variant="rectangular"
        height={height}
        width={width}
        sx={{
          bgcolor: `${saffronBase}20`,
          borderRadius: 2,
          '::before': {
            background: shimmerGradient,
            animation: 'skeleton-shimmer 1.5s ease-in-out infinite',
          },
        }}
        {...props}
      />
    );
  }

  const content = <VedaTimeSkeletonContent variant={variant} />;

  if (width) {
    return (
      <Box width={width}>
        <Box
          sx={{
            '& .MuiSkeleton-root::before': {
              background: shimmerGradient,
              animation: 'skeleton-shimmer 1.5s ease-in-out infinite',
            },
          }}
        >
          {content}
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        '& .MuiSkeleton-root::before': {
          background: shimmerGradient,
          animation: 'skeleton-shimmer 1.5s ease-in-out infinite',
        },
      }}
    >
      {content}
    </Box>
  );
};

// Add keyframes to global styles for shimmer effect
const style = document.createElement('style');
style.textContent = `
  @keyframes skeleton-shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;
document.head.appendChild(style);

export default VedaTimeSkeleton;
