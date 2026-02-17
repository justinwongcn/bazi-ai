import { LunarYear, LunarMonth } from 'tyme4ts';

export interface MonthOption {
  value: number;
  label: string;
}

export const getMonthOptions = (year: number, dateType: string): MonthOption[] => {
  if (dateType === '0') {
    return LunarYear.fromYear(year).getMonths().map((month) => ({
      value: month.getMonthWithLeap(),
      label: month.getName()
    }));
  }
  return Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: String(i + 1)
  }));
};

export const getDayCount = (year: number, monthValue: number, dateType: string): number => {
  if (dateType === '0') {
    return LunarMonth.fromYm(year, monthValue).getDayCount();
  }
  return new Date(year, monthValue, 0).getDate();
};

export const normalizeMonth = (monthValue: number, year: number, dateType: string): number => {
  const values = getMonthOptions(year, dateType).map(item => item.value);
  if (values.includes(monthValue)) {
    return monthValue;
  }
  if (dateType === '1') {
    const clamped = Math.min(12, Math.max(1, Math.abs(monthValue)));
    return values.includes(clamped) ? clamped : values[0];
  }
  return values[0];
};

export const clampDay = (year: number, monthValue: number, dateType: string, dayValue: number): number => {
  const maxDay = getDayCount(year, monthValue, dateType);
  return Math.min(dayValue, maxDay);
};
