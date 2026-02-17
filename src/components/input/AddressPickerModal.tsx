import React, { useRef, useEffect } from 'react';

interface RegionData {
  provinces: string[];
  cities: Record<string, string[]>;
  districts: Record<string, string[]>;
}

interface CityInfo {
  name: string;
  level: string;
  parentProvince?: string;
  parentCity?: string;
  longitude: number;
  latitude: number;
}

interface AddressPickerModalProps {
  show: boolean;
  addressTab: 'domestic' | 'overseas';
  addressSearch: string;
  searchResults: CityInfo[];
  selectedProvince: string;
  selectedCity: string;
  selectedDistrict: string;
  regionData: RegionData;
  onTabChange: (tab: 'domestic' | 'overseas') => void;
  onSearchChange: (value: string) => void;
  onProvinceSelect: (province: string) => void;
  onCitySelect: (city: string) => void;
  onDistrictSelect: (district: string) => void;
  onSearchResultSelect: (city: CityInfo) => void;
  onConfirm: () => void;
  onClose: () => void;
  provinceScrollRef?: React.RefObject<HTMLDivElement | null>;
  cityScrollRef?: React.RefObject<HTMLDivElement | null>;
  districtScrollRef?: React.RefObject<HTMLDivElement | null>;
}

const AddressPickerModal: React.FC<AddressPickerModalProps> = ({
  show,
  addressTab,
  addressSearch,
  searchResults,
  selectedProvince,
  selectedCity,
  selectedDistrict,
  regionData,
  onTabChange,
  onSearchChange,
  onProvinceSelect,
  onCitySelect,
  onDistrictSelect,
  onSearchResultSelect,
  onConfirm,
  onClose,
  provinceScrollRef,
  cityScrollRef,
  districtScrollRef
}) => {
  const defaultProvinceRef = useRef<HTMLDivElement>(null);
  const defaultCityRef = useRef<HTMLDivElement>(null);
  const defaultDistrictRef = useRef<HTMLDivElement>(null);

  const pRef = provinceScrollRef || defaultProvinceRef;
  const cRef = cityScrollRef || defaultCityRef;
  const dRef = districtScrollRef || defaultDistrictRef;

  const scrollTimeouts = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const dragStateRef = useRef({
    isDragging: false,
    startY: 0,
    startScrollTop: 0,
    currentRef: null as HTMLDivElement | null,
    rafId: null as number | null,
    targetScrollTop: 0
  });

  // 当选中值变化时，自动滚动到对应位置
  useEffect(() => {
    if (!show || searchResults.length > 0) return;

    const scrollTo = (ref: React.RefObject<HTMLDivElement | null>, val: string, list: string[]) => {
      if (ref.current) {
        const index = list.indexOf(val);
        if (index !== -1) {
          const targetTop = index * 40;
          ref.current.scrollTo({ top: targetTop, behavior: 'smooth' });
        }
      }
    };

    // 使用 requestAnimationFrame 确保在 DOM 更新后执行
    requestAnimationFrame(() => {
      scrollTo(pRef, selectedProvince, regionData.provinces);
      scrollTo(cRef, selectedCity, regionData.cities[selectedProvince] || []);
      scrollTo(dRef, selectedDistrict, regionData.districts[selectedCity] || []);
    });
  }, [show, selectedProvince, selectedCity, selectedDistrict, regionData, searchResults.length, pRef, cRef, dRef]);

  const handleScroll = (key: string, e: React.UIEvent<HTMLDivElement>, list: string[], currentVal: string, onSelect: (val: string) => void) => {
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

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, scrollRef: React.RefObject<HTMLDivElement | null>) => {
    if (!scrollRef.current) return;
    e.preventDefault();
    const state = dragStateRef.current;
    state.isDragging = true;
    state.startY = e.clientY;
    state.startScrollTop = scrollRef.current.scrollTop;
    state.currentRef = scrollRef.current;
    state.targetScrollTop = scrollRef.current.scrollTop;
    document.addEventListener('mousemove', handleGlobalMouseMove, { passive: false });
    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('mouseleave', handleGlobalMouseUp);
  };

  const handleGlobalMouseMove = (e: MouseEvent) => {
    const state = dragStateRef.current;
    if (!state.isDragging || !state.currentRef) return;
    e.preventDefault();
    const deltaY = state.startY - e.clientY;
    state.targetScrollTop = state.startScrollTop + deltaY;
    if (!state.rafId) {
      state.rafId = requestAnimationFrame(() => {
        if (state.currentRef && state.isDragging) {
          state.currentRef.scrollTop = state.targetScrollTop;
        }
        state.rafId = null;
      });
    }
  };

  const handleGlobalMouseUp = () => {
    const state = dragStateRef.current;
    state.isDragging = false;
    state.currentRef = null;
    if (state.rafId) {
      cancelAnimationFrame(state.rafId);
      state.rafId = null;
    }
    document.removeEventListener('mousemove', handleGlobalMouseMove);
    document.removeEventListener('mouseup', handleGlobalMouseUp);
    document.removeEventListener('mouseleave', handleGlobalMouseUp);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white w-full rounded-t-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <button onClick={onClose} className="text-gray-500 text-sm">取消</button>
          <div className="flex gap-4">
            <button className={`px-3 py-1 rounded ${addressTab === 'domestic' ? 'bg-[#b2955d] text-white' : 'text-gray-600'}`} onClick={() => onTabChange('domestic')}>国内</button>
            <button className={`px-3 py-1 rounded ${addressTab === 'overseas' ? 'bg-[#b2955d] text-white' : 'text-gray-600'}`} onClick={() => onTabChange('overseas')}>海外</button>
          </div>
          <div className="w-10"></div>
        </div>

        <div className="p-4">
          <div className="relative mb-4">
            <input type="text" placeholder="搜索全国城市及地区" className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm" value={addressSearch} onChange={(e) => onSearchChange(e.target.value)} />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>

          {searchResults.length > 0 ? (
            <div className="max-h-60 overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
              {searchResults.map((city, idx) => (
                <div key={idx} className="p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50" onClick={() => onSearchResultSelect(city)}>
                  <div className="font-medium">{city.name}</div>
                  <div className="text-sm text-gray-500">{city.parentProvince} {city.parentCity || ''}</div>
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
                <div ref={pRef} className="w-24 overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-hide select-none" onScroll={(e) => handleScroll('province', e, regionData.provinces, selectedProvince, onProvinceSelect)} onMouseDown={(e) => handleMouseDown(e, pRef)} style={{ scrollbarWidth: 'none', cursor: 'grab', userSelect: 'none' }}>
                  {regionData.provinces.map(province => (
                    <div key={province} className={`h-10 flex items-center justify-center cursor-pointer text-sm ${selectedProvince === province ? 'text-[#b2955d] font-bold' : 'text-gray-600'}`} onClick={() => onProvinceSelect(province)}>{province}</div>
                  ))}
                </div>
                <div ref={cRef} className="w-24 overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-hide select-none" onScroll={(e) => handleScroll('city', e, regionData.cities[selectedProvince] || [], selectedCity, onCitySelect)} onMouseDown={(e) => handleMouseDown(e, cRef)} style={{ scrollbarWidth: 'none', cursor: 'grab', userSelect: 'none' }}>
                  {(regionData.cities[selectedProvince] || []).map(city => (
                    <div key={city} className={`h-10 flex items-center justify-center cursor-pointer text-sm ${selectedCity === city ? 'text-[#b2955d] font-bold' : 'text-gray-600'}`} onClick={() => onCitySelect(city)}>{city}</div>
                  ))}
                </div>
                <div ref={dRef} className="w-24 overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-hide select-none" onScroll={(e) => handleScroll('district', e, regionData.districts[selectedCity] || [], selectedDistrict, onDistrictSelect)} onMouseDown={(e) => handleMouseDown(e, dRef)} style={{ scrollbarWidth: 'none', cursor: 'grab', userSelect: 'none' }}>
                  {(regionData.districts[selectedCity] || []).map(district => (
                    <div key={district} className={`h-10 flex items-center justify-center cursor-pointer text-sm ${selectedDistrict === district ? 'text-[#b2955d] font-bold' : 'text-gray-600'}`} onClick={() => onDistrictSelect(district)}>{district}</div>
                  ))}
                </div>
              </div>
              <button onClick={onConfirm} className="w-full bg-[#b2955d] text-white py-3 rounded-lg mt-4 font-medium">确定</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressPickerModal;
