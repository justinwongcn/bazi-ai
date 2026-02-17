import { Colors } from '../../styles/constants';

interface SexSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SexSelector({ value, onChange }: SexSelectorProps) {
  const isMale = value === '1';
  const isFemale = value === '0';

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div
        onClick={() => onChange('1')}
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          marginRight: 31,
          color: isMale ? Colors.primary : Colors.text,
          fontSize: 16
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            border: `2px solid ${isMale ? Colors.primary : Colors.text}`,
            backgroundColor: isMale ? Colors.primary : 'transparent',
            marginRight: 5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isMale && (
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: Colors.white
              }}
            />
          )}
        </div>
        <span>男</span>
      </div>
      <div
        onClick={() => onChange('0')}
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          color: isFemale ? Colors.primary : Colors.text,
          fontSize: 16
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            border: `2px solid ${isFemale ? Colors.primary : Colors.text}`,
            backgroundColor: isFemale ? Colors.primary : 'transparent',
            marginRight: 5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isFemale && (
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: Colors.white
              }}
            />
          )}
        </div>
        <span>女</span>
      </div>
    </div>
  );
}
