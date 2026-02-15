import React from 'react';

interface HeaderProps {
  name: string;
  sexLabel: string;
  lunarText: string;
  solarText: string;
}

const Header: React.FC<HeaderProps> = ({ name, sexLabel, lunarText, solarText }) => {
  return (
    <div
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
      <img
        src="/static/img/sx_7.png"
        alt="生肖头像"
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.6)',
          flexShrink: 0
        }}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent) {
            const fallback = document.createElement('div');
            fallback.style.cssText = 'width:64px;height:64px;border-radius:50%;border:1px solid rgba(255,255,255,0.6);background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:600;color:white;flex-shrink:0;';
            fallback.textContent = name?.slice(0, 1) || '命';
            parent.insertBefore(fallback, target);
          }
        }}
      />
      <div>
        <div style={{ fontSize: 30, fontWeight: 600, color: 'rgb(178, 149, 93)' }}>
          {name || '未知'}
        </div>
        <div style={{ fontSize: 16, color: 'white', marginTop: 4 }}>
          阴历：{lunarText} <span style={{ color: 'rgb(178, 149, 93)' }}>（{sexLabel}）</span>
        </div>
        <div style={{ fontSize: 16, color: 'white', marginTop: 4 }}>
          阳历：{solarText}
        </div>
      </div>
    </div>
  );
};

export default Header;
