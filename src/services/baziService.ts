import {
  ChildLimit,
  DecadeFortune,
  Gender,
  HeavenStem,
  SixtyCycle,
  SixtyCycleYear,
  SolarTime,
  YinYang,
} from 'tyme4ts';
import type { PillarData, HiddenStemInfo, FortuneItem } from '../types/bazi';
import { getElementColorClass } from './elementService';
import { SolarTimeUtil } from '../utils/solarTimeUtil';

export function buildPillarInfo(pillarName: string, dayStem: HeavenStem, dayLabel: string | null): PillarData {
  const sixty = SixtyCycle.fromName(pillarName);
  const stem = sixty.getHeavenStem();
  const branch = sixty.getEarthBranch();

  const hiddenCandidates = [
    branch.getHideHeavenStemMain(),
    branch.getHideHeavenStemMiddle(),
    branch.getHideHeavenStemResidual(),
  ].filter((x): x is HeavenStem => x !== null);

  const hiddenStems: HiddenStemInfo[] = hiddenCandidates.map((hs) => ({
    stem: hs.getName(),
    stemColor: getElementColorClass(hs.getName()),
    tenStarName: dayStem.getTenStar(hs).getName(),
  }));

  return {
    name: pillarName,
    stem: stem.getName(),
    branch: branch.getName(),
    stemColor: getElementColorClass(stem.getName()),
    branchColor: getElementColorClass(branch.getName()),
    tenStarName: dayLabel ?? dayStem.getTenStar(stem).getName(),
    hiddenStems,
    starLuck: dayStem.getTerrain(branch).getName(),
    selfSeat: stem.getTerrain(branch).getName(),
    empty: sixty.getExtraEarthBranches().map((b) => b.getName()).join(''),
    naYin: sixty.getSound().getName(),
    shenSha: [],
  };
}

export function buildYearPillar(year: number): string {
  return SixtyCycleYear.fromYear(year).getSixtyCycle().getName();
}

export function buildMonthPillar(year: number, month: number): string {
  const solarTime = SolarTime.fromYmdHms(year, month, 1, 12, 0, 0);
  const lunarDay = solarTime.getSolarDay().getLunarDay();
  const name = lunarDay.getMonthSixtyCycle().getName();
  return name.replace('月', '');
}

export function buildDayPillar(year: number, month: number, day: number): string {
  const solarDay = SolarTime.fromYmdHms(year, month, day, 12, 0, 0).getSolarDay();
  const sixtyCycleDay = solarDay.getSixtyCycleDay();
  const name = sixtyCycleDay.getName();
  return name.replace('日', '');
}

export function buildHourPillar(year: number, month: number, day: number, hour: number): string {
  const solarTime = SolarTime.fromYmdHms(year, month, day, hour, 0, 0);
  const sixtyCycleHour = solarTime.getSixtyCycleHour();
  return sixtyCycleHour.getName().replace('时', '');
}

export interface AdjustedDateOptions {
  longitude: number;
  latitude: number;
  isTrueSolar: boolean;
  dst: boolean;
  earlyRatHour: boolean;
}

export function getAdjustedDate(date: Date, opts: AdjustedDateOptions): Date {
  let adjusted = date;

  if (opts.dst) {
    adjusted = new Date(adjusted.getTime() + 60 * 60 * 1000);
  }

  if (opts.isTrueSolar) {
    const solarTimeUtil = SolarTimeUtil.initLocation(opts.longitude, opts.latitude);
    adjusted = solarTimeUtil.getTrueSolarTimeFromDate(adjusted);
  }

  if (opts.earlyRatHour && adjusted.getHours() === 23) {
    adjusted = new Date(adjusted.getTime() + 60 * 60 * 1000);
  }

  return adjusted;
}

export function getDecadeFortunes(solarTime: SolarTime, gender: Gender): {
  childLimit: ChildLimit;
  list: DecadeFortune[];
} {
  const childLimit = ChildLimit.fromSolarTime(solarTime, gender);
  const startDecade = childLimit.getStartDecadeFortune();
  const list: DecadeFortune[] = [];
  for (let i = 0; i < 10; i += 1) {
    list.push(startDecade.next(i));
  }
  return { childLimit, list };
}

export function getSmallFortunes(
  hourPillar: string,
  yearPillar: string,
  gender: Gender,
  childLimit: ChildLimit,
  birthYear: number
): FortuneItem[] {
  const startAge = childLimit.getYearCount() + 1;
  const list: FortuneItem[] = [];
  const hourCycle = SixtyCycle.fromName(hourPillar);
  const yearStem = HeavenStem.fromName(yearPillar.charAt(0));
  const yearYinYang = yearStem.getYinYang();
  const isForward = (yearYinYang === YinYang.YANG && gender === Gender.MAN) ||
    (yearYinYang === YinYang.YIN && gender === Gender.WOMAN);

  for (let age = 1; age < startAge; age += 1) {
    const offset = isForward ? age : -age;
    const pillar = hourCycle.next(offset);
    list.push({
      age,
      year: birthYear + age,
      pillar: pillar.getName(),
    });
  }
  return list;
}

export function getFlowYears(startYear: number, count: number = 10): FortuneItem[] {
  return Array.from({ length: count }, (_, i) => ({
    year: startYear + i,
    pillar: buildYearPillar(startYear + i),
  }));
}

export function getFlowMonths(year: number): FortuneItem[] {
  return Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    pillar: buildMonthPillar(year, i + 1),
  }));
}

export function getFlowDays(year: number, month: number): FortuneItem[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    pillar: buildDayPillar(year, month, i + 1),
  }));
}

export function getFlowHours(year: number, month: number, day: number): FortuneItem[] {
  return Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    pillar: buildHourPillar(year, month, day, i),
  }));
}

export function findDecadeIndex(decades: DecadeFortune[], targetYear: number): number {
  return decades.findIndex((d) => {
    const startY = d.getStartSixtyCycleYear().getYear();
    const endY = d.getEndSixtyCycleYear().getYear();
    return targetYear >= startY && targetYear <= endY;
  });
}
