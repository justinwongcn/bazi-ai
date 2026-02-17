import { useCallback, useMemo, useRef } from 'react';
import { useBaseParams } from './useBaseParams';
import { useBirthInfo, useFortuneData, useFlowData, useInitialSelection } from '../hooks';
import { buildPillarInfo, getWuXingStatus } from '../services';
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

function buildColumns(
  birthInfo: ReturnType<typeof useBirthInfo>,
  selectedDecadeIndex: number,
  selectedDecade: DecadeFortune | null,
  selectedSmallFortune: ReturnType<typeof useFortuneData>['smallFortunes'][number] | null,
  selectedFlowYear: { pillar: string } | undefined,
  selectedFlowMonth: { pillar: string } | undefined,
  selectedFlowDay: { pillar: string } | undefined,
  selectedFlowHour: { pillar: string } | undefined
): ProPageColumns {
  const defaultPillar = buildPillarInfo(birthInfo.pillars.hour, birthInfo.dayStem, null);

  const liunianInfo = selectedFlowYear
    ? buildPillarInfo(selectedFlowYear.pillar, birthInfo.dayStem, null)
    : defaultPillar;

  const dayunInfo = selectedDecadeIndex >= 0 && selectedDecade
    ? buildPillarInfo(selectedDecade.getName(), birthInfo.dayStem, null)
    : selectedSmallFortune
      ? buildPillarInfo(selectedSmallFortune.pillar, birthInfo.dayStem, null)
      : defaultPillar;

  return {
    liunianInfo,
    dayunInfo,
    yearInfo: buildPillarInfo(birthInfo.pillars.year, birthInfo.dayStem, null),
    monthInfo: buildPillarInfo(birthInfo.pillars.month, birthInfo.dayStem, null),
    dayInfo: buildPillarInfo(birthInfo.pillars.day, birthInfo.dayStem, birthInfo.dayLabel),
    hourInfo: buildPillarInfo(birthInfo.pillars.hour, birthInfo.dayStem, null),
    liuyueInfo: selectedFlowMonth
      ? buildPillarInfo(selectedFlowMonth.pillar, birthInfo.dayStem, null)
      : defaultPillar,
    liuriInfo: selectedFlowDay
      ? buildPillarInfo(selectedFlowDay.pillar, birthInfo.dayStem, null)
      : defaultPillar,
    liushiInfo: selectedFlowHour
      ? buildPillarInfo(selectedFlowHour.pillar, birthInfo.dayStem, null)
      : defaultPillar,
  };
}

function buildTableColumns(
  columns: ProPageColumns,
  selectedDecadeIndex: number,
  showFlowDay: boolean,
  showFlowHour: boolean
): TableColumn[] {
  return [
    ...(showFlowHour ? [{ key: 'liushi', label: '流时', pillar: columns.liushiInfo.name }] : []),
    ...(showFlowDay ? [{ key: 'liuri', label: '流日', pillar: columns.liuriInfo.name }] : []),
    { key: 'liuyue', label: '流月', pillar: columns.liuyueInfo.name },
    { key: 'liunian', label: '流年', pillar: columns.liunianInfo.name },
    { key: 'dayun', label: selectedDecadeIndex < 0 ? '小运' : '大运', pillar: columns.dayunInfo.name },
    { key: 'year', label: '年柱', pillar: columns.yearInfo.name },
    { key: 'month', label: '月柱', pillar: columns.monthInfo.name },
    { key: 'day', label: '日柱', pillar: columns.dayInfo.name },
    { key: 'hour', label: '时柱', pillar: columns.hourInfo.name },
  ];
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
  const birthInfo = useBirthInfo(baseParams);
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

  const selectedDecade = fortuneData.decades[Math.min(Math.max(selection.decadeIndex, 0), fortuneData.decades.length - 1)];
  const selectedSmallFortune = fortuneData.smallFortunes.length > 0
    ? fortuneData.smallFortunes[Math.min(Math.max(selection.smallFortuneIndex, 0), fortuneData.smallFortunes.length - 1)]
    : null;
  const selectedFlowYear = flowData.flowYears[Math.min(Math.max(selection.flowYearIndex, 0), flowData.flowYears.length - 1)];
  const selectedFlowMonth = flowData.flowMonths[Math.min(Math.max(selection.flowMonthIndex, 0), flowData.flowMonths.length - 1)];
  const selectedFlowDay = flowData.flowDays[Math.min(Math.max(selection.flowDayIndex, 0), flowData.flowDays.length - 1)];
  const selectedFlowHour = flowData.flowHours[Math.min(Math.max(selection.flowHourIndex, 0), flowData.flowHours.length - 1)];

  const syncToNowRef = useRef<{ dayIndex: number; hourIndex: number } | null>(null);

  const columns = useMemo(() => {
    return buildColumns(
      birthInfo,
      selection.decadeIndex,
      selectedDecade,
      selectedSmallFortune,
      selectedFlowYear,
      selectedFlowMonth,
      selectedFlowDay,
      selectedFlowHour
    );
  }, [birthInfo, selection.decadeIndex, selectedDecade, selectedSmallFortune, selectedFlowYear, selectedFlowMonth, selectedFlowDay, selectedFlowHour]);

  const tableColumns = useMemo(() => {
    return buildTableColumns(columns, selection.decadeIndex, showFlowDay, showFlowHour);
  }, [columns, selection.decadeIndex, showFlowDay, showFlowHour]);

  const wuXingStatus = useMemo(() => {
    const monthPillar = birthInfo.pillars.month;
    if (!monthPillar) return ['水旺', '木相', '金休', '土囚', '火死'];
    const branch = monthPillar.charAt(1);
    return getWuXingStatus(branch);
  }, [birthInfo.pillars.month]);

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

  const startAge = selection.decadeIndex >= 0 ? selectedDecade.getStartAge() : fortuneData.childLimit.getYearCount() + 1;
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
