import React, { useState, useMemo, useCallback } from 'react';
import TimePickerModal from './TimePickerModal';
import { useDatePickerScroll } from '../../hooks/useDatePickerScroll';
import {
  getMonthOptions,
  getDayCount,
  normalizeMonth,
  clampDay,
  formatDisplayDate as formatHelper,
  getLunarDateFromSolar
} from '../../utils/dateHelpers';
import type { FormData } from '../../hooks/useDateInput';
import { usePillarInput } from '../../hooks/usePillarInput';

export interface DateInputSectionProps {
  formData: FormData;
  setFormData: (value: FormData | ((prev: FormData) => FormData)) => void;
  pillarInput: ReturnType<typeof usePillarInput>;
  onTimeConfirm?: () => void;
}

const DateInputSection: React.FC<DateInputSectionProps> = ({
  formData,
  setFormData,
  pillarInput,
  onTimeConfirm
}) => {
  const [initialDate] = useState(() => new Date(formData.birthDate));

  const [selectedYear, setSelectedYear] = useState(() => initialDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(() => {
    if (formData.dateType === '0') {
      return formData.lunarLeap ? -formData.lunarMonth : formData.lunarMonth;
    }
    return initialDate.getMonth() + 1;
  });
  const [selectedDay, setSelectedDay] = useState(() => initialDate.getDate());
  const [selectedHour, setSelectedHour] = useState(() => initialDate.getHours());
  const [selectedMinute, setSelectedMinute] = useState(() => initialDate.getMinutes());

  const [isTodaySelected, setIsTodaySelected] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timeTab, setTimeTab] = useState<'solar' | 'lunar' | 'sizhu'>(
    formData.dateType === '0' ? 'lunar' : formData.dateType === '2' ? 'sizhu' : 'solar'
  );
  const [timeInput, setTimeInput] = useState('');

  const years = useMemo(() => Array.from({ length: 200 }, (_, i) => 1900 + i), []);
  
  const months = useMemo(() => getMonthOptions(selectedYear, formData.dateType), [formData.dateType, selectedYear]);
  
  const days = useMemo(() => {
    const dayCount = getDayCount(selectedYear, selectedMonth, formData.dateType);
    return Array.from({ length: dayCount }, (_, i) => i + 1);
  }, [formData.dateType, selectedYear, selectedMonth]);
  
  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const minutes = useMemo(() => Array.from({ length: 60 }, (_, i) => i), []);

  const openPicker = useCallback(() => {
    const date = new Date(formData.birthDate);
    if (formData.dateType === '0') {
      const lunar = getLunarDateFromSolar(date);
      setSelectedYear(lunar.year);
      setSelectedMonth(lunar.month);
      setSelectedDay(lunar.day);
    } else {
      setSelectedYear(date.getFullYear());
      setSelectedMonth(date.getMonth() + 1);
      setSelectedDay(date.getDate());
    }
    setSelectedHour(date.getHours());
    setSelectedMinute(date.getMinutes());
    setShowTimePicker(true);
  }, [formData.birthDate, formData.dateType]);

  const handleYearSelect = useCallback((year: number) => {
    const nextMonth = normalizeMonth(selectedMonth, year, formData.dateType);
    const nextDay = clampDay(year, nextMonth, formData.dateType, selectedDay);
    setSelectedYear(year);
    if (nextMonth !== selectedMonth) setSelectedMonth(nextMonth);
    if (nextDay !== selectedDay) setSelectedDay(nextDay);
    setIsTodaySelected(false);
  }, [selectedMonth, selectedDay, formData.dateType]);

  const handleMonthSelect = useCallback((monthValue: number) => {
    const nextDay = clampDay(selectedYear, monthValue, formData.dateType, selectedDay);
    setSelectedMonth(monthValue);
    if (nextDay !== selectedDay) setSelectedDay(nextDay);
    setIsTodaySelected(false);
  }, [selectedYear, selectedDay, formData.dateType]);

  const handleDateTypeChange = useCallback((nextType: string) => {
    const nextMonth = normalizeMonth(selectedMonth, selectedYear, nextType);
    const nextDay = clampDay(selectedYear, nextMonth, nextType, selectedDay);
    
    setFormData(prev => ({ ...prev, dateType: nextType }));
    
    if (nextMonth !== selectedMonth) setSelectedMonth(nextMonth);
    if (nextDay !== selectedDay) setSelectedDay(nextDay);
  }, [selectedMonth, selectedYear, selectedDay, setFormData]);

  const handleTimeConfirm = useCallback(() => {
    if (formData.dateType === '2') {
      setShowTimePicker(false);
      onTimeConfirm?.();
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
    onTimeConfirm?.();
  }, [formData.dateType, selectedMonth, selectedDay, selectedHour, selectedMinute, selectedYear, setFormData, onTimeConfirm]);

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
  }, [timeInput, formData.dateType]);

  const handleSetToday = useCallback(() => {
    const today = new Date();
    if (formData.dateType === '0') {
      const lunar = getLunarDateFromSolar(today);
      setSelectedYear(lunar.year);
      setSelectedMonth(lunar.month);
      setSelectedDay(lunar.day);
    } else {
      setSelectedYear(today.getFullYear());
      setSelectedMonth(today.getMonth() + 1);
      setSelectedDay(today.getDate());
    }
    setSelectedHour(today.getHours());
    setSelectedMinute(today.getMinutes());
    setIsTodaySelected(true);
  }, [formData.dateType]);

  const refs = useDatePickerScroll({
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
  });

  const pillarDisplayString = pillarInput
    ? `${pillarInput.selectedYearPillar} ${pillarInput.selectedMonthPillar} ${pillarInput.selectedDayPillar} ${pillarInput.selectedHourPillar}`
    : '';

  return (
    <>
      <div className="mb-[22px] flex items-center justify-between">
        <div className="flex items-center">
          <label className="w-[140px] text-[16px] text-[#444] text-center"></label>
          <div className="flex items-center">
            <div
              onClick={() => {
                handleDateTypeChange('1');
                setTimeTab('solar');
                openPicker();
              }}
              className={`block cursor-pointer px-[20px] py-[6px] rounded-[20px] w-[80px] h-[30px] text-[16px] text-center leading-[18px] ${
                formData.dateType === '1' ? 'bg-[#b2955d] text-white' : 'bg-transparent text-[#444]'
              }`}
            >
              公历
            </div>
            <div
              onClick={() => {
                handleDateTypeChange('0');
                setTimeTab('lunar');
                openPicker();
              }}
              className={`block cursor-pointer px-[20px] py-[6px] rounded-[20px] w-[80px] h-[30px] text-[16px] text-center leading-[18px] ${
                formData.dateType === '0' ? 'bg-[#b2955d] text-white' : 'bg-transparent text-[#444]'
              }`}
            >
              农历
            </div>
            <div
              onClick={() => {
                handleDateTypeChange('2');
                setTimeTab('sizhu');
                openPicker();
              }}
              className={`block cursor-pointer px-[20px] py-[6px] rounded-[20px] w-[80px] h-[30px] text-[16px] text-center leading-[18px] ${
                formData.dateType === '2' ? 'bg-[#b2955d] text-white' : 'bg-transparent text-[#444]'
              }`}
            >
              四柱
            </div>
          </div>
        </div>
      </div>

      <div className="mb-[22px] flex items-center">
        <label className="w-[140px] text-[16px] text-[#444] text-center">
          {formData.dateType === '2' ? '四柱' : '出生时间'}
        </label>
        <div
          onClick={openPicker}
          className="flex-1 h-[38px] flex items-center border border-[#ececec] rounded-[6px] px-[13px] py-[9px] text-[16px] text-[#444] cursor-pointer font-sans"
        >
          {formData.dateType === '2'
            ? (pillarDisplayString || '请选择四柱')
            : formatHelper(formData.birthDate, formData.dateType, formData.lunarMonth, formData.lunarLeap)}
        </div>
      </div>

      <TimePickerModal
        show={showTimePicker}
        timeTab={timeTab}
        dateType={formData.dateType}
        isTodaySelected={isTodaySelected}
        timeInput={timeInput}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        selectedDay={selectedDay}
        selectedHour={selectedHour}
        selectedMinute={selectedMinute}
        selectedYearPillar={pillarInput?.selectedYearPillar}
        selectedMonthPillar={pillarInput?.selectedMonthPillar}
        selectedDayPillar={pillarInput?.selectedDayPillar}
        selectedHourPillar={pillarInput?.selectedHourPillar}
        showStemPopover={pillarInput?.showStemPopover}
        showBranchPopover={pillarInput?.showBranchPopover}
        activePillar={pillarInput?.activePillar}
        currentStep={pillarInput?.currentStep}
        completedPillars={pillarInput?.completedPillars}
        onTimeTabChange={setTimeTab}
        onDateTypeChange={handleDateTypeChange}
        onTimeInputChange={setTimeInput}
        onTimeInputBlur={handleTimeInput}
        onSetToday={handleSetToday}
        onClose={() => setShowTimePicker(false)}
        onConfirm={handleTimeConfirm}
        onYearSelect={handleYearSelect}
        onMonthSelect={handleMonthSelect}
        onDaySelect={(day) => { setSelectedDay(day); setIsTodaySelected(false); }}
        onHourSelect={(hour) => { setSelectedHour(hour); setIsTodaySelected(false); }}
        onMinuteSelect={(minute) => { setSelectedMinute(minute); setIsTodaySelected(false); }}
        onPillarClick={pillarInput?.openStemSelector}
        onStemSelect={pillarInput?.handleStemSelect}
        onBranchSelect={pillarInput?.handleBranchSelect}
        onYearPillarChange={pillarInput?.setSelectedYearPillar}
        onMonthPillarChange={pillarInput?.setSelectedMonthPillar}
        onDayPillarChange={pillarInput?.setSelectedDayPillar}
        onHourPillarChange={pillarInput?.setSelectedHourPillar}
        onCancelSelection={pillarInput?.cancelSelection}
        yearScrollRef={refs.yearScrollRef}
        monthScrollRef={refs.monthScrollRef}
        dayScrollRef={refs.dayScrollRef}
        hourScrollRef={refs.hourScrollRef}
        minuteScrollRef={refs.minuteScrollRef}
      />
    </>
  );
};

export default DateInputSection;
