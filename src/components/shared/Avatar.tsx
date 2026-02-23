import React, { useState } from 'react';

export interface AvatarProps {
  name: string;
  src?: string;
  size?: number;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ 
  name, 
  src = '/static/img/sx_7.png', 
  size = 64,
  className = ''
}) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageError(true);
    const target = e.currentTarget;
    target.style.display = 'none';
  };

  const fallbackChar = name?.slice(0, 1) || '命';

  return (
    <div 
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.6)',
        flexShrink: 0,
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {!imageError && (
        <img
          src={src}
          alt="生肖头像"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          onError={handleImageError}
        />
      )}
      {imageError && (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: size * 0.375,
            fontWeight: 600,
            color: 'white'
          }}
        >
          {fallbackChar}
        </div>
      )}
    </div>
  );
};

export default Avatar;
