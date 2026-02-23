import { useMemo } from 'react';
import { SolarTime, Gender } from 'tyme4ts';
import type { BaseParams } from './useBaseParams';
import { parseBool, parseDateSafe } from './useBaseParams';
import { getAdjustedDate } from '../services/baziService';

export interface SolarTimeResult {
  solarTime: SolarTime;
  gender: Gender;
  birthYear: number;
}

export function useSolarTime(baseParams: BaseParams): SolarTimeResult {
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

    return {
      solarTime,
      gender,
      birthYear: solarTime.getYear(),
    };
  }, [baseParams]);
}
