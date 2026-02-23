
import { describe, it, expect } from 'vitest';
import { cityLocator } from './cityLocator';

type SearchCityInfo = {
  name: string;
  level: string;
  parentProvince?: string;
  parentCity?: string;
};

describe('Location Selection Logic', () => {
  // Simulate the regionData construction from useLocationInput
  const allCities = cityLocator.getAllCities();
  const provinces = Array.from(new Set(allCities.map(c => c.parentProvince).filter((p): p is string => !!p)));
  const regionData = {
    provinces,
    cities: {} as Record<string, string[]>,
    districts: {} as Record<string, string[]>
  };

  provinces.forEach(province => {
    const provinceCities = allCities.filter(c => c.parentProvince === province && c.level === 'city');
    regionData.cities[province] = provinceCities.map(c => c.name);
    
    provinceCities.forEach(city => {
      const cityDistricts = allCities.filter(c => c.parentCity === city.name && c.level === 'district');
      regionData.districts[city.name] = cityDistricts.map(c => c.name);
    });
  });

  // Simulate handleSearchResultSelect logic (UPDATED)
  const simulateSelect = (city: SearchCityInfo, selectedProvince: string) => {
    const nextProvince = city.parentProvince || (city.level === 'province' ? city.name : selectedProvince);
    const provinceCities = regionData.cities[nextProvince] || [];
    let nextCity = city.level === 'city' ? city.name : (city.parentCity || '');
    
    const isValidCity = nextCity && provinceCities.includes(nextCity);
    
    if (!isValidCity && provinceCities.length > 0) {
      const matchedCity = city.level === 'district'
        ? provinceCities.find(item => (regionData.districts[item] || []).includes(city.name))
        : undefined;
      
      if (matchedCity) {
        nextCity = matchedCity;
      } else if (!nextCity) {
        nextCity = provinceCities[0];
      }
    }
    
    const cityDistricts = regionData.districts[nextCity] || [];
    let nextDistrict = city.level === 'district' ? city.name : '';
    
    if (cityDistricts.length > 0 && (!nextDistrict || !cityDistricts.includes(nextDistrict))) {
      const fuzzyDistrict = cityDistricts.find(d => d.includes(nextDistrict) || nextDistrict.includes(d));
      nextDistrict = fuzzyDistrict || cityDistricts[0];
    }
    
    return { nextProvince, nextCity, nextDistrict };
  };

  it('should correctly select Yugan (余干县)', () => {
    const searchResults = cityLocator.search('余干');
    expect(searchResults.length).toBeGreaterThan(0);
    const yugan = searchResults[0];
    expect(yugan.name).toBe('余干县');
    expect(yugan.parentCity).toBe('上饶市');
    expect(yugan.parentProvince).toBe('江西省');

    const result = simulateSelect(yugan, '北京市');
    
    expect(result.nextProvince).toBe('江西省');
    expect(result.nextCity).toBe('上饶市');
    expect(result.nextDistrict).toBe('余干县');
  });

  it('should verify Shangrao is in Jiangxi cities', () => {
    const jiangxiCities = regionData.cities['江西省'];
    expect(jiangxiCities).toContain('上饶市');
  });

  it('should verify Yugan is in Shangrao districts', () => {
    const shangraoDistricts = regionData.districts['上饶市'];
    expect(shangraoDistricts).toContain('余干县');
  });
});
