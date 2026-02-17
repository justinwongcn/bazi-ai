import { useState, useCallback } from 'react';
import { 
  HEAVENLY_STEMS, 
  EARTHLY_BRANCHES,
  isStemYang, 
  isBranchYang 
} from '../constants/ganzhi';
import { getValidMonthBranches, getValidHourBranches } from '../constants/pillarRules';

export type PillarType = 'year' | 'month' | 'day' | 'hour';

export const usePillarSelector = (initialPillars?: {
  year: string;
  month: string;
  day: string;
  hour: string;
}) => {
  const [selectedYearPillar, setSelectedYearPillar] = useState(initialPillars?.year || '甲子');
  const [selectedMonthPillar, setSelectedMonthPillar] = useState(initialPillars?.month || '丙寅');
  const [selectedDayPillar, setSelectedDayPillar] = useState(initialPillars?.day || '甲子');
  const [selectedHourPillar, setSelectedHourPillar] = useState(initialPillars?.hour || '甲子');

  const [showStemPopover, setShowStemPopover] = useState(false);
  const [showBranchPopover, setShowBranchPopover] = useState(false);
  const [activePillar, setActivePillar] = useState<PillarType | null>(null);
  const [completedPillars, setCompletedPillars] = useState<Set<PillarType>>(new Set());

  const getCurrentPillar = useCallback((pillarType: PillarType): string => {
    switch (pillarType) {
      case 'year': return selectedYearPillar;
      case 'month': return selectedMonthPillar;
      case 'day': return selectedDayPillar;
      case 'hour': return selectedHourPillar;
    }
  }, [selectedYearPillar, selectedMonthPillar, selectedDayPillar, selectedHourPillar]);

  const setPillar = useCallback((pillarType: PillarType, value: string) => {
    switch (pillarType) {
      case 'year':
        setSelectedYearPillar(value);
        break;
      case 'month':
        setSelectedMonthPillar(value);
        break;
      case 'day':
        setSelectedDayPillar(value);
        break;
      case 'hour':
        setSelectedHourPillar(value);
        break;
    }
  }, []);

  const handleStemSelect = useCallback((stem: string) => {
    if (!activePillar) return;
    const currentPillar = getCurrentPillar(activePillar);
    setPillar(activePillar, stem + currentPillar.charAt(1));
    setShowStemPopover(false);
    setShowBranchPopover(true);
  }, [activePillar, getCurrentPillar, setPillar]);

  const handleBranchSelect = useCallback((branch: string) => {
    if (!activePillar) return;
    const currentPillar = getCurrentPillar(activePillar);
    setPillar(activePillar, currentPillar.charAt(0) + branch);
    setShowBranchPopover(false);
    setCompletedPillars(prev => new Set([...prev, activePillar]));
  }, [activePillar, getCurrentPillar, setPillar]);

  const getFilteredBranches = useCallback((pillarType: PillarType): string[] => {
    const currentPillar = getCurrentPillar(pillarType);
    const currentStem = currentPillar.charAt(0);

    if (pillarType === 'month') {
      const yearStem = selectedYearPillar.charAt(0);
      return getValidMonthBranches(yearStem, currentStem);
    } else if (pillarType === 'hour') {
      const dayStem = selectedDayPillar.charAt(0);
      return getValidHourBranches(dayStem, currentStem);
    } else {
      const stemIsYang = isStemYang(currentStem);
      return EARTHLY_BRANCHES.filter((branch) => {
        const branchIsYang = isBranchYang(branch);
        return branchIsYang === stemIsYang;
      });
    }
  }, [getCurrentPillar, selectedYearPillar, selectedDayPillar]);

  const openStemSelector = useCallback((pillarType: PillarType) => {
    setActivePillar(pillarType);
    setShowStemPopover(true);
    setShowBranchPopover(false);
  }, []);

  const reset = useCallback(() => {
    setSelectedYearPillar('甲子');
    setSelectedMonthPillar('丙寅');
    setSelectedDayPillar('甲子');
    setSelectedHourPillar('甲子');
    setCompletedPillars(new Set());
  }, []);

  return {
    pillars: {
      year: selectedYearPillar,
      month: selectedMonthPillar,
      day: selectedDayPillar,
      hour: selectedHourPillar
    },
    setPillars: {
      year: setSelectedYearPillar,
      month: setSelectedMonthPillar,
      day: setSelectedDayPillar,
      hour: setSelectedHourPillar
    },
    showStemPopover,
    showBranchPopover,
    activePillar,
    completedPillars,
    setActivePillar,
    setShowStemPopover,
    setShowBranchPopover,
    getCurrentPillar,
    setPillar,
    handleStemSelect,
    handleBranchSelect,
    getFilteredBranches,
    openStemSelector,
    reset,
    HEAVENLY_STEMS,
    EARTHLY_BRANCHES
  };
};
