/**
 * PanchangShareCard - Generate downloadable images for WhatsApp/Instagram sharing
 *
 * Creates beautiful visual cards with:
 * - Stunning saffron/gold gradients
 * - App logo (Om symbol) with branding
 * - Better typography hierarchy
 * - Festival-specific designs when sharing festival info
 * - Date and location info
 * - Instagram/WhatsApp story optimized (1080x1920 ratio option)
 * - Watermark "VedaTime - vedatime.app" at bottom
 */

import React, { useRef, useState, useCallback } from 'react';
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
import { X, Download, Share2, MessageCircle, Image, Smartphone, Link as LinkIcon } from 'lucide-react';
import { buildDayLink } from '../utils/dayLink';
import { alpha } from '@mui/material/styles';
import { Panchang, Festival } from '../types';
import { useI18n } from '../hooks/useI18n';

interface PanchangShareCardProps {
  isOpen: boolean;
  onClose: () => void;
  panchang: Panchang | null;
  locationName: string;
}

type AspectRatio = 'standard' | 'story';

const STANDARD_WIDTH = 1200;
const STANDARD_HEIGHT = 900;
const STORY_WIDTH = 1080;
const STORY_HEIGHT = 1920;

// Gradient presets for different contexts
const GRADIENTS = {
  standard: ['#FFF8E1', '#FFE0B2', '#FFCC80'],
  festival: ['#FF6B35', '#FFB347', '#FFD700'],
  dark: ['#1A1A2E', '#16213E', '#0F3460'],
  story: ['#D4763C', '#E89B6A', '#F2C08E', '#F7D9B8'],
};

const OM_SYMBOL = '\u0950';

