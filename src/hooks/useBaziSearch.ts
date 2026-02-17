import { useState, useCallback } from 'react';
import {
  searchBaziTimes,
  type BaziSearchResult,
  type BaziSearchParams
} from '../utils/baziTimeSearcher';
import { BAZI_SEARCH_START_YEAR, BAZI_SEARCH_END_YEAR } from '../constants/dateType';

interface PillarInput {
  yearPillar: string;
  monthPillar: string;
  dayPillar: string;
  hourPillar: string;
}

interface UseBaziSearchReturn {
  results: BaziSearchResult[];
  selectedResult: BaziSearchResult | null;
  error: string | null;
  showModal: boolean;
  isSearching: boolean;
  search: (pillars: PillarInput) => void;
  searchWithRange: (pillars: PillarInput, startYear: number, endYear: number) => void;
  selectResult: (result: BaziSearchResult | null) => void;
  confirmSelection: () => BaziSearchResult | null;
  closeModal: () => void;
  clearError: () => void;
}

export function useBaziSearch(): UseBaziSearchReturn {
  const [results, setResults] = useState<BaziSearchResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<BaziSearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setSelectedResult(null);
  }, []);

  const executeSearch = useCallback((params: BaziSearchParams) => {
    setIsSearching(true);
    setError(null);

    try {
      const searchResults = searchBaziTimes(params);

      if (searchResults.length === 0) {
        setError(`在${params.startYear}-${params.endYear}年范围内未找到匹配的时间，请检查输入的四柱信息是否正确。`);
        setResults([]);
        setShowModal(false);
      } else {
        setResults(searchResults);
        setSelectedResult(null);
        setShowModal(true);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '查询失败，请检查输入';
      setError(errorMessage);
      setResults([]);
      setShowModal(false);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const search = useCallback((pillars: PillarInput) => {
    executeSearch({
      ...pillars,
      startYear: BAZI_SEARCH_START_YEAR,
      endYear: BAZI_SEARCH_END_YEAR
    });
  }, [executeSearch]);

  const searchWithRange = useCallback((pillars: PillarInput, startYear: number, endYear: number) => {
    executeSearch({
      ...pillars,
      startYear,
      endYear
    });
  }, [executeSearch]);

  const selectResult = useCallback((result: BaziSearchResult | null) => {
    setSelectedResult(result);
  }, []);

  const confirmSelection = useCallback(() => {
    if (!selectedResult) return null;
    closeModal();
    return selectedResult;
  }, [selectedResult, closeModal]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    results,
    selectedResult,
    error,
    showModal,
    isSearching,
    search,
    searchWithRange,
    selectResult,
    confirmSelection,
    closeModal,
    clearError
  };
}

export default useBaziSearch;
