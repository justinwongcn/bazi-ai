import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { cityLocator } from '../utils/cityLocator';

interface CityInfo {
  name: string;
  level: string;
  parentProvince?: string;
  parentCity?: string;
  longitude: number;
  latitude: number;
}

interface RegionData {
  provinces: string[];
  cities: Record<string, string[]>;
  districts: Record<string, string[]>;
}

interface UseAddressPickerOptions {
  initialProvince?: string;
  initialCity?: string;
  initialDistrict?: string;
}

export const useAddressPicker = (options?: UseAddressPickerOptions) => {
  const [selectedProvince, setSelectedProvince] = useState(options?.initialProvince || '北京市');
  const [selectedCity, setSelectedCity] = useState(options?.initialCity || '北京城区');
  const [selectedDistrict, setSelectedDistrict] = useState(options?.initialDistrict || '东城区');
  
  const [showAddressPicker, setShowAddressPicker] = useState(false);
  const [addressTab, setAddressTab] = useState('domestic');
  const [addressSearch, setAddressSearch] = useState('');
  
  const provinceScrollRef = useRef<HTMLDivElement>(null);
  const cityScrollRef = useRef<HTMLDivElement>(null);
  const districtScrollRef = useRef<HTMLDivElement>(null);
  const addressAutoScrollingRef = useRef(false);
  const addressAutoScrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const regionData: RegionData = useMemo(() => {
    const allCities = cityLocator.getAllCities();
    const provinces = Array.from(new Set(allCities.map(c => c.parentProvince).filter((p): p is string => !!p)));
    const cities: Record<string, string[]> = {};
    const districts: Record<string, string[]> = {};

    provinces.forEach(province => {
      const provinceCities = allCities.filter(c => c.parentProvince === province && c.level === 'city');
      cities[province] = provinceCities.map(c => c.name);
      
      provinceCities.forEach(city => {
        const cityDistricts = allCities.filter(c => c.parentCity === city.name && c.level === 'district');
        districts[city.name] = cityDistricts.map(c => c.name);
      });
    });

    return { provinces, cities, districts };
  }, []);

  const searchResults = useMemo(() => {
    if (!addressSearch.trim()) return [];
    return cityLocator.search(addressSearch).slice(0, 10);
  }, [addressSearch]);

  const handleProvinceSelect = useCallback((province: string) => {
    setSelectedProvince(province);
    const cities = regionData.cities[province];
    if (cities && cities.length > 0) {
      setSelectedCity(cities[0]);
      const districts = regionData.districts[cities[0]];
      if (districts && districts.length > 0) {
        setSelectedDistrict(districts[0]);
      }
    }
  }, [regionData]);

  const handleCitySelect = useCallback((city: string) => {
    setSelectedCity(city);
    const districts = regionData.districts[city];
    if (districts && districts.length > 0) {
      setSelectedDistrict(districts[0]);
    }
  }, [regionData]);

  const handleDistrictSelect = useCallback((district: string) => {
    setSelectedDistrict(district);
  }, []);

  const handleAddressConfirm = useCallback((): { location: string; longitude: number; latitude: number } | null => {
    const cityInfo = cityLocator.findOne(selectedDistrict) || 
                    cityLocator.findOne(selectedCity) ||
                    cityLocator.findOne(selectedProvince);
    
    if (cityInfo) {
      return {
        location: `${selectedProvince} ${selectedCity} ${selectedDistrict}`,
        longitude: cityInfo.longitude,
        latitude: cityInfo.latitude
      };
    }
    return null;
  }, [selectedProvince, selectedCity, selectedDistrict]);

  const handleSearchResultSelect = useCallback((city: CityInfo) => {
    const nextProvince = city.parentProvince || (city.level === 'province' ? city.name : selectedProvince);
    const provinceCities = regionData.cities[nextProvince] || [];
    let nextCity = city.level === 'city' ? city.name : (city.parentCity || '');
    if (!nextCity || (provinceCities.length > 0 && !provinceCities.includes(nextCity))) {
      if (provinceCities.length > 0) {
        const matchedCity = city.level === 'district'
          ? provinceCities.find(item => (regionData.districts[item] || []).includes(city.name))
          : undefined;
        nextCity = matchedCity || provinceCities[0];
      } else {
        nextCity = city.level === 'city' ? city.name : (city.parentCity || nextProvince);
      }
    }
    const cityDistricts = regionData.districts[nextCity] || [];
    let nextDistrict = city.level === 'district' ? city.name : '';
    if (cityDistricts.length > 0 && (!nextDistrict || !cityDistricts.includes(nextDistrict))) {
      nextDistrict = cityDistricts[0];
    }
    setSelectedProvince(nextProvince);
    setSelectedCity(nextCity);
    setSelectedDistrict(nextDistrict || selectedDistrict);
    setAddressSearch('');
  }, [regionData, selectedProvince, selectedDistrict]);

  useEffect(() => {
    if (showAddressPicker && addressTab === 'domestic' && !addressSearch.trim()) {
      const timer = setTimeout(() => {
        const scrollTo = (ref: React.RefObject<HTMLDivElement | null>, val: string, list: string[]) => {
          if (ref.current) {
            const index = list.indexOf(val);
            if (index !== -1) {
              const targetTop = index * 40;
              if (Math.abs(ref.current.scrollTop - targetTop) > 10) {
                ref.current.scrollTo({ top: targetTop, behavior: 'smooth' });
              }
            }
          }
        };
        addressAutoScrollingRef.current = true;
        if (addressAutoScrollTimeoutRef.current) {
          clearTimeout(addressAutoScrollTimeoutRef.current);
        }
        addressAutoScrollTimeoutRef.current = setTimeout(() => {
          addressAutoScrollingRef.current = false;
        }, 600);
        scrollTo(provinceScrollRef, selectedProvince, regionData.provinces);
        scrollTo(cityScrollRef, selectedCity, regionData.cities[selectedProvince] || []);
        scrollTo(districtScrollRef, selectedDistrict, regionData.districts[selectedCity] || []);
      }, 10);
      return () => {
        clearTimeout(timer);
        addressAutoScrollingRef.current = false;
        if (addressAutoScrollTimeoutRef.current) {
          clearTimeout(addressAutoScrollTimeoutRef.current);
          addressAutoScrollTimeoutRef.current = null;
        }
      };
    }
  }, [showAddressPicker, addressTab, addressSearch, selectedProvince, selectedCity, selectedDistrict, regionData]);

  return {
    selectedProvince,
    selectedCity,
    selectedDistrict,
    setSelectedProvince,
    setSelectedCity,
    setSelectedDistrict,
    showAddressPicker,
    setShowAddressPicker,
    addressTab,
    setAddressTab,
    addressSearch,
    setAddressSearch,
    regionData,
    searchResults,
    handleProvinceSelect,
    handleCitySelect,
    handleDistrictSelect,
    handleAddressConfirm,
    handleSearchResultSelect,
    refs: {
      provinceScrollRef,
      cityScrollRef,
      districtScrollRef
    }
  };
};
