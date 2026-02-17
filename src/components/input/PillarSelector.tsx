import React from 'react';
import { HEAVENLY_STEMS, EARTHLY_BRANCHES, isStemYang, isBranchYang } from '../../constants/ganzhi';
import { getValidMonthBranches, getValidHourBranches } from '../../constants/pillarRules';
import type { PillarType, SelectionStep } from '../../types';
import { getCurrentStem, getCurrentBranch } from '../../utils/pillarStepLogic';

interface PillarSelectorProps {
  selectedYearPillar: string;
  selectedMonthPillar: string;
  selectedDayPillar: string;
  selectedHourPillar: string;
  onYearPillarSelect: (pillar: string) => void;
  onMonthPillarSelect: (pillar: string) => void;
  onDayPillarSelect: (pillar: string) => void;
  onHourPillarSelect: (pillar: string) => void;
  completedPillars: Set<PillarType>;
  onPillarClick: (type: PillarType) => void;
  currentStep?: SelectionStep;
}

const PillarSelector: React.FC<PillarSelectorProps> = ({
  selectedYearPillar,
  selectedMonthPillar,
  selectedDayPillar,
  selectedHourPillar,
  onYearPillarSelect,
  onMonthPillarSelect,
  onDayPillarSelect,
  onHourPillarSelect,
  completedPillars,
  onPillarClick,
  currentStep
}) => {
  const pillars = [
    { pillar: selectedYearPillar, type: 'year' as PillarType, onSelect: onYearPillarSelect },
    { pillar: selectedMonthPillar, type: 'month' as PillarType, onSelect: onMonthPillarSelect },
    { pillar: selectedDayPillar, type: 'day' as PillarType, onSelect: onDayPillarSelect },
    { pillar: selectedHourPillar, type: 'hour' as PillarType, onSelect: onHourPillarSelect }
  ];

  const isActiveStem = (type: PillarType): boolean => {
    if (!currentStep) return false;
    return currentStep === `${type}Stem`;
  };

  const isActiveBranch = (type: PillarType): boolean => {
    if (!currentStep) return false;
    return currentStep === `${type}Branch`;
  };

  return (
    <div className="flex flex-col flex-1 relative">
      <div className="flex justify-around mb-4 text-sm text-gray-600 px-4">
        <span className="flex-1 text-center">年柱</span>
        <span className="flex-1 text-center">月柱</span>
        <span className="flex-1 text-center">日柱</span>
        <span className="flex-1 text-center">时柱</span>
      </div>

      <div className="flex justify-around mb-3 px-4">
        {pillars.map(({ pillar, type }) => {
          const stem = getCurrentStem(pillar);
          const isCompleted = completedPillars.has(type);
          const isActive = isActiveStem(type);
          return (
            <div key={type} className="relative">
              <button
                onClick={() => onPillarClick(type)}
                className={`w-14 h-14 rounded-full text-white text-lg font-medium flex items-center justify-center transition-colors ${
                  isActive
                    ? 'bg-[#e74c3c] hover:bg-[#c0392b] ring-4 ring-[#e74c3c]/30'
                    : isCompleted
                      ? 'bg-[#b2955d] hover:bg-[#a0804d]'
                      : 'bg-[#b8b8b8] hover:bg-[#a8a8a8]'
                }`}
              >
                {stem}
              </button>
              {isActive && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#e74c3c] text-white text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
                  选择天干
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-around mb-3 px-4">
        {pillars.map(({ pillar, type }) => {
          const branch = getCurrentBranch(pillar);
          const isCompleted = completedPillars.has(type);
          const isActive = isActiveBranch(type);
          return (
            <div key={type} className="relative">
              <button
                onClick={() => onPillarClick(type)}
                className={`w-14 h-14 rounded-full text-white text-lg font-medium flex items-center justify-center transition-colors ${
                  isActive
                    ? 'bg-[#e74c3c] hover:bg-[#c0392b] ring-4 ring-[#e74c3c]/30'
                    : isCompleted
                      ? 'bg-[#b2955d] hover:bg-[#a0804d]'
                      : 'bg-[#b8b8b8] hover:bg-[#a8a8a8]'
                }`}
              >
                {branch}
              </button>
              {isActive && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#e74c3c] text-white text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
                  选择地支
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-center text-sm text-gray-500 mb-1.5">
        查找范围：1801-2099年
      </div>
    </div>
  );
};

export interface StemPopoverProps {
  activePillar: PillarType | null;
  currentPillar: string;
  onStemSelect: (stem: string) => void;
  onCancel?: () => void;
}

export const StemPopover: React.FC<StemPopoverProps> = ({ activePillar, currentPillar, onStemSelect, onCancel }) => {
  if (!activePillar) return null;
  const currentStem = getCurrentStem(currentPillar);

  return (
    <>
      <div 
        className="absolute inset-0 z-40" 
        onClick={(e) => {
          e.stopPropagation();
          onCancel?.();
        }}
      />
      <div className="absolute left-1/2 -translate-x-1/2 top-[35px] w-[390px] bg-white rounded-lg shadow-lg z-50">
        <div className="px-5 py-5">
          <div className="flex flex-wrap">
            {HEAVENLY_STEMS.map((stem) => {
              const isSelected = currentStem === stem;
              return (
                <div
                  key={stem}
                  className={`w-1/5 py-2.5 text-center text-[24px] cursor-pointer ${
                    isSelected ? 'text-[#b2955d] font-bold' : 'text-[#666666]'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onStemSelect(stem);
                  }}
                >
                  {stem}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export interface BranchPopoverProps {
  activePillar: PillarType | null;
  selectedYearPillar: string;
  selectedDayPillar: string;
  currentPillar: string;
  completedPillars: Set<PillarType>;
  onBranchSelect: (branch: string) => void;
  onCancel?: () => void;
}

export const BranchPopover: React.FC<BranchPopoverProps> = ({
  activePillar,
  selectedYearPillar,
  selectedDayPillar,
  currentPillar,
  completedPillars,
  onBranchSelect,
  onCancel
}) => {
  if (!activePillar) return null;
  const currentStem = getCurrentStem(currentPillar);

  let filteredBranches: string[];
  const stemIsYang = isStemYang(currentStem);
  
  if (activePillar === 'month') {
    if (completedPillars.has('year')) {
      const yearStem = getCurrentStem(selectedYearPillar);
      filteredBranches = getValidMonthBranches(yearStem, currentStem);
    } else {
      filteredBranches = EARTHLY_BRANCHES.filter((branch) => {
        const branchIsYang = isBranchYang(branch);
        return branchIsYang === stemIsYang;
      });
    }
  } else if (activePillar === 'hour') {
    if (completedPillars.has('day')) {
      const dayStem = getCurrentStem(selectedDayPillar);
      filteredBranches = getValidHourBranches(dayStem, currentStem);
    } else {
      filteredBranches = EARTHLY_BRANCHES.filter((branch) => {
        const branchIsYang = isBranchYang(branch);
        return branchIsYang === stemIsYang;
      });
    }
  } else {
    filteredBranches = EARTHLY_BRANCHES.filter((branch) => {
      const branchIsYang = isBranchYang(branch);
      return branchIsYang === stemIsYang;
    });
  }

  return (
    <>
      <div 
        className="absolute inset-0 z-40" 
        onClick={(e) => {
          e.stopPropagation();
          onCancel?.();
        }}
      />
      <div className={`absolute left-1/2 -translate-x-1/2 w-[390px] bg-white rounded-lg shadow-lg z-50 ${activePillar === 'month' || activePillar === 'hour' ? 'top-[91px]' : 'top-[35px]'}`}>
        <div className="px-5 py-5">
          <div className="flex flex-wrap">
            {filteredBranches.map((branch) => {
              const isSelected = getCurrentBranch(currentPillar) === branch;
              return (
                <div
                  key={branch}
                  className={`w-1/5 py-2.5 text-center text-[24px] cursor-pointer ${
                    isSelected ? 'text-[#b2955d] font-bold' : 'text-[#666666]'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onBranchSelect(branch);
                  }}
                >
                  {branch}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default PillarSelector;
