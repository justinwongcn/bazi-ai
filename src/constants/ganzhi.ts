export const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

export const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

export const MONTH_BRANCHES = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];

export const HOUR_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

export const isStemYang = (stem: string): boolean => {
  const index = HEAVENLY_STEMS.indexOf(stem);
  return index % 2 === 0;
};

export const isBranchYang = (branch: string): boolean => {
  const index = EARTHLY_BRANCHES.indexOf(branch);
  return index % 2 === 0;
};
