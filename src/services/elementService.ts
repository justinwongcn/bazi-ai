import type { ElementColorClass, ElementName, ElementInfo, WuXingStatus } from '../types/bazi';

const ELEMENT_COLORS: Record<string, ElementColorClass> = {
  '甲': 'woodColor', '乙': 'woodColor', '寅': 'woodColor', '卯': 'woodColor',
  '丙': 'fireColor', '丁': 'fireColor', '巳': 'fireColor', '午': 'fireColor',
  '戊': 'soilColor', '己': 'soilColor', '辰': 'soilColor', '戌': 'soilColor',
  '丑': 'soilColor', '未': 'soilColor',
  '庚': 'goldColor', '辛': 'goldColor', '申': 'goldColor', '酉': 'goldColor',
  '壬': 'waterColor', '癸': 'waterColor', '亥': 'waterColor', '子': 'waterColor',
};

const ELEMENT_INFO: Record<string, ElementInfo> = {
  '甲': { name: '木', color: '#07e930' }, '乙': { name: '木', color: '#07e930' },
  '寅': { name: '木', color: '#07e930' }, '卯': { name: '木', color: '#07e930' },
  '丙': { name: '火', color: '#d30505' }, '丁': { name: '火', color: '#d30505' },
  '巳': { name: '火', color: '#d30505' }, '午': { name: '火', color: '#d30505' },
  '戊': { name: '土', color: '#8b6d03' }, '己': { name: '土', color: '#8b6d03' },
  '辰': { name: '土', color: '#8b6d03' }, '戌': { name: '土', color: '#8b6d03' },
  '丑': { name: '土', color: '#8b6d03' }, '未': { name: '土', color: '#8b6d03' },
  '庚': { name: '金', color: '#ef9104' }, '辛': { name: '金', color: '#ef9104' },
  '申': { name: '金', color: '#ef9104' }, '酉': { name: '金', color: '#ef9104' },
  '壬': { name: '水', color: '#2e83f6' }, '癸': { name: '水', color: '#2e83f6' },
  '亥': { name: '水', color: '#2e83f6' }, '子': { name: '水', color: '#2e83f6' },
};

const ELEMENT_RGB_COLORS: Record<string, string> = {
  '甲': 'rgb(7,233,48)', '乙': 'rgb(7,233,48)', '寅': 'rgb(7,233,48)', '卯': 'rgb(7,233,48)',
  '丙': 'rgb(211,5,5)', '丁': 'rgb(211,5,5)', '巳': 'rgb(211,5,5)', '午': 'rgb(211,5,5)',
  '戊': 'rgb(139,109,3)', '己': 'rgb(139,109,3)', '辰': 'rgb(139,109,3)', '戌': 'rgb(139,109,3)',
  '丑': 'rgb(139,109,3)', '未': 'rgb(139,109,3)',
  '庚': 'rgb(239,145,4)', '辛': 'rgb(239,145,4)', '申': 'rgb(239,145,4)', '酉': 'rgb(239,145,4)',
  '壬': 'rgb(46,131,246)', '癸': 'rgb(46,131,246)', '亥': 'rgb(46,131,246)', '子': 'rgb(46,131,246)',
};

export function getElementColorClass(name: string): ElementColorClass {
  return ELEMENT_COLORS[name] || 'waterColor';
}

export function getElementInfo(name: string): ElementInfo {
  return ELEMENT_INFO[name] || { name: '水' as ElementName, color: '#2e83f6' };
}

export function getElementRgbColor(name: string): string {
  return ELEMENT_RGB_COLORS[name] || 'rgb(46,131,246)';
}

export function getElementName(char: string): ElementName {
  if ('甲乙寅卯'.includes(char)) return '木';
  if ('丙丁巳午'.includes(char)) return '火';
  if ('戊己辰戌丑未'.includes(char)) return '土';
  if ('庚辛申酉'.includes(char)) return '金';
  return '水';
}

const TEN_STAR_SHORT_MAP: Record<string, string> = {
  '比肩': '比', '劫财': '劫', '食神': '食', '伤官': '伤',
  '偏财': '才', '正财': '财', '七杀': '杀', '正官': '官',
  '偏印': '枭', '正印': '印',
};

export function getTenStarShort(name: string): string {
  return TEN_STAR_SHORT_MAP[name] || name.slice(0, 1);
}

const SEASON_BRANCHES = {
  spring: ['寅', '卯'],
  summer: ['巳', '午'],
  autumn: ['申', '酉'],
  winter: ['亥', '子'],
  earth: ['辰', '未', '戌', '丑'],
};

const WUXING_STATUS_MAP: Record<string, WuXingStatus[]> = {
  spring: [
    { element: '木', status: '旺' }, { element: '火', status: '相' },
    { element: '水', status: '休' }, { element: '金', status: '囚' }, { element: '土', status: '死' },
  ],
  summer: [
    { element: '火', status: '旺' }, { element: '土', status: '相' },
    { element: '木', status: '休' }, { element: '水', status: '囚' }, { element: '金', status: '死' },
  ],
  autumn: [
    { element: '金', status: '旺' }, { element: '水', status: '相' },
    { element: '土', status: '休' }, { element: '火', status: '囚' }, { element: '木', status: '死' },
  ],
  winter: [
    { element: '水', status: '旺' }, { element: '木', status: '相' },
    { element: '金', status: '休' }, { element: '土', status: '囚' }, { element: '火', status: '死' },
  ],
  earth: [
    { element: '土', status: '旺' }, { element: '金', status: '相' },
    { element: '火', status: '休' }, { element: '木', status: '囚' }, { element: '水', status: '死' },
  ],
};

export function getWuXingStatus(branchName: string): string[] {
  if (SEASON_BRANCHES.spring.includes(branchName)) {
    return WUXING_STATUS_MAP.spring.map(w => `${w.element}${w.status}`);
  }
  if (SEASON_BRANCHES.summer.includes(branchName)) {
    return WUXING_STATUS_MAP.summer.map(w => `${w.element}${w.status}`);
  }
  if (SEASON_BRANCHES.autumn.includes(branchName)) {
    return WUXING_STATUS_MAP.autumn.map(w => `${w.element}${w.status}`);
  }
  if (SEASON_BRANCHES.winter.includes(branchName)) {
    return WUXING_STATUS_MAP.winter.map(w => `${w.element}${w.status}`);
  }
  if (SEASON_BRANCHES.earth.includes(branchName)) {
    return WUXING_STATUS_MAP.earth.map(w => `${w.element}${w.status}`);
  }
  return WUXING_STATUS_MAP.winter.map(w => `${w.element}${w.status}`);
}
