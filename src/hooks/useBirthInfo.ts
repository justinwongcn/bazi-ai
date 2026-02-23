import { useMemo } from 'react';
import { Gender, HeavenStem, SolarTime } from 'tyme4ts';
import type { SolarTimeResult } from './useSolarTime';

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

export function useBirthInfo(solarTimeResult: SolarTimeResult): BirthInfo {
  return useMemo(() => {
    const { solarTime, gender, birthYear } = solarTimeResult;

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
      birthYear,
    };
  }, [solarTimeResult]);
}
