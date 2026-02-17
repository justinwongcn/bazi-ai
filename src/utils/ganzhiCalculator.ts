/**
 * 干支计算工具 - 五虎遁、五鼠遁
 */

// 天干数组
export const HEAVEN_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;

// 地支数组
export const EARTH_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;

// 月份对应的地支（正月建寅）
export const MONTH_BRANCHES = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'] as const;

// 时辰对应的地支
export const HOUR_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;

export type HeavenStem = typeof HEAVEN_STEMS[number];
export type EarthBranch = typeof EARTH_BRANCHES[number];

/**
 * 五虎遁 - 根据年干获取正月月干索引
 * 甲己之年丙作首，乙庚之岁戊为头
 * 丙辛之岁寻庚上，丁壬壬位顺行流
 * 戊癸之年甲为真
 */
export function getMonthStemStart(yearStem: HeavenStem): number {
  const startMap: Record<HeavenStem, number> = {
    '甲': 2, // 丙
    '己': 2, // 丙
    '乙': 4, // 戊
    '庚': 4, // 戊
    '丙': 6, // 庚
    '辛': 6, // 庚
    '丁': 8, // 壬
    '壬': 8, // 壬
    '戊': 0, // 甲
    '癸': 0, // 甲
  };
  return startMap[yearStem] ?? 0;
}

/**
 * 五鼠遁 - 根据日干获取子时天干索引
 * 甲己还加甲，乙庚丙作初
 * 丙辛从戊起，丁壬庚子居
 * 戊癸何方发，壬子是真途
 */
export function getHourStemStart(dayStem: HeavenStem): number {
  const startMap: Record<HeavenStem, number> = {
    '甲': 0, // 甲
    '己': 0, // 甲
    '乙': 2, // 丙
    '庚': 2, // 丙
    '丙': 4, // 戊
    '辛': 4, // 戊
    '丁': 6, // 庚
    '壬': 6, // 庚
    '戊': 8, // 壬
    '癸': 8, // 壬
  };
  return startMap[dayStem] ?? 0;
}

/**
 * 获取年干对应的所有月柱（五虎遁全表）
 */
export function getAllMonthPillars(yearStem: HeavenStem): Array<{ stem: HeavenStem; branch: EarthBranch; month: number }> {
  const stemStart = getMonthStemStart(yearStem);
  const result: Array<{ stem: HeavenStem; branch: EarthBranch; month: number }> = [];

  for (let month = 1; month <= 12; month++) {
    const stemIndex = (stemStart + month - 1) % 10;
    result.push({
      stem: HEAVEN_STEMS[stemIndex],
      branch: MONTH_BRANCHES[month - 1],
      month: month,
    });
  }

  return result;
}

/**
 * 根据年干和月干，获取可能的地支列表
 * 这是核心功能：当用户选择年干和月干后，返回所有可能的地支
 */
export function getPossibleMonthBranches(yearStem: HeavenStem, monthStem: HeavenStem): EarthBranch[] {
  const allMonthPillars = getAllMonthPillars(yearStem);
  const possibleBranches = allMonthPillars
    .filter((p) => p.stem === monthStem)
    .map((p) => p.branch);
  return [...new Set(possibleBranches)]; // 去重
}

/**
 * 获取日干对应的所有时柱（五鼠遁全表）
 */
export function getAllHourPillars(dayStem: HeavenStem): Array<{ stem: HeavenStem; branch: EarthBranch; hourIndex: number }> {
  const stemStart = getHourStemStart(dayStem);
  const result: Array<{ stem: HeavenStem; branch: EarthBranch; hourIndex: number }> = [];

  for (let hourIndex = 0; hourIndex < 12; hourIndex++) {
    const stemIndex = (stemStart + hourIndex) % 10;
    result.push({
      stem: HEAVEN_STEMS[stemIndex],
      branch: HOUR_BRANCHES[hourIndex],
      hourIndex: hourIndex,
    });
  }

  return result;
}

/**
 * 根据日干和时干，获取可能的地支列表
 * 这是核心功能：当用户选择日干和时干后，返回所有可能的地支
 */
export function getPossibleHourBranches(dayStem: HeavenStem, hourStem: HeavenStem): EarthBranch[] {
  const allHourPillars = getAllHourPillars(dayStem);
  const possibleBranches = allHourPillars
    .filter((p) => p.stem === hourStem)
    .map((p) => p.branch);
  return [...new Set(possibleBranches)]; // 去重
}

/**
 * 获取所有可能的年柱（60甲子）
 */
export function getAllYearPillars(): Array<{ stem: HeavenStem; branch: EarthBranch; name: string }> {
  const result: Array<{ stem: HeavenStem; branch: EarthBranch; name: string }> = [];

  // 60甲子循环
  for (let i = 0; i < 60; i++) {
    const stemIndex = i % 10;
    const branchIndex = i % 12;
    result.push({
      stem: HEAVEN_STEMS[stemIndex],
      branch: EARTH_BRANCHES[branchIndex],
      name: HEAVEN_STEMS[stemIndex] + EARTH_BRANCHES[branchIndex],
    });
  }

  return result;
}

/**
 * 获取所有可能的日柱（60甲子）
 */
export function getAllDayPillars(): Array<{ stem: HeavenStem; branch: EarthBranch; name: string }> {
  return getAllYearPillars(); // 同样是60甲子
}

/**
 * 根据干支名称获取天干索引
 */
export function getStemIndex(stem: HeavenStem): number {
  return HEAVEN_STEMS.indexOf(stem);
}

/**
 * 根据干支名称获取地支索引
 */
export function getBranchIndex(branch: EarthBranch): number {
  return EARTH_BRANCHES.indexOf(branch);
}

/**
 * 四柱数据接口
 */
export interface SiZhuData {
  yearStem: HeavenStem;
  yearBranch: EarthBranch;
  monthStem: HeavenStem;
  monthBranch: EarthBranch;
  dayStem: HeavenStem;
  dayBranch: EarthBranch;
  hourStem: HeavenStem;
  hourBranch: EarthBranch;
}

/**
 * 将四柱数据转换为标准格式
 */
export function formatSiZhu(data: SiZhuData): {
  yearPillar: string;
  monthPillar: string;
  dayPillar: string;
  hourPillar: string;
} {
  return {
    yearPillar: data.yearStem + data.yearBranch,
    monthPillar: data.monthStem + data.monthBranch,
    dayPillar: data.dayStem + data.dayBranch,
    hourPillar: data.hourStem + data.hourBranch,
  };
}

/**
 * 验证月柱是否合法（根据五虎遁）
 */
export function isValidMonthPillar(yearStem: HeavenStem, monthStem: HeavenStem, monthBranch: EarthBranch): boolean {
  const possibleBranches = getPossibleMonthBranches(yearStem, monthStem);
  return possibleBranches.includes(monthBranch);
}

/**
 * 验证时柱是否合法（根据五鼠遁）
 */
export function isValidHourPillar(dayStem: HeavenStem, hourStem: HeavenStem, hourBranch: EarthBranch): boolean {
  const possibleBranches = getPossibleHourBranches(dayStem, hourStem);
  return possibleBranches.includes(hourBranch);
}
