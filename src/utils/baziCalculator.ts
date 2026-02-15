import { SolarTime, EightChar, HeavenStem, EarthBranch, LunarHour } from 'tyme4ts';
import { SolarTimeUtil } from './solarTimeUtil';

export interface BaziResult {
  yearPillar: string;
  monthPillar: string;
  dayPillar: string;
  hourPillar: string;
  fullBazi: string;
  yearTenStar: string;
  monthTenStar: string;
  dayTenStar: string;
  hourTenStar: string;
  yearHiddenTenStars: string[];
  monthHiddenTenStars: string[];
  dayHiddenTenStars: string[];
  hourHiddenTenStars: string[];
  yearHiddenStems: string[];
  monthHiddenStems: string[];
  dayHiddenStems: string[];
  hourHiddenStems: string[];
  yearStarLuck: string;
  monthStarLuck: string;
  dayStarLuck: string;
  hourStarLuck: string;
  yearSelfSeat: string;
  monthSelfSeat: string;
  daySelfSeat: string;
  hourSelfSeat: string;
  yearEmpty: string;
  monthEmpty: string;
  dayEmpty: string;
  hourEmpty: string;
  yearNaYin: string;
  monthNaYin: string;
  dayNaYin: string;
  hourNaYin: string;
  taiYuan: string;
  mingGong: string;
  shenGong: string;
}

export interface BaziOptions {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second?: number;
  dateType?: string;
  longitude?: number;
  latitude?: number;
  useTrueSolar?: boolean;
  useDst?: boolean;
  useEarlyRat?: boolean;
}

export class BaziCalculator {
  /**
   * 计算八字
   * @param options 计算选项
   * @returns 八字结果
   */
  static calculate(options: BaziOptions): BaziResult {
    let { year, month, day, hour, minute, second = 0 } = options;
    let date: Date;

    if (options.dateType === '0') {
      const lunarHour = LunarHour.fromYmdHms(year, month, day, hour, minute, second);
      const solarTime = lunarHour.getSolarTime();
      date = new Date(
        solarTime.getYear(),
        solarTime.getMonth() - 1,
        solarTime.getDay(),
        solarTime.getHour(),
        solarTime.getMinute(),
        solarTime.getSecond()
      );
    } else {
      date = new Date(year, month - 1, day, hour, minute, second);
    }

    if (options.useDst) {
      date = new Date(date.getTime() - 60 * 60 * 1000);
    }

    if (options.useTrueSolar && options.longitude && options.latitude) {
      const util = new SolarTimeUtil(options.longitude, options.latitude);
      date = util.getTrueSolarTimeFromDate(date);
    }

    if (options.useEarlyRat && date.getHours() === 23) {
      date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, date.getHours(), date.getMinutes(), date.getSeconds());
    }

    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();
    hour = date.getHours();
    minute = date.getMinutes();
    second = date.getSeconds();
    
    const solarTime = SolarTime.fromYmdHms(year, month, day, hour, minute, second);
    const lunarHour = solarTime.getLunarHour();
    const eightChar: EightChar = lunarHour.getEightChar();
    const yearPillar = eightChar.getYear();
    const monthPillar = eightChar.getMonth();
    const dayPillar = eightChar.getDay();
    const hourPillar = eightChar.getHour();
    const dayHeavenStem = dayPillar.getHeavenStem();
    const getTenStarName = (stem: HeavenStem) => dayHeavenStem.getTenStar(stem).getName();
    
    const getHiddenTenStars = (earthBranch: { getHideHeavenStemMain: () => HeavenStem; getHideHeavenStemMiddle: () => HeavenStem | null; getHideHeavenStemResidual: () => HeavenStem | null; }) => {
      const stems = [
        earthBranch.getHideHeavenStemMain(),
        earthBranch.getHideHeavenStemMiddle(),
        earthBranch.getHideHeavenStemResidual()
      ].filter((stem): stem is HeavenStem => Boolean(stem));
      return stems.map(stem => getTenStarName(stem));
    };

    const getHiddenStems = (earthBranch: { getHideHeavenStemMain: () => HeavenStem; getHideHeavenStemMiddle: () => HeavenStem | null; getHideHeavenStemResidual: () => HeavenStem | null; }) => {
      const stems = [
        earthBranch.getHideHeavenStemMain(),
        earthBranch.getHideHeavenStemMiddle(),
        earthBranch.getHideHeavenStemResidual()
      ].filter((stem): stem is HeavenStem => Boolean(stem));
      // 返回 "癸水" 格式
      return stems.map(stem => stem.getName() + stem.getElement().getName());
    };

