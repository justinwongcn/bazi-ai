import { HEAVENLY_STEMS, MONTH_BRANCHES, HOUR_BRANCHES } from './ganzhi';

export const getMonthStemStart = (yearStem: string): string => {
  const wuHuDun: Record<string, string> = {
    '甲': '丙', '己': '丙',
    '乙': '戊', '庚': '戊',
    '丙': '庚', '辛': '庚',
    '丁': '壬', '壬': '壬',
    '戊': '甲', '癸': '甲'
  };
  return wuHuDun[yearStem] || '甲';
};

export const getHourStemStart = (dayStem: string): string => {
  const wuShuDun: Record<string, string> = {
    '甲': '甲', '己': '甲',
    '乙': '丙', '庚': '丙',
    '丙': '戊', '辛': '戊',
    '丁': '庚', '壬': '庚',
    '戊': '壬', '癸': '壬'
  };
  return wuShuDun[dayStem] || '甲';
};

export const getValidMonthBranches = (yearStem: string, monthStem: string): string[] => {
  const startStem = getMonthStemStart(yearStem);
  const startIndex = HEAVENLY_STEMS.indexOf(startStem);
  const targetIndex = HEAVENLY_STEMS.indexOf(monthStem);

  const validBranches: string[] = [];
  for (let i = 0; i < 12; i++) {
    const currentStemIndex = (startIndex + i) % 10;
    if (currentStemIndex === targetIndex) {
      validBranches.push(MONTH_BRANCHES[i]);
    }
  }

  return validBranches;
};

export const getValidHourBranches = (dayStem: string, hourStem: string): string[] => {
  const startStem = getHourStemStart(dayStem);
  const startIndex = HEAVENLY_STEMS.indexOf(startStem);
  const targetIndex = HEAVENLY_STEMS.indexOf(hourStem);

  const validBranches: string[] = [];
  for (let i = 0; i < 12; i++) {
    const currentStemIndex = (startIndex + i) % 10;
    if (currentStemIndex === targetIndex) {
      validBranches.push(HOUR_BRANCHES[i]);
    }
  }

  return validBranches;
};
