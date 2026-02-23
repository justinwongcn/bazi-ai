import { LunarYear, LunarMonth, LunarDay, SolarTime } from 'tyme4ts';

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

export const formatDisplayDate = (
  dateStr: string,
  dateType: string,
  lunarMonthVal: number,
  lunarLeap: boolean
): string => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const day = date.getDate();
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  
  if (dateType === '0') {
    const monthValue = lunarLeap ? -lunarMonthVal : lunarMonthVal;
    const lunarMonth = LunarMonth.fromYm(year, monthValue);
    const lunarDay = LunarDay.fromYmd(year, monthValue, day);
    return `${year}年${lunarMonth.getName()}${lunarDay.getName()} ${hour}:${minute}`;
  }
  
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const dayStr = String(day).padStart(2, '0');
  return `${year}年${month}月${dayStr}日 ${hour}:${minute}`;
};

export const getLunarDateFromSolar = (date: Date) => {
  const solarTime = SolarTime.fromYmdHms(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds()
  );
  const lunarHour = solarTime.getLunarHour();
  const lunarDay = lunarHour.getLunarDay();
  const lunarMonth = lunarDay.getLunarMonth();
  
  return {
    year: lunarDay.getYear(),
    month: lunarMonth.getMonthWithLeap(),
    day: lunarDay.getDay()
  };
};
