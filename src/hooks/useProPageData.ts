import { useCallback, useMemo, useRef } from 'react';
import { useBaseParams } from './useBaseParams';
import { useBirthInfo, useFortuneData, useFlowData, useInitialSelection, useSolarTime, useBaziCalc } from '../hooks';
import { buildPillarInfo } from '../services';
import { formatSolarTime } from '../utils/format';
import { DecadeFortune } from 'tyme4ts';

export interface TableColumn {
  key: string;
  label: string;
  pillar: string;
}

export interface ProPageColumns {
  liunianInfo: ReturnType<typeof buildPillarInfo>;
  dayunInfo: ReturnType<typeof buildPillarInfo>;
  yearInfo: ReturnType<typeof buildPillarInfo>;
  monthInfo: ReturnType<typeof buildPillarInfo>;
  dayInfo: ReturnType<typeof buildPillarInfo>;
  hourInfo: ReturnType<typeof buildPillarInfo>;
  liuyueInfo: ReturnType<typeof buildPillarInfo>;
  liuriInfo: ReturnType<typeof buildPillarInfo>;
  liushiInfo: ReturnType<typeof buildPillarInfo>;
}

export interface BirthInfoDisplay {
  lunarText: string;
  solarText: string;
  sexText: string;
}

export interface UseProPageDataResult {
  baseParams: ReturnType<typeof useBaseParams>;
  birthInfo: ReturnType<typeof useBirthInfo>;
  fortuneData: ReturnType<typeof useFortuneData>;
  flowData: ReturnType<typeof useFlowData>;
  initialSelection: ReturnType<typeof useInitialSelection>;
  columns: ProPageColumns;
  tableColumns: TableColumn[];
  birthInfoDisplay: BirthInfoDisplay;
  wuXingStatus: string[];
  startAge: number;
  xiaoyunStartYear: number;
  xiaoyunAgeText: string;
  goToNow: () => void;
  selectedDecade: DecadeFortune | null;
  selectedSmallFortune: ReturnType<typeof useFortuneData>['smallFortunes'][number] | null;
}

interface SelectionState {
  decadeIndex: number;
  flowYearIndex: number;
  smallFortuneIndex: number;
  flowMonthIndex: number;
  flowDayIndex: number;
  flowHourIndex: number;
}

export function useProPageData(
  selection: SelectionState,
  showFlowDay: boolean,
  showFlowHour: boolean,
  setSelection: (updates: Partial<SelectionState>) => void,
  setShowFlowDay: (show: boolean) => void,
  setShowFlowHour: (show: boolean) => void
): UseProPageDataResult {
  const baseParams = useBaseParams();
  const solarTimeResult = useSolarTime(baseParams);
  const birthInfo = useBirthInfo(solarTimeResult);
  const fortuneData = useFortuneData(birthInfo);
  const initialSelection = useInitialSelection(birthInfo, fortuneData);

  const flowData = useFlowData(birthInfo, fortuneData, {
    decadeIndex: selection.decadeIndex,
    flowYearIndex: selection.flowYearIndex,
    smallFortuneIndex: selection.smallFortuneIndex,
    flowMonthIndex: selection.flowMonthIndex,
    flowDayIndex: selection.flowDayIndex,
    flowHourIndex: selection.flowHourIndex,
  });

  const {
    selectedDecade,
    selectedSmallFortune,
    columns,
    tableColumns,
    wuXingStatus
  } = useBaziCalc(birthInfo, fortuneData, flowData, selection, showFlowDay, showFlowHour);

  const syncToNowRef = useRef<{ dayIndex: number; hourIndex: number } | null>(null);

  const birthInfoDisplay = useMemo(() => {
    const solarTime = birthInfo.birthSolarTime;
    const lunarHour = solarTime.getLunarHour();
    const lunarDay = lunarHour.getLunarDay();
    const lunarMonth = lunarDay.getLunarMonth();
    const lunarYear = lunarMonth.getLunarYear();

    return {
      lunarText: `${lunarYear.getName()}年${lunarMonth.getName()}${lunarDay.getName()} ${lunarHour.getName()}`,
      solarText: formatSolarTime(solarTime),
      sexText: baseParams.sex === '1' ? '乾造' : '坤造',
    };
  }, [birthInfo.birthSolarTime, baseParams.sex]);

  const startAge = selection.decadeIndex >= 0 && selectedDecade ? selectedDecade.getStartAge() : fortuneData.childLimit.getYearCount() + 1;
  const xiaoyunStartYear = birthInfo.birthYear;
  const xiaoyunAgeText = `1~${Math.max(startAge - 1, 1)}岁 `;

  const goToNow = useCallback(() => {
    const now = new Date();
    const nowYear = now.getFullYear();
    const nowMonth = now.getMonth();
    const nowDay = now.getDate();
    const nowHour = now.getHours();

    const currentAge = nowYear - birthInfo.birthYear + 1;
    const childLimitStartAge = fortuneData.childLimit.getYearCount() + 1;

    if (currentAge < childLimitStartAge && fortuneData.smallFortunes.length > 0) {
      setSelection({
        decadeIndex: -1,
        smallFortuneIndex: Math.min(currentAge - 1, fortuneData.smallFortunes.length - 1),
        flowYearIndex: Math.min(currentAge - 1, fortuneData.smallFortunes.length - 1),
        flowMonthIndex: nowMonth,
      });
      syncToNowRef.current = { dayIndex: nowDay - 1, hourIndex: nowHour };
      setShowFlowDay(true);
      setShowFlowHour(true);
      return;
    }

    const decadeIdx = fortuneData.decades.findIndex((d: DecadeFortune) => {
      const startY = d.getStartSixtyCycleYear().getYear();
      const endY = d.getEndSixtyCycleYear().getYear();
      return nowYear >= startY && nowYear <= endY;
    });

    if (decadeIdx >= 0) {
      const decade = fortuneData.decades[decadeIdx];
      const startY = decade.getStartSixtyCycleYear().getYear();
      const flowIdx = Math.min(Math.max(nowYear - startY, 0), 9);

      setSelection({
        decadeIndex: decadeIdx,
        flowYearIndex: flowIdx,
        flowMonthIndex: nowMonth,
      });
      syncToNowRef.current = { dayIndex: nowDay - 1, hourIndex: nowHour };
      setShowFlowDay(true);
      setShowFlowHour(true);
    }
  }, [fortuneData.decades, fortuneData.childLimit, fortuneData.smallFortunes, birthInfo.birthYear, setSelection, setShowFlowDay, setShowFlowHour]);

  return {
    baseParams,
    birthInfo,
    fortuneData,
    flowData,
    initialSelection,
    columns,
    tableColumns,
    birthInfoDisplay,
    wuXingStatus,
    startAge,
    xiaoyunStartYear,
    xiaoyunAgeText,
    goToNow,
    selectedDecade,
    selectedSmallFortune,
  };
}
