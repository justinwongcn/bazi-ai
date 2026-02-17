import { WUXING_ICON_DATA_URI } from '../data/wuxingIcons';

export const getElementColor = (char: string): string => {
  const colors: Record<string, string> = {
    '甲': 'rgb(7,233,48)', '乙': 'rgb(7,233,48)',
    '寅': 'rgb(7,233,48)', '卯': 'rgb(7,233,48)',
    '丙': 'rgb(211,5,5)', '丁': 'rgb(211,5,5)',
    '巳': 'rgb(211,5,5)', '午': 'rgb(211,5,5)',
    '戊': 'rgb(139,109,3)', '己': 'rgb(139,109,3)',
    '辰': 'rgb(139,109,3)', '戌': 'rgb(139,109,3)', '丑': 'rgb(139,109,3)', '未': 'rgb(139,109,3)',
    '庚': 'rgb(239,145,4)', '辛': 'rgb(239,145,4)',
    '申': 'rgb(239,145,4)', '酉': 'rgb(239,145,4)',
    '壬': 'rgb(46,131,246)', '癸': 'rgb(46,131,246)',
    '亥': 'rgb(46,131,246)', '子': 'rgb(46,131,246)'
  };
  return colors[char] || '#374151';
};

export const getElementMeta = (char: string): { label: string; color: string } => {
  const metaMap: Record<string, { label: string; color: string }> = {
    '甲': { label: '木', color: '#07e930' }, '乙': { label: '木', color: '#07e930' },
    '寅': { label: '木', color: '#07e930' }, '卯': { label: '木', color: '#07e930' },
    '丙': { label: '火', color: '#d30505' }, '丁': { label: '火', color: '#d30505' },
    '巳': { label: '火', color: '#d30505' }, '午': { label: '火', color: '#d30505' },
    '戊': { label: '土', color: '#8b6d03' }, '己': { label: '土', color: '#8b6d03' },
    '辰': { label: '土', color: '#8b6d03' }, '戌': { label: '土', color: '#8b6d03' }, '丑': { label: '土', color: '#8b6d03' }, '未': { label: '土', color: '#8b6d03' },
    '庚': { label: '金', color: '#ef9104' }, '辛': { label: '金', color: '#ef9104' },
    '申': { label: '金', color: '#ef9104' }, '酉': { label: '金', color: '#ef9104' },
    '壬': { label: '水', color: '#2e83f6' }, '癸': { label: '水', color: '#2e83f6' },
    '亥': { label: '水', color: '#2e83f6' }, '子': { label: '水', color: '#2e83f6' }
  };
  return metaMap[char] || { label: '', color: '#9ca3af' };
};

export const getElementIconDataUri = (char: string): string => {
  const meta = getElementMeta(char);
  if (!meta.label) return '';
  return WUXING_ICON_DATA_URI[meta.label as keyof typeof WUXING_ICON_DATA_URI] || '';
};
