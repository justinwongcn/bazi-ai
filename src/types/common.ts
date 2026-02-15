export interface BirthParams {
  name: string;
  sex: '0' | '1';
  dateType: '0' | '1';
  date: string;
  lunarMonth: number;
  lunarLeap: boolean;
  location: string;
  longitude: number;
  latitude: number;
  isDst: boolean;
  isTrueSolar: boolean;
  isEarlyRat: boolean;
}

export interface DateTimeParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second?: number;
}

export interface CityInfo {
  name: string;
  longitude: number;
  latitude: number;
  level: 'province' | 'city' | 'district';
  parentProvince?: string;
  parentCity?: string;
}

export interface RegionData {
  provinces: string[];
  cities: Record<string, string[]>;
  districts: Record<string, string[]>;
}
