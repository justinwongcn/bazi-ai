import { useMemo } from 'react';
import type { BirthInfo } from './useBirthInfo';
import { getDecadeFortunes, getSmallFortunes } from '../services/baziService';

export interface FortuneData {
  childLimit: ReturnType<typeof getDecadeFortunes>['childLimit'];
  decades: ReturnType<typeof getDecadeFortunes>['list'];
  smallFortunes: ReturnType<typeof getSmallFortunes>;
}

export function useFortuneData(birthInfo: BirthInfo): FortuneData {
  return useMemo(() => {
    const { childLimit, list } = getDecadeFortunes(birthInfo.birthSolarTime, birthInfo.gender);
    const smallFortunes = getSmallFortunes(
      birthInfo.pillars.hour,
      birthInfo.pillars.year,
      birthInfo.gender,
      childLimit,
      birthInfo.birthYear
    );
    return { childLimit, decades: list, smallFortunes };
  }, [birthInfo]);
}
