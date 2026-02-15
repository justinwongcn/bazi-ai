import chinaRegions from '../data/china-regions.json';

export interface CityInfo {
  name: string;
  longitude: number;
  latitude: number;
  level: string;
  parentProvince?: string;
  parentCity?: string;
}

export interface RegionNode {
  name: string;
  center: {
    longitude: number;
    latitude: number;
  };
  level: string;
  districts?: RegionNode[];
}

/**
 * 中国行政区域查询工具
 * 用于根据城市名称查找经纬度信息
 */
export class CityLocator {
  private cityMap: Map<string, CityInfo[]> = new Map();
  private allCities: CityInfo[] = [];

  constructor() {
    this.buildCityMap();
  }

  /**
   * 构建城市查询索引
   */
  private buildCityMap(): void {
    const root = chinaRegions as RegionNode;
    
    if (root.districts) {
      for (const province of root.districts) {
        this.processProvince(province);
      }
    }
  }

  private processProvince(province: RegionNode): void {
    if (!province.districts) return;

    const directControlledMunicipalities = ['北京市', '上海市', '天津市', '重庆市'];
    if (directControlledMunicipalities.includes(province.name)) {
      const cityInfo: CityInfo = {
        name: province.name,
        longitude: province.center.longitude,
        latitude: province.center.latitude,
        level: 'city',
        parentProvince: province.name
      };
      this.addToMap(cityInfo);
      this.allCities.push(cityInfo);
    }

    for (const city of province.districts) {
      this.processCity(city, province.name);
    }
  }

  /**
   * 处理城市节点
   */
  private processCity(city: RegionNode, provinceName: string): void {
    const cityInfo: CityInfo = {
      name: city.name,
      longitude: city.center.longitude,
      latitude: city.center.latitude,
      level: city.level,
      parentProvince: provinceName
    };

    this.addToMap(cityInfo);
    this.allCities.push(cityInfo);

    if (city.districts && city.districts.length > 0) {
      for (const district of city.districts) {
        this.processDistrict(district, provinceName, city.name);
      }
    }
  }

  /**
   * 处理区县节点
   */
  private processDistrict(district: RegionNode, provinceName: string, cityName: string): void {
    const districtInfo: CityInfo = {
      name: district.name,
      longitude: district.center.longitude,
      latitude: district.center.latitude,
      level: district.level,
      parentProvince: provinceName,
      parentCity: cityName
    };

    this.addToMap(districtInfo);
    this.allCities.push(districtInfo);
  }

  /**
   * 将城市信息添加到查询映射
   */
  private addToMap(cityInfo: CityInfo): void {
    const key = cityInfo.name;
    if (!this.cityMap.has(key)) {
      this.cityMap.set(key, []);
    }
    this.cityMap.get(key)!.push(cityInfo);
  }

  /**
   * 根据城市名称查找城市信息
   * @param name 城市名称
   * @returns 城市信息数组，可能包含多个同名地点
   */
  findByName(name: string): CityInfo[] {
    return this.cityMap.get(name) || [];
  }

  /**
   * 根据城市名称查找唯一的城市信息
   * 如果有多个同名城市，优先返回市级行政区
   * @param name 城市名称
   * @returns 城市信息或 null
   */
  findOne(name: string): CityInfo | null {
    const cities = this.findByName(name);
    if (cities.length === 0) return null;
    if (cities.length === 1) return cities[0];
    
    // 如果有多个同名城市，优先返回市级行政区
    const cityLevel = cities.find(c => c.level === 'city');
    if (cityLevel) return cityLevel;
    
    // 其次返回区级行政区
    const districtLevel = cities.find(c => c.level === 'district');
    if (districtLevel) return districtLevel;
    
    return cities[0];
  }

  /**
   * 获取所有城市列表
   */
  getAllCities(): CityInfo[] {
    return [...this.allCities];
  }

  /**
   * 获取所有地级市列表
   */
  getAllPrefectureCities(): CityInfo[] {
    return this.allCities.filter(c => c.level === 'city');
  }

  /**
   * 搜索城市（支持模糊匹配）
   * @param keyword 搜索关键词
   * @returns 匹配的城市列表
   */
  search(keyword: string): CityInfo[] {
    if (!keyword || keyword.trim() === '') return [];
    
    const lowerKeyword = keyword.toLowerCase();
    return this.allCities.filter(city => 
      city.name.toLowerCase().includes(lowerKeyword)
    );
  }

  /**
   * 获取指定省份下的所有城市
   * @param provinceName 省份名称
   */
  getCitiesByProvince(provinceName: string): CityInfo[] {
    return this.allCities.filter(city => city.parentProvince === provinceName);
  }
}

// 导出单例实例
export const cityLocator = new CityLocator();

export default cityLocator;
