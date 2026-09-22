/**
 * ExpandableSection - Collapsible content section with smooth animations
 * 
 * Implements smooth expand/collapse animations using max-height transitions
 * Supports custom icons and responsive behavior
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  IconButton,
  Typography,
  Collapse,
  BoxProps,
} from '@mui/material';
import { ChevronDown } from 'lucide-react';
import { alpha } from '@mui/material/styles';
import { useTheme } from '@mui/material';

export interface ExpandableSectionProps extends BoxProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  expanded?: boolean;
  onToggle?: () => void;
  defaultExpanded?: boolean;
  animationDuration?: number;
}

export const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  title,
  children,
  icon,
  expanded,
  onToggle,
  defaultExpanded = true,
  animationDuration = 300,
  sx,
  ...props
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [maxHeight, setMaxHeight] = useState<number>(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isControlled = typeof expanded === 'boolean';
  const currentExpanded = isControlled ? expanded : isExpanded;

  // Calculate content height for smooth animation
  const updateMaxHeight = useCallback(() => {
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight;
      setMaxHeight(height);
    }
  }, []);

  useEffect(() => {
    updateMaxHeight();
    
    // Recalculate on window resize
    const handleResize = () => {
      updateMaxHeight();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateMaxHeight]);

  useEffect(() => {
    // Update height when children change
    updateMaxHeight();
  }, [children, updateMaxHeight]);

  const handleToggle = () => {
    if (!isControlled) {
      setIsExpanded(!isExpanded);
    }
    onToggle?.();
  };

  return (
    <Box
      className="expandable-section"
      sx={{
        mb: 2,
        ...sx,
      }}
      {...props}
    >
      <Card
        className="expandable-card"
        elevation={0}
        sx={{
          borderRadius: 1,
                    bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.common.black, theme.palette.mode === 'dark' ? 0.4 : 0.08)}`,
          },
          '&:active': { transform: 'scale(0.99)' },
        }}
      >
        <Box
          className="expandable-header"
          onClick={handleToggle}
          role="button"
          tabIndex={0}
          aria-expanded={currentExpanded}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleToggle(); } }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            minHeight: 48,
            cursor: 'pointer',
            userSelect: 'none',
            bgcolor: 'background.paper',
            '&:hover': {
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
            },
            '&:active': { transform: 'scale(0.99)' },
          }}
        >
          <Box
            className="header-content"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            {icon ? (
              <Box
                className="header-icon"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                  borderRadius: 1,
                  bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.14 : 0.08),
                  color: 'primary.main',
                }}
              >
                {icon}
              </Box>
            ) : (
              <Box
                className="header-icon"
                aria-hidden
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                  borderRadius: 1,
                  bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.14 : 0.08),
                  color: 'primary.main',
                  fontWeight: 500,
                  fontSize: '1rem',
                }}
              >
                {title.charAt(0)}
              </Box>
            )}
            <Typography
              variant="h6"
              className="header-title"
              sx={{
                
                fontWeight: 500,
                color: 'text.primary',
                letterSpacing: '-0.01em',
              }}
            >
              {title}
            </Typography>
          </Box>
          <IconButton
            className={`expand-button ${currentExpanded ? 'expanded' : ''}`}
            size="small"
            aria-label={currentExpanded ? 'Collapse section' : 'Expand section'}
            sx={{
              width: 48,
              height: 48,
              transition: `transform ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
              transform: currentExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            <ChevronDown size={20} />
          </IconButton>
        </Box>

        <Box
          className="expandable-content-wrapper"
          sx={{
            maxHeight: currentExpanded ? `${maxHeight}px` : '0px',
                        transition: `max-height ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
          }}
        >
          <Box
            ref={contentRef}
            className="expandable-content"
            sx={{
              p: 2,
              pt: 0,
              opacity: currentExpanded ? 1 : 0,
              transition: `opacity ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
            }}
          >
            {children}
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default ExpandableSection;
