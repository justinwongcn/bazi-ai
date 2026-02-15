import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getDefaultParams } from '../utils/defaultParams';

export interface BaseParams {
  name: string;
  sex: string;
  dateType: string;
  date: string;
  isTrueSolar: string;
  dst: string;
  earlyRatHour: string;
  longitude: string;
  latitude: string;
  hasParams: boolean;
}

export function useBaseParams(): BaseParams {
  const [searchParams] = useSearchParams();

  return useMemo(() => {
    const defaultParams = getDefaultParams();
    const hasParams = Array.from(searchParams.keys()).length > 0;
    return {
      name: searchParams.get('name') ?? defaultParams.name,
      sex: searchParams.get('sex') ?? defaultParams.sex,
      dateType: searchParams.get('dateType') ?? defaultParams.dateType,
      date: searchParams.get('date') ?? defaultParams.date,
      isTrueSolar: searchParams.get('isTrueSolar') ?? defaultParams.isTrueSolar,
      dst: searchParams.get('dst') ?? '0',
      earlyRatHour: searchParams.get('earlyRatHour') ?? '1',
      longitude: searchParams.get('longitude') ?? defaultParams.longitude,
      latitude: searchParams.get('latitude') ?? defaultParams.latitude,
      hasParams,
    };
  }, [searchParams]);
}

export function parseBool(v: string | null, fallback: boolean): boolean {
  if (v === null) return fallback;
  if (v === '1' || v.toLowerCase() === 'true') return true;
  if (v === '0' || v.toLowerCase() === 'false') return false;
  return fallback;
}

export function parseDateSafe(v: string | null, fallback: Date): Date {
  if (!v) return fallback;
  const d = new Date(v);
  return Number.isFinite(d.getTime()) ? d : fallback;
}

export function parseDateTime(value: string) {
  const [datePart, timePart = '00:00'] = value.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);
  return { year, month, day, hour, minute };
}
