/**
 * MoreMenu - Bottom Sheet for additional features
 *
 * Provides access to less-frequently used screens:
 * - Muhurta
 * - Stories
 * - Settings
 */

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  useTheme,
  Slide,
} from '@mui/material';
import { Leaf, BookOpen, Settings, X } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';
import { useBreakpoints } from '../theme/breakpoints';
import { triggerHapticIfSupported } from '../utils/haptics';
import { trackFeatureUse } from '../services/analytics';

interface MoreMenuProps {
  open: boolean;
  onClose: () => void;
  onSelectItem: (item: 'fasts' | 'stories' | 'settings') => void;
}

const Transition = React.forwardRef(function Transition(
  props: React.ComponentProps<typeof Slide>,
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const MoreMenu: React.FC<MoreMenuProps> = ({ open, onClose, onSelectItem }) => {
  const { t } = useI18n();
  const theme = useTheme();
  const { isMobile } = useBreakpoints();

  const handleSelect = (item: 'fasts' | 'stories' | 'settings') => {
    triggerHapticIfSupported('selection');
    // Local-only tap telemetry (no network) — informs future nav IA decisions
    trackFeatureUse('more_menu_select', { item });
    onSelectItem(item);
    onClose();
  };

  const menuItems = [
    {
      key: 'fasts' as const,
      label: t('navigation.fasts'),
      icon: Leaf,
      description: t('fasting.subtitle') || 'Ekadashi, Pradosh & fasting days',
    },
    {
      key: 'stories' as const,
      label: t('stories.title'),
      icon: BookOpen,
      description: t('stories.subtitle') || 'Sacred teachings & insights',
    },
    {
      key: 'settings' as const,
      label: t('navigation.settings'),
      icon: Settings,
      description: t('settings.subtitle') || 'Customize your experience',
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          margin: 0,
          maxWidth: '100%',
          borderRadius: isMobile ? 0 : '20px 20px 0 0',
          bgcolor: 'background.paper',
          maxHeight: isMobile ? '85vh' : '70vh',
        },
      }}
      hideBackdrop={false}
      sx={{
        zIndex: 1300,
        '& .MuiDialog-paper': {
          zIndex: 1301,
        },
      }}
    >
      {/* Header with drag handle indicator */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          pt: 1,
          pb: 0.5,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 4,
            borderRadius: 2,
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)',
          }}
        />
      </Box>

      <DialogTitle
        sx={{
          px: 3,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          component="span"
          variant="h6"
          sx={{
            fontWeight: 500,
            fontSize: '1.125rem',
            color: 'text.primary',
          }}
        >
          {t('navigation.more')}
        </Typography>
        <ListItemButton
          onClick={onClose}
          sx={{
            width: 48,
            height: 48,
            minWidth: 48,
            minHeight: 48,
            borderRadius: '50%',
            p: 0,
            justifyContent: 'center',
            alignItems: 'center',
            '&:hover': {
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
            },
          }}
        >
          <X size={20} color={theme.palette.text.secondary} />
        </ListItemButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 0 }}>
        <List sx={{ py: 1 }}>
          {menuItems.map((item, index) => (
            <ListItemButton
              key={item.key}
              onClick={() => handleSelect(item.key)}
              sx={{
                py: 1.75,
                px: 2.5,
                mx: 1,
                my: 0.25,
                borderRadius: 2,
                minHeight: 56,
                '&:hover': {
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(199, 91, 18, 0.06)',
                },
                '&:active': {
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(199, 91, 18, 0.1)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 48,
                  color: theme.palette.primary.main,
                }}
              >
                <item.icon size={22} strokeWidth={1.5} />
              </ListItemIcon>
              <Box sx={{ flex: 1 }}>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: 500,
                    fontSize: '0.9375rem',
                    color: 'text.primary',
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.8125rem',
                    mt: 0.25,
                  }}
                >
                  {item.description}
                </Typography>
              </Box>
            </ListItemButton>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default MoreMenu;
