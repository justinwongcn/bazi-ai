import { useMemo } from 'react';
import { Gender, HeavenStem, SolarTime } from 'tyme4ts';
import type { BaseParams } from './useBaseParams';
import { parseBool, parseDateSafe } from './useBaseParams';
import { getAdjustedDate } from '../services/baziService';

export interface BirthInfo {
  gender: Gender;
  birthSolarTime: SolarTime;
  pillars: {
    year: string;
    month: string;
    day: string;
    hour: string;
  };
  dayStem: HeavenStem;
  dayLabel: string;
  birthYear: number;
}

export function useBirthInfo(baseParams: BaseParams): BirthInfo {
  return useMemo(() => {
    const fallbackDate = new Date();
    const baseDate = parseDateSafe(baseParams.date, fallbackDate);

    const longitude = Number(baseParams.longitude);
    const latitude = Number(baseParams.latitude);

    const adjustedDate = getAdjustedDate(baseDate, {
      longitude,
      latitude,
      isTrueSolar: parseBool(baseParams.isTrueSolar, true),
      dst: parseBool(baseParams.dst, false),
      earlyRatHour: parseBool(baseParams.earlyRatHour, true),
    });

    const gender = baseParams.sex === '0' ? Gender.WOMAN : Gender.MAN;

    const solarTime = SolarTime.fromYmdHms(
      adjustedDate.getFullYear(),
      adjustedDate.getMonth() + 1,
      adjustedDate.getDate(),
      adjustedDate.getHours(),
      adjustedDate.getMinutes(),
      0,
    );

    const eightChar = solarTime.getLunarHour().getEightChar();
    const yearPillar = eightChar.getYear().getName();
    const monthPillar = eightChar.getMonth().getName();
    const dayPillar = eightChar.getDay().getName();
    const hourPillar = eightChar.getHour().getName();

    const dayStem = HeavenStem.fromName(dayPillar.charAt(0));
    const dayLabel = gender === Gender.MAN ? '元男' : '元女';

    return {
      gender,
      birthSolarTime: solarTime,
      pillars: { year: yearPillar, month: monthPillar, day: dayPillar, hour: hourPillar },
      dayStem,
      dayLabel,
      birthYear: solarTime.getYear(),
    };
  }, [baseParams]);
}
