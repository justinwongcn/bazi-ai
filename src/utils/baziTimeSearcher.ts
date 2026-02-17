import { EightChar, SixtyCycle, SolarTime } from 'tyme4ts';

export interface BaziSearchParams {
  yearPillar: string;
  monthPillar: string;
  dayPillar: string;
  hourPillar: string;
  startYear: number;
  endYear: number;
}

export interface BaziSearchResult {
  solarTime: Date;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  hourBranch: string;
  hourDisplayName: string;
  formattedTime: string;
  bazi: {
    year: string;
    month: string;
    day: string;
    hour: string;
  };
}

export const HOUR_BRANCH_TO_EVEN_HOUR: Record<string, number> = {
  '子': 0,
  '丑': 2,
  '寅': 4,
  '卯': 6,
  '辰': 8,
  '巳': 10,
  '午': 12,
  '未': 14,
  '申': 16,
  '酉': 18,
  '戌': 20,
  '亥': 22
};

export const HOUR_BRANCH_NAMES: Record<string, string> = {
  '子': '子时(23:00-01:00)',
  '丑': '丑时(01:00-03:00)',
  '寅': '寅时(03:00-05:00)',
  '卯': '卯时(05:00-07:00)',
  '辰': '辰时(07:00-09:00)',
  '巳': '巳时(09:00-11:00)',
  '午': '午时(11:00-13:00)',
  '未': '未时(13:00-15:00)',
  '申': '申时(15:00-17:00)',
  '酉': '酉时(17:00-19:00)',
  '戌': '戌时(19:00-21:00)',
  '亥': '亥时(21:00-23:00)'
};

export function getEvenHourFromBranch(branch: string): number {
  return HOUR_BRANCH_TO_EVEN_HOUR[branch] ?? 0;
}

export function getHourBranchDisplayName(branch: string): string {
  return HOUR_BRANCH_NAMES[branch] ?? branch;
}

export function validatePillar(pillar: string): boolean {
  if (!pillar || pillar.length !== 2) return false;
  const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  return stems.includes(pillar[0]) && branches.includes(pillar[1]);
}

export function validateSearchParams(params: BaziSearchParams): string | null {
  if (!validatePillar(params.yearPillar)) {
    return '年柱格式不正确，应为如"甲子"格式';
  }
  if (!validatePillar(params.monthPillar)) {
    return '月柱格式不正确，应为如"丙寅"格式';
  }
  if (!validatePillar(params.dayPillar)) {
    return '日柱格式不正确，应为如"甲子"格式';
  }
  if (!validatePillar(params.hourPillar)) {
    return '时柱格式不正确，应为如"甲子"格式';
  }
  if (params.startYear > params.endYear) {
    return '起始年份不能大于结束年份';
  }
  return null;
}

export function searchBaziTimes(params: BaziSearchParams): BaziSearchResult[] {
  const validationError = validateSearchParams(params);
  if (validationError) {
    throw new Error(validationError);
  }

  const yearPillar = SixtyCycle.fromName(params.yearPillar);
  const monthPillar = SixtyCycle.fromName(params.monthPillar);
  const dayPillar = SixtyCycle.fromName(params.dayPillar);
  const hourPillar = SixtyCycle.fromName(params.hourPillar);

  const eightChar = new EightChar(yearPillar, monthPillar, dayPillar, hourPillar);

  const solarTimes: SolarTime[] = eightChar.getSolarTimes(params.startYear, params.endYear);

  return solarTimes.map((solarTime) => {
    const hourBranch = hourPillar.getEarthBranch().getName();
    const evenHour = getEvenHourFromBranch(hourBranch);
    const hourBranchDisplayName = getHourBranchDisplayName(hourBranch);

    const year = solarTime.getYear();
    const month = solarTime.getMonth();
    const day = solarTime.getDay();
    const hour = solarTime.getHour();
    const minute = solarTime.getMinute();

    const displayHour = evenHour.toString().padStart(2, '0');
    const displayMinute = '00';

    return {
      solarTime: new Date(year, month - 1, day, hour, minute),
      year,
      month,
      day,
      hour,
      minute,
      hourBranch,
      hourDisplayName: `${hourBranchDisplayName} → ${displayHour}:${displayMinute}`,
      formattedTime: `${year}年${month}月${day}日 ${displayHour}:${displayMinute}`,
      bazi: {
        year: params.yearPillar,
        month: params.monthPillar,
        day: params.dayPillar,
        hour: params.hourPillar
      }
    };
  });
}

export function formatSearchResult(result: BaziSearchResult): string {
  return `${result.formattedTime} (${result.hourDisplayName})`;
}

export function getHourBranchFromTime(hour: number): string {
  const hourToBranch: Record<number, string> = {
    23: '子', 0: '子',
    1: '丑', 2: '丑',
    3: '寅', 4: '寅',
    5: '卯', 6: '卯',
    7: '辰', 8: '辰',
    9: '巳', 10: '巳',
    11: '午', 12: '午',
    13: '未', 14: '未',
    15: '申', 16: '申',
    17: '酉', 18: '酉',
    19: '戌', 20: '戌',
    21: '亥', 22: '亥'
  };
  return hourToBranch[hour] ?? '子';
}
