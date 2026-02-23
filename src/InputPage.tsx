import { useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AddressPickerModal from './components/input/AddressPickerModal';
import DateInputSection from './components/input/DateInputSection';
import LocationInputSection from './components/input/LocationInputSection';
import BaziResultModal from './components/input/BaziResultModal';
import NameInput from './components/ui/NameInput';
import SexSelector from './components/ui/SexSelector';
import { useLocationInput } from './hooks/useLocationInput';
import { usePillarInput } from './hooks/usePillarInput';
import { useBaziSearch } from './hooks/useBaziSearch';
import { DATE_TYPE } from './constants/dateType';
import { Colors, Spacing, ButtonStyles, FontSize } from './styles/constants';

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

const InputPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialDateType = searchParams.get('dateType') || DATE_TYPE.SOLAR;
  const initialLunarMonthParam = searchParams.get('lunarMonth');
  const initialLunarLeapParam = searchParams.get('lunarLeap');
  const initialBirthDate = searchParams.get('birthDate') || '1990-01-01T12:00';

  const initialLunarMonth = initialLunarMonthParam
    ? parseInt(initialLunarMonthParam, 10)
    : (new Date(initialBirthDate).getMonth() + 1);
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

  const pillarInput = usePillarInput();

  const locationInput = useLocationInput({
    formData,
    setFormData,
    initialCity: formData.longitude && formData.latitude
      ? { parentProvince: '北京市', parentCity: '北京城区', name: '东城区' }
      : undefined
  });

  const baziSearch = useBaziSearch();

  const handleTrueSolarChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isTrueSolar: checked }));
    if (checked && formData.longitude && formData.latitude) {
      locationInput.calculateTrueSolarTimeDiff(formData.longitude, formData.latitude);
    }
  };

  const handleDstChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isDst: checked }));
  };

  const handleEarlyRatChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isEarlyRat: checked }));
  };

  const navigateToDetail = useCallback((dateStr: string, yearPillar?: string, monthPillar?: string, dayPillar?: string, hourPillar?: string) => {
    const queryParams: Record<string, string> = {
      name: formData.name,
      sex: formData.sex,
      dateType: formData.dateType,
      birthDate: dateStr,
      date: dateStr,
      lunarMonth: formData.lunarMonth.toString(),
      lunarLeap: formData.lunarLeap ? '1' : '0',
      location: formData.location,
      isDst: formData.isDst ? '1' : '0',
      isTrueSolar: formData.isTrueSolar ? '1' : '0',
      isEarlyRat: formData.isEarlyRat ? '1' : '0',
      longitude: formData.longitude?.toString() || '116.407394',
      latitude: formData.latitude?.toString() || '39.904211'
    };

    if (yearPillar) queryParams.yearPillar = yearPillar;
    if (monthPillar) queryParams.monthPillar = monthPillar;
    if (dayPillar) queryParams.dayPillar = dayPillar;
    if (hourPillar) queryParams.hourPillar = hourPillar;

    const query = new URLSearchParams(queryParams).toString();
    navigate(`/detail?${query}`);
  }, [formData, navigate]);

  const handleTimeConfirm = useCallback(() => {
    if (formData.dateType === DATE_TYPE.PILLAR) {
      baziSearch.search({
        yearPillar: pillarInput.selectedYearPillar,
        monthPillar: pillarInput.selectedMonthPillar,
        dayPillar: pillarInput.selectedDayPillar,
        hourPillar: pillarInput.selectedHourPillar
      });
    }
  }, [formData.dateType, baziSearch, pillarInput]);

  const handleBaziResultConfirm = useCallback(() => {
    const result = baziSearch.confirmSelection();
    if (!result) return;

    const dateStr = `${result.year}-${String(result.month).padStart(2, '0')}-${String(result.day).padStart(2, '0')}T${String(result.hour).padStart(2, '0')}:${String(result.minute).padStart(2, '0')}`;

    navigateToDetail(
      dateStr,
      result.bazi.year,
      result.bazi.month,
      result.bazi.day,
      result.bazi.hour
    );
  }, [baziSearch, navigateToDetail]);

  const handleSubmit = useCallback(() => {
    if (formData.dateType === DATE_TYPE.PILLAR) {
      if (!baziSearch.selectedResult) {
        baziSearch.search({
          yearPillar: pillarInput.selectedYearPillar,
          monthPillar: pillarInput.selectedMonthPillar,
          dayPillar: pillarInput.selectedDayPillar,
          hourPillar: pillarInput.selectedHourPillar
        });
        return;
      }
      handleBaziResultConfirm();
    } else {
      navigateToDetail(formData.birthDate);
    }
  }, [formData, pillarInput, baziSearch, navigateToDetail, handleBaziResultConfirm]);

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
          <div style={{ width: 405, flexShrink: 0 }}></div>
          <div style={{ width: 660, flexShrink: 0 }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: 15,
              padding: '40px 60px',
              fontFamily: '"Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif',
              boxShadow: '0 2px 12px rgba(0,0,0,0.05)'
            }}>
              <NameInput
                value={formData.name}
                onChange={(name) => setFormData({ ...formData, name })}
                label="命主姓名"
              />

              <div style={{ marginBottom: Spacing.section, display: 'flex', alignItems: 'center' }}>
                <label style={{
                  width: Spacing.labelWidth,
                  fontSize: 16,
                  color: Colors.text,
                  textAlign: 'center'
                }}>性别</label>
                <SexSelector
                  value={formData.sex}
                  onChange={(sex) => setFormData({ ...formData, sex })}
                />
              </div>

              <DateInputSection
                formData={formData}
                setFormData={setFormData}
                pillarInput={pillarInput}
                onTimeConfirm={handleTimeConfirm}
              />

              <LocationInputSection
                formData={formData}
                trueSolarTimeDiff={locationInput.trueSolarTimeDiff}
                onOpenAddressPicker={locationInput.setShowAddressPicker}
                onDstChange={handleDstChange}
                onTrueSolarChange={handleTrueSolarChange}
                onEarlyRatChange={handleEarlyRatChange}
              />

              {baziSearch.error && (
                <div style={{
                  padding: '10px 15px',
                  backgroundColor: 'rgb(255, 240, 240)',
                  borderRadius: 8,
                  color: 'rgb(200, 50, 50)',
                  marginBottom: Spacing.section,
                  textAlign: 'center',
                  fontSize: FontSize.sm
                }}>
                  {baziSearch.error}
                </div>
              )}

              {baziSearch.selectedResult && (
                <div style={{
                  marginBottom: Spacing.section,
                  padding: '10px 15px',
                  backgroundColor: 'rgb(240, 255, 240)',
                  borderRadius: 8,
                  color: 'rgb(50, 150, 50)',
                  textAlign: 'center',
                  fontSize: FontSize.sm
                }}>
                  已选择：{baziSearch.selectedResult.formattedTime}
                </div>
              )}

              <div style={{ marginTop: 40 }}>
                <div
                  onClick={handleSubmit}
                  style={{
                    ...ButtonStyles.primary,
                    opacity: baziSearch.isSearching ? 0.7 : 1,
                    cursor: baziSearch.isSearching ? 'wait' : 'pointer'
                  }}
                >
                  {baziSearch.isSearching ? '查询中...' : '开始排盘'}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <AddressPickerModal
        show={locationInput.showAddressPicker}
        addressTab={locationInput.addressTab}
        addressSearch={locationInput.addressSearch}
        searchResults={locationInput.searchResults}
        selectedProvince={locationInput.selectedProvince}
        selectedCity={locationInput.selectedCity}
        selectedDistrict={locationInput.selectedDistrict}
        regionData={locationInput.regionData}
        onTabChange={locationInput.setAddressTab}
        onSearchChange={locationInput.setAddressSearch}
        onProvinceSelect={locationInput.handleProvinceSelect}
        onCitySelect={locationInput.handleCitySelect}
        onDistrictSelect={locationInput.handleDistrictSelect}
        onSearchResultSelect={locationInput.handleSearchResultSelect}
        onConfirm={locationInput.handleAddressConfirm}
        onClose={() => locationInput.setShowAddressPicker(false)}
        provinceScrollRef={locationInput.provinceScrollRef}
        cityScrollRef={locationInput.cityScrollRef}
        districtScrollRef={locationInput.districtScrollRef}
      />

      <BaziResultModal
        show={baziSearch.showModal}
        results={baziSearch.results}
        selectedResult={baziSearch.selectedResult}
        onSelect={baziSearch.selectResult}
        onConfirm={handleBaziResultConfirm}
        onClose={baziSearch.closeModal}
      />

    </div>
  );
};

export default InputPage;
