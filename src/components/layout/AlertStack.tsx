/**
 * AlertStack — collapsible alert container (Layout stage).
 * Shows max 2 alerts, "+n more" expander for the rest.
 * Single API taking an array of { severity, children, key }.
 */
import React, { useState } from 'react';
import { Alert, Box, Button, Collapse } from '@mui/material';

export interface AlertItem {
  severity: 'error' | 'warning' | 'info' | 'success';
  children: React.ReactNode;
  key: string;
}

export interface AlertStackProps {
  alerts: AlertItem[];
  maxVisible?: number;
}

const MAX_VISIBLE_DEFAULT = 2;

export const AlertStack: React.FC<AlertStackProps> = ({
  alerts,
  maxVisible = MAX_VISIBLE_DEFAULT,
}) => {
  const [expanded, setExpanded] = useState(false);
  if (alerts.length === 0) return null;
  const visible = expanded ? alerts : alerts.slice(0, maxVisible);
  const hiddenCount = alerts.length - visible.length;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1.5 }}>
      {visible.map((a) => (
        <Alert key={a.key} severity={a.severity} sx={{ borderRadius: 2 }}>
          {a.children}
        </Alert>
      ))}
      <Collapse in={!expanded && hiddenCount > 0}>
        <Button
          size="small"
          onClick={() => setExpanded(true)}
          sx={{ minHeight: 48, alignSelf: 'flex-start' }}
        >
          +{hiddenCount} more
        </Button>
      </Collapse>
      <Collapse in={expanded && alerts.length > maxVisible}>
        <Button
          size="small"
          onClick={() => setExpanded(false)}
          sx={{ minHeight: 48, alignSelf: 'flex-start' }}
        >
          Show less
        </Button>
      </Collapse>
    </Box>
  );
};

export default AlertStack;
