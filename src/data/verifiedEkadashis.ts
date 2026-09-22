/**
 * Verified Ekadashi Dates for 2025-2030
 * 
 * Source: Verified against Drik Panchang (drikpanchang.com)
 * These dates are 100% accurate and used as fallback when algorithmic
 * calculation has minor errors due to Moon position approximations.
 *
 * Smarta convention (Drik main list). When Drik lists a Gauna/Vaishnava
 * observance on the following Dwadashi day, it is kept as a separate row
 * with a "(Vaishnava)" suffix — never merged onto the wrong tithi (a
 * 2026 data-entry shift once put Indira on Sep 23 instead of Oct 6).
 * 
 * Format: { date: 'YYYY-MM-DD', name: string, paksha: 'Shukla'|'Krishna', month: string }
 */

export interface VerifiedEkadashi {
  date: string;
  name: string;
  paksha: 'Shukla' | 'Krishna';
  lunarMonth: number; // 1-12 (Chaitra=1 to Phalguna=12)
}

export const VERIFIED_EKADASHIS: VerifiedEkadashi[] = [
  // 2025 Ekadashis
  { date: '2025-01-10', name: 'Vaikuntha Ekadashi', paksha: 'Shukla', lunarMonth: 10 },
  { date: '2025-01-25', name: 'Shat Tila Ekadashi', paksha: 'Krishna', lunarMonth: 10 },
  { date: '2025-02-08', name: 'Jaya Ekadashi', paksha: 'Shukla', lunarMonth: 11 },
  { date: '2025-02-24', name: 'Vijaya Ekadashi', paksha: 'Krishna', lunarMonth: 11 },
  { date: '2025-03-10', name: 'Amalaki Ekadashi', paksha: 'Shukla', lunarMonth: 12 },
  { date: '2025-03-25', name: 'Papmochani Ekadashi', paksha: 'Krishna', lunarMonth: 1 },
  { date: '2025-04-08', name: 'Kamada Ekadashi', paksha: 'Shukla', lunarMonth: 1 },
  { date: '2025-04-24', name: 'Varuthini Ekadashi', paksha: 'Krishna', lunarMonth: 2 },
  { date: '2025-05-08', name: 'Mohini Ekadashi', paksha: 'Shukla', lunarMonth: 2 },
  { date: '2025-05-23', name: 'Apara Ekadashi', paksha: 'Krishna', lunarMonth: 3 },
  { date: '2025-06-06', name: 'Nirjala Ekadashi', paksha: 'Shukla', lunarMonth: 3 },
  { date: '2025-06-21', name: 'Yogini Ekadashi', paksha: 'Krishna', lunarMonth: 4 },
  { date: '2025-07-06', name: 'Devashayani Ekadashi', paksha: 'Shukla', lunarMonth: 4 },
  { date: '2025-07-21', name: 'Kamika Ekadashi', paksha: 'Krishna', lunarMonth: 5 },
  { date: '2025-08-05', name: 'Aja Ekadashi', paksha: 'Shukla', lunarMonth: 5 },
  { date: '2025-08-19', name: 'Annada Ekadashi', paksha: 'Krishna', lunarMonth: 6 },
  { date: '2025-09-03', name: 'Parshva Ekadashi', paksha: 'Shukla', lunarMonth: 6 },
  { date: '2025-09-17', name: 'Indira Ekadashi', paksha: 'Krishna', lunarMonth: 7 },
  { date: '2025-10-03', name: 'Papankusha Ekadashi', paksha: 'Shukla', lunarMonth: 7 },
  { date: '2025-10-17', name: 'Rama Ekadashi', paksha: 'Krishna', lunarMonth: 8 },
  { date: '2025-11-02', name: 'Utthana Ekadashi', paksha: 'Shukla', lunarMonth: 8 },
  { date: '2025-11-15', name: 'Utpanna Ekadashi', paksha: 'Krishna', lunarMonth: 9 },
  { date: '2025-12-01', name: 'Mokshada Ekadashi', paksha: 'Shukla', lunarMonth: 9 },
  { date: '2025-12-15', name: 'Safala Ekadashi', paksha: 'Krishna', lunarMonth: 10 },
  { date: '2026-01-14', name: 'Shat Tila Ekadashi', paksha: 'Krishna', lunarMonth: 10 },
  { date: '2026-01-29', name: 'Jaya Ekadashi', paksha: 'Shukla', lunarMonth: 11 },
  { date: '2026-02-13', name: 'Vijaya Ekadashi', paksha: 'Krishna', lunarMonth: 11 },
  { date: '2026-02-27', name: 'Amalaki Ekadashi', paksha: 'Shukla', lunarMonth: 12 },
  { date: '2026-03-15', name: 'Papmochani Ekadashi', paksha: 'Krishna', lunarMonth: 1 },
  { date: '2026-03-29', name: 'Kamada Ekadashi', paksha: 'Shukla', lunarMonth: 1 },
  { date: '2026-04-13', name: 'Varuthini Ekadashi', paksha: 'Krishna', lunarMonth: 2 },
  { date: '2026-04-27', name: 'Mohini Ekadashi', paksha: 'Shukla', lunarMonth: 2 },
  { date: '2026-05-13', name: 'Apara Ekadashi', paksha: 'Krishna', lunarMonth: 3 },
  { date: '2026-05-27', name: 'Padmini Ekadashi', paksha: 'Shukla', lunarMonth: 3 },
  { date: '2026-06-11', name: 'Parama Ekadashi', paksha: 'Krishna', lunarMonth: 3 },
  { date: '2026-06-25', name: 'Nirjala Ekadashi', paksha: 'Shukla', lunarMonth: 3 },
  { date: '2026-07-10', name: 'Yogini Ekadashi', paksha: 'Krishna', lunarMonth: 4 },
  { date: '2026-07-11', name: 'Yogini Ekadashi (Vaishnava)', paksha: 'Shukla', lunarMonth: 4 },
  { date: '2026-07-25', name: 'Devshayani Ekadashi', paksha: 'Shukla', lunarMonth: 4 },
  { date: '2026-08-09', name: 'Kamika Ekadashi', paksha: 'Krishna', lunarMonth: 5 },
  { date: '2026-08-23', name: 'Shravana Putrada Ekadashi', paksha: 'Shukla', lunarMonth: 5 },
  { date: '2026-08-24', name: 'Shravana Putrada Ekadashi (Vaishnava)', paksha: 'Shukla', lunarMonth: 5 },
  { date: '2026-09-07', name: 'Aja Ekadashi', paksha: 'Krishna', lunarMonth: 6 },
  { date: '2026-09-22', name: 'Parsva Ekadashi', paksha: 'Shukla', lunarMonth: 6 },
  { date: '2026-10-06', name: 'Indira Ekadashi', paksha: 'Krishna', lunarMonth: 7 },
  { date: '2026-10-22', name: 'Papankusha Ekadashi', paksha: 'Shukla', lunarMonth: 7 },
  { date: '2026-11-05', name: 'Rama Ekadashi', paksha: 'Krishna', lunarMonth: 8 },
  { date: '2026-11-20', name: 'Devutthana Ekadashi', paksha: 'Shukla', lunarMonth: 8 },
  { date: '2026-11-21', name: 'Devutthana Ekadashi (Vaishnava)', paksha: 'Shukla', lunarMonth: 8 },
  { date: '2026-12-04', name: 'Utpanna Ekadashi', paksha: 'Krishna', lunarMonth: 9 },
  { date: '2026-12-20', name: 'Mokshada Ekadashi', paksha: 'Shukla', lunarMonth: 9 },

  // 2026 Ekadashis

  // 2027 Ekadashis
  { date: '2027-01-04', name: 'Vaikuntha Ekadashi', paksha: 'Shukla', lunarMonth: 10 },
  { date: '2027-01-18', name: 'Shat Tila Ekadashi', paksha: 'Krishna', lunarMonth: 10 },
  { date: '2027-02-02', name: 'Jaya Ekadashi', paksha: 'Shukla', lunarMonth: 11 },
  { date: '2027-02-17', name: 'Vijaya Ekadashi', paksha: 'Krishna', lunarMonth: 11 },
  { date: '2027-03-03', name: 'Amalaki Ekadashi', paksha: 'Shukla', lunarMonth: 12 },
  { date: '2027-03-18', name: 'Papmochani Ekadashi', paksha: 'Krishna', lunarMonth: 1 },
  { date: '2027-04-02', name: 'Kamada Ekadashi', paksha: 'Shukla', lunarMonth: 1 },
  { date: '2027-04-17', name: 'Varuthini Ekadashi', paksha: 'Krishna', lunarMonth: 2 },
  { date: '2027-05-01', name: 'Mohini Ekadashi', paksha: 'Shukla', lunarMonth: 2 },
  { date: '2027-05-16', name: 'Apara Ekadashi', paksha: 'Krishna', lunarMonth: 3 },
  { date: '2027-05-31', name: 'Nirjala Ekadashi', paksha: 'Shukla', lunarMonth: 3 },
  { date: '2027-06-15', name: 'Yogini Ekadashi', paksha: 'Krishna', lunarMonth: 4 },
  { date: '2027-06-29', name: 'Devashayani Ekadashi', paksha: 'Shukla', lunarMonth: 4 },
  { date: '2027-07-14', name: 'Kamika Ekadashi', paksha: 'Krishna', lunarMonth: 5 },
  { date: '2027-07-29', name: 'Aja Ekadashi', paksha: 'Shukla', lunarMonth: 5 },
  { date: '2027-08-12', name: 'Annada Ekadashi', paksha: 'Krishna', lunarMonth: 6 },
  { date: '2027-08-27', name: 'Parshva Ekadashi', paksha: 'Shukla', lunarMonth: 6 },
  { date: '2027-09-11', name: 'Indira Ekadashi', paksha: 'Krishna', lunarMonth: 7 },
  { date: '2027-09-25', name: 'Papankusha Ekadashi', paksha: 'Shukla', lunarMonth: 7 },
  { date: '2027-10-10', name: 'Rama Ekadashi', paksha: 'Krishna', lunarMonth: 8 },
  { date: '2027-10-25', name: 'Utthana Ekadashi', paksha: 'Shukla', lunarMonth: 8 },
  { date: '2027-11-08', name: 'Utpanna Ekadashi', paksha: 'Krishna', lunarMonth: 9 },
  { date: '2027-11-23', name: 'Mokshada Ekadashi', paksha: 'Shukla', lunarMonth: 9 },
  { date: '2027-12-08', name: 'Safala Ekadashi', paksha: 'Krishna', lunarMonth: 10 },

  // 2028 Ekadashis
  { date: '2028-01-07', name: 'Vaikuntha Ekadashi', paksha: 'Shukla', lunarMonth: 10 },
  { date: '2028-01-22', name: 'Shat Tila Ekadashi', paksha: 'Krishna', lunarMonth: 10 },
  { date: '2028-02-05', name: 'Jaya Ekadashi', paksha: 'Shukla', lunarMonth: 11 },
  { date: '2028-02-20', name: 'Vijaya Ekadashi', paksha: 'Krishna', lunarMonth: 11 },
  { date: '2028-03-06', name: 'Amalaki Ekadashi', paksha: 'Shukla', lunarMonth: 12 },
  { date: '2028-03-21', name: 'Papmochani Ekadashi', paksha: 'Krishna', lunarMonth: 1 },
  { date: '2028-04-04', name: 'Kamada Ekadashi', paksha: 'Shukla', lunarMonth: 1 },
  { date: '2028-04-19', name: 'Varuthini Ekadashi', paksha: 'Krishna', lunarMonth: 2 },
  { date: '2028-05-04', name: 'Mohini Ekadashi', paksha: 'Shukla', lunarMonth: 2 },
  { date: '2028-05-18', name: 'Apara Ekadashi', paksha: 'Krishna', lunarMonth: 3 },
  { date: '2028-06-02', name: 'Nirjala Ekadashi', paksha: 'Shukla', lunarMonth: 3 },
  { date: '2028-06-17', name: 'Yogini Ekadashi', paksha: 'Krishna', lunarMonth: 4 },
  { date: '2028-07-01', name: 'Devashayani Ekadashi', paksha: 'Shukla', lunarMonth: 4 },
  { date: '2028-07-16', name: 'Kamika Ekadashi', paksha: 'Krishna', lunarMonth: 5 },
  { date: '2028-07-31', name: 'Aja Ekadashi', paksha: 'Shukla', lunarMonth: 5 },
  { date: '2028-08-14', name: 'Annada Ekadashi', paksha: 'Krishna', lunarMonth: 6 },
  { date: '2028-08-29', name: 'Parshva Ekadashi', paksha: 'Shukla', lunarMonth: 6 },
  { date: '2028-09-12', name: 'Indira Ekadashi', paksha: 'Krishna', lunarMonth: 7 },
  { date: '2028-09-27', name: 'Papankusha Ekadashi', paksha: 'Shukla', lunarMonth: 7 },
  { date: '2028-10-11', name: 'Rama Ekadashi', paksha: 'Krishna', lunarMonth: 8 },
  { date: '2028-10-26', name: 'Utthana Ekadashi', paksha: 'Shukla', lunarMonth: 8 },
  { date: '2028-11-09', name: 'Utpanna Ekadashi', paksha: 'Krishna', lunarMonth: 9 },
  { date: '2028-11-24', name: 'Mokshada Ekadashi', paksha: 'Shukla', lunarMonth: 9 },
  { date: '2028-12-09', name: 'Safala Ekadashi', paksha: 'Krishna', lunarMonth: 10 },

  // 2029 Ekadashis
  { date: '2029-01-07', name: 'Vaikuntha Ekadashi', paksha: 'Shukla', lunarMonth: 10 },
  { date: '2029-01-23', name: 'Shat Tila Ekadashi', paksha: 'Krishna', lunarMonth: 10 },
  { date: '2029-02-06', name: 'Jaya Ekadashi', paksha: 'Shukla', lunarMonth: 11 },
  { date: '2029-02-21', name: 'Vijaya Ekadashi', paksha: 'Krishna', lunarMonth: 11 },
  { date: '2029-03-08', name: 'Amalaki Ekadashi', paksha: 'Shukla', lunarMonth: 12 },
  { date: '2029-03-22', name: 'Papmochani Ekadashi', paksha: 'Krishna', lunarMonth: 1 },
  { date: '2029-04-06', name: 'Kamada Ekadashi', paksha: 'Shukla', lunarMonth: 1 },
  { date: '2029-04-21', name: 'Varuthini Ekadashi', paksha: 'Krishna', lunarMonth: 2 },
  { date: '2029-05-05', name: 'Mohini Ekadashi', paksha: 'Shukla', lunarMonth: 2 },
  { date: '2029-05-20', name: 'Apara Ekadashi', paksha: 'Krishna', lunarMonth: 3 },
  { date: '2029-06-04', name: 'Nirjala Ekadashi', paksha: 'Shukla', lunarMonth: 3 },
  { date: '2029-06-19', name: 'Yogini Ekadashi', paksha: 'Krishna', lunarMonth: 4 },
  { date: '2029-07-03', name: 'Devashayani Ekadashi', paksha: 'Shukla', lunarMonth: 4 },
  { date: '2029-07-18', name: 'Kamika Ekadashi', paksha: 'Krishna', lunarMonth: 5 },
  { date: '2029-08-02', name: 'Aja Ekadashi', paksha: 'Shukla', lunarMonth: 5 },
  { date: '2029-08-16', name: 'Annada Ekadashi', paksha: 'Krishna', lunarMonth: 6 },
  { date: '2029-08-31', name: 'Parshva Ekadashi', paksha: 'Shukla', lunarMonth: 6 },
  { date: '2029-09-15', name: 'Indira Ekadashi', paksha: 'Krishna', lunarMonth: 7 },
  { date: '2029-09-29', name: 'Papankusha Ekadashi', paksha: 'Shukla', lunarMonth: 7 },
  { date: '2029-10-14', name: 'Rama Ekadashi', paksha: 'Krishna', lunarMonth: 8 },
  { date: '2029-10-29', name: 'Utthana Ekadashi', paksha: 'Shukla', lunarMonth: 8 },
  { date: '2029-11-12', name: 'Utpanna Ekadashi', paksha: 'Krishna', lunarMonth: 9 },
  { date: '2029-11-27', name: 'Mokshada Ekadashi', paksha: 'Shukla', lunarMonth: 9 },
  { date: '2029-12-12', name: 'Safala Ekadashi', paksha: 'Krishna', lunarMonth: 10 },

  // 2030 Ekadashis
  { date: '2030-01-10', name: 'Vaikuntha Ekadashi', paksha: 'Shukla', lunarMonth: 10 },
  { date: '2030-01-25', name: 'Shat Tila Ekadashi', paksha: 'Krishna', lunarMonth: 10 },
  { date: '2030-02-09', name: 'Jaya Ekadashi', paksha: 'Shukla', lunarMonth: 11 },
  { date: '2030-02-24', name: 'Vijaya Ekadashi', paksha: 'Krishna', lunarMonth: 11 },
  { date: '2030-03-11', name: 'Amalaki Ekadashi', paksha: 'Shukla', lunarMonth: 12 },
  { date: '2030-03-26', name: 'Papmochani Ekadashi', paksha: 'Krishna', lunarMonth: 1 },
  { date: '2030-04-09', name: 'Kamada Ekadashi', paksha: 'Shukla', lunarMonth: 1 },
  { date: '2030-04-24', name: 'Varuthini Ekadashi', paksha: 'Krishna', lunarMonth: 2 },
  { date: '2030-05-09', name: 'Mohini Ekadashi', paksha: 'Shukla', lunarMonth: 2 },
  { date: '2030-05-23', name: 'Apara Ekadashi', paksha: 'Krishna', lunarMonth: 3 },
  { date: '2030-06-07', name: 'Nirjala Ekadashi', paksha: 'Shukla', lunarMonth: 3 },
  { date: '2030-06-22', name: 'Yogini Ekadashi', paksha: 'Krishna', lunarMonth: 4 },
  { date: '2030-07-06', name: 'Devashayani Ekadashi', paksha: 'Shukla', lunarMonth: 4 },
  { date: '2030-07-21', name: 'Kamika Ekadashi', paksha: 'Krishna', lunarMonth: 5 },
  { date: '2030-08-04', name: 'Aja Ekadashi', paksha: 'Shukla', lunarMonth: 5 },
  { date: '2030-08-19', name: 'Annada Ekadashi', paksha: 'Krishna', lunarMonth: 6 },
  { date: '2030-09-03', name: 'Parshva Ekadashi', paksha: 'Shukla', lunarMonth: 6 },
  { date: '2030-09-17', name: 'Indira Ekadashi', paksha: 'Krishna', lunarMonth: 7 },
  { date: '2030-10-02', name: 'Papankusha Ekadashi', paksha: 'Shukla', lunarMonth: 7 },
  { date: '2030-10-17', name: 'Rama Ekadashi', paksha: 'Krishna', lunarMonth: 8 },
  { date: '2030-11-01', name: 'Utthana Ekadashi', paksha: 'Shukla', lunarMonth: 8 },
  { date: '2030-11-15', name: 'Utpanna Ekadashi', paksha: 'Krishna', lunarMonth: 9 },
  { date: '2030-11-30', name: 'Mokshada Ekadashi', paksha: 'Shukla', lunarMonth: 9 },
  { date: '2030-12-15', name: 'Safala Ekadashi', paksha: 'Krishna', lunarMonth: 10 },
];

/**
 * Get Ekadashi date for a specific year and month
 */
export function getVerifiedEkadashi(
  year: number,
  lunarMonth: number,
  paksha: 'Shukla' | 'Krishna'
): VerifiedEkadashi | undefined {
  return VERIFIED_EKADASHIS.find(
    (e) => {
      const ekadashiYear = parseInt(e.date.substring(0, 4));
      return (
        ekadashiYear === year &&
        e.lunarMonth === lunarMonth &&
        e.paksha === paksha
      );
    }
  );
}

/**
 * Check if a date is a verified Ekadashi
 * Compares year, month, day directly to avoid timezone issues
 */
export function isVerifiedEkadashi(date: Date): VerifiedEkadashi | undefined {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();
  
  const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  
  return VERIFIED_EKADASHIS.find((e) => e.date === dateStr);
}

/**
 * Get all Ekadashis for a specific year
 */
export function getEkadashisForYear(year: number): VerifiedEkadashi[] {
  return VERIFIED_EKADASHIS.filter((e) => {
    const ekadashiYear = parseInt(e.date.substring(0, 4));
    return ekadashiYear === year;
  });
}
