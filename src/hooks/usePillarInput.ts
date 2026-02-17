import { useState, useCallback, useMemo } from 'react';
import {
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  isStemYang,
  isBranchYang
} from '../constants/ganzhi';
import { getValidMonthBranches, getValidHourBranches } from '../constants/pillarRules';
import type { PillarType, SelectionStep } from '../types';
import {
  PILLAR_INITIAL_STEPS,
  getNextStep,
  getStepPillarType,
  isStemStep,
  getCurrentStem,
  getCurrentBranch,
  buildPillar
} from '../utils/pillarStepLogic';

export interface PillarInputState {
  selectedYearPillar: string;
  selectedMonthPillar: string;
  selectedDayPillar: string;
  selectedHourPillar: string;
  showStemPopover: boolean;
  showBranchPopover: boolean;
  activePillar: PillarType | null;
  completedPillars: Set<PillarType>;
}

export interface PillarInputSetters {
  setSelectedYearPillar: (value: string) => void;
  setSelectedMonthPillar: (value: string) => void;
  setSelectedDayPillar: (value: string) => void;
  setSelectedHourPillar: (value: string) => void;
  setShowStemPopover: (value: boolean) => void;
  setShowBranchPopover: (value: boolean) => void;
  setActivePillar: (value: PillarType | null) => void;
}

