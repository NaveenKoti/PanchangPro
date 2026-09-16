import { Panchang } from '../types';

interface ShareData {
  title: string;
  text: string;
  imageUrl?: string;
}

export const createShareText = (panchang: Panchang, locationName: string, isHindi: boolean): string => {
  return isHindi
    ? `🙏 आज का पंचांग - ${locationName}\n\n📅 ${panchang.date.toLocaleDateString('hi-IN')}\n🌙 तिथि: ${panchang.tithi.nameHindi} (${panchang.tithi.paksha})\n\nPanchang Pro ऐप से`
    : `🙏 Today's Panchang - ${locationName}\n\n📅 ${panchang.date.toLocaleDateString()}\n🌙 Tithi: ${panchang.tithi.name} (${panchang.tithi.paksha})\n\nShared from Panchang Pro`;
};

export const isShareSupported = (): boolean => {
  return typeof navigator !== 'undefined' && !!navigator.share;
};

export const shareContent = async (data: { title: string; text: string; url?: string }): Promise<void> => {
  try {
    if (isShareSupported()) {
      await navigator.share(data as ShareData);
    } else {
      await navigator.clipboard.writeText(`${data.title}\n\n${data.text}\n${data.url || ''}`);
    }
  } catch (error) {
    // Share cancelled or failed - silent failure expected
  }
};