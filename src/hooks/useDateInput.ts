import { useState } from 'react';

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

export interface UseDateInputOptions {
  initialDateType?: string;
  initialBirthDate?: string;
  initialLunarMonth?: number;
  initialLunarLeap?: boolean;
  formData?: FormData;
  onFormDataChange?: (formData: FormData | ((prev: FormData) => FormData)) => void;
}

export const useDateInput = (options?: UseDateInputOptions) => {
  const initialDateType = options?.initialDateType || '1';
  const initialLunarMonthParam = options?.initialLunarMonth;
  const initialLunarLeapParam = options?.initialLunarLeap;

  const initialBirthDate = options?.initialBirthDate || '1990-01-01T12:00';
  const initialDateForFields = new Date(initialBirthDate);
  const initialLunarMonth = initialLunarMonthParam ?? (initialDateForFields.getMonth() + 1);
  const initialLunarLeap = initialLunarLeapParam ?? false;

  const [formDataState, setFormDataState] = useState<FormData>({
    name: '',
    sex: '1',
    dateType: initialDateType,
    birthDate: initialBirthDate,
    lunarMonth: initialLunarMonth,
    lunarLeap: initialLunarLeap,
    location: '北京市 东经116.41° 北纬39.90°',
    longitude: 116.407394,
    latitude: 39.904211,
    isDst: false,
    isTrueSolar: false,
    isEarlyRat: false,
    ...options?.formData
  });

  const formData = options?.formData ?? formDataState;
  const setFormData = options?.onFormDataChange ?? setFormDataState;

  const handleDateTypeChange = (nextType: string) => {
    setFormData(prev => ({ ...prev, dateType: nextType }));
  };

  return {
    formData,
    setFormData,
    handleDateTypeChange
  };
};
