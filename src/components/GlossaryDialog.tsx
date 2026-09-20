/**
 * GlossaryDialog - one-tap "what does this mean" explainer for any Panchang limb.
 *
 * Generic dialog driven by src/data/panchangGlossary.ts (single source with
 * onboarding + Settings About). Visual pattern mirrors TithiExplanationDialog.
 */

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  alpha,
} from '@mui/material';
import { useTheme } from '@mui/material';
import { BookOpen, X } from 'lucide-react';
import { getGlossaryEntry, GlossaryEntry } from '../data/panchangGlossary';
import { useI18n } from '../hooks/useI18n';

interface GlossaryDialogProps {
  open: boolean;
  onClose: () => void;
  limbId: GlossaryEntry['id'];
}

export const GlossaryDialog: React.FC<GlossaryDialogProps> = ({
  open,
  onClose,
  limbId,
}) => {
  const theme = useTheme();
  const { currentLanguage } = useI18n();
  const isHindi = currentLanguage === 'hi';

  const entry = getGlossaryEntry(limbId);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: alpha(theme.palette.primary.main, 0.08),
          py: 2,
          px: 2.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.15),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <BookOpen size={28} color={theme.palette.primary.main} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              component="span"
              variant="h6"
              sx={{
                fontWeight: 500,
                color: theme.palette.primary.main,
                mb: 0.5,
              }}
            >
              {isHindi ? entry.nameHindi : entry.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              {isHindi ? 'क्या है?' : 'What is it?'}
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            size="small"
            aria-label={isHindi ? 'बंद करें' : 'Close'}
            sx={{
              color: 'text.secondary',
              minWidth: 48,
              minHeight: 48,
              '&:hover': {
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
              },
            }}
          >
            <X size={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 2.5, py: 2 }}>
        <Typography variant="body1" sx={{ lineHeight: 1.7, mb: 1.5 }}>
          {isHindi ? entry.meaningHindi : entry.meaning}
        </Typography>
        <Typography variant="body2" sx={{ lineHeight: 1.7, color: 'text.secondary' }}>
          {isHindi ? entry.detailHindi : entry.detail}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 2.5, pb: 2.5 }}>
        <Button
          onClick={onClose}
          variant="contained"
          fullWidth
          sx={{
            borderRadius: 2,
            py: 1.25,
            minHeight: 48,
            fontWeight: 500,
          }}
        >
          {isHindi ? 'समझ गया' : 'Got it'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GlossaryDialog;