export const PanchangShareCard: React.FC<PanchangShareCardProps> = ({
  isOpen,
  onClose,
  panchang,
  locationName,
}) => {
  const { currentLanguage } = useI18n();
  const theme = useTheme();
  const isHindi = currentLanguage === 'hi';
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shareMessage, setShareMessage] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('standard');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const isStory = aspectRatio === 'story';
  const canvasWidth = isStory ? STORY_WIDTH : STANDARD_WIDTH;
  const canvasHeight = isStory ? STORY_HEIGHT : STANDARD_HEIGHT;

  const hasFestival = panchang?.festivals && panchang.festivals.length > 0;

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

  const drawDecorativeBorder = useCallback((
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    color: string,
    lineWidth: number
  ) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    const margin = lineWidth * 2;
    drawRoundedRect(ctx, margin, margin, width - margin * 2, height - margin * 2, 12);
    ctx.stroke();

    // Inner decorative line
    ctx.strokeStyle = `${color}60`;
    ctx.lineWidth = lineWidth / 2;
    const innerMargin = margin + 8;
    drawRoundedRect(ctx, innerMargin, innerMargin, width - innerMargin * 2, height - innerMargin * 2, 8);
    ctx.stroke();
  }, [drawRoundedRect]);

  const drawOmSymbol = useCallback((
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
    isDark: boolean
  ) => {
    const y = height - 30;
    ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(199, 91, 18, 0.6)';
    ctx.font = 'bold 24px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('VedaTime - vedatime.app', width / 2, y);
  }, []);

  const drawLogo = useCallback((
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    isDark: boolean
  ) => {
    // Draw Om symbol as logo
    drawOmSymbol(ctx, x, y, size, isDark ? '#FFD700' : '#FFFFFF');
  }, [drawOmSymbol]);

  // Generate image with proper canvas readiness check
  const generateImage = useCallback(() => {
    if (!canvasRef.current || !panchang) return null;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: false });
    if (!ctx) return null;

    // Ensure canvas dimensions are set before drawing
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Force canvas to be ready
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const isDark = theme.palette.mode === 'dark';
    const padding = isStory ? 60 : 40;
    const contentWidth = canvasWidth - padding * 2;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
    if (isStory) {
      GRADIENTS.story.forEach((color, i) => {
        gradient.addColorStop(i / (GRADIENTS.story.length - 1), color);
      });
    } else if (hasFestival) {
      GRADIENTS.festival.forEach((color, i) => {
        gradient.addColorStop(i / (GRADIENTS.festival.length - 1), color);
      });
    } else if (isDark) {
      GRADIENTS.dark.forEach((color, i) => {
        gradient.addColorStop(i / (GRADIENTS.dark.length - 1), color);
      });
    } else {
      GRADIENTS.standard.forEach((color, i) => {
        gradient.addColorStop(i / (GRADIENTS.standard.length - 1), color);
      });
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Decorative border
    drawDecorativeBorder(ctx, canvasWidth, canvasHeight, isDark ? '#FFD700' : '#C75B12', isStory ? 8 : 6);

    if (isStory) {
      // STORY FORMAT (1080x1920)
      // Top Om logo
      drawLogo(ctx, canvasWidth / 2, 120, 80, isDark);

      // App name
      ctx.fillStyle = isDark ? '#FFD700' : '#FFFFFF';
      ctx.font = 'bold 48px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('VedaTime', canvasWidth / 2, 220);

      // Date header
      const dateStr = panchang.date.toLocaleDateString(
        isHindi ? 'hi-IN' : 'en-IN',
        { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
      );
      ctx.fillStyle = isDark ? 'rgba(255,255,255,0.9)' : '#5D4037';
      ctx.font = '600 32px Arial, sans-serif';
      ctx.fillText(dateStr, canvasWidth / 2, 290);

      // Location
      ctx.fillStyle = isDark ? 'rgba(255,255,255,0.7)' : '#7A3008';
      ctx.font = '28px Arial, sans-serif';
      ctx.fillText(`${locationName}`, canvasWidth / 2, 340);

      // Divider
      ctx.strokeStyle = isDark ? 'rgba(255,215,0,0.3)' : 'rgba(199,91,18,0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(padding, 380);
      ctx.lineTo(canvasWidth - padding, 380);
      ctx.stroke();

      // Content card background - dark overlay for contrast
      const cardY = 420;
      const cardHeight = canvasHeight - 550;
      const cardRadius = 24;

      // Dark overlay behind content area for text contrast
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.fillRect(padding - 20, cardY - 20, contentWidth + 40, cardHeight + 40);

      ctx.fillStyle = isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.85)';
      drawRoundedRect(ctx, padding, cardY, contentWidth, cardHeight, cardRadius);
      ctx.fill();

      // Content inside card
      const contentStartY = cardY + 60;
      const lineSpacing = 100;

      // Tithi
      ctx.fillStyle = isDark ? '#FFD700' : '#C75B12';
      ctx.font = 'bold 44px Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`Tithi: ${panchang.tithi.name}`, padding + 40, contentStartY);
      ctx.fillStyle = isDark ? 'rgba(255,255,255,0.6)' : '#757575';
      ctx.font = '32px Arial, sans-serif';
      ctx.fillText(`(${panchang.tithi.paksha} Paksha)`, padding + 40, contentStartY + 55);

      // Nakshatra
      ctx.fillStyle = isDark ? '#87CEEB' : '#2C3E6B';
      ctx.font = 'bold 44px Arial, sans-serif';
      ctx.fillText(`Nakshatra: ${panchang.nakshatra.name}`, padding + 40, contentStartY + lineSpacing * 2);

      // Yoga
      ctx.fillStyle = isDark ? '#FFA500' : '#E8944A';
      ctx.font = 'bold 44px Arial, sans-serif';
      ctx.fillText(`Yoga: ${panchang.yoga.name}`, padding + 40, contentStartY + lineSpacing * 3);

      // Karana
      ctx.fillStyle = isDark ? '#98D8C8' : '#2C3E6B';
      ctx.font = 'bold 44px Arial, sans-serif';
      ctx.fillText(`Karana: ${panchang.karana.name}`, padding + 40, contentStartY + lineSpacing * 4);

      // Sunrise/Sunset
      const sunriseStr = panchang.sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const sunsetStr = panchang.sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      ctx.fillStyle = isDark ? '#FFA07A' : '#E8944A';
      ctx.font = 'bold 36px Arial, sans-serif';
      ctx.fillText(`Sunrise: ${sunriseStr}`, padding + 40, contentStartY + lineSpacing * 5.5);
      ctx.fillText(`Sunset: ${sunsetStr}`, padding + 40, contentStartY + lineSpacing * 6.5);

      // Rahu Kaal
      const rahuStart = panchang.rahuKaal.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const rahuEnd = panchang.rahuKaal.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      ctx.fillStyle = isDark ? '#FF6B6B' : '#D32F2F';
      ctx.font = '32px Arial, sans-serif';
      ctx.fillText(`Rahu Kaal: ${rahuStart} - ${rahuEnd}`, padding + 40, contentStartY + lineSpacing * 8);

      // Festival info if any
      if (hasFestival && panchang.festivals) {
        const festival = panchang.festivals[0];
        const festY = contentStartY + lineSpacing * 9.5;
        ctx.fillStyle = isDark ? '#FFD700' : '#C75B12';
        ctx.font = 'bold 40px Arial, sans-serif';
        ctx.fillText(`Festival: ${festival.name}`, padding + 40, festY);
        if (festival.nameHindi) {
          ctx.fillStyle = isDark ? 'rgba(255,255,255,0.7)' : '#7A3008';
          ctx.font = '32px Arial, sans-serif';
          ctx.fillText(festival.nameHindi, padding + 40, festY + 50);
        }
      }

      // Bottom watermark
      drawWatermark(ctx, canvasWidth, canvasHeight, isDark);

    } else {
      // STANDARD FORMAT (1200x630)
      // Header bar
      const headerHeight = isDark ? 100 : 100;
      ctx.fillStyle = isDark ? 'rgba(0,0,0,0.4)' : 'rgba(199, 91, 18, 0.9)';
      ctx.fillRect(0, 0, canvasWidth, headerHeight);

      // Om symbol in header
      drawLogo(ctx, 60, headerHeight / 2, 40, isDark);

      // App name in header
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 40px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('VedaTime', canvasWidth / 2, headerHeight / 2 + 5);

      // Location
      ctx.fillStyle = isDark ? 'rgba(255,255,255,0.9)' : '#7A3008';
      ctx.font = '600 28px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${locationName}`, canvasWidth / 2, headerHeight + 50);

      // Date
      const dateStr = panchang.date.toLocaleDateString(
        isHindi ? 'hi-IN' : 'en-IN',
        { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
      );
      ctx.fillStyle = isDark ? 'rgba(255,255,255,0.7)' : '#5D4037';
      ctx.font = '600 24px Arial, sans-serif';
      ctx.fillText(dateStr, canvasWidth / 2, headerHeight + 90);

      // Main content box
      const boxY = headerHeight + 120;
      const boxHeight = canvasHeight - boxY - 100;
      const boxRadius = 16;
      ctx.fillStyle = isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.85)';
      drawRoundedRect(ctx, padding, boxY, contentWidth, boxHeight, boxRadius);
      ctx.fill();

      // Content items
      const startX = padding + 40;
      let currentY = boxY + 55;
      const itemSpacing = 65;

      // Tithi
      ctx.fillStyle = isDark ? '#FFD700' : '#C75B12';
      ctx.font = 'bold 36px Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`Tithi: ${panchang.tithi.name}`, startX, currentY);
      ctx.fillStyle = isDark ? 'rgba(255,255,255,0.6)' : '#757575';
      ctx.font = '28px Arial, sans-serif';
      ctx.fillText(`(${panchang.tithi.paksha} Paksha)`, startX + 350, currentY);

      currentY += itemSpacing;

      // Nakshatra
      ctx.fillStyle = isDark ? '#87CEEB' : '#2C3E6B';
      ctx.font = 'bold 36px Arial, sans-serif';
      ctx.fillText(`Nakshatra: ${panchang.nakshatra.name}`, startX, currentY);

      currentY += itemSpacing;

      // Yoga
      ctx.fillStyle = isDark ? '#FFA500' : '#E8944A';
      ctx.font = 'bold 36px Arial, sans-serif';
      ctx.fillText(`Yoga: ${panchang.yoga.name}`, startX, currentY);

      currentY += itemSpacing;

      // Karana
      ctx.fillStyle = isDark ? '#98D8C8' : '#2C3E6B';
      ctx.font = 'bold 36px Arial, sans-serif';
      ctx.fillText(`Karana: ${panchang.karana.name}`, startX, currentY);

      currentY += itemSpacing + 15;

      // Sunrise/Sunset side by side
      const sunriseStr = panchang.sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const sunsetStr = panchang.sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      ctx.fillStyle = isDark ? '#FFA07A' : '#E8944A';
      ctx.font = 'bold 32px Arial, sans-serif';
      ctx.fillText(`Sunrise: ${sunriseStr}`, startX, currentY);
      ctx.fillText(`Sunset: ${sunsetStr}`, startX + 450, currentY);

      currentY += itemSpacing;

      // Rahu Kaal
      const rahuStart = panchang.rahuKaal.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const rahuEnd = panchang.rahuKaal.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      ctx.fillStyle = isDark ? '#FF6B6B' : '#D32F2F';
      ctx.font = '28px Arial, sans-serif';
      ctx.fillText(`Rahu Kaal: ${rahuStart} - ${rahuEnd}`, startX, currentY);

      // Festival badge if any
      if (hasFestival && panchang.festivals) {
        const festival = panchang.festivals[0];
        const festY = currentY + 55;
        // Festive badge background
        ctx.fillStyle = isDark ? 'rgba(255,215,0,0.2)' : 'rgba(255,107,53,0.15)';
        drawRoundedRect(ctx, startX, festY - 30, contentWidth - 40, 60, 12);
        ctx.fill();

        ctx.fillStyle = isDark ? '#FFD700' : '#C75B12';
        ctx.font = 'bold 32px Arial, sans-serif';
        ctx.fillText(`Festival: ${festival.name}`, startX + 20, festY + 5);
      }

      // Footer with watermark
      drawWatermark(ctx, canvasWidth, canvasHeight, isDark);
    }

    const dataUrl = canvas.toDataURL('image/png', 1.0);
    setGeneratedImage(dataUrl);
    return dataUrl;
  }, [canvasRef, canvasWidth, canvasHeight, panchang, locationName, isHindi, theme.palette.mode, hasFestival, isStory, drawDecorativeBorder, drawLogo, drawRoundedRect, drawWatermark]);

  const handleDownload = useCallback(() => {
    // Use already-generated image if available, otherwise generate
    let imageUrl = generatedImage;
    if (!imageUrl) {
      imageUrl = generateImage();
    }
    if (!imageUrl) return;

    const link = document.createElement('a');
    const fileName = isStory
      ? `vedatime-story-${panchang?.date.toISOString().split('T')[0]}.png`
      : `vedatime-${panchang?.date.toISOString().split('T')[0]}.png`;
    link.download = fileName;
    link.href = imageUrl;
    link.click();

    setShareMessage(isHindi ? 'छवि डाउनलोड हो गई!' : 'Image downloaded!');
  }, [generateImage, generatedImage, isStory, panchang, isHindi]);

  const handleShareText = useCallback(async () => {
    if (!panchang) return;

    const festivalLine = hasFestival && panchang.festivals
      ? `\n🎉 Festival: ${panchang.festivals[0].name}`
      : '';

    const dayLink = buildDayLink(panchang.date);
    const shareText = `🙏 VedaTime - Today's Panchang
📍 ${locationName}
📅 ${panchang.date.toLocaleDateString()}
🌙 Tithi: ${panchang.tithi.name} (${panchang.tithi.paksha})
⭐ Nakshatra: ${panchang.nakshatra.name}
🧘 Yoga: ${panchang.yoga.name}
☀️ Sunrise: ${panchang.sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
🌅 Sunset: ${panchang.sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}${festivalLine}

🔗 Open this day: ${dayLink}
Shared from VedaTime - vedatime.app`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'VedaTime',
          text: shareText
        });
        setShareMessage(isHindi ? 'सफलतापूर्वक शेयर किया!' : 'Shared successfully!');
      } catch {
        // User cancelled — not an error
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      setShareMessage(isHindi ? 'क्लिपबोर्ड पर कॉपी किया!' : 'Copied to clipboard!');
    }
  }, [panchang, locationName, isHindi, hasFestival]);

  // Copy the deep link for this day (?d=YYYY-MM-DD): recipients open the
  // exact tithi in the app and get an install nudge.
  const handleCopyLink = useCallback(async () => {
    if (!panchang) return;
    try {
      await navigator.clipboard.writeText(buildDayLink(panchang.date));
      setShareMessage(isHindi ? 'दिन का लिंक कॉपी हो गया!' : 'Day link copied!');
    } catch {
      setShareMessage(isHindi ? 'कॉपी नहीं हो पाया' : 'Copy failed');
    }
    setTimeout(() => setShareMessage(''), 3000);
  }, [panchang, isHindi]);

  // Reset state when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      setShareMessage('');
      setGeneratedImage(null);
    }
  }, [isOpen]);

  // Auto-generate image when dialog opens with proper delay
  const [isGenerating, setIsGenerating] = React.useState(false);

  React.useEffect(() => {
    if (isOpen && panchang) {
      setIsGenerating(true);
      // Give canvas time to be ready and ensure complete rendering
      const timer = setTimeout(() => {
        generateImage();
        setIsGenerating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, panchang, aspectRatio]);

  const handleAspectRatioChange = (_: React.MouseEvent<HTMLElement>, newRatio: AspectRatio) => {
    if (newRatio !== null) {
      setAspectRatio(newRatio);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 1 }
      }}
    >
      <DialogTitle sx={{ fontWeight: 500, pb: 1 }}>
        {isHindi ? 'साझा करें' : 'Share Panchang'}
        <IconButton
          onClick={onClose}
          aria-label="Close share card"
          sx={{ position: 'absolute', right: 16, top: 16 }}
        >
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {/* Hidden canvas for image generation */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Format toggle */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Smartphone size={16} />
          <ToggleButtonGroup
            value={aspectRatio}
            exclusive
            onChange={handleAspectRatioChange}
            size="small"
            sx={{ bgcolor: alpha(theme.palette.primary.main, 0.06), borderRadius: 1 }}
          >
            <ToggleButton value="standard" sx={{ px: 2, borderRadius: 2 }}>
              <Image size={16} style={{ marginRight: 6 }} />
              Standard
            </ToggleButton>
            <ToggleButton value="story" sx={{ px: 2, borderRadius: 2 }}>
              <Smartphone size={16} style={{ marginRight: 6 }} />
              Story (9:16)
            </ToggleButton>
          </ToggleButtonGroup>
          {hasFestival && (
            <Chip
              label={isHindi ? 'त्योहार' : 'Festival'}
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.warning.main, 0.12),
                color: 'warning.main',
                fontWeight: 500,
              }}
            />
          )}
        </Box>

        {/* Preview */}
        {panchang && (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 1,
              bgcolor: alpha(theme.palette.primary.main, 0.04),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 500, color: theme.palette.primary.main }}>
                {isHindi ? 'पंचांग' : 'Panchang'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ({panchang.tithi.paksha})
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ mb: 0.5 }}>
              {panchang.nakshatra.name}
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              {panchang.yoga.name} • {panchang.karana.name}
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              {panchang.sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              {' • '}
              {panchang.sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Typography>

            {hasFestival && panchang.festivals && (
              <Typography variant="body2" sx={{ mb: 0.5, color: 'warning.main', fontWeight: 500 }}>
                {isHindi ? panchang.festivals[0].nameHindi : panchang.festivals[0].name}
              </Typography>
            )}

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              {locationName} • {panchang.date.toLocaleDateString()}
            </Typography>

            {/* Image preview - shown only when generated */}
            {generatedImage && !isGenerating && (
              <Box
                component="img"
                src={generatedImage}
                alt="Panchang Card Preview"
                sx={{
                  width: '100%',
                  maxHeight: isStory ? 400 : 220,
                  objectFit: 'contain',
                  borderRadius: 1,
                  mt: 1.5,
                  border: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
                }}
              />
            )}

            {/* Loading indicator while generating */}
            {isGenerating && (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, minHeight: 120 }}>
                <Typography variant="body2" color="text.secondary">
                  {isHindi ? 'छवि तैयार हो रही है...' : 'Generating image...'}
                </Typography>
              </Box>
            )}
          </Paper>
        )}

        {/* Share options */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<Download size={18} />}
            onClick={handleDownload}
            fullWidth
            sx={{
              borderRadius: 2,
              py: 1.5,
              fontWeight: 500,
              bgcolor: theme.palette.primary.main,
              '&:hover': { bgcolor: theme.palette.primary.dark }
            }}
          >
            {isHindi ? 'इमेज डाउनलोड करें' : 'Download Image'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<MessageCircle size={18} />}
            onClick={handleShareText}
            fullWidth
            sx={{
              borderRadius: 2,
              py: 1.5,
              fontWeight: 500,
              borderColor: '#25D366',
              color: '#25D366',
              '&:hover': { bgcolor: 'rgba(37, 211, 102, 0.08)' }
            }}
          >
            WhatsApp
          </Button>
          <Button
            variant="outlined"
            onClick={handleCopyLink}
            aria-label={isHindi ? 'दिन का लिंक कॉपी करें' : 'Copy day link'}
            sx={{
              borderRadius: 2,
              minWidth: 48,
              width: 48,
              height: 48,
              flexShrink: 0,
              borderColor: 'divider',
              color: 'primary.main',
              '&:hover': { bgcolor: 'action.hover' }
            }}
          >
            <LinkIcon size={20} />
          </Button>
        </Box>

        {/* Message */}
        {shareMessage && (
          <Alert severity="success" sx={{ mt: 1 }}>
            {shareMessage}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Typography variant="caption" color="text.secondary">
          {isHindi
            ? 'छवि डाउनलोड करें या WhatsApp पर साझा करें'
            : 'Download image or share on WhatsApp'}
        </Typography>
      </DialogActions>
    </Dialog>
  );
};

export default PanchangShareCard;
