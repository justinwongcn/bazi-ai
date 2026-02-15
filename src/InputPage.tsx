import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { cityLocator } from './utils/cityLocator';
import { SolarTimeUtil } from './utils/solarTimeUtil';
import { LunarYear, LunarMonth, LunarDay, SolarTime } from 'tyme4ts';
import Sidebar from './components/Sidebar';

interface FormData {
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

interface RegionData {
  provinces: string[];
  cities: Record<string, string[]>;
  districts: Record<string, string[]>;
}

const InputPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialDateType = searchParams.get('dateType') || '1';
  const initialLunarMonthParam = searchParams.get('lunarMonth');
  const initialLunarLeapParam = searchParams.get('lunarLeap');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showAddressPicker, setShowAddressPicker] = useState(false);
  const [timeTab, setTimeTab] = useState(initialDateType === '0' ? 'lunar' : 'solar');
  const [addressTab, setAddressTab] = useState('domestic');
  const [timeInput, setTimeInput] = useState('');
  const [addressSearch, setAddressSearch] = useState('');
  const [trueSolarTimeDiff, setTrueSolarTimeDiff] = useState<string>('');
  
  const initialBirthDate = searchParams.get('birthDate') || '1990-01-01T12:00';
  const initialDateForFields = new Date(initialBirthDate);
  const initialLunarMonth = initialLunarMonthParam ? parseInt(initialLunarMonthParam, 10) : (initialDateForFields.getMonth() + 1);
  const initialLunarLeap = initialLunarLeapParam === '1';

  const [formData, setFormData] = useState<FormData>({
    name: searchParams.get('name') || '',
    sex: searchParams.get('sex') || '1',
    dateType: initialDateType,
    birthDate: initialBirthDate,
    lunarMonth: initialLunarMonth,
    lunarLeap: initialLunarLeap,
    location: searchParams.get('location') || '北京市 东经116.41° 北纬39.90°',
    longitude: parseFloat(searchParams.get('longitude') || '116.407394'),
    latitude: parseFloat(searchParams.get('latitude') || '39.904211'),
    isDst: searchParams.get('isDst') === '1',
    isTrueSolar: searchParams.get('isTrueSolar') === '1',
    isEarlyRat: searchParams.get('isEarlyRat') === '1'
  });

  const initialDate = new Date(formData.birthDate);
  const initialCity = formData.longitude && formData.latitude
    ? cityLocator.getAllCities().find(
        c => Math.abs(c.longitude - formData.longitude!) < 0.1 &&
             Math.abs(c.latitude - formData.latitude!) < 0.1
      )
    : undefined;

  const [selectedYear, setSelectedYear] = useState(() => initialDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(() => {
    if (initialDateType === '0') {
      return initialLunarLeap ? -initialLunarMonth : initialLunarMonth;
    }
    return initialDate.getMonth() + 1;
  });
  const [selectedDay, setSelectedDay] = useState(() => initialDate.getDate());
  const [selectedHour, setSelectedHour] = useState(() => initialDate.getHours());
  const [selectedMinute, setSelectedMinute] = useState(() => initialDate.getMinutes());

  const [selectedProvince, setSelectedProvince] = useState(() => initialCity?.parentProvince || '北京市');
  const [selectedCity, setSelectedCity] = useState(() => initialCity?.parentCity || initialCity?.name || '北京城区');
  const [selectedDistrict, setSelectedDistrict] = useState('东城区');

  const yearScrollRef = useRef<HTMLDivElement>(null);
  const monthScrollRef = useRef<HTMLDivElement>(null);
  const dayScrollRef = useRef<HTMLDivElement>(null);
  const hourScrollRef = useRef<HTMLDivElement>(null);
  const minuteScrollRef = useRef<HTMLDivElement>(null);
  const provinceScrollRef = useRef<HTMLDivElement>(null);
  const cityScrollRef = useRef<HTMLDivElement>(null);
  const districtScrollRef = useRef<HTMLDivElement>(null);

  const years = useMemo(() => Array.from({ length: 200 }, (_, i) => 1900 + i), []);
  const getMonthOptions = (year: number, dateType: string) => {
    if (dateType === '0') {
      return LunarYear.fromYear(year).getMonths().map((month) => ({
        value: month.getMonthWithLeap(),
        label: month.getName()
      }));
    }
    return Array.from({ length: 12 }, (_, i) => ({
      value: i + 1,
      label: String(i + 1)
    }));
  };
  const getDayCount = (year: number, monthValue: number, dateType: string) => {
    if (dateType === '0') {
      return LunarMonth.fromYm(year, monthValue).getDayCount();
    }
    return new Date(year, monthValue, 0).getDate();
  };
  const normalizeMonth = (monthValue: number, year: number, dateType: string) => {
    const values = getMonthOptions(year, dateType).map(item => item.value);
    if (values.includes(monthValue)) {
      return monthValue;
    }
    if (dateType === '1') {
      const clamped = Math.min(12, Math.max(1, Math.abs(monthValue)));
      return values.includes(clamped) ? clamped : values[0];
    }
    return values[0];
  };
  const clampDay = (year: number, monthValue: number, dateType: string, dayValue: number) => {
    const maxDay = getDayCount(year, monthValue, dateType);
    return Math.min(dayValue, maxDay);
  };
  const months = useMemo(() => getMonthOptions(selectedYear, formData.dateType), [formData.dateType, selectedYear]);
  const days = useMemo(() => {
    const dayCount = getDayCount(selectedYear, selectedMonth, formData.dateType);
    return Array.from({ length: dayCount }, (_, i) => i + 1);
  }, [formData.dateType, selectedYear, selectedMonth]);
  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const minutes = useMemo(() => Array.from({ length: 60 }, (_, i) => i), []);

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

  // Scroll to selected items when picker opens or selection changes
  useEffect(() => {
    if (showTimePicker) {
      const timer = setTimeout(() => {
        const scrollTo = (ref: React.RefObject<HTMLDivElement | null>, val: number, list: number[]) => {
          if (ref.current) {
            const index = list.indexOf(val);
            if (index !== -1) {
              const targetTop = index * 44;
              if (Math.abs(ref.current.scrollTop - targetTop) > 10) {
                ref.current.scrollTo({ top: targetTop, behavior: 'smooth' });
              }
            }
          }
        };
        scrollTo(yearScrollRef, selectedYear, years);
        scrollTo(monthScrollRef, selectedMonth, months.map(item => item.value));
        scrollTo(dayScrollRef, selectedDay, days);
        scrollTo(hourScrollRef, selectedHour, hours);
        scrollTo(minuteScrollRef, selectedMinute, minutes);
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [showTimePicker, selectedYear, selectedMonth, selectedDay, selectedHour, selectedMinute, years, months, days, hours, minutes]);

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
        scrollTo(provinceScrollRef, selectedProvince, regionData.provinces);
        scrollTo(cityScrollRef, selectedCity, regionData.cities[selectedProvince] || []);
        scrollTo(districtScrollRef, selectedDistrict, regionData.districts[selectedCity] || []);
      }, 10);
      return () => clearTimeout(timer);
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

  const scrollTimeouts = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // 鼠标拖动滚动相关 ref（使用 ref 避免重渲染，提高性能）
  const dragStateRef = useRef({
    isDragging: false,
    startY: 0,
    startScrollTop: 0,
    currentRef: null as HTMLDivElement | null,
    rafId: null as number | null,
    targetScrollTop: 0
  });

  const handleScroll = (key: string, e: React.UIEvent<HTMLDivElement>, list: (number | { value: number })[], currentVal: number, onSelect: (val: number) => void) => {
    const target = e.target as HTMLDivElement;
    if (scrollTimeouts.current[key]) {
      clearTimeout(scrollTimeouts.current[key]);
    }

    scrollTimeouts.current[key] = setTimeout(() => {
      const index = Math.round(target.scrollTop / 44);
      if (index >= 0 && index < list.length) {
        const item = list[index];
        const val = (typeof item === 'object' && item !== null && 'value' in item) ? item.value : (item as number);
        if (val !== currentVal) {
          onSelect(val);
        }
      }
    }, 100);
  };

  const handleAddressScroll = (key: string, e: React.UIEvent<HTMLDivElement>, list: string[], currentVal: string, onSelect: (val: string) => void) => {
    const target = e.target as HTMLDivElement;
    if (scrollTimeouts.current[key]) {
      clearTimeout(scrollTimeouts.current[key]);
    }

    scrollTimeouts.current[key] = setTimeout(() => {
      const index = Math.round(target.scrollTop / 40);
      if (index >= 0 && index < list.length) {
        const val = list[index];
        if (val !== currentVal) {
          onSelect(val);
        }
      }
    }, 100);
  };

  // 使用 requestAnimationFrame 实现流畅的滚动更新
  const updateScroll = () => {
    const state = dragStateRef.current;
    if (state.currentRef && state.isDragging) {
      state.currentRef.scrollTop = state.targetScrollTop;
    }
  };

  // 处理鼠标按下事件
  const handleMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    scrollRef: React.RefObject<HTMLDivElement | null>
  ) => {
    if (!scrollRef.current) return;
    
    e.preventDefault();
    const state = dragStateRef.current;
    
    state.isDragging = true;
    state.startY = e.clientY;
    state.startScrollTop = scrollRef.current.scrollTop;
    state.currentRef = scrollRef.current;
    state.targetScrollTop = scrollRef.current.scrollTop;

    // 添加全局事件监听
    document.addEventListener('mousemove', handleGlobalMouseMove, { passive: false });
    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('mouseleave', handleGlobalMouseUp);
  };

  // 全局鼠标移动处理
  const handleGlobalMouseMove = (e: MouseEvent) => {
    const state = dragStateRef.current;
    if (!state.isDragging || !state.currentRef) return;

    e.preventDefault();
    const deltaY = state.startY - e.clientY;
    state.targetScrollTop = state.startScrollTop + deltaY;

    // 使用 requestAnimationFrame 优化性能
    if (!state.rafId) {
      state.rafId = requestAnimationFrame(() => {
        updateScroll();
        state.rafId = null;
      });
    }
  };

  // 全局鼠标释放处理
  const handleGlobalMouseUp = () => {
    const state = dragStateRef.current;
    
    state.isDragging = false;
    state.currentRef = null;
    
    if (state.rafId) {
      cancelAnimationFrame(state.rafId);
      state.rafId = null;
    }

    // 移除全局事件监听
    document.removeEventListener('mousemove', handleGlobalMouseMove);
    document.removeEventListener('mouseup', handleGlobalMouseUp);
    document.removeEventListener('mouseleave', handleGlobalMouseUp);
  };

  const handleProvinceSelect = (province: string) => {
    setSelectedProvince(province);
    const cities = regionData.cities[province];
    if (cities && cities.length > 0) {
      setSelectedCity(cities[0]);
      const districts = regionData.districts[cities[0]];
      if (districts && districts.length > 0) {
        setSelectedDistrict(districts[0]);
      }
    }
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    const districts = regionData.districts[city];
    if (districts && districts.length > 0) {
      setSelectedDistrict(districts[0]);
    }
  };

  const handleDistrictSelect = (district: string) => {
    setSelectedDistrict(district);
  };

  const handleYearSelect = (year: number) => {
    const nextMonth = normalizeMonth(selectedMonth, year, formData.dateType);
    const nextDay = clampDay(year, nextMonth, formData.dateType, selectedDay);
    setSelectedYear(year);
    if (nextMonth !== selectedMonth) {
      setSelectedMonth(nextMonth);
    }
    if (nextDay !== selectedDay) {
      setSelectedDay(nextDay);
    }
  };

  const handleMonthSelect = (monthValue: number) => {
    const nextDay = clampDay(selectedYear, monthValue, formData.dateType, selectedDay);
    setSelectedMonth(monthValue);
    if (nextDay !== selectedDay) {
      setSelectedDay(nextDay);
    }
  };

  const handleDateTypeChange = (nextType: string) => {
    const nextMonth = normalizeMonth(selectedMonth, selectedYear, nextType);
    const nextDay = clampDay(selectedYear, nextMonth, nextType, selectedDay);
    setFormData(prev => ({ ...prev, dateType: nextType }));
    if (nextMonth !== selectedMonth) {
      setSelectedMonth(nextMonth);
    }
    if (nextDay !== selectedDay) {
      setSelectedDay(nextDay);
    }
  };

  const calculateTrueSolarTimeDiff = (longitude: number, latitude: number) => {
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
  };

  const handleTimeConfirm = () => {
    const monthValue = formData.dateType === '0' ? Math.abs(selectedMonth) : selectedMonth;
    const monthStr = String(monthValue).padStart(2, '0');
    const dayStr = String(selectedDay).padStart(2, '0');
    const hourStr = String(selectedHour).padStart(2, '0');
    const minuteStr = String(selectedMinute).padStart(2, '0');
    
    setFormData(prev => ({
      ...prev,
      birthDate: `${selectedYear}-${monthStr}-${dayStr}T${hourStr}:${minuteStr}`,
      lunarMonth: Math.abs(selectedMonth),
      lunarLeap: selectedMonth < 0
    }));
    setShowTimePicker(false);
  };

  const handleAddressConfirm = () => {
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
  };

  const handleTimeInput = () => {
    if (timeInput.length === 12) {
      const year = parseInt(timeInput.substring(0, 4));
      const month = parseInt(timeInput.substring(4, 6));
      const day = parseInt(timeInput.substring(6, 8));
      const hour = parseInt(timeInput.substring(8, 10));
      const minute = parseInt(timeInput.substring(10, 12));
      
      if (year >= 1900 && year <= 2100 && month >= 1 && month <= 12 && 
          day >= 1 && day <= 31 && hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
        const nextMonth = normalizeMonth(month, year, formData.dateType);
        const nextDay = clampDay(year, nextMonth, formData.dateType, day);
        setSelectedYear(year);
        setSelectedMonth(nextMonth);
        setSelectedDay(nextDay);
        setSelectedHour(hour);
        setSelectedMinute(minute);
      }
    }
  };

  const handleSetToday = () => {
    const today = new Date();
    if (formData.dateType === '0') {
      const solarTime = SolarTime.fromYmdHms(
        today.getFullYear(),
        today.getMonth() + 1,
        today.getDate(),
        today.getHours(),
        today.getMinutes(),
        today.getSeconds()
      );
      const lunarHour = solarTime.getLunarHour();
      const lunarDay = lunarHour.getLunarDay();
      const lunarMonth = lunarDay.getLunarMonth();
      setSelectedYear(lunarDay.getYear());
      setSelectedMonth(lunarMonth.getMonthWithLeap());
      setSelectedDay(lunarDay.getDay());
    } else {
      setSelectedYear(today.getFullYear());
      setSelectedMonth(today.getMonth() + 1);
      setSelectedDay(today.getDate());
    }
    setSelectedHour(today.getHours());
    setSelectedMinute(today.getMinutes());
  };

  const handleTrueSolarChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isTrueSolar: checked }));
    
    if (checked && formData.longitude && formData.latitude) {
      calculateTrueSolarTimeDiff(formData.longitude, formData.latitude);
    } else {
      setTrueSolarTimeDiff('');
    }
  };

  const handleSubmit = () => {
    const query = new URLSearchParams({
      name: formData.name,
      sex: formData.sex,
      dateType: formData.dateType,
      birthDate: formData.birthDate,
      date: formData.birthDate,
      lunarMonth: formData.lunarMonth.toString(),
      lunarLeap: formData.lunarLeap ? '1' : '0',
      location: formData.location,
      isDst: formData.isDst ? '1' : '0',
      isTrueSolar: formData.isTrueSolar ? '1' : '0',
      isEarlyRat: formData.isEarlyRat ? '1' : '0',
      longitude: formData.longitude?.toString() || '116.407394',
      latitude: formData.latitude?.toString() || '39.904211'
    }).toString();
    
    navigate(`/detail?${query}`);
  };

  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const day = date.getDate();
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    if (formData.dateType === '0') {
      const monthValue = formData.lunarLeap ? -formData.lunarMonth : formData.lunarMonth;
      const lunarMonth = LunarMonth.fromYm(year, monthValue);
      const lunarDay = LunarDay.fromYmd(year, monthValue, day);
      return `${year}年${lunarMonth.getName()}${lunarDay.getName()} ${hour}:${minute}`;
    }
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}年${month}月${dayStr}日 ${hour}:${minute}`;
  };

  const searchResults = useMemo(() => {
    if (!addressSearch.trim()) return [];
    return cityLocator.search(addressSearch).slice(0, 10);
  }, [addressSearch]);

  return (
    <div className="flex min-h-screen bg-[rgb(245,245,247)] text-gray-900">
      <Sidebar />
      <div className="flex-1" style={{ marginTop: 68, padding: '0 20px' }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 0
        }}>
          {/* 左侧区域 - 参考网站有图片区域 */}
          <div style={{ width: 405, flexShrink: 0 }}></div>

          {/* 右侧表单区域 */}
          <div style={{ width: 660, flexShrink: 0 }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: 15,
              padding: '40px 60px',
              fontFamily: '"Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif',
              boxShadow: '0 2px 12px rgba(0,0,0,0.05)'
            }}>
              {/* 表单内容 */}
              <div style={{ marginBottom: 22, display: 'flex', alignItems: 'center' }}>
                <label style={{
                  width: 140,
                  fontSize: 16,
                  color: 'rgb(68, 68, 68)',
                  textAlign: 'center'
                }}>命主姓名</label>
                <div style={{ flex: 1 }}>
                  <input
                    type="text"
                    placeholder="请输入姓名"
                    style={{
                      width: '100%',
                      height: 38,
                      fontSize: 16,
                      border: '1px solid rgb(236, 236, 236)',
                      borderRadius: 6,
                      padding: '0 13px',
                      outline: 'none',
                      color: 'rgb(68, 68, 68)'
                    }}
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 22, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <label style={{
                    width: 140,
                    fontSize: 16,
                    color: 'rgb(68, 68, 68)',
                    textAlign: 'center'
                  }}>性别</label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div
                      onClick={() => setFormData({...formData, sex: '1'})}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        marginRight: 31,
                        color: formData.sex === '1' ? 'rgb(178, 149, 93)' : 'rgb(68, 68, 68)',
                        fontSize: 16
                      }}
                    >
                      <img 
                        src={formData.sex === '1' 
                          ? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASBAMAAACk4JNkAAAAJFBMVEUAAACylV20ll+zlV2ylV2ylVyvllqylV3////8+/nn3s3Bqn3jwQa2AAAAB3RSTlMA+07dwKMzspmckgAAAGZJREFUCNdjYGBgChY0VWAAAjb38vLykgQgS7EcBISAQuJgVmECA0s5BDgwqJeX75q5ury8iCG8vHpGR+f28lIG8/Kqjo6O5eXFDOLllUDW9PJCBAshi9CBMAVhMsI2hAsQrkK4FAAJaTwJs9GBHgAAAABJRU5ErkJggg=="
                          : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASBAMAAACk4JNkAAAAIVBMVEUAAAC7u7u7u7u6urq6urq7u7u8vLy5ubm8vLy/v7+7u7tem6BrAAAAC3RSTlMA+8NoTt2jMyYERyRpzasAAABWSURBVAjXY2BgYEkVDHNgAAJ2JYuZzUoFQJajAZBgFgEKSTGAwMICBiagEEhQgcGJAQJUGJKhLDOGCCirlUESypqIYCFkEToQpiBMRtiGcAHCVQiXAgBgTw9plt7GMwAAAABJRU5ErkJggg=="
                        }
                        alt="男"
                        style={{ width: 18, height: 18, marginRight: 5 }}
                      />
                      <span>男</span>
                    </div>
                    <div
                      onClick={() => setFormData({...formData, sex: '0'})}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        color: formData.sex === '0' ? 'rgb(178, 149, 93)' : 'rgb(68, 68, 68)',
                        fontSize: 16
                      }}
                    >
                      <img 
                        src={formData.sex === '0'
                          ? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASBAMAAACk4JNkAAAAIVBMVEUAAAC7u7u7u7u6urq6urq7u7u8vLy5ubm8vLy/v7+7u7tem6BrAAAAC3RSTlMA+8NoTt2jMyYERyRpzasAAABWSURBVAjXY2BgYEkVDHNgAAJ2JYuZzUoFQJajAZBgFgEKSTGAwMICBiagEEhQgcGJAQJUGJKhLDOGCCirlUESypqIYCFkEToQpiBMRtiGcAHCVQiXAgBgTw9plt7GMwAAAABJRU5ErkJggg=="
                          : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASBAMAAACk4JNkAAAAJFBMVEUAAACylV20ll+zlV2ylV2ylVyvllqylV3////8+/nn3s3Bqn3jwQa2AAAAB3RSTlMA+07dwKMzspmckgAAAGZJREFUCNdjYGBgChY0VWAAAjb38vLykgQgS7EcBISAQuJgVmECA0s5BDgwqJeX75q5ury8iCG8vHpGR+f28lIG8/Kqjo6O5eXFDOLllUDW9PJCBAshi9CBMAVhMsI2hAsQrkK4FAAJaTwJs9GBHgAAAABJRU5ErkJggg=="
                        }
                        alt="女"
                        style={{ width: 18, height: 18, marginRight: 5 }}
                      />
                      <span>女</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', borderRadius: 20 }}>
                  <div
                    onClick={() => {
                      handleDateTypeChange('1');
                      setTimeTab('solar');
                    }}
                    style={{
                      display: 'block',
                      cursor: 'pointer',
                      padding: '6px 30px',
                      borderRadius: 20,
                      width: 92,
                      height: 30,
                      backgroundColor: formData.dateType === '1' ? 'rgb(178, 149, 93)' : 'transparent',
                      color: formData.dateType === '1' ? 'white' : 'rgb(68, 68, 68)',
                      fontSize: 16,
                      textAlign: 'center',
                      lineHeight: '18px'
                    }}
                  >
                    公历
                  </div>
                  <div
                    onClick={() => {
                      handleDateTypeChange('0');
                      setTimeTab('lunar');
                    }}
                    style={{
                      display: 'block',
                      cursor: 'pointer',
                      padding: '6px 30px',
                      borderRadius: 20,
                      width: 92,
                      height: 30,
                      backgroundColor: formData.dateType === '0' ? 'rgb(178, 149, 93)' : 'transparent',
                      color: formData.dateType === '0' ? 'white' : 'rgb(68, 68, 68)',
                      fontSize: 16,
                      textAlign: 'center',
                      lineHeight: '18px'
                    }}
                  >
                    农历
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 22, display: 'flex', alignItems: 'center' }}>
                <label style={{
                  width: 140,
                  fontSize: 16,
                  color: 'rgb(68, 68, 68)',
                  textAlign: 'center'
                }}></label>
                <div
                  onClick={() => setShowTimePicker(true)}
                  style={{
                    flex: 1,
                    height: 38,
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid rgb(236, 236, 236)',
                    borderRadius: 6,
                    padding: '9px 13px',
                    fontSize: 16,
                    color: 'rgb(68, 68, 68)',
                    cursor: 'pointer'
                  }}
                >
                  {formatDisplayDate(formData.birthDate)}
                </div>
              </div>

              <div style={{ marginBottom: 22, display: 'flex', alignItems: 'center' }}>
                <label style={{
                  width: 140,
                  fontSize: 16,
                  color: 'rgb(68, 68, 68)',
                  textAlign: 'center'
                }}>出生地址</label>
                <div
                  onClick={() => setShowAddressPicker(true)}
                  style={{
                    flex: 1,
                    height: 38,
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid rgb(236, 236, 236)',
                    borderRadius: 6,
                    padding: '9px 13px',
                    fontSize: 16,
                    color: 'rgb(68, 68, 68)',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {formData.location}
                </div>
              </div>

              <div style={{
                marginBottom: 22,
                display: 'flex',
                alignItems: 'center',
                gap: 30
              }}>
                <label style={{
                  width: 140,
                  fontSize: 16,
                  color: 'rgb(68, 68, 68)',
                  textAlign: 'center'
                }}></label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
                  onClick={() => setFormData({...formData, isDst: !formData.isDst})}
                >
                  <div style={{
                    width: 16,
                    height: 16,
                    borderRadius: 3,
                    border: '1px solid rgb(178, 149, 93)',
                    backgroundColor: formData.isDst ? 'rgb(178, 149, 93)' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {formData.isDst && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    )}
                  </div>
                  <span style={{ fontSize: 16, color: 'rgb(16, 16, 16)' }}>夏令时</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
                  onClick={() => handleTrueSolarChange(!formData.isTrueSolar)}
                >
                  <div style={{
                    width: 16,
                    height: 16,
                    borderRadius: 3,
                    border: '1px solid rgb(178, 149, 93)',
                    backgroundColor: formData.isTrueSolar ? 'rgb(178, 149, 93)' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {formData.isTrueSolar && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    )}
                  </div>
                  <span style={{ fontSize: 16, color: 'rgb(16, 16, 16)' }}>真太阳时</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
                  onClick={() => setFormData({...formData, isEarlyRat: !formData.isEarlyRat})}
                >
                  <div style={{
                    width: 16,
                    height: 16,
                    borderRadius: 3,
                    border: '1px solid rgb(178, 149, 93)',
                    backgroundColor: formData.isEarlyRat ? 'rgb(178, 149, 93)' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {formData.isEarlyRat && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    )}
                  </div>
                  <span style={{ fontSize: 16, color: 'rgb(16, 16, 16)' }}>早晚子时</span>
                </div>
              </div>

              {formData.isTrueSolar && trueSolarTimeDiff && (
                <div style={{
                  marginBottom: 22,
                  marginLeft: 140,
                  fontSize: 14,
                  color: 'rgb(178, 149, 93)',
                  backgroundColor: 'rgba(178, 149, 93, 0.1)',
                  padding: '10px 15px',
                  borderRadius: 6
                }}>
                  真太阳时修正: {trueSolarTimeDiff}
                </div>
              )}

              <div style={{ marginTop: 40 }}>
                <div
                  onClick={handleSubmit}
                  style={{
                    width: '100%',
                    maxWidth: 546,
                    height: 63,
                    margin: '0 auto',
                    backgroundColor: 'black',
                    color: 'rgb(247, 211, 161)',
                    borderRadius: 63,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    cursor: 'pointer',
                    fontWeight: 500
                  }}
                >
                  开始排盘
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {showTimePicker && (
          <div 
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={(e) => e.target === e.currentTarget && setShowTimePicker(false)}
          >
            <div className="bg-white w-full rounded-t-xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <button 
                  onClick={() => setShowTimePicker(false)}
                  className="text-gray-500 text-sm"
                >
                  取消
                </button>
                <div className="flex gap-4">
                  <button 
                    className={`px-3 py-1 rounded ${timeTab === 'solar' ? 'bg-[#b2955d] text-white' : 'text-gray-600'}`}
                    onClick={() => {
                      setTimeTab('solar');
                      handleDateTypeChange('1');
                    }}
                  >
                    公历
                  </button>
                  <button 
                    className={`px-3 py-1 rounded ${timeTab === 'lunar' ? 'bg-[#b2955d] text-white' : 'text-gray-600'}`}
                    onClick={() => {
                      setTimeTab('lunar');
                      handleDateTypeChange('0');
                    }}
                  >
                    农历
                  </button>
                </div>
                <button 
                  onClick={handleSetToday}
                  className="text-[#b2955d] text-sm"
                >
                  今
                </button>
              </div>

              <div className="p-4">
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="输入年月日时分(格式199001011200)"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    value={timeInput}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 12);
                      setTimeInput(val);
                    }}
                    onBlur={handleTimeInput}
                  />
                  <button 
                    onClick={handleTimeConfirm}
                    className="bg-[#b2955d] text-white px-4 py-2 rounded-lg text-sm"
                  >
                    确定
                  </button>
                </div>

                <div className="flex justify-around mb-2 text-sm text-gray-500 px-4">
                  <span className="flex-1 text-center">年</span>
                  <span className="flex-1 text-center">月</span>
                  <span className="flex-1 text-center">日</span>
                  <span className="flex-1 text-center">时</span>
                  <span className="flex-1 text-center">分</span>
                </div>

                <div className="relative h-[220px]">
                  <div className="absolute inset-0 flex">
                    <div
                      ref={yearScrollRef}
                      className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-hide select-none"
                      onScroll={(e) => handleScroll('year', e, years, selectedYear, handleYearSelect)}
                      onMouseDown={(e) => handleMouseDown(e, yearScrollRef)}
                      style={{
                        scrollSnapType: 'y mandatory',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        paddingTop: '88px',
                        paddingBottom: '88px',
                        cursor: 'grab',
                        userSelect: 'none'
                      }}
                    >
                      {years.map(year => (
                        <div
                          key={year}
                          className={`h-11 flex items-center justify-center cursor-pointer text-base scroll-snap-align-center ${
                            selectedYear === year ? 'text-[#b2955d] font-bold' : 'text-gray-600'
                          }`}
                          onClick={() => handleYearSelect(year)}
                        >
                          {year}
                        </div>
                      ))}
                    </div>
                    <div
                      ref={monthScrollRef}
                      className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-hide select-none"
                      onScroll={(e) => handleScroll('month', e, months, selectedMonth, handleMonthSelect)}
                      onMouseDown={(e) => handleMouseDown(e, monthScrollRef)}
                      style={{
                        scrollSnapType: 'y mandatory',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        paddingTop: '88px',
                        paddingBottom: '88px',
                        cursor: 'grab',
                        userSelect: 'none'
                      }}
                    >
                      {months.map(month => (
                        <div
                          key={month.value}
                          className={`h-11 flex items-center justify-center cursor-pointer text-base scroll-snap-align-center ${
                            selectedMonth === month.value ? 'text-[#b2955d] font-bold' : 'text-gray-600'
                          }`}
                          onClick={() => handleMonthSelect(month.value)}
                        >
                          {month.label}
                        </div>
                      ))}
                    </div>
                    <div
                      ref={dayScrollRef}
                      className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-hide select-none"
                      onScroll={(e) => handleScroll('day', e, days, selectedDay, setSelectedDay)}
                      onMouseDown={(e) => handleMouseDown(e, dayScrollRef)}
                      style={{
                        scrollSnapType: 'y mandatory',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        paddingTop: '88px',
                        paddingBottom: '88px',
                        cursor: 'grab',
                        userSelect: 'none'
                      }}
                    >
                      {days.map(day => (
                        <div
                          key={day}
                          className={`h-11 flex items-center justify-center cursor-pointer text-base scroll-snap-align-center ${
                            selectedDay === day ? 'text-[#b2955d] font-bold' : 'text-gray-600'
                          }`}
                          onClick={() => setSelectedDay(day)}
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                    <div
                      ref={hourScrollRef}
                      className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-hide select-none"
                      onScroll={(e) => handleScroll('hour', e, hours, selectedHour, setSelectedHour)}
                      onMouseDown={(e) => handleMouseDown(e, hourScrollRef)}
                      style={{
                        scrollSnapType: 'y mandatory',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        paddingTop: '88px',
                        paddingBottom: '88px',
                        cursor: 'grab',
                        userSelect: 'none'
                      }}
                    >
                      {hours.map(hour => (
                        <div
                          key={hour}
                          className={`h-11 flex items-center justify-center cursor-pointer text-base scroll-snap-align-center ${
                            selectedHour === hour ? 'text-[#b2955d] font-bold' : 'text-gray-600'
                          }`}
                          onClick={() => setSelectedHour(hour)}
                        >
                          {hour}
                        </div>
                      ))}
                    </div>
                    <div
                      ref={minuteScrollRef}
                      className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-hide select-none"
                      onScroll={(e) => handleScroll('minute', e, minutes, selectedMinute, setSelectedMinute)}
                      onMouseDown={(e) => handleMouseDown(e, minuteScrollRef)}
                      style={{
                        scrollSnapType: 'y mandatory',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        paddingTop: '88px',
                        paddingBottom: '88px',
                        cursor: 'grab',
                        userSelect: 'none'
                      }}
                    >
                      {minutes.map(minute => (
                        <div
                          key={minute}
                          className={`h-11 flex items-center justify-center cursor-pointer text-base scroll-snap-align-center ${
                            selectedMinute === minute ? 'text-[#b2955d] font-bold' : 'text-gray-600'
                          }`}
                          onClick={() => setSelectedMinute(minute)}
                        >
                          {minute}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="absolute left-0 right-0 top-[88px] h-11 pointer-events-none border-t border-b border-gray-200 bg-gray-50/30"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showAddressPicker && (
          <div 
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={(e) => e.target === e.currentTarget && setShowAddressPicker(false)}
          >
            <div className="bg-white w-full rounded-t-xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <button 
                  onClick={() => setShowAddressPicker(false)}
                  className="text-gray-500 text-sm"
                >
                  取消
                </button>
                <div className="flex gap-4">
                  <button 
                    className={`px-3 py-1 rounded ${addressTab === 'domestic' ? 'bg-[#b2955d] text-white' : 'text-gray-600'}`}
                    onClick={() => setAddressTab('domestic')}
                  >
                    国内
                  </button>
                  <button 
                    className={`px-3 py-1 rounded ${addressTab === 'overseas' ? 'bg-[#b2955d] text-white' : 'text-gray-600'}`}
                    onClick={() => setAddressTab('overseas')}
                  >
                    海外
                  </button>
                </div>
                <div className="w-10"></div>
              </div>

              <div className="p-4">
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="搜索全国城市及地区"
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm"
                    value={addressSearch}
                    onChange={(e) => setAddressSearch(e.target.value)}
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {searchResults.length > 0 ? (
                  <div className="max-h-60 overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
                    {searchResults.map((city, idx) => (
                      <div
                        key={idx}
                        className="p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
                        onClick={() => {
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
                        }}
                      >
                        <div className="font-medium">{city.name}</div>
                        <div className="text-sm text-gray-500">
                          {city.parentProvince} {city.parentCity || ''}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="flex justify-center gap-2 mb-2 text-sm text-gray-500">
                      <span className="w-24 text-center">省份</span>
                      <span className="w-24 text-center">城市</span>
                      <span className="w-24 text-center">区县</span>
                    </div>

                    <div className="flex justify-center gap-2 h-48 overflow-hidden">
                      <div
                        ref={provinceScrollRef}
                        className="w-24 overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-hide select-none"
                        onScroll={(e) => handleAddressScroll('province', e, regionData.provinces, selectedProvince, handleProvinceSelect)}
                        onMouseDown={(e) => handleMouseDown(e, provinceScrollRef)}
                        style={{
                          scrollbarWidth: 'none',
                          cursor: 'grab',
                          userSelect: 'none'
                        }}
                      >
                        {regionData.provinces.map(province => (
                          <div
                            key={province}
                            className={`h-10 flex items-center justify-center cursor-pointer text-sm ${
                              selectedProvince === province ? 'text-[#b2955d] font-bold' : 'text-gray-600'
                            }`}
                            onClick={() => handleProvinceSelect(province)}
                          >
                            {province}
                          </div>
                        ))}
                      </div>
                      <div
                        ref={cityScrollRef}
                        className="w-24 overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-hide select-none"
                        onScroll={(e) => handleAddressScroll('city', e, regionData.cities[selectedProvince] || [], selectedCity, handleCitySelect)}
                        onMouseDown={(e) => handleMouseDown(e, cityScrollRef)}
                        style={{
                          scrollbarWidth: 'none',
                          cursor: 'grab',
                          userSelect: 'none'
                        }}
                      >
                        {(regionData.cities[selectedProvince] || []).map(city => (
                          <div
                            key={city}
                            className={`h-10 flex items-center justify-center cursor-pointer text-sm ${
                              selectedCity === city ? 'text-[#b2955d] font-bold' : 'text-gray-600'
                            }`}
                            onClick={() => handleCitySelect(city)}
                          >
                            {city}
                          </div>
                        ))}
                      </div>
                      <div
                        ref={districtScrollRef}
                        className="w-24 overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-hide select-none"
                        onScroll={(e) => handleAddressScroll('district', e, regionData.districts[selectedCity] || [], selectedDistrict, handleDistrictSelect)}
                        onMouseDown={(e) => handleMouseDown(e, districtScrollRef)}
                        style={{
                          scrollbarWidth: 'none',
                          cursor: 'grab',
                          userSelect: 'none'
                        }}
                      >
                        {(regionData.districts[selectedCity] || []).map(district => (
                          <div
                            key={district}
                            className={`h-10 flex items-center justify-center cursor-pointer text-sm ${
                              selectedDistrict === district ? 'text-[#b2955d] font-bold' : 'text-gray-600'
                            }`}
                            onClick={() => handleDistrictSelect(district)}
                          >
                            {district}
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleAddressConfirm}
                      className="w-full bg-[#b2955d] text-white py-3 rounded-lg mt-4 font-medium"
                    >
                      确定
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

    </div>
  );
};

export default InputPage;
