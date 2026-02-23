import { EightChar, SixtyCycle, SolarTime } from 'tyme4ts';
import {
  SIXTY_CYCLE,
  HOUR_BRANCH_TO_EVEN_HOUR,
  HOUR_BRANCH_NAMES,
  HOUR_TO_BRANCH_MAP
} from '../constants/ganzhi';

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

export { HOUR_BRANCH_TO_EVEN_HOUR, HOUR_BRANCH_NAMES };

export function getEvenHourFromBranch(branch: string): number {
  return HOUR_BRANCH_TO_EVEN_HOUR[branch] ?? 0;
}

export function getHourBranchDisplayName(branch: string): string {
  return HOUR_BRANCH_NAMES[branch] ?? branch;
}

export function validatePillar(pillar: string): boolean {
  if (!pillar || pillar.length !== 2) return false;
  return SIXTY_CYCLE.includes(pillar);
}

export function validateSearchParams(params: BaziSearchParams): string | null {
  if (!validatePillar(params.yearPillar)) {
    return '年柱格式不正确或不存在（如甲丑不存在），请检查输入';
  }
  if (!validatePillar(params.monthPillar)) {
    return '月柱格式不正确或不存在，请检查输入';
  }
  if (!validatePillar(params.dayPillar)) {
    return '日柱格式不正确或不存在，请检查输入';
  }
  if (!validatePillar(params.hourPillar)) {
    return '时柱格式不正确或不存在，请检查输入';
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
  return HOUR_TO_BRANCH_MAP[hour] ?? '子';
}
