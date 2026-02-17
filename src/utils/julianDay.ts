export interface SolarTime {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

export interface Location {
  longitude: number;
  latitude: number;
}

export class JulianDay {
  private _day: number;

  constructor(day: number) {
    this._day = day;
  }

  getDay(): number {
    return this._day;
  }

  static fromJulianDay(day: number): JulianDay {
    return new JulianDay(day);
  }

  getSolarTime(): SolarTime {
    const jd = this._day + 0.5;
    const z = Math.floor(jd);
    const f = jd - z;

    let year: number, month: number, day: number;

    if (z < 2299161) {
      const a = z;
      const b = a + 1524;
      const c = Math.floor((b - 122.1) / 365.25);
      const d = Math.floor(365.25 * c);
      const e = Math.floor((b - d) / 30.6001);

      day = Math.floor(b - d - Math.floor(30.6001 * e) + f);

      if (e < 14) {
        month = e - 1;
      } else {
        month = e - 13;
      }

      if (month > 2) {
        year = c - 4716;
      } else {
        year = c - 4715;
      }
    } else {
      const a = Math.floor((z - 1867216.25) / 36524.25);
      const b = z + 1 + a - Math.floor(a / 4);
      const c = b + 1524;
      const d = Math.floor((c - 122.1) / 365.25);
      const e = Math.floor(365.25 * d);
      const g = Math.floor((c - e) / 30.6001);

      day = Math.floor(c - e - Math.floor(30.6001 * g) + f);

      if (g < 14) {
        month = g - 1;
      } else {
        month = g - 13;
      }

      if (month > 2) {
        year = d - 4716;
      } else {
        year = d - 4715;
      }
    }

    const totalSeconds = f * 86400.0;
    const hour = Math.floor(totalSeconds / 3600);
    const minute = Math.floor((totalSeconds - hour * 3600) / 60);
    const second = totalSeconds - hour * 3600 - minute * 60;

    return {
      year,
      month,
      day,
      hour,
      minute,
      second: Math.round(second * 100) / 100
    };
  }
}
