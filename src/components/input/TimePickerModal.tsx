import React from 'react';
import DatePickerColumn from './DatePickerColumn';
import PillarSelector, { StemPopover, BranchPopover } from './PillarSelector';
import type { PillarType, SelectionStep } from '../../types';
import { getCurrentStem, getCurrentBranch, buildPillar } from '../../utils/pillarStepLogic';

interface TimePickerModalProps {
  show: boolean;
  timeTab: 'solar' | 'lunar' | 'sizhu';
  dateType: string;
  isTodaySelected: boolean;
  timeInput: string;
  selectedYear: number;
  selectedMonth: number;
  selectedDay: number;
  selectedHour: number;
  selectedMinute: number;
  selectedYearPillar: string;
  selectedMonthPillar: string;
  selectedDayPillar: string;
  selectedHourPillar: string;
  showStemPopover: boolean;
  showBranchPopover: boolean;
  activePillar: PillarType | null;
  currentStep?: SelectionStep;
  completedPillars: Set<PillarType>;
  onTimeTabChange: (tab: 'solar' | 'lunar' | 'sizhu') => void;
  onDateTypeChange: (type: string) => void;
  onTimeInputChange: (value: string) => void;
  onTimeInputBlur: () => void;
  onSetToday: () => void;
  onClose: () => void;
  onConfirm: () => void;
  onYearSelect: (year: number) => void;
  onMonthSelect: (month: number) => void;
  onDaySelect: (day: number) => void;
  onHourSelect: (hour: number) => void;
  onMinuteSelect: (minute: number) => void;
  onPillarClick: (type: PillarType) => void;
  onStemSelect: (stem: string) => void;
  onBranchSelect: (branch: string) => void;
  onYearPillarChange: (pillar: string) => void;
  onMonthPillarChange: (pillar: string) => void;
  onDayPillarChange: (pillar: string) => void;
  onHourPillarChange: (pillar: string) => void;
  onCancelSelection?: () => void;
  yearScrollRef?: React.RefObject<HTMLDivElement | null>;
  monthScrollRef?: React.RefObject<HTMLDivElement | null>;
  dayScrollRef?: React.RefObject<HTMLDivElement | null>;
  hourScrollRef?: React.RefObject<HTMLDivElement | null>;
  minuteScrollRef?: React.RefObject<HTMLDivElement | null>;
}

