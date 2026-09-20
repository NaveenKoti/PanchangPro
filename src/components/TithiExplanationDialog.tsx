/**
 * TithiExplanationDialog - Detailed Tithi Information
 * 
 * Shows complete information about a tithi when tapped:
 * - Significance from scriptures
 * - Recommended activities
 * - Activities to avoid
 * - Deity information
 * - Special notes
 * 
 * Uses offline data from /src/data/vedic/tithiData.ts
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
import { Sparkles, X, Info, CheckCircle, XCircle } from 'lucide-react';
import { getTithiByIndex, TithiSignificance } from '../data/vedic/tithiData';
import { useI18n } from '../hooks/useI18n';

interface TithiExplanationDialogProps {
  open: boolean;
  onClose: () => void;
  tithiNumber: number;
  paksha: 'Shukla' | 'Krishna';
}

export const TithiExplanationDialog: React.FC<TithiExplanationDialogProps> = ({
  open,
  onClose,
  tithiNumber,
  paksha,
}) => {
  const theme = useTheme();
  const { t, currentLanguage } = useI18n();
  const isHindi = currentLanguage === 'hi';

  // Get tithi data from offline database
  const tithiData = getTithiByIndex(
    paksha === 'Shukla' ? tithiNumber : tithiNumber + 15
  );

  if (!tithiData) {
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
          borderRadius: 3,
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          bgcolor: 'rgba(199, 91, 18, 0.08)',
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
              bgcolor: 'rgba(199, 91, 18, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Sparkles size={28} color={theme.palette.primary.main} />
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
              {isHindi ? tithiData.nameHindi : tithiData.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {paksha} Paksha • Tithi {tithiData.number}
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            size="small"
            aria-label="Close tithi explanation"
            sx={{
              color: 'text.secondary',
              '&:hover': { bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' },
            }}
          >
            <X size={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 2.5, py: 2 }}>
        {/* Category & Nature */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip
            label={isHindi ? tithiData.category : `Category: ${tithiData.category}`}
            size="small"
            sx={{
              fontWeight: 500,
              bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(144, 164, 215, 0.15)' : 'rgba(44, 62, 107, 0.1)',
              color: theme.palette.info.main,
            }}
          />
          <Chip
            label={
              isHindi
                ? tithiData.nature === 'good'
                  ? 'शुभ'
                  : tithiData.nature === 'avoid'
                  ? 'वर्जित'
                  : 'साधारण'
                : tithiData.nature === 'good'
                ? 'Auspicious'
                : tithiData.nature === 'avoid'
                ? 'Inauspicious'
                : 'Neutral'
            }
            size="small"
            sx={{
              fontWeight: 500,
              bgcolor:
                tithiData.nature === 'good'
                  ? (theme) => theme.palette.mode === 'dark' ? 'rgba(129, 199, 106, 0.15)' : 'rgba(61, 107, 36, 0.1)'
                  : tithiData.nature === 'avoid'
                  ? (theme) => theme.palette.mode === 'dark' ? 'rgba(239, 154, 154, 0.15)' : 'rgba(244, 67, 54, 0.1)'
                  : (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 183, 77, 0.15)' : 'rgba(232, 148, 74, 0.1)',
              color:
                tithiData.nature === 'good'
                  ? theme.palette.success.main
                  : tithiData.nature === 'avoid'
                  ? theme.palette.error.main
                  : theme.palette.warning.main,
            }}
          />
          {tithiData.deity && (
            <Chip
              label={isHindi ? `देवता: ${tithiData.deity}` : `Deity: ${tithiData.deity}`}
              size="small"
              sx={{
                fontWeight: 500,
                bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(144, 164, 215, 0.15)' : 'rgba(44, 62, 107, 0.1)',
                color: theme.palette.info.main,
              }}
            />
          )}
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
            {isHindi ? tithiData.significanceHindi : tithiData.significance}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Recommended Activities */}
        <Box sx={{ mb: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
            <CheckCircle size={18} color={theme.palette.success.main} />
            <Typography variant="subtitle2" sx={{ fontWeight: 500, color: theme.palette.success.main }}>
              {isHindi ? 'क्या करें' : 'Recommended Activities'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
            {(isHindi ? tithiData.recommendedActivitiesHindi : tithiData.recommendedActivities).map(
              (activity, index) => (
                <Chip
                  key={index}
                  label={activity}
                  size="small"
                  sx={{
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(129, 199, 106, 0.12)' : 'rgba(61, 107, 36, 0.08)',
                    color: theme.palette.success.main,
                  }}
                />
              )
            )}
          </Box>
        </Box>

        {/* Activities to Avoid */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
            <XCircle size={18} color={theme.palette.error.main} />
            <Typography variant="subtitle2" sx={{ fontWeight: 500, color: theme.palette.error.main }}>
              {isHindi ? 'क्या न करें' : 'Activities to Avoid'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
            {(isHindi ? tithiData.avoidActivitiesHindi : tithiData.avoidActivities).map(
              (activity, index) => (
                <Chip
                  key={index}
                  label={activity}
                  size="small"
                  sx={{
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(239, 154, 154, 0.12)' : 'rgba(244, 67, 54, 0.08)',
                    color: theme.palette.error.main,
                  }}
                />
              )
            )}
          </Box>
        </Box>

        {/* Special Notes */}
        {tithiData.specialNotes && (
          <Box
            sx={{
              mt: 2,
              p: 1.5,
              bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 183, 77, 0.1)' : 'rgba(255, 193, 7, 0.08)',
              borderRadius: 2,
              border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 183, 77, 0.2)' : 'rgba(255, 193, 7, 0.2)'}`,
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
              {isHindi ? tithiData.specialNotes : tithiData.specialNotes}
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
            borderRadius: 2,
            py: 1.25,
            fontWeight: 500,
            bgcolor: theme.palette.primary.main,
            '&:hover': { bgcolor: theme.palette.primary.dark },
          }}
        >
          {isHindi ? 'बंद करें' : 'Close'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TithiExplanationDialog;
