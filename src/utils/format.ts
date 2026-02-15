import { WUXING_ICON_DATA_URI } from '../data/wuxingIcons';
import { getElementInfo } from '../services/elementService';

export function getElementIconDataUri(char: string): string {
  const meta = getElementInfo(char);
  if (!meta.name) return '';
  return WUXING_ICON_DATA_URI[meta.name as keyof typeof WUXING_ICON_DATA_URI] || '';
}

export function formatSolarTime(solarTime: { getYear: () => number; getMonth: () => number; getDay: () => number; getHour: () => number; getMinute: () => number }): string {
  const y = solarTime.getYear();
  const m = String(solarTime.getMonth()).padStart(2, '0');
  const d = String(solarTime.getDay()).padStart(2, '0');
  const h = String(solarTime.getHour()).padStart(2, '0');
  const min = String(solarTime.getMinute()).padStart(2, '0');
  return `${y}年${m}月${d}日 ${h}:${min}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
