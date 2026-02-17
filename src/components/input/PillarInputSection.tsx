import React from 'react';

export interface PillarInputSectionProps {
  selectedYearPillar: string;
  selectedMonthPillar: string;
  selectedDayPillar: string;
  selectedHourPillar: string;
  onClick?: () => void;
}

export const PillarInputSection: React.FC<PillarInputSectionProps> = ({
  selectedYearPillar,
  selectedMonthPillar,
  selectedDayPillar,
  selectedHourPillar,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
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
        cursor: onClick ? 'pointer' : 'default',
        fontFamily: '"Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif'
      }}
    >
      {`${selectedYearPillar} ${selectedMonthPillar} ${selectedDayPillar} ${selectedHourPillar}`}
    </div>
  );
};

export default PillarInputSection;
