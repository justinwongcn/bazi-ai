import React from 'react';

export interface LocationInputSectionProps {
  formData: {
    location: string;
    isDst: boolean;
    isTrueSolar: boolean;
    isEarlyRat: boolean;
  };
  trueSolarTimeDiff: string;
  onOpenAddressPicker: (show: boolean) => void;
  onDstChange: (checked: boolean) => void;
  onTrueSolarChange: (checked: boolean) => void;
  onEarlyRatChange: (checked: boolean) => void;
}

const LocationInputSection: React.FC<LocationInputSectionProps> = ({
  formData,
  trueSolarTimeDiff,
  onOpenAddressPicker,
  onDstChange,
  onTrueSolarChange,
  onEarlyRatChange,
}) => {
  return (
    <>
      <div style={{ marginBottom: 22, display: 'flex', alignItems: 'center' }}>
        <label style={{
          width: 140,
          fontSize: 16,
          color: 'rgb(68, 68, 68)',
          textAlign: 'center'
        }}>出生地址</label>
        <div
          onClick={() => onOpenAddressPicker(true)}
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
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {formData.location}
        </div>
      </div>

      <div style={{
        marginBottom: 22,
        display: 'flex',
        alignItems: 'center',
        gap: 30
      }}>
        <label style={{
          width: 140,
          fontSize: 16,
          color: 'rgb(68, 68, 68)',
          textAlign: 'center'
        }}></label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
          onClick={() => onDstChange(!formData.isDst)}
        >
          <div style={{
            width: 16,
            height: 16,
            borderRadius: 3,
            border: '1px solid rgb(178, 149, 93)',
            backgroundColor: formData.isDst ? 'rgb(178, 149, 93)' : 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {formData.isDst && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            )}
          </div>
          <span style={{ fontSize: 16, color: 'rgb(16, 16, 16)' }}>夏令时</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
          onClick={() => onTrueSolarChange(!formData.isTrueSolar)}
        >
          <div style={{
            width: 16,
            height: 16,
            borderRadius: 3,
            border: '1px solid rgb(178, 149, 93)',
            backgroundColor: formData.isTrueSolar ? 'rgb(178, 149, 93)' : 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {formData.isTrueSolar && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            )}
          </div>
          <span style={{ fontSize: 16, color: 'rgb(16, 16, 16)' }}>真太阳时</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
          onClick={() => onEarlyRatChange(!formData.isEarlyRat)}
        >
          <div style={{
            width: 16,
            height: 16,
            borderRadius: 3,
            border: '1px solid rgb(178, 149, 93)',
            backgroundColor: formData.isEarlyRat ? 'rgb(178, 149, 93)' : 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {formData.isEarlyRat && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            )}
          </div>
          <span style={{ fontSize: 16, color: 'rgb(16, 16, 16)' }}>早晚子时</span>
        </div>
      </div>

      {formData.isTrueSolar && trueSolarTimeDiff && (
        <div style={{
          marginBottom: 22,
          marginLeft: 140,
          fontSize: 14,
          color: 'rgb(178, 149, 93)',
          backgroundColor: 'rgba(178, 149, 93, 0.1)',
          padding: '10px 15px',
          borderRadius: 6
        }}>
          真太阳时修正: {trueSolarTimeDiff}
        </div>
      )}
    </>
  );
};

export default LocationInputSection;
