export const DATE_TYPE = {
  SOLAR: '1',
  LUNAR: '0',
  PILLAR: '2'
} as const;

export type DateType = typeof DATE_TYPE[keyof typeof DATE_TYPE];

export const BAZI_SEARCH_START_YEAR = 1901;
export const BAZI_SEARCH_END_YEAR = 2099;

export const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;
export const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;

export type HeavenlyStem = typeof HEAVENLY_STEMS[number];
export type EarthlyBranch = typeof EARTHLY_BRANCHES[number];
