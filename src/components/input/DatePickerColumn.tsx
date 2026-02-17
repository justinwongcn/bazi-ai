import React, { useMemo, useRef, useEffect } from 'react';
import { getMonthOptions, getDayCount, normalizeMonth, clampDay } from '../../utils/dateHelpers';

interface DatePickerColumnProps {
  selectedYear: number;
  selectedMonth: number;
  selectedDay: number;
  selectedHour: number;
  selectedMinute: number;
  dateType: string;
  onYearSelect: (year: number) => void;
  onMonthSelect: (month: number) => void;
  onDaySelect: (day: number) => void;
  onHourSelect: (hour: number) => void;
  onMinuteSelect: (minute: number) => void;
  yearScrollRef?: React.RefObject<HTMLDivElement | null>;
  monthScrollRef?: React.RefObject<HTMLDivElement | null>;
  dayScrollRef?: React.RefObject<HTMLDivElement | null>;
  hourScrollRef?: React.RefObject<HTMLDivElement | null>;
  minuteScrollRef?: React.RefObject<HTMLDivElement | null>;
}

const DatePickerColumn: React.FC<DatePickerColumnProps> = ({
  selectedYear,
  selectedMonth,
  selectedDay,
  selectedHour,
  selectedMinute,
  dateType,
  onYearSelect,
  onMonthSelect,
  onDaySelect,
  onHourSelect,
  onMinuteSelect,
  yearScrollRef,
  monthScrollRef,
  dayScrollRef,
  hourScrollRef,
  minuteScrollRef
}) => {
  const defaultYearScrollRef = useRef<HTMLDivElement>(null);
  const defaultMonthScrollRef = useRef<HTMLDivElement>(null);
  const defaultDayScrollRef = useRef<HTMLDivElement>(null);
  const defaultHourScrollRef = useRef<HTMLDivElement>(null);
  const defaultMinuteScrollRef = useRef<HTMLDivElement>(null);

  const yRef = yearScrollRef || defaultYearScrollRef;
  const mRef = monthScrollRef || defaultMonthScrollRef;
  const dRef = dayScrollRef || defaultDayScrollRef;
  const hRef = hourScrollRef || defaultHourScrollRef;
  const minRef = minuteScrollRef || defaultMinuteScrollRef;

  const scrollTimeouts = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const dragStateRef = useRef({
    isDragging: false,
    startY: 0,
    startScrollTop: 0,
    currentRef: null as HTMLDivElement | null,
    rafId: null as number | null,
    targetScrollTop: 0
  });

  const years = useMemo(() => Array.from({ length: 200 }, (_, i) => 1900 + i), []);
  const months = useMemo(() => getMonthOptions(selectedYear, dateType), [selectedYear, dateType]);
  const days = useMemo(() => {
    const dayCount = getDayCount(selectedYear, selectedMonth, dateType);
    return Array.from({ length: dayCount }, (_, i) => i + 1);
  }, [selectedYear, selectedMonth, dateType]);
  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const minutes = useMemo(() => Array.from({ length: 60 }, (_, i) => i), []);

  // 当选中值变化时，自动滚动到对应位置
  useEffect(() => {
    const scrollTo = (ref: React.RefObject<HTMLDivElement | null>, val: number, list: (number | { value: number })[]) => {
      if (ref.current) {
        const index = list.findIndex(item => {
          if (typeof item === 'object' && item !== null && 'value' in item) {
            return item.value === val;
          }
          return item === val;
        });
        if (index !== -1) {
          const targetTop = index * 44;
          ref.current.scrollTo({ top: targetTop, behavior: 'smooth' });
        }
      }
    };

    // 使用 requestAnimationFrame 确保在 DOM 更新后执行
    requestAnimationFrame(() => {
      scrollTo(yRef, selectedYear, years);
      scrollTo(mRef, selectedMonth, months);
      scrollTo(dRef, selectedDay, days);
      scrollTo(hRef, selectedHour, hours);
      scrollTo(minRef, selectedMinute, minutes);
    });
  }, [selectedYear, selectedMonth, selectedDay, selectedHour, selectedMinute, years, months, days, hours, minutes, yRef, mRef, dRef, hRef, minRef]);

  const handleScroll = (key: string, e: React.UIEvent<HTMLDivElement>, list: (number | { value: number })[], currentVal: number, onSelect: (val: number) => void) => {
    const target = e.target as HTMLDivElement;
    if (scrollTimeouts.current[key]) {
      clearTimeout(scrollTimeouts.current[key]);
    }
    scrollTimeouts.current[key] = setTimeout(() => {
      const index = Math.round(target.scrollTop / 44);
      if (index >= 0 && index < list.length) {
        const item = list[index];
        const val = (typeof item === 'object' && item !== null && 'value' in item) ? item.value : (item as number);
        if (val !== currentVal) {
          onSelect(val);
        }
      }
    }, 100);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, scrollRef: React.RefObject<HTMLDivElement | null>) => {
    if (!scrollRef.current) return;
    e.preventDefault();
    const state = dragStateRef.current;
    state.isDragging = true;
    state.startY = e.clientY;
    state.startScrollTop = scrollRef.current.scrollTop;
    state.currentRef = scrollRef.current;
    state.targetScrollTop = scrollRef.current.scrollTop;
    document.addEventListener('mousemove', handleGlobalMouseMove, { passive: false });
    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('mouseleave', handleGlobalMouseUp);
  };

  const handleGlobalMouseMove = (e: MouseEvent) => {
    const state = dragStateRef.current;
    if (!state.isDragging || !state.currentRef) return;
    e.preventDefault();
    const deltaY = state.startY - e.clientY;
    state.targetScrollTop = state.startScrollTop + deltaY;
    if (!state.rafId) {
      state.rafId = requestAnimationFrame(() => {
        if (state.currentRef && state.isDragging) {
          state.currentRef.scrollTop = state.targetScrollTop;
        }
        state.rafId = null;
      });
    }
  };

  const handleGlobalMouseUp = () => {
    const state = dragStateRef.current;
    state.isDragging = false;
    state.currentRef = null;
    if (state.rafId) {
      cancelAnimationFrame(state.rafId);
      state.rafId = null;
    }
    document.removeEventListener('mousemove', handleGlobalMouseMove);
    document.removeEventListener('mouseup', handleGlobalMouseUp);
    document.removeEventListener('mouseleave', handleGlobalMouseUp);
  };

  const handleYearSelect = (year: number) => {
    const nextMonth = normalizeMonth(selectedMonth, year, dateType);
    const nextDay = clampDay(year, nextMonth, dateType, selectedDay);
    onYearSelect(year);
    if (nextMonth !== selectedMonth) onMonthSelect(nextMonth);
    if (nextDay !== selectedDay) onDaySelect(nextDay);
  };

  const handleMonthSelect = (monthValue: number) => {
    const nextDay = clampDay(selectedYear, monthValue, dateType, selectedDay);
    onMonthSelect(monthValue);
    if (nextDay !== selectedDay) onDaySelect(nextDay);
  };

  const scrollStyle = {
    scrollSnapType: 'y mandatory' as const,
    scrollbarWidth: 'none' as const,
    msOverflowStyle: 'none' as const,
    paddingTop: '78px',
    paddingBottom: '78px',
    cursor: 'grab' as const,
    userSelect: 'none' as const
  };

  const getClassName = (isSelected: boolean) =>
    `h-11 flex items-center justify-center cursor-pointer scroll-snap-align-center ${
      isSelected ? 'text-[20px] text-[#323233] font-bold' : 'text-[14px] text-[#323233]'
    }`;

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-around mb-2 text-sm text-gray-500 px-4">
        <span className="flex-1 text-center">年</span>
        <span className="flex-1 text-center">月</span>
        <span className="flex-1 text-center">日</span>
        <span className="flex-1 text-center">时</span>
        <span className="flex-1 text-center">分</span>
      </div>
      <div className="relative h-[200px]">
        <div className="absolute inset-0 flex">
          <div ref={yRef} className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-hide select-none"
            onScroll={(e) => handleScroll('year', e, years, selectedYear, handleYearSelect)}
            onMouseDown={(e) => handleMouseDown(e, yRef)} style={scrollStyle}>
            {years.map(year => (
              <div key={year} className={getClassName(selectedYear === year)} onClick={() => handleYearSelect(year)}>{year}</div>
            ))}
          </div>
          <div ref={mRef} className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-hide select-none"
            onScroll={(e) => handleScroll('month', e, months, selectedMonth, handleMonthSelect)}
            onMouseDown={(e) => handleMouseDown(e, mRef)} style={scrollStyle}>
            {months.map(month => (
              <div key={month.value} className={getClassName(selectedMonth === month.value)} onClick={() => handleMonthSelect(month.value)}>{month.label}</div>
            ))}
          </div>
          <div ref={dRef} className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-hide select-none"
            onScroll={(e) => handleScroll('day', e, days, selectedDay, onDaySelect)}
            onMouseDown={(e) => handleMouseDown(e, dRef)} style={scrollStyle}>
            {days.map(day => (
              <div key={day} className={getClassName(selectedDay === day)} onClick={() => onDaySelect(day)}>{day}</div>
            ))}
          </div>
          <div ref={hRef} className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-hide select-none"
            onScroll={(e) => handleScroll('hour', e, hours, selectedHour, onHourSelect)}
            onMouseDown={(e) => handleMouseDown(e, hRef)} style={scrollStyle}>
            {hours.map(hour => (
              <div key={hour} className={getClassName(selectedHour === hour)} onClick={() => onHourSelect(hour)}>{hour}</div>
            ))}
          </div>
          <div ref={minRef} className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-hide select-none"
            onScroll={(e) => handleScroll('minute', e, minutes, selectedMinute, onMinuteSelect)}
            onMouseDown={(e) => handleMouseDown(e, minRef)} style={scrollStyle}>
            {minutes.map(minute => (
              <div key={minute} className={getClassName(selectedMinute === minute)} onClick={() => onMinuteSelect(minute)}>{minute}</div>
            ))}
          </div>
        </div>
        <div className="absolute left-0 right-0 top-[78px] h-11 pointer-events-none border-t border-b border-gray-200 bg-gray-50/30"></div>
      </div>
    </div>
  );
};

export default DatePickerColumn;
