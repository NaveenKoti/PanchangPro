/**
 * PanchangTimelineItem — one node on the Panchanga timeline (Details tab).
 *
 * Inspired by almanac timeline UIs: a dashed accent spine with a node dot
 * per limb (Nakshatra → Yoga → Karana → Samvatsara), each node carrying its
 * section icon. The rail is aria-hidden; content keeps its own semantics.
 */
import React from 'react';
import { Box, useTheme, alpha } from '@mui/material';

export interface PanchangTimelineItemProps {
  /** Section icon rendered inside the node (18px, primary). */
  icon: React.ReactNode;
  /** Card/content for this limb. */
  children: React.ReactNode;
  /** Hide the trailing connector (last item). */
  isLast?: boolean;
}

export const PanchangTimelineItem: React.FC<PanchangTimelineItemProps> = ({
  icon,
  children,
  isLast = false,
}) => {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', alignItems: 'stretch', gap: 1.5 }}>
      {/* Rail: node + dashed connector */}
      <Box
        aria-hidden
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: 32,
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1,
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            border: '1px solid',
            borderColor: alpha(theme.palette.primary.main, 0.2),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'primary.main',
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        {!isLast && (
          <Box
            sx={{
              width: 0,
              flex: 1,
              minHeight: 16,
              borderLeft: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
              my: 0.5,
            }}
          />
        )}
      </Box>
      {/* Content */}
      <Box sx={{ flex: 1, minWidth: 0, pb: isLast ? 0 : 1.5 }}>
        {children}
      </Box>
    </Box>
  );
};

export default PanchangTimelineItem;
