import { InputStyles } from '../../styles/constants';

interface NameInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export default function NameInput({ value, onChange, label = '命主姓名' }: NameInputProps) {
  return (
    <div style={InputStyles.container}>
      <label style={InputStyles.label}>{label}</label>
      <div style={InputStyles.inputWrapper}>
        <input
          style={InputStyles.input}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="请输入姓名"
        />
      </div>
    </div>
  );
}
