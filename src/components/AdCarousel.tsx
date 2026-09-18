/**
 * AdCarousel - Subtle Promotional Carousel
 * 
 * Design Principles:
 * - Non-intrusive, calm colors
 * - Smooth, gentle animations
 * - No aggressive marketing feel
 * - Consistent with app aesthetic
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Paper, Typography, IconButton, Skeleton, useTheme, useMediaQuery } from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface AdSlide {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  backgroundColor?: string;
  ctaText?: string;
  ctaUrl?: string;
  onClick?: () => void;
}

interface AdCarouselProps {
  slides?: AdSlide[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  height?: number | string;
  adUnitId?: string;
  onSlideChange?: (index: number) => void;
}

// In-app promotional slides — brand-compliant VedaTime palette
const getSlides = (theme: any): AdSlide[] => [
  {
    id: '2',
    title: 'Share Your Panchang',
    subtitle: 'Send today\'s tithi & muhurta to family on WhatsApp',
    backgroundColor: theme.palette.mode === 'dark'
      ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`
      : 'linear-gradient(135deg, #E8722A 0%, #FF9A5C 100%)',
    ctaText: 'Share',
  },
  {
    id: '3',
    title: 'Ayurvedic Daily Guide',
    subtitle: 'Align your routine with nature\'s Vedic rhythms',
    backgroundColor: theme.palette.mode === 'dark'
      ? `linear-gradient(135deg, ${theme.palette.success.dark} 0%, ${theme.palette.success.main} 100%)`
      : 'linear-gradient(135deg, #2A4D18 0%, #38A169 100%)',
    ctaText: 'Explore',
  },
  {
    id: '4',
    title: 'Auspicious Timings',
    subtitle: 'Find the perfect muhurta for your important decisions',
    backgroundColor: theme.palette.mode === 'dark'
      ? `linear-gradient(135deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.secondary.main} 100%)`
      : 'linear-gradient(135deg, #1C2E54 0%, #4A55A8 100%)',
    ctaText: 'View',
  },
];

export const AdCarousel: React.FC<AdCarouselProps> = ({
  slides: propSlides,
  autoPlay = true,
  autoPlayInterval = 5000,
  showArrows = true,
  showDots = true,
  height = 140,
  adUnitId,
  onSlideChange,
}) => {
  const theme = useTheme();
  const slides = propSlides || getSlides(theme);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || isPaused || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % slides.length;
        onSlideChange?.(next);
        return next;
      });
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, isPaused, slides.length, onSlideChange]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => {
      const next = (prev - 1 + slides.length) % slides.length;
      onSlideChange?.(next);
      return next;
    });
  }, [slides.length, onSlideChange]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => {
      const next = (prev + 1) % slides.length;
      onSlideChange?.(next);
      return next;
    });
  }, [slides.length, onSlideChange]);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    onSlideChange?.(index);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  // Touch/Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeThreshold = 50; // Minimum swipe distance
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swiped left - next slide
        handleNext();
      } else {
        // Swiped right - prev slide
        handlePrev();
      }
    }
  };

  if (isLoading) {
    return (
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          height,
          margin: '8px auto',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Skeleton
          variant="rectangular"
          width="100%"
          height={height}
          sx={{ bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0, 0, 0, 0.05)', borderRadius: 2 }}
        />
      </Paper>
    );
  }

  if (slides.length === 0) {
    return null;
  }

  const currentSlide = slides[currentIndex];

  return (
    <Paper
      ref={carouselRef}
      elevation={0}
      sx={{
        width: '100%',
        height,
        margin: '8px auto',
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        bgcolor: 'transparent',
        touchAction: 'pan-y',
        border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}`,
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slide Content */}
      <Box
        sx={{
          width: '100%',
          height: '100%',
          background: currentSlide.backgroundColor || `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 2,
          transition: 'all 0.5s ease-in-out',
          cursor: currentSlide.onClick ? 'pointer' : 'default',
          position: 'relative',
          overflow: 'hidden',
        }}
        onClick={() => {
          currentSlide.onClick?.();
        }}
      >
        {/* Decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
          }}
        />

        {/* Text Content */}
        <Box sx={{ zIndex: 1, flex: 1 }}>
          <Typography
            variant="subtitle1"
            sx={{
              color: '#fff',
              fontWeight: 500,
              fontSize: { xs: '0.9rem', sm: '1rem' },
              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
              lineHeight: 1.3,
            }}
          >
            {currentSlide.title}
          </Typography>
          {currentSlide.subtitle && (
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                mt: 0.5,
                fontSize: { xs: '0.7rem', sm: '0.8rem' },
                display: { xs: 'none', sm: 'block' },
              }}
            >
              {currentSlide.subtitle}
            </Typography>
          )}
          {currentSlide.ctaText && (
            <Box
              sx={{
                display: 'inline-block',
                mt: 1.5,
                px: 2.5,
                py: 0.75,
                bgcolor: 'rgba(255,255,255,0.3)',
                borderRadius: 2,
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.4)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                },
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: '#fff',
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  letterSpacing: '0.02em',
                }}
              >
                {currentSlide.ctaText}  →
              </Typography>
            </Box>
          )}
        </Box>

        {/* Icon decoration */}
        <Box
          sx={{
            fontSize: { xs: '2.5rem', sm: '3rem' },
            opacity: 0.85,
            ml: 2,
            display: { xs: 'none', sm: 'block' },
            userSelect: 'none',
          }}
        >
          {currentSlide.id === '1' && '✨'}
          {currentSlide.id === '2' && '🙏'}
          {currentSlide.id === '3' && '🌿'}
          {currentSlide.id === '4' && '🌙'}
        </Box>
      </Box>

      {/* Navigation Arrows - Hidden on mobile, use swipe instead */}
      {showArrows && slides.length > 1 && !isMobile && (
        <>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            sx={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255,255,255,0.95)',
              color: theme.palette.text.primary,
              width: 32,
              height: 32,
              opacity: 0.8,
              '&:hover': {
                bgcolor: '#fff',
                opacity: 1,
                transform: 'translateY(-50%) scale(1.1)',
              },
              transition: 'all 0.2s ease',
              boxShadow: (theme) => theme.palette.mode === 'dark' ? '0 2px 8px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.15)',
            }}
            size="small"
            aria-label="Previous ad"
          >
            <ChevronLeft size={20} />
          </IconButton>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255,255,255,0.95)',
              color: theme.palette.text.primary,
              width: 32,
              height: 32,
              opacity: 0.8,
              '&:hover': {
                bgcolor: '#fff',
                opacity: 1,
                transform: 'translateY(-50%) scale(1.1)',
              },
              transition: 'all 0.2s ease',
              boxShadow: (theme) => theme.palette.mode === 'dark' ? '0 2px 8px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.15)',
            }}
            size="small"
            aria-label="Next ad"
          >
            <ChevronRight size={20} />
          </IconButton>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && slides.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 12,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1,
            zIndex: 2,
          }}
        >
          {slides.map((_, index) => (
            <Box
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                handleDotClick(index);
              }}
              sx={{
                width: index === currentIndex ? 24 : 8,
                height: 6,
                borderRadius: 3,
                bgcolor: index === currentIndex ? '#fff' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  bgcolor: index === currentIndex ? '#fff' : 'rgba(255,255,255,0.7)',
                },
              }}
            />
          ))}
        </Box>
      )}

      {/* Sponsored label — minimal */}
      <Typography
        variant="caption"
        sx={{
          position: 'absolute',
          top: 5,
          right: 8,
          color: 'rgba(255,255,255,0.45)',
          fontSize: '0.5rem',
          zIndex: 2,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        Sponsored
      </Typography>
    </Paper>
  );
};

/**
 * Compact version for smaller ad spaces
 */
export const AdCarouselCompact: React.FC<Omit<AdCarouselProps, 'height' | 'showArrows'>> = (props) => {
  return <AdCarousel {...props} height={80} showArrows={false} />;
};

export default AdCarousel;
