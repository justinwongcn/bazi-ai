import { useMemo } from 'react';
import { buildPillarInfo, getWuXingStatus } from '../services';
import type { BirthInfo } from './useBirthInfo';
import type { FortuneData } from './useFortuneData';
import type { FlowData, SelectionState } from './useFlowData';

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

export function useBaziCalc(
  birthInfo: BirthInfo,
  fortuneData: FortuneData,
  flowData: FlowData,
  selection: SelectionState,
  showFlowDay: boolean,
  showFlowHour: boolean
) {
  const selectedDecade = useMemo(() => 
    fortuneData.decades[Math.min(Math.max(selection.decadeIndex, 0), fortuneData.decades.length - 1)],
    [fortuneData.decades, selection.decadeIndex]
  );

  const selectedSmallFortune = useMemo(() => 
    fortuneData.smallFortunes.length > 0
      ? fortuneData.smallFortunes[Math.min(Math.max(selection.smallFortuneIndex, 0), fortuneData.smallFortunes.length - 1)]
      : null,
    [fortuneData.smallFortunes, selection.smallFortuneIndex]
  );

  const selectedFlowYear = useMemo(() => 
    flowData.flowYears[Math.min(Math.max(selection.flowYearIndex, 0), flowData.flowYears.length - 1)],
    [flowData.flowYears, selection.flowYearIndex]
  );
  
  const selectedFlowMonth = useMemo(() => 
    flowData.flowMonths[Math.min(Math.max(selection.flowMonthIndex, 0), flowData.flowMonths.length - 1)],
    [flowData.flowMonths, selection.flowMonthIndex]
  );
  
  const selectedFlowDay = useMemo(() => 
    flowData.flowDays[Math.min(Math.max(selection.flowDayIndex, 0), flowData.flowDays.length - 1)],
    [flowData.flowDays, selection.flowDayIndex]
  );
  
  const selectedFlowHour = useMemo(() => 
    flowData.flowHours[Math.min(Math.max(selection.flowHourIndex, 0), flowData.flowHours.length - 1)],
    [flowData.flowHours, selection.flowHourIndex]
  );

  const columns = useMemo(() => {
    const defaultPillar = buildPillarInfo(birthInfo.pillars.hour, birthInfo.dayStem, null);

    const liunianInfo = selectedFlowYear
      ? buildPillarInfo(selectedFlowYear.pillar, birthInfo.dayStem, null)
      : defaultPillar;

    const dayunInfo = selection.decadeIndex >= 0 && selectedDecade
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
  }, [birthInfo, selection.decadeIndex, selectedDecade, selectedSmallFortune, selectedFlowYear, selectedFlowMonth, selectedFlowDay, selectedFlowHour]);

  const tableColumns = useMemo(() => {
    return [
      ...(showFlowHour ? [{ key: 'liushi', label: '流时', pillar: columns.liushiInfo.name }] : []),
      ...(showFlowDay ? [{ key: 'liuri', label: '流日', pillar: columns.liuriInfo.name }] : []),
      { key: 'liuyue', label: '流月', pillar: columns.liuyueInfo.name },
      { key: 'liunian', label: '流年', pillar: columns.liunianInfo.name },
      { key: 'dayun', label: selection.decadeIndex < 0 ? '小运' : '大运', pillar: columns.dayunInfo.name },
      { key: 'year', label: '年柱', pillar: columns.yearInfo.name },
      { key: 'month', label: '月柱', pillar: columns.monthInfo.name },
      { key: 'day', label: '日柱', pillar: columns.dayInfo.name },
      { key: 'hour', label: '时柱', pillar: columns.hourInfo.name },
    ];
  }, [columns, selection.decadeIndex, showFlowDay, showFlowHour]);

  const wuXingStatus = useMemo(() => {
    const monthPillar = birthInfo.pillars.month;
    if (!monthPillar) return ['水旺', '木相', '金休', '土囚', '火死'];
    const branch = monthPillar.charAt(1);
    return getWuXingStatus(branch);
  }, [birthInfo.pillars.month]);

  return {
    selectedDecade,
    selectedSmallFortune,
    selectedFlowYear,
    selectedFlowMonth,
    selectedFlowDay,
    selectedFlowHour,
    columns,
    tableColumns,
    wuXingStatus,
  };
}
