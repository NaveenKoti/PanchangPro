/**
 * FestivalShareCard - Beautiful shareable festival image card
 *
 * Features:
 * - Festival name (large, prominent) with Hindi name
 * - Date and tithi info
 * - Brief significance/description
 * - Decorative elements (lotus, diyas based on festival type)
 * - Saffron/gold gradient background
 * - App branding at bottom
 * - Canvas API for image generation
 * - Light and dark mode versions
 * - Export function: copy to clipboard or trigger native share
 */

import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Paper,
  Alert,
  useTheme,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
} from '@mui/material';
import { X, Download, Share2, Copy, Image, Smartphone, Sun, Moon } from 'lucide-react';
import { Festival } from '../types';
import { useI18n } from '../hooks/useI18n';

// Accept both Festival and FestivalStory types
interface FestivalLike {
  id: string;
  name: string;
  nameHindi: string;
  significance: string;
  date?: Date;
  type?: string;
  region?: string[];
}

interface FestivalShareCardProps {
  isOpen: boolean;
  onClose: () => void;
  festival: FestivalLike | null;
  tithiInfo?: string;
  dateStr?: string;
}

type AspectRatio = 'standard' | 'story';
type ThemeMode = 'light' | 'dark';

const STANDARD_WIDTH = 1080;
const STANDARD_HEIGHT = 1080;
const STORY_WIDTH = 1080;
const STORY_HEIGHT = 1920;

const OM_SYMBOL = '\u0950';
const LOTUS = '\u{1FAB7}';
const DIYA = '\u{1FA94}';
const FIRE = '\u{1F525}';
const FLOWER = '\u{1F338}';
const STAR = '\u2728';
const CONCH = '\u{1F41A}';

// Festival type to decorative elements mapping
const FESTIVAL_DECORATIONS: Record<string, { emoji: string; secondary: string }> = {
  diwali: { emoji: DIYA, secondary: FIRE },
  navratri: { emoji: FLOWER, secondary: LOTUS },
  ganesh: { emoji: FLOWER, secondary: LOTUS },
  holi: { emoji: FLOWER, secondary: STAR },
  raksha: { emoji: STAR, secondary: FLOWER },
  default: { emoji: LOTUS, secondary: DIYA },
};

function getFestivalDecoration(festival: FestivalLike) {
  const id = festival.id.toLowerCase();
  if (id.includes('diwali') || id.includes('deep')) return FESTIVAL_DECORATIONS.diwali;
  if (id.includes('navratri') || id.includes('durga')) return FESTIVAL_DECORATIONS.navratri;
  if (id.includes('ganesh') || id.includes('vinayaka') || id.includes('chaturthi')) return FESTIVAL_DECORATIONS.ganesh;
  if (id.includes('holi')) return FESTIVAL_DECORATIONS.holi;
  if (id.includes('raksha') || id.includes('rakhi')) return FESTIVAL_DECORATIONS.raksha;
  return FESTIVAL_DECORATIONS.default;
}

// Color themes
const COLOR_THEMES = {
  light: {
    bgStart: '#F5E6D0',
    bgMid: '#EDD9B8',
    bgEnd: '#E5CFA0',
    cardBg: 'rgba(255, 255, 255, 0.92)',
    textPrimary: '#4A3228',
    textSecondary: '#6B4226',
    accent: '#B8520E',
    accentLight: '#D4853A',
    gold: '#E5C100',
    saffron: '#E07A3A',
    border: 'rgba(184, 82, 14, 0.25)',
  },
  dark: {
    bgStart: '#1A1A2E',
    bgMid: '#16213E',
    bgEnd: '#0F3460',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    textPrimary: '#FFE0B2',
    textSecondary: '#FFD700',
    accent: '#FFD700',
    accentLight: '#FFB347',
    gold: '#FFD700',
    saffron: '#FF8C42',
    border: 'rgba(255, 215, 0, 0.2)',
  },
};

