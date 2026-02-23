import React from 'react';
import type { PillarData } from '../types/bazi';
import { getElementRgbColor, getTenStarShort } from '../services/elementService';

interface PillarColumnProps {
  pillar: PillarData;
  dayLabel: string;
}

export const PillarColumn: React.FC<PillarColumnProps> = ({ pillar, dayLabel }) => {
  return (
    <>
      <div className="pro-pan-row">
        <div className="pro-pan-row-item">
          <span className={pillar.tenStarName === dayLabel ? '' : 'pointer'}>
            {pillar.tenStarName}
          </span>
        </div>
      </div>
      <div className="pro-pan-row">
        <div className="pro-pan-row-item gzClass">
          <span className={pillar.stemColor}>
            {pillar.stem}
          </span>
        </div>
      </div>
      <div className="pro-pan-row">
        <div className="pro-pan-row-item gzClass">
          <span className={pillar.branchColor}>
            {pillar.branch}
          </span>
        </div>
      </div>
      <div className="pro-pan-row greyBg">
        <div className="pro-pan-row-item columnFlex alignSelfStart">
          {pillar.hiddenStems.map((hs, i) => (
            <span
              key={i}
              className={hs.stemColor}
              style={{ fontSize: 0, marginBottom: 2 }}
            >
              <span style={{ fontSize: 15 }}>
                {hs.stem}
              </span>
              <span className="pointer" style={{ color: 'black', fontSize: 14 }}>
                {hs.tenStarName}
              </span>
            </span>
          ))}
        </div>
      </div>
      <div className="pro-pan-row">
        <div className="pro-pan-row-item">
          <span className="pointer">
            {pillar.starLuck}
          </span>
        </div>
      </div>
      <div className="pro-pan-row">
        <div className="pro-pan-row-item">
          <span className="pointer">
            {pillar.selfSeat}
          </span>
        </div>
      </div>
      <div className="pro-pan-row">
        <div className="pro-pan-row-item">
          {pillar.empty}
        </div>
      </div>
      <div className="pro-pan-row">
        <div className="pro-pan-row-item">
          <span className="pointer">
            {pillar.naYin}
          </span>
        </div>
      </div>
    </>
  );
};

interface FortuneItemDisplayProps {
  pillar: string;
  label: string;
  isSelected: boolean;
  dayStem: { getTenStar: (stem: { getName: () => string }) => { getName: () => string } };
  onClick: () => void;
}

export const FortuneItemDisplay: React.FC<FortuneItemDisplayProps> = ({
  pillar,
  label,
  isSelected,
  dayStem,
  onClick,
}) => {
  const stem = pillar.charAt(0);
  const branch = pillar.charAt(1);
  const stemTenStar = dayStem.getTenStar({ getName: () => stem }).getName();

  return (
    <div
      className={`pro-pan-yun-item pointer ${isSelected ? 'pro-pan-yun-item-selected' : ''}`}
      onClick={onClick}
    >
      <span className="pro-pan-yun-item-small">
        {label}
      </span>
      <span className="pro-pan-yun-item-label">
        <span style={{ color: getElementRgbColor(stem) }}>
          {stem}
        </span>
        <span className="pro-pan-yun-item-shishen">
          {getTenStarShort(stemTenStar)}
        </span>
      </span>
      <span className="pro-pan-yun-item-label">
        <span style={{ color: getElementRgbColor(branch) }}>
          {branch}
        </span>
      </span>
    </div>
  );
};
