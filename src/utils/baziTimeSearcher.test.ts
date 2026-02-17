import { describe, it, expect } from 'vitest';
import {
  getEvenHourFromBranch,
  getHourBranchDisplayName,
  validatePillar,
  validateSearchParams,
  searchBaziTimes,
  HOUR_BRANCH_TO_EVEN_HOUR,
  HOUR_BRANCH_NAMES
} from './baziTimeSearcher';

describe('baziTimeSearcher', () => {
  describe('HOUR_BRANCH_TO_EVEN_HOUR', () => {
    it('should have all 12 earthly branches', () => {
      const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
      branches.forEach(branch => {
        expect(HOUR_BRANCH_TO_EVEN_HOUR).toHaveProperty(branch);
      });
    });

    it('should map each branch to an even hour', () => {
      Object.values(HOUR_BRANCH_TO_EVEN_HOUR).forEach(hour => {
        expect(hour).toBeGreaterThanOrEqual(0);
        expect(hour).toBeLessThanOrEqual(22);
        expect(hour % 2).toBe(0);
      });
    });
  });

  describe('HOUR_BRANCH_NAMES', () => {
    it('should have display names for all branches', () => {
      const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
      branches.forEach(branch => {
        expect(HOUR_BRANCH_NAMES[branch]).toContain(branch);
        expect(HOUR_BRANCH_NAMES[branch]).toMatch(/\d{2}:\d{2}/);
      });
    });
  });

  describe('getEvenHourFromBranch', () => {
    it('should return correct even hour for each branch', () => {
      expect(getEvenHourFromBranch('子')).toBe(0);
      expect(getEvenHourFromBranch('丑')).toBe(2);
      expect(getEvenHourFromBranch('寅')).toBe(4);
      expect(getEvenHourFromBranch('卯')).toBe(6);
      expect(getEvenHourFromBranch('辰')).toBe(8);
      expect(getEvenHourFromBranch('巳')).toBe(10);
      expect(getEvenHourFromBranch('午')).toBe(12);
      expect(getEvenHourFromBranch('未')).toBe(14);
      expect(getEvenHourFromBranch('申')).toBe(16);
      expect(getEvenHourFromBranch('酉')).toBe(18);
      expect(getEvenHourFromBranch('戌')).toBe(20);
      expect(getEvenHourFromBranch('亥')).toBe(22);
    });

    it('should return 0 for unknown branch', () => {
      expect(getEvenHourFromBranch('x')).toBe(0);
    });
  });

  describe('getHourBranchDisplayName', () => {
    it('should return formatted display name for known branches', () => {
      expect(getHourBranchDisplayName('子')).toBe('子时(23:00-01:00)');
      expect(getHourBranchDisplayName('午')).toBe('午时(11:00-13:00)');
    });

    it('should return the branch itself for unknown branches', () => {
      expect(getHourBranchDisplayName('x')).toBe('x');
    });
  });

  describe('validatePillar', () => {
    it('should return true for valid pillars', () => {
      expect(validatePillar('甲子')).toBe(true);
      expect(validatePillar('乙丑')).toBe(true);
      expect(validatePillar('丙寅')).toBe(true);
      expect(validatePillar('癸亥')).toBe(true);
    });

    it('should return false for invalid pillars', () => {
      expect(validatePillar('')).toBe(false);
      expect(validatePillar('甲')).toBe(false);
      expect(validatePillar('甲子乙')).toBe(false);
      expect(validatePillar('abc')).toBe(false);
      expect(validatePillar('甲x')).toBe(false);
      expect(validatePillar('x子')).toBe(false);
    });
  });

  describe('validateSearchParams', () => {
    const validParams = {
      yearPillar: '甲子',
      monthPillar: '丙寅',
      dayPillar: '甲子',
      hourPillar: '甲子',
      startYear: 2000,
      endYear: 2010
    };

    it('should return null for valid params', () => {
      expect(validateSearchParams(validParams)).toBeNull();
    });

    it('should return error for invalid year pillar', () => {
      expect(validateSearchParams({ ...validParams, yearPillar: 'abc' })).toBe('年柱格式不正确，应为如"甲子"格式');
    });

    it('should return error for invalid month pillar', () => {
      expect(validateSearchParams({ ...validParams, monthPillar: 'abc' })).toBe('月柱格式不正确，应为如"丙寅"格式');
    });

    it('should return error for invalid day pillar', () => {
      expect(validateSearchParams({ ...validParams, dayPillar: 'abc' })).toBe('日柱格式不正确，应为如"甲子"格式');
    });

    it('should return error for invalid hour pillar', () => {
      expect(validateSearchParams({ ...validParams, hourPillar: 'abc' })).toBe('时柱格式不正确，应为如"甲子"格式');
    });

    it('should return error when start year is greater than end year', () => {
      expect(validateSearchParams({ ...validParams, startYear: 2010, endYear: 2000 })).toBe('起始年份不能大于结束年份');
    });
  });

  describe('searchBaziTimes', () => {
    it('should throw error for invalid pillars', () => {
      expect(() => searchBaziTimes({
        yearPillar: 'abc',
        monthPillar: '丙寅',
        dayPillar: '甲子',
        hourPillar: '甲子',
        startYear: 2000,
        endYear: 2001
      })).toThrow('年柱格式不正确');
    });

    it('should return array of results for valid pillars', () => {
      const results = searchBaziTimes({
        yearPillar: '甲子',
        monthPillar: '丙寅',
        dayPillar: '甲子',
        hourPillar: '甲子',
        startYear: 1901,
        endYear: 2099
      });

      expect(Array.isArray(results)).toBe(true);
    });

    it('should return results with correct structure when results exist', () => {
      const results = searchBaziTimes({
        yearPillar: '甲子',
        monthPillar: '丙寅',
        dayPillar: '甲子',
        hourPillar: '甲子',
        startYear: 1901,
        endYear: 2099
      });

      if (results.length > 0) {
        const result = results[0];
        expect(result).toHaveProperty('year');
        expect(result).toHaveProperty('month');
        expect(result).toHaveProperty('day');
        expect(result).toHaveProperty('hour');
        expect(result).toHaveProperty('minute');
        expect(result).toHaveProperty('hourBranch');
        expect(result).toHaveProperty('hourDisplayName');
        expect(result).toHaveProperty('formattedTime');
        expect(result).toHaveProperty('bazi');
        expect(result.bazi).toHaveProperty('year');
        expect(result.bazi).toHaveProperty('month');
        expect(result.bazi).toHaveProperty('day');
        expect(result.bazi).toHaveProperty('hour');
      }
    });

    it('should return results within the specified year range when results exist', () => {
      const startYear = 1901;
      const endYear = 2000;
      const results = searchBaziTimes({
        yearPillar: '甲子',
        monthPillar: '丙寅',
        dayPillar: '甲子',
        hourPillar: '甲子',
        startYear,
        endYear
      });

      results.forEach(result => {
        expect(result.year).toBeGreaterThanOrEqual(startYear);
        expect(result.year).toBeLessThanOrEqual(endYear);
      });
    });

    it('should format time correctly when results exist', () => {
      const results = searchBaziTimes({
        yearPillar: '甲子',
        monthPillar: '丙寅',
        dayPillar: '甲子',
        hourPillar: '甲子',
        startYear: 1901,
        endYear: 2099
      });

      if (results.length > 0) {
        const result = results[0];
        expect(result.formattedTime).toMatch(/^\d{4}年\d{1,2}月\d{1,2}日 \d{2}:\d{2}$/);
      }
    });

    it('should return empty array for unmatched pillars in small range', () => {
      const results = searchBaziTimes({
        yearPillar: '甲子',
        monthPillar: '丙寅',
        dayPillar: '甲子',
        hourPillar: '甲子',
        startYear: 2024,
        endYear: 2024
      });

      expect(Array.isArray(results)).toBe(true);
    });
  });
});