export const FestivalShareCard: React.FC<FestivalShareCardProps> = ({
  isOpen,
  onClose,
  festival,
  tithiInfo,
  dateStr,
}) => {
  const { currentLanguage } = useI18n();
  const theme = useTheme();
  const isHindi = currentLanguage === 'hi';
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shareMessage, setShareMessage] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('story');
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const isStory = aspectRatio === 'story';
  const canvasWidth = isStory ? STORY_WIDTH : STANDARD_WIDTH;
  const canvasHeight = isStory ? STORY_HEIGHT : STANDARD_HEIGHT;
  const colors = COLOR_THEMES[themeMode];

  const drawRoundedRect = useCallback((
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }, []);

  const drawDecorativePattern = useCallback((
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    colors: typeof COLOR_THEMES.light
  ) => {
    // Corner lotus decorations
    const cornerSize = 80;
    ctx.font = `${cornerSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Top-left
    ctx.globalAlpha = 0.15;
    ctx.fillText(LOTUS, cornerSize / 2 + 20, cornerSize / 2 + 20);
    // Top-right
    ctx.fillText(LOTUS, width - cornerSize / 2 - 20, cornerSize / 2 + 20);
    // Bottom-left
    ctx.fillText(DIYA, cornerSize / 2 + 20, height - cornerSize / 2 - 20);
    // Bottom-right
    ctx.fillText(DIYA, width - cornerSize / 2 - 20, height - cornerSize / 2 - 20);
    ctx.globalAlpha = 1.0;
  }, []);

  const drawOmHeader = useCallback((
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    color: string
  ) => {
    ctx.fillStyle = color;
    ctx.font = `bold ${size}px "Noto Sans Devanagari", Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(OM_SYMBOL, x, y);
  }, []);

  const drawWatermark = useCallback((
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    colors: typeof COLOR_THEMES.light
  ) => {
    const y = height - 35;
    ctx.fillStyle = `${colors.accent}90`;
    ctx.font = 'bold 26px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${LOTUS} VedaTime - vedatime.app ${LOTUS}`, width / 2, y);
  }, []);

  const drawDecorativeBorder = useCallback((
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    color: string,
    lineWidth: number
  ) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    const margin = lineWidth * 3;
    drawRoundedRect(ctx, margin, margin, width - margin * 2, height - margin * 2, 20);
    ctx.stroke();

    // Inner border
    ctx.strokeStyle = `${color}50`;
    ctx.lineWidth = lineWidth / 2;
    const innerMargin = margin + 10;
    drawRoundedRect(ctx, innerMargin, innerMargin, width - innerMargin * 2, height - innerMargin * 2, 16);
    ctx.stroke();
  }, [drawRoundedRect]);

  const drawFestivalCard = useCallback(() => {
    if (!canvasRef.current || !festival) return null;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const padding = isStory ? 60 : 50;
    const contentWidth = canvasWidth - padding * 2;
    const deco = getFestivalDecoration(festival);

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
    if (themeMode === 'dark') {
      gradient.addColorStop(0, colors.bgStart);
      gradient.addColorStop(0.5, colors.bgMid);
      gradient.addColorStop(1, colors.bgEnd);
    } else {
      gradient.addColorStop(0, colors.bgStart);
      gradient.addColorStop(0.5, colors.bgMid);
      gradient.addColorStop(1, colors.bgEnd);
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Decorative border
    drawDecorativeBorder(ctx, canvasWidth, canvasHeight, colors.accent, isStory ? 6 : 4);

    // Background pattern
    drawDecorativePattern(ctx, canvasWidth, canvasHeight, colors);

    if (isStory) {
      // STORY FORMAT (1080x1920) - Instagram/WhatsApp Story optimized
      // Top Om symbol
      drawOmHeader(ctx, canvasWidth / 2, 100, 64, colors.gold);

      // App branding
      ctx.fillStyle = colors.accent;
      ctx.font = 'bold 40px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('VedaTime', canvasWidth / 2, 175);

      // Date
      const displayDate = dateStr || (festival.date ? festival.date.toLocaleDateString(
        isHindi ? 'hi-IN' : 'en-IN',
        { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
      ) : '');
      ctx.fillStyle = colors.textSecondary;
      ctx.font = '28px Arial, sans-serif';
      ctx.fillText(displayDate, canvasWidth / 2, 230);

      // Decorative divider
      ctx.fillStyle = colors.gold;
      ctx.font = '36px Arial';
      ctx.fillText(`${STAR} ${deco.emoji} ${STAR}`, canvasWidth / 2, 290);

      // Main content card
      const cardY = 340;
      const cardHeight = canvasHeight - 500;
      const cardRadius = 28;

      // Dark overlay behind content area for text contrast
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(padding - 20, cardY - 20, contentWidth + 40, cardHeight + 40);

      // Card shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 10;
      ctx.fillStyle = colors.cardBg;
      drawRoundedRect(ctx, padding, cardY, contentWidth, cardHeight, cardRadius);
      ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // Card border
      ctx.strokeStyle = colors.border;
      ctx.lineWidth = 2;
      drawRoundedRect(ctx, padding, cardY, contentWidth, cardHeight, cardRadius);
      ctx.stroke();

      // Content inside card
      const contentStartY = cardY + 70;

      // Festival name (main)
      ctx.fillStyle = colors.accent;
      ctx.font = 'bold 64px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(festival.name, canvasWidth / 2, contentStartY);

      // Hindi name
      if (festival.nameHindi) {
        ctx.fillStyle = colors.textSecondary;
        ctx.font = 'bold 48px "Noto Sans Devanagari", Arial, sans-serif';
        ctx.fillText(festival.nameHindi, canvasWidth / 2, contentStartY + 70);
      }

      // Tithi info
      if (tithiInfo) {
        const tithiY = contentStartY + (festival.nameHindi ? 150 : 110);
        // Tithi pill background
        const tithiTextWidth = ctx.measureText(tithiInfo).width;
        const pillWidth = Math.min(tithiTextWidth + 60, contentWidth - 80);
        const pillHeight = 50;
        const pillX = (canvasWidth - pillWidth) / 2;

        ctx.fillStyle = `${colors.accent}20`;
        drawRoundedRect(ctx, pillX, tithiY, pillWidth, pillHeight, 25);
        ctx.fill();

        ctx.fillStyle = colors.accent;
        ctx.font = 'bold 28px Arial, sans-serif';
        ctx.fillText(tithiInfo, canvasWidth / 2, tithiY + 30);
      }

      // Decorative separator
      const sepY = contentStartY + (festival.nameHindi ? 230 : 190);
      ctx.fillStyle = colors.gold;
      ctx.font = '32px Arial';
      ctx.fillText(`${deco.secondary}  ${deco.emoji}  ${deco.secondary}`, canvasWidth / 2, sepY);

      // Festival significance/description
      const descStartY = sepY + 60;
      const descMaxWidth = contentWidth - 80;
      const lineHeight = 42;
      const fontSize = 32;

      ctx.fillStyle = colors.textPrimary;
      ctx.font = `${fontSize}px Arial, sans-serif`;
      ctx.textAlign = 'left';

      // Word wrap the description
      const words = festival.significance.split(' ');
      let line = '';
      let currentY = descStartY;

      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > descMaxWidth && i > 0) {
          ctx.fillText(line.trim(), padding + 40, currentY);
          line = words[i] + ' ';
          currentY += lineHeight;

          // Stop if we're running out of space
          if (currentY > cardY + cardHeight - 80) break;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line.trim(), padding + 40, currentY);

      // Festival type badge
      const badgeY = Math.min(currentY + lineHeight + 30, cardY + cardHeight - 100);
      const badgeText = festival.type === 'major' ? 'Major Festival' : festival.type === 'regional' ? `Regional: ${festival.region?.join(', ') || 'Regional'}` : 'Festival';
      ctx.fillStyle = `${colors.accent}25`;
      const badgeTextWidth = ctx.measureText(badgeText).width;
      const badgeWidth = badgeTextWidth + 50;
      drawRoundedRect(ctx, (canvasWidth - badgeWidth) / 2, badgeY, badgeWidth, 44, 22);
      ctx.fill();

      ctx.fillStyle = colors.accent;
      ctx.font = 'bold 24px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(badgeText, canvasWidth / 2, badgeY + 29);

    } else {
      // SQUARE FORMAT (1080x1080) - Instagram post optimized

      // Top Om symbol
      drawOmHeader(ctx, canvasWidth / 2, 80, 56, colors.gold);

      // App branding
      ctx.fillStyle = colors.accent;
      ctx.font = 'bold 36px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('VedaTime', canvasWidth / 2, 150);

      // Main content card
      const cardY = 190;
      const cardHeight = canvasHeight - 320;
      const cardRadius = 24;

      // Card shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetY = 8;
      ctx.fillStyle = colors.cardBg;
      drawRoundedRect(ctx, padding, cardY, contentWidth, cardHeight, cardRadius);
      ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // Card border
      ctx.strokeStyle = colors.border;
      ctx.lineWidth = 2;
      drawRoundedRect(ctx, padding, cardY, contentWidth, cardHeight, cardRadius);
      ctx.stroke();

      // Content inside card
      const contentStartY = cardY + 60;

      // Decorative top
      ctx.fillStyle = colors.gold;
      ctx.font = '36px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${deco.emoji}  ${STAR}  ${deco.emoji}`, canvasWidth / 2, contentStartY);

      // Festival name
      ctx.fillStyle = colors.accent;
      ctx.font = 'bold 56px Arial, sans-serif';
      ctx.fillText(festival.name, canvasWidth / 2, contentStartY + 80);

      // Hindi name
      if (festival.nameHindi) {
        ctx.fillStyle = colors.textSecondary;
        ctx.font = 'bold 42px "Noto Sans Devanagari", Arial, sans-serif';
        ctx.fillText(festival.nameHindi, canvasWidth / 2, contentStartY + 140);
      }

      // Tithi badge
      const tithiBaseY = contentStartY + (festival.nameHindi ? 210 : 170);
      if (tithiInfo) {
        ctx.fillStyle = `${colors.accent}15`;
        const tithiWidth = ctx.measureText(tithiInfo).width + 50;
        drawRoundedRect(ctx, (canvasWidth - tithiWidth) / 2, tithiBaseY, tithiWidth, 46, 23);
        ctx.fill();

        ctx.fillStyle = colors.accent;
        ctx.font = 'bold 26px Arial, sans-serif';
        ctx.fillText(tithiInfo, canvasWidth / 2, tithiBaseY + 30);
      }

      // Description
      const descStartY = tithiBaseY + (tithiInfo ? 80 : 40);
      const descMaxWidth = contentWidth - 80;
      const lineHeight = 38;
      const fontSize = 28;

      ctx.fillStyle = colors.textPrimary;
      ctx.font = `${fontSize}px Arial, sans-serif`;
      ctx.textAlign = 'left';

      const words = festival.significance.split(' ');
      let line = '';
      let currentY = descStartY;

      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > descMaxWidth && i > 0) {
          ctx.fillText(line.trim(), padding + 40, currentY);
          line = words[i] + ' ';
          currentY += lineHeight;

          if (currentY > cardY + cardHeight - 100) break;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line.trim(), padding + 40, currentY);

      // Type badge at bottom
      const badgeY = Math.min(currentY + lineHeight + 30, cardY + cardHeight - 70);
      const badgeText = festival.type === 'major' ? 'Major Festival' : festival.type === 'regional' ? 'Regional' : 'Festival';
      ctx.fillStyle = `${colors.accent}25`;
      const badgeTextWidth = ctx.measureText(badgeText).width;
      const badgeWidth = badgeTextWidth + 50;
      drawRoundedRect(ctx, (canvasWidth - badgeWidth) / 2, badgeY, badgeWidth, 40, 20);
      ctx.fill();

      ctx.fillStyle = colors.accent;
      ctx.font = 'bold 22px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(badgeText, canvasWidth / 2, badgeY + 27);
    }

    // Watermark
    drawWatermark(ctx, canvasWidth, canvasHeight, colors);

    const dataUrl = canvas.toDataURL('image/png', 1.0);
    setGeneratedImage(dataUrl);
    return dataUrl;
  }, [canvasRef, canvasWidth, canvasHeight, festival, tithiInfo, dateStr, isStory, themeMode, colors, isHindi, drawDecorativeBorder, drawDecorativePattern, drawOmHeader, drawRoundedRect, drawWatermark]);

  const handleDownload = useCallback(() => {
    const imageUrl = generatedImage || drawFestivalCard();
    if (!imageUrl || !festival) return;

    const link = document.createElement('a');
    const fileName = isStory
      ? `vedatime-${festival.id}-story.png`
      : `vedatime-${festival.id}.png`;
    link.download = fileName;
    link.href = imageUrl;
    link.click();

    setShareMessage(isHindi ? 'त्योहार कार्ड डाउनलोड हुआ!' : 'Festival card downloaded!');
  }, [generatedImage, drawFestivalCard, festival, isStory, isHindi]);

  const handleCopyToClipboard = useCallback(async () => {
    const imageUrl = generatedImage || drawFestivalCard();
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setShareMessage(isHindi ? 'क्लिपबोर्ड पर कॉपी किया!' : 'Copied to clipboard!');
    } catch {
      // Fallback to download
      handleDownload();
    }
  }, [generatedImage, drawFestivalCard, handleDownload, isHindi]);

  const handleShare = useCallback(async () => {
    if (!festival) return;

    const shareText = `${festival.name} ${festival.nameHindi ? `(${festival.nameHindi})` : ''}
${tithiInfo ? `Tithi: ${tithiInfo}` : ''}
${dateStr || (festival.date ? `Date: ${festival.date.toLocaleDateString()}` : '')}

${festival.significance}

Shared from VedaTime - vedatime.app`;

    if (navigator.share) {
      try {
        const imageUrl = generatedImage || drawFestivalCard();
        if (imageUrl) {
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const file = new File([blob], `festival-${festival.id}.png`, { type: 'image/png' });
          await navigator.share({
            title: festival.name,
            text: shareText,
            files: [file]
          });
          setShareMessage(isHindi ? 'सफलतापूर्वक शेयर किया!' : 'Shared successfully!');
          return;
        }
      } catch {
        // User cancelled — not an error
      }
    }

    // Fallback to text share
    if (navigator.share) {
      try {
        await navigator.share({
          title: festival.name,
          text: shareText
        });
        setShareMessage(isHindi ? 'सफलतापूर्वक शेयर किया!' : 'Shared successfully!');
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      setShareMessage(isHindi ? 'विवरण कॉपी किए!' : 'Details copied to clipboard!');
    }
  }, [festival, tithiInfo, dateStr, generatedImage, drawFestivalCard, isHindi]);

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setShareMessage('');
      setGeneratedImage(null);
    }
  }, [isOpen]);

  // Auto-generate image when dialog opens
  useEffect(() => {
    if (isOpen && festival) {
      const timer = setTimeout(() => drawFestivalCard(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, festival, aspectRatio, themeMode, drawFestivalCard]);

  const handleAspectRatioChange = (_: React.MouseEvent<HTMLElement>, newRatio: AspectRatio) => {
    if (newRatio !== null) {
      setAspectRatio(newRatio);
    }
  };

  const handleThemeChange = (_: React.MouseEvent<HTMLElement>, newTheme: ThemeMode) => {
    if (newTheme !== null) {
      setThemeMode(newTheme);
    }
  };

  if (!festival) return null;

  const deco = getFestivalDecoration(festival);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, overflow: 'hidden' }
      }}
    >
      <DialogTitle sx={{ fontWeight: 500, pb: 1 }}>
        {deco.emoji} {isHindi ? 'त्योहार साझा करें' : 'Share Festival'}
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 16, top: 16 }}
        >
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {/* Hidden canvas for image generation */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Festival info preview */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 2,
            borderRadius: 2,
            background: 'linear-gradient(135deg, rgba(199, 91, 18, 0.08), rgba(255, 215, 0, 0.08))',
            border: '1px solid rgba(199, 91, 18, 0.15)',
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 500, color: 'primary.main', mb: 0.5 }}>
            {festival.name}
          </Typography>
          {festival.nameHindi && (
            <Typography variant="body1" sx={{ color: '#7A3008', mb: 1 }}>
              {festival.nameHindi}
            </Typography>
          )}
          {tithiInfo && (
            <Chip
              label={tithiInfo}
              size="small"
              sx={{
                bgcolor: 'rgba(199, 91, 18, 0.1)',
                color: '#C75B12',
                fontWeight: 500,
                mr: 1,
                mb: 1,
              }}
            />
          )}
          {dateStr && (
            <Chip
              label={dateStr}
              size="small"
              variant="outlined"
              sx={{ mb: 1 }}
            />
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {festival.significance.slice(0, 120)}...
          </Typography>
        </Paper>

        {/* Controls */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2, alignItems: 'center' }}>
          {/* Format toggle */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Image size={14} />
            <ToggleButtonGroup
              value={aspectRatio}
              exclusive
              onChange={handleAspectRatioChange}
              size="small"
              sx={{ bgcolor: 'rgba(199, 91, 18, 0.06)', borderRadius: 2 }}
            >
              <ToggleButton value="standard" sx={{ px: 1.5, borderRadius: 2, minHeight: 36 }}>
                {isHindi ? 'स्क्वायर' : 'Square'}
              </ToggleButton>
              <ToggleButton value="story" sx={{ px: 1.5, borderRadius: 2, minHeight: 36 }}>
                <Smartphone size={14} style={{ marginRight: 4 }} />
                Story
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Theme toggle */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <ToggleButtonGroup
              value={themeMode}
              exclusive
              onChange={handleThemeChange}
              size="small"
              sx={{ bgcolor: 'rgba(199, 91, 18, 0.06)', borderRadius: 2 }}
            >
              <ToggleButton value="light" sx={{ px: 1.5, borderRadius: 2, minHeight: 36 }}>
                <Sun size={14} style={{ marginRight: 4 }} />
                {isHindi ? 'लाइट' : 'Light'}
              </ToggleButton>
              <ToggleButton value="dark" sx={{ px: 1.5, borderRadius: 2, minHeight: 36 }}>
                <Moon size={14} style={{ marginRight: 4 }} />
                {isHindi ? 'डार्क' : 'Dark'}
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {/* Image preview */}
        {generatedImage && (
          <Box
            sx={{
              mb: 2,
              borderRadius: 2,
              overflow: 'hidden',
              border: '1px solid rgba(0,0,0,0.08)',
              bgcolor: 'rgba(0,0,0,0.02)',
            }}
          >
            <Box
              component="img"
              src={generatedImage}
              alt={`${festival.name} Share Card`}
              sx={{
                width: '100%',
                maxHeight: isStory ? 350 : 280,
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </Box>
        )}

        {/* Action buttons */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<Download size={18} />}
            onClick={handleDownload}
            sx={{
              flex: 1,
              borderRadius: 2,
              py: 1.5,
              fontWeight: 500,
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark' },
            }}
          >
            {isHindi ? 'डाउनलोड' : 'Download'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<Copy size={18} />}
            onClick={handleCopyToClipboard}
            sx={{
              flex: 1,
              borderRadius: 2,
              py: 1.5,
              fontWeight: 500,
            }}
          >
            {isHindi ? 'कॉपी' : 'Copy'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<Share2 size={18} />}
            onClick={handleShare}
            sx={{
              flex: 1,
              borderRadius: 2,
              py: 1.5,
              fontWeight: 500,
              borderColor: '#25D366',
              color: '#25D366',
              '&:hover': { bgcolor: 'rgba(37, 211, 102, 0.08)' },
            }}
          >
            Share
          </Button>
        </Box>

        {/* Message */}
        {shareMessage && (
          <Alert severity="success" sx={{ mt: 1.5 }}>
            {shareMessage}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Typography variant="caption" color="text.secondary">
          {isHindi
            ? 'त्योहार कार्ड डाउनलोड करें या साझा करें'
            : 'Download or share the festival card'}
        </Typography>
      </DialogActions>
    </Dialog>
  );
};

export default FestivalShareCard;
