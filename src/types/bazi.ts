export type ElementName = '木' | '火' | '土' | '金' | '水';

export type ElementColorClass = 'woodColor' | 'fireColor' | 'soilColor' | 'goldColor' | 'waterColor';

export type StemBranch = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸' |
  '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥';

export interface ElementInfo {
  name: ElementName;
  color: string;
}

export interface HiddenStemInfo {
  stem: string;
  stemColor: ElementColorClass;
  tenStarName: string;
}

export interface PillarData {
  name: string;
  stem: string;
  branch: string;
  stemColor: ElementColorClass;
  branchColor: ElementColorClass;
  tenStarName: string;
  hiddenStems: HiddenStemInfo[];
  starLuck: string;
  selfSeat: string;
  empty: string;
  naYin: string;
  shenSha: string[];
}

export interface FortuneItem {
  pillar: string;
  year?: number;
  month?: number;
  day?: number;
  hour?: number;
  age?: number;
}

export interface DecadeFortuneInfo {
  name: string;
  startYear: number;
  endYear: number;
  startAge: number;
  pillar: string;
}

export interface WuXingStatus {
  element: ElementName;
  status: '旺' | '相' | '休' | '囚' | '死';
}