    const getTerrainName = (stem: HeavenStem, branch: EarthBranch) => stem.getTerrain(branch).getName();
    const getEmptyName = (pillar: { getHeavenStem: () => HeavenStem; getEarthBranch: () => EarthBranch; }) => {
      const stem = pillar.getHeavenStem();
      const branch = pillar.getEarthBranch();
      const stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
      const branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
      const stemIndex = stems.indexOf(stem.getName());
      const branchIndex = branches.indexOf(branch.getName());
      
      if (stemIndex === -1 || branchIndex === -1) return "";
      
      const emptyIndex1 = (branchIndex - stemIndex + 10) % 12;
      const emptyIndex2 = (branchIndex - stemIndex + 11) % 12;
      
      return branches[emptyIndex1] + branches[emptyIndex2];
    };
    const getNaYinName = (pillar: { getSound: () => { getName: () => string } }) =>
      pillar.getSound().getName();

    const formatPillarWithNaYin = (pillar: { getName: () => string; getSound: () => { getName: () => string } }) => {
        return `${pillar.getName()} (${pillar.getSound().getName()})`;
    };

    const taiYuan = formatPillarWithNaYin(eightChar.getFetalOrigin());
    const mingGong = formatPillarWithNaYin(eightChar.getOwnSign());
    const shenGong = formatPillarWithNaYin(eightChar.getBodySign());
    
    return {
      yearPillar: yearPillar.getName(),
      monthPillar: monthPillar.getName(),
      dayPillar: dayPillar.getName(),
      hourPillar: hourPillar.getName(),
      fullBazi: eightChar.toString(),
      yearTenStar: getTenStarName(yearPillar.getHeavenStem()),
      monthTenStar: getTenStarName(monthPillar.getHeavenStem()),
      dayTenStar: getTenStarName(dayHeavenStem),
      hourTenStar: getTenStarName(hourPillar.getHeavenStem()),
      yearHiddenTenStars: getHiddenTenStars(yearPillar.getEarthBranch()),
      monthHiddenTenStars: getHiddenTenStars(monthPillar.getEarthBranch()),
      dayHiddenTenStars: getHiddenTenStars(dayPillar.getEarthBranch()),
      hourHiddenTenStars: getHiddenTenStars(hourPillar.getEarthBranch()),
      yearHiddenStems: getHiddenStems(yearPillar.getEarthBranch()),
      monthHiddenStems: getHiddenStems(monthPillar.getEarthBranch()),
      dayHiddenStems: getHiddenStems(dayPillar.getEarthBranch()),
      hourHiddenStems: getHiddenStems(hourPillar.getEarthBranch()),
      yearStarLuck: getTerrainName(dayHeavenStem, yearPillar.getEarthBranch()),
      monthStarLuck: getTerrainName(dayHeavenStem, monthPillar.getEarthBranch()),
      dayStarLuck: getTerrainName(dayHeavenStem, dayPillar.getEarthBranch()),
      hourStarLuck: getTerrainName(dayHeavenStem, hourPillar.getEarthBranch()),
      yearSelfSeat: getTerrainName(yearPillar.getHeavenStem(), yearPillar.getEarthBranch()),
      monthSelfSeat: getTerrainName(monthPillar.getHeavenStem(), monthPillar.getEarthBranch()),
      daySelfSeat: getTerrainName(dayPillar.getHeavenStem(), dayPillar.getEarthBranch()),
      hourSelfSeat: getTerrainName(hourPillar.getHeavenStem(), hourPillar.getEarthBranch()),
      yearEmpty: getEmptyName(yearPillar),
      monthEmpty: getEmptyName(monthPillar),
      dayEmpty: getEmptyName(dayPillar),
      hourEmpty: getEmptyName(hourPillar),
      yearNaYin: getNaYinName(yearPillar),
      monthNaYin: getNaYinName(monthPillar),
      dayNaYin: getNaYinName(dayPillar),
      hourNaYin: getNaYinName(hourPillar),
      taiYuan,
      mingGong,
      shenGong
    };
  }
  
  /**
   * 计算八字（从 Date 对象）
   * @param date JavaScript Date 对象
   * @param longitude 经度（可选，用于真太阳时）
   * @param latitude 纬度（可选，用于真太阳时）
   * @param useTrueSolar 是否使用真太阳时
   * @returns 八字结果
   */
  static calculateFromDate(
    date: Date, 
    longitude?: number, 
    latitude?: number, 
    useTrueSolar: boolean = false,
    useDst: boolean = false,
    useEarlyRat: boolean = false
  ): BaziResult {
    return BaziCalculator.calculate({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds(),
      longitude,
      latitude,
      useTrueSolar,
      useDst,
      useEarlyRat
    });
  }
  
  /**
   * 计算八字（从字符串）
   * @param dateString ISO 格式的日期字符串，如 "1990-01-01T12:00"
   * @param longitude 经度（可选，用于真太阳时）
   * @param latitude 纬度（可选，用于真太阳时）
   * @param useTrueSolar 是否使用真太阳时
   * @returns 八字结果
   */
  static calculateFromString(
    dateString: string,
    longitude?: number,
    latitude?: number,
    useTrueSolar: boolean = false,
    useDst: boolean = false,
    useEarlyRat: boolean = false
  ): BaziResult {
    const date = new Date(dateString);
    return BaziCalculator.calculateFromDate(date, longitude, latitude, useTrueSolar, useDst, useEarlyRat);
  }
}

export default BaziCalculator;
