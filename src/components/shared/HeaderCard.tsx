import React from 'react';
import Avatar from './Avatar';

export interface HeaderCardProps {
  name: string;
  lunarText: string;
  solarText: string;
  sex: string;
  className?: string;
}

const HeaderCard: React.FC<HeaderCardProps> = ({
  name,
  lunarText,
  solarText,
  sex,
  className = ''
}) => {
  return (
    <div
      className={className}
      style={{
        backgroundImage: 'url(/static/img/paipan_header_bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '20px 24px',
        borderRadius: '15px 15px 0 0',
        minHeight: 105,
        display: 'flex',
        alignItems: 'center',
        gap: 16
      }}
    >
      <Avatar name={name} />
      <div>
        <div style={{ fontSize: 30, fontWeight: 600, color: 'rgb(178, 149, 93)' }}>
          {name}
        </div>
        <div style={{ fontSize: 16, color: 'white', marginTop: 4 }}>
          阴历：{lunarText} <span style={{ color: 'rgb(178, 149, 93)' }}>（{sex}）</span>
        </div>
        <div style={{ fontSize: 16, color: 'white', marginTop: 4 }}>
          阳历：{solarText}
        </div>
      </div>
    </div>
  );
};

export default HeaderCard;
