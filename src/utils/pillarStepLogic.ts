import type { PillarType, SelectionStep } from '../types';

export const STEP_ORDER: SelectionStep[] = [
  'yearStem', 'yearBranch',
  'monthStem', 'monthBranch',
  'dayStem', 'dayBranch',
  'hourStem', 'hourBranch'
];

export const PILLAR_INITIAL_STEPS: Record<PillarType, SelectionStep> = {
  year: 'yearStem',
  month: 'monthStem',
  day: 'dayStem',
  hour: 'hourStem'
};

export const getNextStep = (currentStep: SelectionStep): SelectionStep => {
  if (!currentStep) return 'yearStem';
  const currentIndex = STEP_ORDER.indexOf(currentStep);
  if (currentIndex === -1 || currentIndex === STEP_ORDER.length - 1) return null;
  return STEP_ORDER[currentIndex + 1];
};

export const getStepPillarType = (step: SelectionStep): PillarType | null => {
  if (!step) return null;
  if (step.startsWith('year')) return 'year';
  if (step.startsWith('month')) return 'month';
  if (step.startsWith('day')) return 'day';
  if (step.startsWith('hour')) return 'hour';
  return null;
};

export const isStemStep = (step: SelectionStep): boolean => {
  if (!step) return false;
  return step.endsWith('Stem');
};

export const isBranchStep = (step: SelectionStep): boolean => {
  if (!step) return false;
  return step.endsWith('Branch');
};

export const getStepLabel = (step: SelectionStep): string => {
  if (!step) return '';
  if (step.endsWith('Stem')) return '选择天干';
  if (step.endsWith('Branch')) return '选择地支';
  return '';
};

export const getCurrentStem = (pillar: string): string => pillar.charAt(0);
export const getCurrentBranch = (pillar: string): string => pillar.charAt(1);

export const buildPillar = (stem: string, branch: string): string => stem + branch;
