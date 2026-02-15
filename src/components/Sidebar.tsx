import React from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const menuItems = [
    { label: '基本信息', path: '/', active: location.pathname === '/' },
    { label: '基本排盘', path: '/detail', active: location.pathname === '/detail' },
    { label: '专业细盘', path: '/pro', active: location.pathname === '/pro' },
  ];

  const handleNavigation = (path: string) => {
    let query = searchParams.toString();
    
    if (!query && (path === '/detail' || path === '/pro')) {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hour = String(now.getHours()).padStart(2, '0');
      const minute = String(now.getMinutes()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}T${hour}:${minute}`;
      
      const params = new URLSearchParams();
      params.set('date', dateStr);
      params.set('name', '默认');
      params.set('sex', '1');
      params.set('dateType', '1');
      params.set('isTrueSolar', '1');
      params.set('location', '北京市 北京市 东城区');
      params.set('longitude', '116.41005');
      params.set('latitude', '39.93157');
      
      query = params.toString();
    }
    
    const targetUrl = query ? `${path}?${query}` : path;
    navigate(targetUrl);
  };

  return (
    <div
      style={{
        width: 161,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 32,
        height: 'fit-content',
        padding: 0,
      }}
      className={className}
    >
      {/* 问真官网 */}
      <div
        style={{
          width: 161,
          height: 87,
          backgroundColor: 'rgb(255, 255, 255)',
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          color: 'rgb(131, 131, 131)',
          cursor: 'pointer',
          marginBottom: 18,
          lineHeight: '87px',
        }}
      >
        问真官网
      </div>

      {/* 菜单组 */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {menuItems.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === menuItems.length - 1;
          
          let borderRadius: string;
          if (isFirst) {
            borderRadius = '10px 10px 0 0';
          } else if (isLast) {
            borderRadius = '0 0 10px 10px';
          } else {
            borderRadius = '0';
          }

          return (
            <div
              key={index}
              onClick={() => handleNavigation(item.path)}
              style={{
                width: 161,
                height: 71,
                backgroundColor: 'rgb(255, 255, 255)',
                borderRadius,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                color: item.active ? 'rgb(178, 149, 93)' : 'rgb(131, 131, 131)',
                cursor: 'pointer',
                lineHeight: '71px',
              }}
            >
              {item.label}
            </div>
          );
        })}
      </div>

      {/* 断事笔记 */}
      <div
        style={{
          width: 161,
          height: 71,
          backgroundColor: 'rgb(255, 255, 255)',
          borderRadius: '0 0 10px 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          color: 'rgb(131, 131, 131)',
          cursor: 'pointer',
          lineHeight: '71px',
        }}
      >
        断事笔记
      </div>

      {/* 设置 */}
      <div
        style={{
          width: 161,
          height: 71,
          backgroundColor: 'rgb(255, 255, 255)',
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          color: 'rgb(131, 131, 131)',
          cursor: 'pointer',
          marginTop: 15,
          lineHeight: '71px',
        }}
      >
        设置
      </div>

      {/* 切换手机版 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '30px 20px',
          marginTop: 15,
          color: 'rgb(135, 135, 135)',
          fontSize: 16,
          cursor: 'pointer',
        }}
      >
        <svg
          viewBox="0 0 1024 1024"
          width={16}
          height={16}
          style={{ marginRight: 8, flexShrink: 0 }}
        >
          <g>
            <path
              d="M637.952 161.792a43.008 43.008 0 0 1 60.8-0.384l227.456 224.256A43.008 43.008 0 0 1 896 459.264H128a43.008 43.008 0 0 1 0-86.016h663.168L638.336 222.592a43.008 43.008 0 0 1-4.928-55.424l4.48-5.376zM896 564.736a43.008 43.008 0 1 1 0 86.016l-663.232-0.064 152.896 150.72a43.008 43.008 0 0 1 4.928 55.424l-4.48 5.376a43.008 43.008 0 0 1-60.864 0.384L97.792 638.336A43.008 43.008 0 0 1 128 564.736h768z"
              fill="rgba(134, 134, 134, 1)"
            />
          </g>
        </svg>
        <span>切换手机版</span>
      </div>
    </div>
  );
};

export default Sidebar;