export const usePillarInput = (initialPillars?: {
  year?: string;
  month?: string;
  day?: string;
  hour?: string;
}) => {
  const [selectedYearPillar, setSelectedYearPillar] = useState(initialPillars?.year || '甲子');
  const [selectedMonthPillar, setSelectedMonthPillar] = useState(initialPillars?.month || '丙寅');
  const [selectedDayPillar, setSelectedDayPillar] = useState(initialPillars?.day || '甲子');
  const [selectedHourPillar, setSelectedHourPillar] = useState(initialPillars?.hour || '甲子');

  const [showStemPopover, setShowStemPopover] = useState(false);
  const [showBranchPopover, setShowBranchPopover] = useState(false);
  const [currentStep, setCurrentStep] = useState<SelectionStep>(null);
  const [completedPillars, setCompletedPillars] = useState<Set<PillarType>>(new Set());
  
  const [savedPillarState, setSavedPillarState] = useState<{
    pillar: PillarType;
    value: string;
    completedPillars: Set<PillarType>;
  } | null>(null);

  const activePillar = useMemo(
    () => getStepPillarType(currentStep),
    [currentStep]
  );

  const pillarMap = useMemo(() => ({
    year: selectedYearPillar,
    month: selectedMonthPillar,
    day: selectedDayPillar,
    hour: selectedHourPillar
  }), [selectedYearPillar, selectedMonthPillar, selectedDayPillar, selectedHourPillar]);

  const getCurrentPillar = useCallback((pillarType: PillarType): string => {
    return pillarMap[pillarType];
  }, [pillarMap]);

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

  const moveToNextStep = useCallback(() => {
    const nextStep = getNextStep(currentStep);
    setCurrentStep(nextStep);

    if (nextStep) {
      if (isStemStep(nextStep)) {
        setShowStemPopover(true);
        setShowBranchPopover(false);
      } else {
        setShowStemPopover(false);
        setShowBranchPopover(true);
      }
    } else {
      setShowStemPopover(false);
      setShowBranchPopover(false);
    }
  }, [currentStep]);

  const handleStemSelect = useCallback((stem: string) => {
    const pillarType = getStepPillarType(currentStep);
    if (!pillarType) return;

    const currentPillar = getCurrentPillar(pillarType);
    const branch = getCurrentBranch(currentPillar);
    setPillar(pillarType, buildPillar(stem, branch));
    moveToNextStep();
  }, [currentStep, getCurrentPillar, setPillar, moveToNextStep]);

  const handleBranchSelect = useCallback((branch: string) => {
    const pillarType = getStepPillarType(currentStep);
    if (!pillarType) return;

    const currentPillar = getCurrentPillar(pillarType);
    const stem = getCurrentStem(currentPillar);
    setPillar(pillarType, buildPillar(stem, branch));
    setCompletedPillars(prev => new Set([...prev, pillarType]));
    moveToNextStep();
  }, [currentStep, getCurrentPillar, setPillar, moveToNextStep]);

  const getFilteredBranches = useCallback((pillarType: PillarType): string[] => {
    const currentPillar = getCurrentPillar(pillarType);
    const currentStem = getCurrentStem(currentPillar);
    const stemIsYang = isStemYang(currentStem);

    if (pillarType === 'month') {
      if (completedPillars.has('year')) {
        const yearStem = getCurrentStem(selectedYearPillar);
        return getValidMonthBranches(yearStem, currentStem);
      } else {
        return EARTHLY_BRANCHES.filter((branch) => {
          const branchIsYang = isBranchYang(branch);
          return branchIsYang === stemIsYang;
        });
      }
    } else if (pillarType === 'hour') {
      if (completedPillars.has('day')) {
        const dayStem = getCurrentStem(selectedDayPillar);
        return getValidHourBranches(dayStem, currentStem);
      } else {
        return EARTHLY_BRANCHES.filter((branch) => {
          const branchIsYang = isBranchYang(branch);
          return branchIsYang === stemIsYang;
        });
      }
    } else {
      return EARTHLY_BRANCHES.filter((branch) => {
        const branchIsYang = isBranchYang(branch);
        return branchIsYang === stemIsYang;
      });
    }
  }, [getCurrentPillar, selectedYearPillar, selectedDayPillar, completedPillars]);

  const openStemSelector = useCallback((pillarType: PillarType) => {
    setSavedPillarState({
      pillar: pillarType,
      value: getCurrentPillar(pillarType),
      completedPillars: new Set(completedPillars)
    });
    setShowStemPopover(true);
    setShowBranchPopover(false);
    setCurrentStep(PILLAR_INITIAL_STEPS[pillarType]);
  }, [getCurrentPillar, completedPillars]);

  const cancelSelection = useCallback(() => {
    if (savedPillarState) {
      setPillar(savedPillarState.pillar, savedPillarState.value);
      setCompletedPillars(savedPillarState.completedPillars);
      setSavedPillarState(null);
    }
    setShowStemPopover(false);
    setShowBranchPopover(false);
    setCurrentStep(null);
  }, [savedPillarState, setPillar]);

  const reset = useCallback(() => {
    setSelectedYearPillar('甲子');
    setSelectedMonthPillar('丙寅');
    setSelectedDayPillar('甲子');
    setSelectedHourPillar('甲子');
    setCompletedPillars(new Set());
    setCurrentStep(null);
    setSavedPillarState(null);
    setShowStemPopover(false);
    setShowBranchPopover(false);
  }, []);

  const getPillarDisplayString = useCallback((): string => {
    return `${selectedYearPillar} ${selectedMonthPillar} ${selectedDayPillar} ${selectedHourPillar}`;
  }, [selectedYearPillar, selectedMonthPillar, selectedDayPillar, selectedHourPillar]);

  return {
    selectedYearPillar,
    selectedMonthPillar,
    selectedDayPillar,
    selectedHourPillar,
    showStemPopover,
    showBranchPopover,
    activePillar,
    currentStep,
    completedPillars,
    setSelectedYearPillar,
    setSelectedMonthPillar,
    setSelectedDayPillar,
    setSelectedHourPillar,
    setShowStemPopover,
    setShowBranchPopover,
    getCurrentPillar,
    setPillar,
    handleStemSelect,
    handleBranchSelect,
    getFilteredBranches,
    openStemSelector,
    cancelSelection,
    reset,
    getPillarDisplayString,
    HEAVENLY_STEMS,
    EARTHLY_BRANCHES
  };
};
