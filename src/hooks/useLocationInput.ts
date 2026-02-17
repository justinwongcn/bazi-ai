import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { cityLocator } from '../utils/cityLocator';
import { SolarTimeUtil } from '../utils/solarTimeUtil';

export interface FormData {
  name: string;
  sex: string;
  dateType: string;
  birthDate: string;
  lunarMonth: number;
  lunarLeap: boolean;
  location: string;
  longitude: number | null;
  latitude: number | null;
  isDst: boolean;
  isTrueSolar: boolean;
  isEarlyRat: boolean;
}

export interface RegionData {
  provinces: string[];
  cities: Record<string, string[]>;
  districts: Record<string, string[]>;
}

export interface CityInfo {
  name: string;
  level: string;
  parentProvince?: string;
  parentCity?: string;
  longitude: number;
  latitude: number;
}

interface InitialCityInfo {
  parentProvince?: string;
  parentCity?: string;
  name?: string;
}

interface UseLocationInputOptions {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  initialCity?: InitialCityInfo;
}

interface UseLocationInputReturn {
  showAddressPicker: boolean;
  addressTab: 'domestic' | 'overseas';
  addressSearch: string;
  selectedProvince: string;
  selectedCity: string;
  selectedDistrict: string;
  formData: FormData;
  trueSolarTimeDiff: string;
  regionData: RegionData;
  searchResults: CityInfo[];
  setShowAddressPicker: (show: boolean) => void;
  setAddressTab: (tab: 'domestic' | 'overseas') => void;
  setAddressSearch: (search: string) => void;
  setSelectedProvince: (province: string) => void;
  setSelectedCity: (city: string) => void;
  setSelectedDistrict: (district: string) => void;
  handleProvinceSelect: (province: string) => void;
  handleCitySelect: (city: string) => void;
  handleDistrictSelect: (district: string) => void;
  handleAddressConfirm: () => void;
  handleSearchResultSelect: (city: CityInfo) => void;
  calculateTrueSolarTimeDiff: (longitude: number, latitude: number) => void;
  provinceScrollRef: React.RefObject<HTMLDivElement | null>;
  cityScrollRef: React.RefObject<HTMLDivElement | null>;
  districtScrollRef: React.RefObject<HTMLDivElement | null>;
}

export const useLocationInput = ({
  formData,
  setFormData,
  initialCity
}: UseLocationInputOptions): UseLocationInputReturn => {
  const [showAddressPicker, setShowAddressPicker] = useState(false);
  const [addressTab, setAddressTab] = useState<'domestic' | 'overseas'>('domestic');
  const [addressSearch, setAddressSearch] = useState('');
  const [trueSolarTimeDiff, setTrueSolarTimeDiff] = useState<string>('');

  const [selectedProvince, setSelectedProvince] = useState(() => initialCity?.parentProvince || '北京市');
  const [selectedCity, setSelectedCity] = useState(() => initialCity?.parentCity || initialCity?.name || '北京城区');
  const [selectedDistrict, setSelectedDistrict] = useState('东城区');

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
  }, [
    showAddressPicker,
    addressTab,
    addressSearch,
    selectedProvince,
    selectedCity,
    selectedDistrict,
    regionData
  ]);

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

  const calculateTrueSolarTimeDiff = useCallback((longitude: number, latitude: number) => {
    try {
      const util = new SolarTimeUtil(longitude, latitude);
      const date = new Date(formData.birthDate);
      const equationOfTime = util.getEquationOfTime(date);
      const longitudeDiff = (longitude - 120) * 4;
      const totalDiff = equationOfTime + longitudeDiff;

      const sign = totalDiff >= 0 ? '+' : '-';
      const absDiff = Math.abs(totalDiff);
      const hours = Math.floor(absDiff / 60);
      const minutes = Math.floor(absDiff % 60);

      if (hours > 0) {
        setTrueSolarTimeDiff(`${sign}${hours}小时${minutes}分钟`);
      } else {
        setTrueSolarTimeDiff(`${sign}${minutes}分钟`);
      }
    } catch {
      setTrueSolarTimeDiff('');
    }
  }, [formData.birthDate]);

  const handleAddressConfirm = useCallback(() => {
    const cityInfo = cityLocator.findOne(selectedDistrict) ||
                    cityLocator.findOne(selectedCity) ||
                    cityLocator.findOne(selectedProvince);

    if (cityInfo) {
      setFormData(prev => ({
        ...prev,
        location: `${selectedProvince} ${selectedCity} ${selectedDistrict}`,
        longitude: cityInfo.longitude,
        latitude: cityInfo.latitude,
        isTrueSolar: true
      }));
      calculateTrueSolarTimeDiff(cityInfo.longitude, cityInfo.latitude);
    }

    setShowAddressPicker(false);
  }, [selectedProvince, selectedCity, selectedDistrict, setFormData, calculateTrueSolarTimeDiff]);

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
  }, [selectedProvince, selectedDistrict, regionData]);

  return {
    showAddressPicker,
    addressTab,
    addressSearch,
    selectedProvince,
    selectedCity,
    selectedDistrict,
    formData,
    trueSolarTimeDiff,
    regionData,
    searchResults,
    setShowAddressPicker,
    setAddressTab,
    setAddressSearch,
    setSelectedProvince,
    setSelectedCity,
    setSelectedDistrict,
    handleProvinceSelect,
    handleCitySelect,
    handleDistrictSelect,
    handleAddressConfirm,
    handleSearchResultSelect,
    calculateTrueSolarTimeDiff,
    provinceScrollRef,
    cityScrollRef,
    districtScrollRef
  };
};
