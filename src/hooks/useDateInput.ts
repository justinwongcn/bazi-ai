import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { LunarYear, LunarMonth, LunarDay, SolarTime } from 'tyme4ts';

export interface FormData {
  name: string;
  sex: string;
  dateType: string;
  birthDate: string;
  lunarMonth: number;
  lunarLeap: boolean;
  location: string;
  longitude: number | null;
  latitude: number | null;
  isDst: boolean;
  isTrueSolar: boolean;
  isEarlyRat: boolean;
}

interface MonthOption {
  value: number;
  label: string;
}

interface UseDateInputOptions {
  initialDateType?: string;
  initialBirthDate?: string;
  initialLunarMonth?: number;
  initialLunarLeap?: boolean;
  formData?: FormData;
  onFormDataChange?: (formData: FormData | ((prev: FormData) => FormData)) => void;
}

export const useDateInput = (options?: UseDateInputOptions) => {
  const initialDateType = options?.initialDateType || '1';
  const initialLunarMonthParam = options?.initialLunarMonth;
  const initialLunarLeapParam = options?.initialLunarLeap;

  const initialBirthDate = options?.initialBirthDate || '1990-01-01T12:00';
  const initialDateForFields = new Date(initialBirthDate);
  const initialLunarMonth = initialLunarMonthParam ?? (initialDateForFields.getMonth() + 1);
  const initialLunarLeap = initialLunarLeapParam ?? false;

  const [formDataState, setFormDataState] = useState<FormData>({
    name: '',
    sex: '1',
    dateType: initialDateType,
    birthDate: initialBirthDate,
    lunarMonth: initialLunarMonth,
    lunarLeap: initialLunarLeap,
    location: '北京市 东经116.41° 北纬39.90°',
    longitude: 116.407394,
    latitude: 39.904211,
    isDst: false,
    isTrueSolar: false,
    isEarlyRat: false,
    ...options?.formData
  });

  const formData = options?.formData ?? formDataState;
  const setFormData = options?.onFormDataChange ?? setFormDataState;

  const initialDate = new Date(formData.birthDate || initialBirthDate);

  const [selectedYear, setSelectedYear] = useState(() => initialDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(() => {
    if (initialDateType === '0') {
      return initialLunarLeap ? -initialLunarMonth : initialLunarMonth;
    }
    return initialDate.getMonth() + 1;
  });
  const [selectedDay, setSelectedDay] = useState(() => initialDate.getDate());
  const [selectedHour, setSelectedHour] = useState(() => initialDate.getHours());
  const [selectedMinute, setSelectedMinute] = useState(() => initialDate.getMinutes());
  const [isTodaySelected, setIsTodaySelected] = useState(false);

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timeTab, setTimeTab] = useState<'solar' | 'lunar' | 'sizhu'>(
    initialDateType === '0' ? 'lunar' : initialDateType === '2' ? 'sizhu' : 'solar'
  );
  const [timeInput, setTimeInput] = useState('');

  const yearScrollRef = useRef<HTMLDivElement>(null);
  const monthScrollRef = useRef<HTMLDivElement>(null);
  const dayScrollRef = useRef<HTMLDivElement>(null);
  const hourScrollRef = useRef<HTMLDivElement>(null);
  const minuteScrollRef = useRef<HTMLDivElement>(null);

  const years = useMemo(() => Array.from({ length: 200 }, (_, i) => 1900 + i), []);

  const getMonthOptions = useCallback((year: number, dateType: string): MonthOption[] => {
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
  }, []);

  const getDayCount = useCallback((year: number, monthValue: number, dateType: string): number => {
    if (dateType === '0') {
      return LunarMonth.fromYm(year, monthValue).getDayCount();
    }
    return new Date(year, monthValue, 0).getDate();
  }, []);

  const normalizeMonth = useCallback((monthValue: number, year: number, dateType: string): number => {
    const values = getMonthOptions(year, dateType).map(item => item.value);
    if (values.includes(monthValue)) {
      return monthValue;
    }
    if (dateType === '1') {
      const clamped = Math.min(12, Math.max(1, Math.abs(monthValue)));
      return values.includes(clamped) ? clamped : values[0];
    }
    return values[0];
  }, [getMonthOptions]);

  const clampDay = useCallback((year: number, monthValue: number, dateType: string, dayValue: number): number => {
    const maxDay = getDayCount(year, monthValue, dateType);
    return Math.min(dayValue, maxDay);
  }, [getDayCount]);

  const months = useMemo(() => getMonthOptions(selectedYear, formData.dateType), [formData.dateType, selectedYear, getMonthOptions]);

  const days = useMemo(() => {
    const dayCount = getDayCount(selectedYear, selectedMonth, formData.dateType);
    return Array.from({ length: dayCount }, (_, i) => i + 1);
  }, [formData.dateType, selectedYear, selectedMonth, getDayCount]);

  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const minutes = useMemo(() => Array.from({ length: 60 }, (_, i) => i), []);

  useEffect(() => {
    if (showTimePicker) {
      const timer = setTimeout(() => {
        const scrollTo = (ref: React.RefObject<HTMLDivElement | null>, val: number, list: number[]) => {
          if (ref.current) {
            const index = list.indexOf(val);
            if (index !== -1) {
              const targetTop = index * 44;
              if (Math.abs(ref.current.scrollTop - targetTop) > 10) {
                ref.current.scrollTo({ top: targetTop, behavior: 'smooth' });
              }
            }
          }
        };
        scrollTo(yearScrollRef, selectedYear, years);
        scrollTo(monthScrollRef, selectedMonth, months.map(item => item.value));
        scrollTo(dayScrollRef, selectedDay, days);
        scrollTo(hourScrollRef, selectedHour, hours);
        scrollTo(minuteScrollRef, selectedMinute, minutes);
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [showTimePicker, selectedYear, selectedMonth, selectedDay, selectedHour, selectedMinute, years, months, days, hours, minutes]);

  const handleYearSelect = useCallback((year: number) => {
    const nextMonth = normalizeMonth(selectedMonth, year, formData.dateType);
    const nextDay = clampDay(year, nextMonth, formData.dateType, selectedDay);
    setSelectedYear(year);
    if (nextMonth !== selectedMonth) {
      setSelectedMonth(nextMonth);
    }
    if (nextDay !== selectedDay) {
      setSelectedDay(nextDay);
    }
    setIsTodaySelected(false);
  }, [selectedMonth, selectedDay, formData.dateType, normalizeMonth, clampDay]);

  const handleMonthSelect = useCallback((monthValue: number) => {
    const nextDay = clampDay(selectedYear, monthValue, formData.dateType, selectedDay);
    setSelectedMonth(monthValue);
    if (nextDay !== selectedDay) {
      setSelectedDay(nextDay);
    }
    setIsTodaySelected(false);
  }, [selectedYear, selectedDay, formData.dateType, clampDay]);

  const handleDateTypeChange = useCallback((nextType: string) => {
    const nextMonth = normalizeMonth(selectedMonth, selectedYear, nextType);
    const nextDay = clampDay(selectedYear, nextMonth, nextType, selectedDay);
    setFormData(prev => ({ ...prev, dateType: nextType }));
    if (nextMonth !== selectedMonth) {
      setSelectedMonth(nextMonth);
    }
    if (nextDay !== selectedDay) {
      setSelectedDay(nextDay);
    }
  }, [selectedMonth, selectedYear, selectedDay, normalizeMonth, clampDay, setFormData]);

  const handleTimeConfirm = useCallback(() => {
    if (formData.dateType === '2') {
      setShowTimePicker(false);
      return;
    }

    const monthValue = formData.dateType === '0' ? Math.abs(selectedMonth) : selectedMonth;
    const monthStr = String(monthValue).padStart(2, '0');
    const dayStr = String(selectedDay).padStart(2, '0');
    const hourStr = String(selectedHour).padStart(2, '0');
    const minuteStr = String(selectedMinute).padStart(2, '0');

    setFormData(prev => ({
      ...prev,
      birthDate: `${selectedYear}-${monthStr}-${dayStr}T${hourStr}:${minuteStr}`,
      lunarMonth: Math.abs(selectedMonth),
      lunarLeap: selectedMonth < 0
    }));
    setShowTimePicker(false);
  }, [formData.dateType, selectedMonth, selectedDay, selectedHour, selectedMinute, selectedYear, setFormData]);

  const handleTimeInput = useCallback(() => {
    if (timeInput.length === 12) {
      const year = parseInt(timeInput.substring(0, 4));
      const month = parseInt(timeInput.substring(4, 6));
      const day = parseInt(timeInput.substring(6, 8));
      const hour = parseInt(timeInput.substring(8, 10));
      const minute = parseInt(timeInput.substring(10, 12));

      if (year >= 1900 && year <= 2100 && month >= 1 && month <= 12 &&
          day >= 1 && day <= 31 && hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
        const nextMonth = normalizeMonth(month, year, formData.dateType);
        const nextDay = clampDay(year, nextMonth, formData.dateType, day);
        setSelectedYear(year);
        setSelectedMonth(nextMonth);
        setSelectedDay(nextDay);
        setSelectedHour(hour);
        setSelectedMinute(minute);
      }
    }
  }, [timeInput, formData.dateType, normalizeMonth, clampDay]);

  const handleSetToday = useCallback(() => {
    const today = new Date();
    if (formData.dateType === '0') {
      const solarTime = SolarTime.fromYmdHms(
        today.getFullYear(),
        today.getMonth() + 1,
        today.getDate(),
        today.getHours(),
        today.getMinutes(),
        today.getSeconds()
      );
      const lunarHour = solarTime.getLunarHour();
      const lunarDay = lunarHour.getLunarDay();
      const lunarMonth = lunarDay.getLunarMonth();
      setSelectedYear(lunarDay.getYear());
      setSelectedMonth(lunarMonth.getMonthWithLeap());
      setSelectedDay(lunarDay.getDay());
    } else {
      setSelectedYear(today.getFullYear());
      setSelectedMonth(today.getMonth() + 1);
      setSelectedDay(today.getDate());
    }
    setSelectedHour(today.getHours());
    setSelectedMinute(today.getMinutes());
    setIsTodaySelected(true);
  }, [formData.dateType]);

  const formatDisplayDate = useCallback((dateStr: string): string => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const day = date.getDate();
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    if (formData.dateType === '0') {
      const monthValue = formData.lunarLeap ? -formData.lunarMonth : formData.lunarMonth;
      const lunarMonth = LunarMonth.fromYm(year, monthValue);
      const lunarDay = LunarDay.fromYmd(year, monthValue, day);
      return `${year}年${lunarMonth.getName()}${lunarDay.getName()} ${hour}:${minute}`;
    }
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}年${month}月${dayStr}日 ${hour}:${minute}`;
  }, [formData.dateType, formData.lunarMonth, formData.lunarLeap]);

  return {
    selectedYear,
    selectedMonth,
    selectedDay,
    selectedHour,
    selectedMinute,
    setSelectedYear,
    setSelectedMonth,
    setSelectedDay,
    setSelectedHour,
    setSelectedMinute,
    showTimePicker,
    setShowTimePicker,
    timeTab,
    setTimeTab,
    timeInput,
    setTimeInput,
    isTodaySelected,
    setIsTodaySelected,
    formData,
    handleYearSelect,
    handleMonthSelect,
    handleDateTypeChange,
    handleTimeConfirm,
    handleSetToday,
    handleTimeInput,
    formatDisplayDate,
    refs: {
      yearScrollRef,
      monthScrollRef,
      dayScrollRef,
      hourScrollRef,
      minuteScrollRef
    },
    lists: {
      years,
      months,
      days,
      hours,
      minutes
    }
  };
};
