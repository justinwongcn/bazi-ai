import { useRef, useEffect } from 'react';
import type { MonthOption } from '../utils/dateHelpers';

interface UseDatePickerScrollProps {
  showTimePicker: boolean;
  selectedYear: number;
  selectedMonth: number;
  selectedDay: number;
  selectedHour: number;
  selectedMinute: number;
  years: number[];
  months: MonthOption[];
  days: number[];
  hours: number[];
  minutes: number[];
}

export const useDatePickerScroll = ({
  showTimePicker,
  selectedYear,
  selectedMonth,
  selectedDay,
  selectedHour,
  selectedMinute,
  years,
  months,
  days,
  hours,
  minutes
}: UseDatePickerScrollProps) => {
  const yearScrollRef = useRef<HTMLDivElement>(null);
  const monthScrollRef = useRef<HTMLDivElement>(null);
  const dayScrollRef = useRef<HTMLDivElement>(null);
  const hourScrollRef = useRef<HTMLDivElement>(null);
  const minuteScrollRef = useRef<HTMLDivElement>(null);

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
  }, [
    showTimePicker,
    selectedYear,
    selectedMonth,
    selectedDay,
    selectedHour,
    selectedMinute,
    years,
    months,
    days,
    hours,
    minutes
  ]);

  return {
    yearScrollRef,
    monthScrollRef,
    dayScrollRef,
    hourScrollRef,
    minuteScrollRef
  };
};
