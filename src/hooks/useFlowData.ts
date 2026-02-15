import { useMemo } from 'react';
import type { BirthInfo } from './useBirthInfo';
import type { FortuneData } from './useFortuneData';
import { getFlowYears, getFlowMonths, getFlowDays, getFlowHours, findDecadeIndex } from '../services/baziService';

export interface SelectionState {
  decadeIndex: number;
  flowYearIndex: number;
  smallFortuneIndex: number;
  flowMonthIndex: number;
  flowDayIndex: number;
  flowHourIndex: number;
}

export interface FlowData {
  flowYears: ReturnType<typeof getFlowYears>;
  flowMonths: ReturnType<typeof getFlowMonths>;
  flowDays: ReturnType<typeof getFlowDays>;
  flowHours: ReturnType<typeof getFlowHours>;
}

export function useInitialSelection(
  birthInfo: BirthInfo,
  fortuneData: FortuneData
): SelectionState {
  return useMemo(() => {
    const nowYear = new Date().getFullYear();
    const currentAge = nowYear - birthInfo.birthYear + 1;
    const startAge = fortuneData.childLimit.getYearCount() + 1;

    if (currentAge < startAge && fortuneData.smallFortunes.length > 0) {
      return {
        decadeIndex: -1,
        smallFortuneIndex: Math.min(currentAge - 1, fortuneData.smallFortunes.length - 1),
        flowYearIndex: 0,
        flowMonthIndex: 0,
        flowDayIndex: 0,
        flowHourIndex: 0,
      };
    }

    const idx = findDecadeIndex(fortuneData.decades, nowYear);
    const decadeIndex = idx >= 0 ? idx : 0;
    const decade = fortuneData.decades[decadeIndex];
    const startY = decade.getStartSixtyCycleYear().getYear();
    const flowIdx = Math.min(Math.max(nowYear - startY, 0), 9);

    return {
      decadeIndex,
      smallFortuneIndex: 0,
      flowYearIndex: flowIdx,
      flowMonthIndex: new Date().getMonth(),
      flowDayIndex: new Date().getDate() - 1,
      flowHourIndex: new Date().getHours(),
    };
  }, [birthInfo, fortuneData]);
}

export function useFlowData(
  birthInfo: BirthInfo,
  fortuneData: FortuneData,
  selection: SelectionState
): FlowData {
  const selectedDecade = fortuneData.decades[Math.min(Math.max(selection.decadeIndex, 0), fortuneData.decades.length - 1)];

  const flowYears = useMemo(() => {
    if (selection.decadeIndex < 0 && fortuneData.smallFortunes.length > 0) {
      const startYear = birthInfo.birthYear;
      const count = Math.min(fortuneData.smallFortunes.length, 10);
      return getFlowYears(startYear, count);
    }
    const startYear = selectedDecade.getStartSixtyCycleYear().getYear();
    return getFlowYears(startYear, 10);
  }, [birthInfo.birthYear, selectedDecade, selection.decadeIndex, fortuneData.smallFortunes.length]);

  const selectedFlowYear = flowYears[Math.min(Math.max(selection.flowYearIndex, 0), flowYears.length - 1)];

  const flowMonths = useMemo(() => {
    if (!selectedFlowYear?.year) return [];
    return getFlowMonths(selectedFlowYear.year);
  }, [selectedFlowYear]);

  const selectedFlowMonth = flowMonths[Math.min(Math.max(selection.flowMonthIndex, 0), flowMonths.length - 1)];

  const flowDays = useMemo(() => {
    if (!selectedFlowYear?.year || !selectedFlowMonth?.month) return [];
    return getFlowDays(selectedFlowYear.year, selectedFlowMonth.month);
  }, [selectedFlowYear, selectedFlowMonth]);

  const selectedFlowDay = flowDays[Math.min(Math.max(selection.flowDayIndex, 0), flowDays.length - 1)];

  const flowHours = useMemo(() => {
    if (!selectedFlowYear?.year || !selectedFlowMonth?.month || !selectedFlowDay?.day) return [];
    return getFlowHours(selectedFlowYear.year, selectedFlowMonth.month, selectedFlowDay.day);
  }, [selectedFlowYear, selectedFlowMonth, selectedFlowDay]);

  return { flowYears, flowMonths, flowDays, flowHours };
}
