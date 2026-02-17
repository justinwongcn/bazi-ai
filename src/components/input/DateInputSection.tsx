import React from 'react';

export interface DateInputSectionProps {
  formData: {
    dateType: string;
    birthDate: string;
    lunarMonth: number;
    lunarLeap: boolean;
  };
  setShowTimePicker: (show: boolean) => void;
  setTimeTab: (tab: 'solar' | 'lunar' | 'sizhu') => void;
  formatDisplayDate: (dateStr: string) => string;
  handleDateTypeChange: (type: string) => void;
  pillarInput?: {
    selectedYearPillar: string;
    selectedMonthPillar: string;
    selectedDayPillar: string;
    selectedHourPillar: string;
  };
}

const DateInputSection: React.FC<DateInputSectionProps> = ({
  formData,
  setShowTimePicker,
  setTimeTab,
  formatDisplayDate,
  handleDateTypeChange,
  pillarInput,
}) => {
  const pillarDisplayString = pillarInput
    ? `${pillarInput.selectedYearPillar} ${pillarInput.selectedMonthPillar} ${pillarInput.selectedDayPillar} ${pillarInput.selectedHourPillar}`
    : '';

  return (
    <>
      <div style={{ marginBottom: 22, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label style={{
            width: 140,
            fontSize: 16,
            color: 'rgb(68, 68, 68)',
            textAlign: 'center'
          }}></label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              onClick={() => {
                handleDateTypeChange('1');
                setTimeTab('solar');
                setShowTimePicker(true);
              }}
              style={{
                display: 'block',
                cursor: 'pointer',
                padding: '6px 20px',
                borderRadius: 20,
                width: 80,
                height: 30,
                backgroundColor: formData.dateType === '1' ? 'rgb(178, 149, 93)' : 'transparent',
                color: formData.dateType === '1' ? 'white' : 'rgb(68, 68, 68)',
                fontSize: 16,
                textAlign: 'center',
                lineHeight: '18px'
              }}
            >
              公历
            </div>
            <div
              onClick={() => {
                handleDateTypeChange('0');
                setTimeTab('lunar');
                setShowTimePicker(true);
              }}
              style={{
                display: 'block',
                cursor: 'pointer',
                padding: '6px 20px',
                borderRadius: 20,
                width: 80,
                height: 30,
                backgroundColor: formData.dateType === '0' ? 'rgb(178, 149, 93)' : 'transparent',
                color: formData.dateType === '0' ? 'white' : 'rgb(68, 68, 68)',
                fontSize: 16,
                textAlign: 'center',
                lineHeight: '18px'
              }}
            >
              农历
            </div>
            <div
              onClick={() => {
                handleDateTypeChange('2');
                setTimeTab('sizhu');
                setShowTimePicker(true);
              }}
              style={{
                display: 'block',
                cursor: 'pointer',
                padding: '6px 20px',
                borderRadius: 20,
                width: 80,
                height: 30,
                backgroundColor: formData.dateType === '2' ? 'rgb(178, 149, 93)' : 'transparent',
                color: formData.dateType === '2' ? 'white' : 'rgb(68, 68, 68)',
                fontSize: 16,
                textAlign: 'center',
                lineHeight: '18px'
              }}
            >
              四柱
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 22, display: 'flex', alignItems: 'center' }}>
        <label style={{
          width: 140,
          fontSize: 16,
          color: 'rgb(68, 68, 68)',
          textAlign: 'center'
        }}>{formData.dateType === '2' ? '四柱' : '出生时间'}</label>
        <div
          onClick={() => setShowTimePicker(true)}
          style={{
            flex: 1,
            height: 38,
            display: 'flex',
            alignItems: 'center',
            border: '1px solid rgb(236, 236, 236)',
            borderRadius: 6,
            padding: '9px 13px',
            fontSize: 16,
            color: 'rgb(68, 68, 68)',
            cursor: 'pointer',
            fontFamily: '"Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif'
          }}
        >
          {formData.dateType === '2'
            ? (pillarDisplayString || '请选择四柱')
            : formatDisplayDate(formData.birthDate)}
        </div>
      </div>
    </>
  );
};

export default DateInputSection;
