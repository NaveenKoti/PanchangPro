/**
 * SectionCard — the ONE shared card primitive (Layout stage).
 *
 * Standard: elevation 0, `1px solid` divider border, radius from theme,
 * standard padding theme.spacing(2), dense variant theme.spacing(1.5).
 * Consume tokens via useTheme() — never hardcode.
 */
import React from 'react';
import { Card, CardContent, CardHeader, useTheme } from '@mui/material';

export interface SectionCardProps {
  title?: React.ReactNode;
  subheader?: React.ReactNode;
  action?: React.ReactNode;
  dense?: boolean;
  /** Full-bleed content (e.g. grids): skips CardContent padding. */
  noPadding?: boolean;
  children: React.ReactNode;
}

export const SectionCard = React.forwardRef<HTMLDivElement, SectionCardProps>(function SectionCard({
  title,
  subheader,
  action,
  dense = false,
  noPadding = false,
  children,
}, ref) {
  const theme = useTheme();
  return (
    <Card
      ref={ref}
      elevation={0}
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius * 2,
        bgcolor: 'background.paper',
        mb: 1.5,
        overflow: 'hidden',
      }}
    >
      {(title || action) && (
        <CardHeader
          title={title}
          subheader={subheader}
          action={action}
          titleTypographyProps={{ variant: 'subtitle1', fontWeight: 500 }}
          sx={{ px: dense ? 1.5 : 2, py: dense ? 1 : 1.5, '& .MuiCardHeader-action': { alignSelf: 'center', m: 0 } }}
        />
      )}
      {noPadding ? (
        children
      ) : (
      <CardContent sx={{ p: dense ? 1.5 : 2, '&:last-child': { pb: dense ? 1.5 : 2 }, pt: title || action ? 0 : undefined }}>
        {children}
      </CardContent>
      )}
    </Card>
  );
});

export default SectionCard;