const TimePickerModal: React.FC<TimePickerModalProps> = ({
  show,
  timeTab,
  dateType,
  isTodaySelected,
  timeInput,
  selectedYear,
  selectedMonth,
  selectedDay,
  selectedHour,
  selectedMinute,
  selectedYearPillar,
  selectedMonthPillar,
  selectedDayPillar,
  selectedHourPillar,
  showStemPopover,
  showBranchPopover,
  activePillar,
  currentStep,
  completedPillars,
  onTimeTabChange,
  onDateTypeChange,
  onTimeInputChange,
  onTimeInputBlur,
  onSetToday,
  onClose,
  onConfirm,
  onYearSelect,
  onMonthSelect,
  onDaySelect,
  onHourSelect,
  onMinuteSelect,
  onPillarClick,
  onStemSelect,
  onBranchSelect,
  onYearPillarChange,
  onMonthPillarChange,
  onDayPillarChange,
  onHourPillarChange,
  onCancelSelection,
  yearScrollRef,
  monthScrollRef,
  dayScrollRef,
  hourScrollRef,
  minuteScrollRef
}) => {
  const [localCompletedPillars, setCompletedPillars] = React.useState(completedPillars);

  React.useEffect(() => {
    setCompletedPillars(completedPillars);
  }, [completedPillars]);

  if (!show) return null;

  const pillarSetters: Record<PillarType, (pillar: string) => void> = {
    year: onYearPillarChange,
    month: onMonthPillarChange,
    day: onDayPillarChange,
    hour: onHourPillarChange
  };

  const getCurrentPillar = (): string => {
    if (!activePillar) return '';
    const pillars = { year: selectedYearPillar, month: selectedMonthPillar, day: selectedDayPillar, hour: selectedHourPillar };
    return pillars[activePillar];
  };

  const handleStemSelect = (stem: string) => {
    if (!activePillar) return;
    const currentPillar = getCurrentPillar();
    const branch = getCurrentBranch(currentPillar);
    pillarSetters[activePillar](buildPillar(stem, branch));
    onStemSelect(stem);
  };

  const handleBranchSelect = (branch: string) => {
    if (!activePillar) return;
    const currentPillar = getCurrentPillar();
    const stem = getCurrentStem(currentPillar);
    pillarSetters[activePillar](buildPillar(stem, branch));
    onBranchSelect(branch);
    setCompletedPillars((prev: Set<PillarType>) => new Set([...prev, activePillar]));
  };

  const handleConfirm = () => {
    onConfirm();
    setCompletedPillars(completedPillars);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white w-[390px] h-[425px] rounded-[20px] overflow-hidden relative" style={{ padding: '17px' }}>
        <div className="relative flex items-center justify-center h-[35px] mb-2">
          <div className="flex gap-2">
            <button className={`px-4 py-1 rounded-[25px] text-[15px] ${timeTab === 'solar' ? 'bg-[#b2955d] text-white' : 'text-gray-600'}`} onClick={() => { onTimeTabChange('solar'); onDateTypeChange('1'); }}>公历</button>
            <button className={`px-4 py-1 rounded-[25px] text-[15px] ${timeTab === 'lunar' ? 'bg-[#b2955d] text-white' : 'text-gray-600'}`} onClick={() => { onTimeTabChange('lunar'); onDateTypeChange('0'); }}>农历</button>
            <button className={`px-4 py-1 rounded-[25px] text-[15px] ${timeTab === 'sizhu' ? 'bg-[#b2955d] text-white' : 'text-gray-600'}`} onClick={() => { onTimeTabChange('sizhu'); onDateTypeChange('2'); }}>四柱</button>
          </div>
          {timeTab !== 'sizhu' && !isTodaySelected && <div onClick={onSetToday} className="absolute left-0 w-8 h-8 rounded-full bg-[#b3b3b3] text-white text-sm flex items-center justify-center cursor-pointer">今</div>}
          <div onClick={onClose} className="absolute right-0 cursor-pointer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6L18 18" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>

        <div className="flex flex-col h-[320px]">
          {timeTab === 'solar' && (
            <div className="flex gap-2 mb-4">
              <input type="text" placeholder="输入年月日时分(格式199001011200)" className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm" value={timeInput} onChange={(e) => onTimeInputChange(e.target.value.replace(/\D/g, '').slice(0, 12))} onBlur={onTimeInputBlur} />
              <div onClick={onConfirm} className="bg-[#b4b4b4] text-white w-[62px] h-8 rounded-[25px] text-[15px] flex items-center justify-center cursor-pointer">确定</div>
            </div>
          )}

          {timeTab === 'sizhu' ? (
            <>
              <PillarSelector selectedYearPillar={selectedYearPillar} selectedMonthPillar={selectedMonthPillar} selectedDayPillar={selectedDayPillar} selectedHourPillar={selectedHourPillar} onYearPillarSelect={onYearPillarChange} onMonthPillarSelect={onMonthPillarChange} onDayPillarSelect={onDayPillarChange} onHourPillarSelect={onHourPillarChange} completedPillars={localCompletedPillars} onPillarClick={onPillarClick} currentStep={currentStep} />
              <div className="mt-auto flex justify-center px-4 pb-2">
                <button onClick={handleConfirm} className="w-full bg-[#101010] text-[#f7d3a1] py-3 rounded-[30px] text-[18px] font-medium hover:bg-[#333] transition-colors">确定</button>
              </div>
              {showStemPopover && <StemPopover activePillar={activePillar} currentPillar={getCurrentPillar()} onStemSelect={handleStemSelect} onCancel={onCancelSelection} />}
              {showBranchPopover && <BranchPopover activePillar={activePillar} selectedYearPillar={selectedYearPillar} selectedDayPillar={selectedDayPillar} currentPillar={getCurrentPillar()} completedPillars={localCompletedPillars} onBranchSelect={handleBranchSelect} onCancel={onCancelSelection} />}
            </>
          ) : (
            <>
              <DatePickerColumn selectedYear={selectedYear} selectedMonth={selectedMonth} selectedDay={selectedDay} selectedHour={selectedHour} selectedMinute={selectedMinute} dateType={dateType} onYearSelect={onYearSelect} onMonthSelect={onMonthSelect} onDaySelect={onDaySelect} onHourSelect={onHourSelect} onMinuteSelect={onMinuteSelect} yearScrollRef={yearScrollRef} monthScrollRef={monthScrollRef} dayScrollRef={dayScrollRef} hourScrollRef={hourScrollRef} minuteScrollRef={minuteScrollRef} />
              <div className="mt-auto flex justify-center px-4 pb-2">
                <button onClick={onConfirm} className="w-full bg-[#101010] text-[#f7d3a1] py-3 rounded-[30px] text-[18px] font-medium hover:bg-[#333] transition-colors">确定</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimePickerModal;
