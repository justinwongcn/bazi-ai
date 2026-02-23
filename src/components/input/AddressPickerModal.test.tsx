import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, it, expect, vi } from 'vitest';
import AddressPickerModal from './AddressPickerModal';

describe('AddressPickerModal', () => {
  it('should not emit selection changes during auto scroll', async () => {
    (globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
    vi.useFakeTimers();
    const rafSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      cb(0);
      return 1;
    });

    const provinceRef = React.createRef<HTMLDivElement>();
    const cityRef = React.createRef<HTMLDivElement>();
    const districtRef = React.createRef<HTMLDivElement>();

    const onProvinceSelect = vi.fn();
    const onCitySelect = vi.fn();
    const onDistrictSelect = vi.fn();

    const regionData = {
      provinces: ['北京市', '江西省'],
      cities: {
        '北京市': ['北京城区'],
        '江西省': ['萍乡市', '上饶市'],
      },
      districts: {
        '北京城区': ['东城区'],
        '萍乡市': ['安源区'],
        '上饶市': ['余干县'],
      },
    };

    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    try {
      await act(async () => {
        root.render(
          <AddressPickerModal
            show
            addressTab="domestic"
            addressSearch=""
            searchResults={[]}
            selectedProvince="江西省"
            selectedCity="上饶市"
            selectedDistrict="余干县"
            regionData={regionData}
            onTabChange={() => {}}
            onSearchChange={() => {}}
            onProvinceSelect={onProvinceSelect}
            onCitySelect={onCitySelect}
            onDistrictSelect={onDistrictSelect}
            onSearchResultSelect={() => {}}
            onConfirm={() => {}}
            onClose={() => {}}
            provinceScrollRef={provinceRef}
            cityScrollRef={cityRef}
            districtScrollRef={districtRef}
          />
        );
      });

      await act(async () => {
        await Promise.resolve();
      });

      expect(provinceRef.current).toBeTruthy();
      provinceRef.current!.scrollTop = 0;
      await act(async () => {
        provinceRef.current!.dispatchEvent(new Event('scroll', { bubbles: true }));
      });

      await act(async () => {
        vi.advanceTimersByTime(200);
      });

      expect(onProvinceSelect).not.toHaveBeenCalled();
      expect(onCitySelect).not.toHaveBeenCalled();
      expect(onDistrictSelect).not.toHaveBeenCalled();
    } finally {
      await act(async () => {
        root.unmount();
      });
      container.remove();
      rafSpy.mockRestore();
      vi.useRealTimers();
    }
  });
});
