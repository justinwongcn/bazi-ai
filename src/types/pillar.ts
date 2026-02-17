export type PillarType = 'year' | 'month' | 'day' | 'hour';

export type SelectionStep =
  | 'yearStem' | 'yearBranch'
  | 'monthStem' | 'monthBranch'
  | 'dayStem' | 'dayBranch'
  | 'hourStem' | 'hourBranch'
  | null;
