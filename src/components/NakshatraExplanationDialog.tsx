/**
 * NakshatraExplanationDialog - Detailed Nakshatra Information
 * 
 * Shows complete information about a nakshatra when tapped:
 * - Ruling deity and planet
 * - Guna and nature
 * - Symbol
 * - Good activities
 * - Activities to avoid
 * - Compatibility info
 * 
 * Uses offline data from /src/data/vedic/nakshatraData.ts
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
  Chip,
  Divider,
  IconButton,
} from '@mui/material';
import { useTheme } from '@mui/material';
import { X, CheckCircle, XCircle, Info, Sparkles, Moon } from 'lucide-react';
import { alpha } from '@mui/material/styles';
import { getNakshatraByNumber, NakshatraSignificance } from '../data/vedic/nakshatraData';
import { useI18n } from '../hooks/useI18n';

interface NakshatraExplanationDialogProps {
  open: boolean;
  onClose: () => void;
  nakshatraNumber: number;
}

export const NakshatraExplanationDialog: React.FC<NakshatraExplanationDialogProps> = ({
  open,
  onClose,
  nakshatraNumber,
}) => {
  const { t, currentLanguage } = useI18n();
  const theme = useTheme();
  const isHindi = currentLanguage === 'hi';

  // Get nakshatra data from offline database
  const nakshatraData = getNakshatraByNumber(nakshatraNumber);

  if (!nakshatraData) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 1,
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          bgcolor: alpha(theme.palette.primary.main, 0.07),
          py: 2,
          px: 2.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1,
              bgcolor: alpha(theme.palette.primary.main, 0.12),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Moon size={19} color={theme.palette.primary.main} />
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
              {isHindi ? nakshatraData.nameHindi : nakshatraData.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Nakshatra #{nakshatraData.number} • {nakshatraData.rulingPlanet}
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            size="small"
            aria-label="Close nakshatra explanation"
            sx={{
              color: 'text.secondary',
              minWidth: 48,
              minHeight: 48,
              '&:hover': { bgcolor: alpha(theme.palette.text.primary, theme.palette.mode === 'dark' ? 0.08 : 0.05) },
              '&:active': { transform: 'scale(0.98)' },
            }}
          >
            <X size={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 2.5, py: 2 }}>
        {/* Basic Info Chips */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip
            label={isHindi ? `गुण: ${nakshatraData.guna}` : `Guna: ${nakshatraData.guna}`}
            size="small"
            sx={{
              fontWeight: 500,
              bgcolor:
                nakshatraData.guna === 'Sattva'
                  ? (theme) => alpha(theme.palette.success.main, theme.palette.mode === 'dark' ? 0.16 : 0.08)
                  : nakshatraData.guna === 'Rajas'
                  ? (theme) => alpha(theme.palette.warning.main, theme.palette.mode === 'dark' ? 0.16 : 0.08)
                  : alpha(theme.palette.text.primary, 0.08),
              color:
                nakshatraData.guna === 'Sattva'
                  ? theme.palette.success.main
                  : nakshatraData.guna === 'Rajas'
                  ? theme.palette.warning.main
                  : theme.palette.text.secondary,
            }}
          />
          <Chip
            label={isHindi ? `प्रकृति: ${nakshatraData.nature}` : `Nature: ${nakshatraData.nature}`}
            size="small"
            sx={{
              fontWeight: 500,
              bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.16 : 0.08),
              color: theme.palette.primary.main,
            }}
          />
          <Chip
            label={isHindi ? `देवता: ${nakshatraData.rulingDeityHindi}` : `Deity: ${nakshatraData.rulingDeity}`}
            size="small"
            sx={{
              fontWeight: 500,
              bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.16 : 0.08),
              color: theme.palette.primary.main,
            }}
          />
        </Box>

        {/* Symbol */}
        <Box sx={{ mb: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
            <Sparkles size={18} color={theme.palette.primary.main} />
            <Typography variant="subtitle2" sx={{ fontWeight: 500, color: theme.palette.primary.main }}>
              {isHindi ? 'प्रतीक' : 'Symbol'}
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              lineHeight: 1.7,
              color: 'text.secondary',
              bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.1 : 0.05),
              p: 1.5,
              borderRadius: 1,
            }}
          >
            {isHindi ? nakshatraData.symbolHindi : nakshatraData.symbol}
          </Typography>
        </Box>

        {/* Significance */}
        <Box sx={{ mb: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
            <Info size={18} color={theme.palette.primary.main} />
            <Typography variant="subtitle2" sx={{ fontWeight: 500, color: theme.palette.primary.main }}>
              {isHindi ? 'महत्व' : 'Significance'}
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              lineHeight: 1.7,
              color: 'text.secondary',
            }}
          >
            {isHindi ? nakshatraData.significanceHindi : nakshatraData.significance}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Good For Activities */}
        <Box sx={{ mb: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
            <CheckCircle size={18} color={theme.palette.success.main} />
            <Typography variant="subtitle2" sx={{ fontWeight: 500, color: theme.palette.success.main }}>
              {isHindi ? 'इनके लिए अच्छा' : 'Good For'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
            {(isHindi ? nakshatraData.goodForHindi : nakshatraData.goodFor).map(
              (activity, index) => (
                <Chip
                  key={index}
                  label={activity}
                  size="small"
                  sx={{
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    bgcolor: (theme) => alpha(theme.palette.success.main, theme.palette.mode === 'dark' ? 0.14 : 0.08),
                    color: theme.palette.success.main,
                  }}
                />
              )
            )}
          </Box>
        </Box>

        {/* Avoid For Activities */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
            <XCircle size={18} color={theme.palette.error.main} />
            <Typography variant="subtitle2" sx={{ fontWeight: 500, color: theme.palette.error.main }}>
              {isHindi ? 'इनसे बचें' : 'Avoid For'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
            {(isHindi ? nakshatraData.avoidForHindi : nakshatraData.avoidFor).map(
              (activity, index) => (
                <Chip
                  key={index}
                  label={activity}
                  size="small"
                  sx={{
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    bgcolor: (theme) => alpha(theme.palette.error.main, theme.palette.mode === 'dark' ? 0.14 : 0.08),
                    color: theme.palette.error.main,
                  }}
                />
              )
            )}
          </Box>
        </Box>

        {/* Special Notes */}
        {nakshatraData.specialNotes && (
          <Box
            sx={{
              mt: 2,
              p: 1.5,
              bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.12 : 0.06),
              borderRadius: 1,
              border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 500,
                color: theme.palette.primary.main,
                display: 'block',
                mb: 0.5,
              }}
            >
              {isHindi ? 'विशेष नोट' : 'Special Note'}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                lineHeight: 1.6,
              }}
            >
              {nakshatraData.specialNotes}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 2.5, pb: 2.5 }}>
        <Button
          onClick={onClose}
          variant="contained"
          fullWidth
          sx={{
            borderRadius: 1,
            py: 1.25,
            fontWeight: 500,
            minHeight: 48,
            bgcolor: theme.palette.primary.main,
            '&:hover': { bgcolor: theme.palette.primary.dark },
            '&:active': { transform: 'scale(0.98)' },
          }}
        >
          {isHindi ? 'बंद करें' : 'Close'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NakshatraExplanationDialog;
