import React from 'react';
import type { PillarData } from '../types/bazi';
import { getElementRgbColor, getTenStarShort } from '../services/elementService';

const DV_ATTR = { 'data-v-07b66fb4': '' } as const;

interface PillarColumnProps {
  pillar: PillarData;
  dayLabel: string;
}

export const PillarColumn: React.FC<PillarColumnProps> = ({ pillar, dayLabel }) => {
  return (
    <>
      <div className="pro-pan-row" {...DV_ATTR}>
        <div className="pro-pan-row-item" {...DV_ATTR}>
          <span className={pillar.tenStarName === dayLabel ? '' : 'pointer'} {...DV_ATTR}>
            {pillar.tenStarName}
          </span>
        </div>
      </div>
      <div className="pro-pan-row" {...DV_ATTR}>
        <div className="pro-pan-row-item gzClass" {...DV_ATTR}>
          <span className={pillar.stemColor} {...DV_ATTR}>
            {pillar.stem}
          </span>
        </div>
      </div>
      <div className="pro-pan-row" {...DV_ATTR}>
        <div className="pro-pan-row-item gzClass" {...DV_ATTR}>
          <span className={pillar.branchColor} {...DV_ATTR}>
            {pillar.branch}
          </span>
        </div>
      </div>
      <div className="pro-pan-row greyBg" {...DV_ATTR}>
        <div className="pro-pan-row-item columnFlex alignSelfStart" {...DV_ATTR}>
          {pillar.hiddenStems.map((hs, i) => (
            <span
              key={i}
              className={hs.stemColor}
              {...DV_ATTR}
              style={{ fontSize: 0, marginBottom: 2 }}
            >
              <span {...DV_ATTR} style={{ fontSize: 15 }}>
                {hs.stem}
              </span>
              <span className="pointer" {...DV_ATTR} style={{ color: 'black', fontSize: 14 }}>
                {hs.tenStarName}
              </span>
            </span>
          ))}
        </div>
      </div>
      <div className="pro-pan-row" {...DV_ATTR}>
        <div className="pro-pan-row-item" {...DV_ATTR}>
          <span className="pointer" {...DV_ATTR}>
            {pillar.starLuck}
          </span>
        </div>
      </div>
      <div className="pro-pan-row" {...DV_ATTR}>
        <div className="pro-pan-row-item" {...DV_ATTR}>
          <span className="pointer" {...DV_ATTR}>
            {pillar.selfSeat}
          </span>
        </div>
      </div>
      <div className="pro-pan-row" {...DV_ATTR}>
        <div className="pro-pan-row-item" {...DV_ATTR}>
          {pillar.empty}
        </div>
      </div>
      <div className="pro-pan-row" {...DV_ATTR}>
        <div className="pro-pan-row-item" {...DV_ATTR}>
          <span className="pointer" {...DV_ATTR}>
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
      {...DV_ATTR}
      onClick={onClick}
    >
      <span className="pro-pan-yun-item-small" {...DV_ATTR}>
        {label}
      </span>
      <span className="pro-pan-yun-item-label" {...DV_ATTR}>
        <span style={{ color: getElementRgbColor(stem) }} {...DV_ATTR}>
          {stem}
        </span>
        <span className="pro-pan-yun-item-shishen" {...DV_ATTR}>
          {getTenStarShort(stemTenStar)}
        </span>
      </span>
      <span className="pro-pan-yun-item-label" {...DV_ATTR}>
        <span style={{ color: getElementRgbColor(branch) }} {...DV_ATTR}>
          {branch}
        </span>
      </span>
    </div>
  );
};
