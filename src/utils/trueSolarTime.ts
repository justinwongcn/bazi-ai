import { JulianDay, type SolarTime } from './julianDay';

export class SolarTimeUtil {
  private _j: number = 120.0;
  private lng: number;
  private lat: number;

  constructor(longitude: number = 120.0, latitude: number = 35.0) {
    if (longitude < -180.0 || longitude > 180.0) {
      throw new Error(`illegal longitude: ${longitude}`);
    }
    if (latitude < -90.0 || latitude > 90.0) {
      throw new Error(`illegal latitude: ${latitude}`);
    }
    this.lng = longitude;
    this.lat = latitude;
  }

  static initLocation(longitude: number = 120.0, latitude: number = 35.0): SolarTimeUtil {
    return new SolarTimeUtil(longitude, latitude);
  }

  static dateToSolarTime(date: Date): SolarTime {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds() + date.getMilliseconds() / 1000
    };
  }

  static solarTimeToDate(solarTime: SolarTime): Date {
    return new Date(
      solarTime.year,
      solarTime.month - 1,
      solarTime.day,
      solarTime.hour,
      solarTime.minute,
      Math.floor(solarTime.second),
      Math.round((solarTime.second % 1) * 1000)
    );
  }

  private getJulianDay(solarTime: SolarTime): JulianDay {
    let y = solarTime.year;
    let m = solarTime.month;

    if (m <= 2) {
      m += 12;
      y -= 1;
    }

    let b = 0;
    if (y * 10000 + m * 100 + solarTime.day >= 15821015) {
      const a = Math.floor(y / 100);
      b = 2 - a + Math.floor(a / 4);
    }

    let jd =
      Math.floor(365.25 * (y + 4716)) +
      Math.floor(30.6001 * (m + 1)) +
      solarTime.day +
      b -
      1524.5;

    jd += solarTime.hour / 24.0 + solarTime.minute / 1440.0 + solarTime.second / 86400.0;

    return new JulianDay(jd);
  }

  getMeanSolarTime(solarTime: SolarTime): SolarTime {
    const spcjd = this.getJulianDay(solarTime).getDay();
    const deltPty = spcjd - (this._j - this.lng) * 4 / 60 / 24;
    return JulianDay.fromJulianDay(deltPty).getSolarTime();
  }

  getTrueSolarTime(solarTime: SolarTime): SolarTime {
    const spcjd = this.getJulianDay(solarTime).getDay();
    const realZty = this._zty(spcjd);
    return JulianDay.fromJulianDay(realZty).getSolarTime();
  }

  getTrueSolarTimeFromDate(date: Date): Date {
    const solarTime = SolarTimeUtil.dateToSolarTime(date);
    const trueSolarTime = this.getTrueSolarTime(solarTime);
    return SolarTimeUtil.solarTimeToDate(trueSolarTime);
  }

  getEquationOfTime(date: Date): number {
    const solarTime = SolarTimeUtil.dateToSolarTime(date);
    const spcjd = this.getJulianDay(solarTime).getDay();
    const dt = this._risenset(spcjd, 2)[2] as number;
    return dt * 24 * 60;
  }

  private _sn(x: number): number {
    return Math.sin(x * 1.74532925199433e-2);
  }

  private _cn(x: number): number {
    return Math.cos(x * 1.74532925199433e-2);
  }

  private _fpart(x: number): number {
    x = x - Math.floor(x);
    if (x < 0) {
      x = x + 1;
    }
    return x;
  }

  private _ipart(x: number): number {
    if (x === 0) {
      return 0;
    }
    return (x / Math.abs(x)) * Math.floor(Math.abs(x));
  }

  private _quad(ym: number, y0: number, yp: number): [number, number, number, number, number] {
    let nz = 0;
    const a = 0.5 * (ym + yp) - y0;
    const b = 0.5 * (yp - ym);
    const c = y0;
    const xe = -b / (2 * a);
    const ye = (a * xe + b) * xe + c;
    const dis = b * b - 4 * a * c;
    let z1 = 0.0;
    let z2 = 0.0;
    if (dis > 0) {
      const dx = 0.5 * Math.sqrt(dis) / Math.abs(a);
      z1 = xe - dx;
      z2 = xe + dx;
      if (Math.abs(z1) <= 1) {
        nz = nz + 1;
      }
      if (Math.abs(z2) <= 1) {
        nz = nz + 1;
      }
      if (z1 < -1) {
        z1 = z2;
      }
    }
    return [xe, ye, z1, z2, nz];
  }

  private _sinalt(jd: number, lx: number): number {
    const instant = jd - 2400001.0;
    const t = (instant - 51544.5) / 36525;
    let ra: number, dec: number;

    if (lx === 1) {
      const moon = this._moon(t);
      ra = moon[0];
      dec = moon[1];
    } else {
      const sun = this._sun(t);
      ra = sun[0];
      dec = sun[1];
    }

    const mjd0 = this._ipart(instant);
    const ut = (instant - mjd0) * 24;
    const t2 = (mjd0 - 51544.5) / 36525;
    let gmst = 6.697374558 + 1.0027379093 * ut;
    gmst = gmst + (8640184.812866 + (0.093104 - 0.0000062 * t2) * t2) * t2 / 3600;
    const lmst = 24 * this._fpart((gmst + this.lng / 15) / 24);

    const tau = 15 * (lmst - ra);
    return this._sn(this.lat) * this._sn(dec) + this._cn(this.lat) * this._cn(dec) * this._cn(tau);
  }

  private _sun(t: number): [number, number] {
    const p2 = 2 * Math.PI;
    const coseps = 0.91748;
    const sineps = 0.39778;
    const m = p2 * this._fpart(0.993133 + 99.997361 * t);
    const dl = 6893 * Math.sin(m) + 72 * Math.sin(2 * m);
    const l = p2 * this._fpart(0.7859453 + m / p2 + (6191.2 * t + dl) / 1296000);

    const sl = Math.sin(l);
    const x = Math.cos(l);
    const y = coseps * sl;
    const z = sineps * sl;
    const rho = Math.sqrt(1 - z * z);
    const dec = (360 / p2) * Math.atan(z / rho);
    let ra = (48 / p2) * Math.atan(y / (x + rho));
    if (ra < 0) {
      ra = ra + 24;
    }
    return [ra, dec];
  }

  private _moon(t: number): [number, number] {
    const p2 = 2 * Math.PI;
    const arc = 206264.8062;
    const coseps = 0.91748;
    const sineps = 0.39778;
    const l0 = this._fpart(0.606433 + 1336.855225 * t);
    const l = p2 * this._fpart(0.374897 + 1325.55241 * t);
    const ls = p2 * this._fpart(0.993133 + 99.997361 * t);
    const d = p2 * this._fpart(0.827361 + 1236.853086 * t);
    const f = p2 * this._fpart(0.259086 + 1342.227825 * t);

    let dl = 22640 * Math.sin(l) - 4586 * Math.sin(l - 2 * d);
    dl = dl + 2370 * Math.sin(2 * d) + 769 * Math.sin(2 * l);
    dl = dl - 668 * Math.sin(ls) - 412 * Math.sin(2 * f);
    dl = dl - 212 * Math.sin(2 * l - 2 * d) - 206 * Math.sin(l + ls - 2 * d);
    dl = dl + 192 * Math.sin(l + 2 * d) - 165 * Math.sin(ls - 2 * d);
    dl = dl - 125 * Math.sin(d) - 110 * Math.sin(l + ls);
    dl = dl + 148 * Math.sin(l - ls) - 55 * Math.sin(2 * f - 2 * d);

    const s = f + (dl + 412 * Math.sin(2 * f) + 541 * Math.sin(ls)) / arc;
    const h = f - 2 * d;
    let n = -526 * Math.sin(h) + 44 * Math.sin(l + h) - 31 * Math.sin(h - l) - 23 * Math.sin(ls + h);
    n = n + 11 * Math.sin(h - ls) - 25 * Math.sin(f - 2 * l) + 21 * Math.sin(f - l);

    const lmoon = p2 * this._fpart(l0 + dl / 1296000);
    const bmoon = (18520 * Math.sin(s) + n) / arc;

    const cb = Math.cos(bmoon);
    const x = cb * Math.cos(lmoon);
    const v = cb * Math.sin(lmoon);
    const c = Math.sin(bmoon);
    const y = coseps * v - sineps * c;
    const z = sineps * v + coseps * c;
    const rho = Math.sqrt(1 - z * z);
    const dec = (360 / p2) * Math.atan(z / rho);
    let ra = (48 / p2) * Math.atan(y / (x + rho));
    if (ra < 0) {
      ra = ra + 24;
    }
    return [ra, dec];
  }

  private _risenset(jd: number, lx: number): [number | boolean, number | boolean, number, number | boolean, number | boolean] {
    const noon = Math.round(jd) - this._j / 360.0;

    const sinho: number[] = [0, this._sn(8 / 60), this._sn(-50 / 60), this._sn(-12)];

    let rise = 0;
    let utrise: number | boolean = false;
    let sett = 0;
    let utset: number | boolean = false;
    let hour = 1;
    let ym = this._sinalt(noon + (hour - 1) / 24, lx) - sinho[lx];

    do {
      const y0 = this._sinalt(noon + (hour + 0) / 24, lx) - sinho[lx];
      const yp = this._sinalt(noon + (hour + 1) / 24, lx) - sinho[lx];
      const quad = this._quad(ym, y0, yp);
      const ye = quad[1];
      const z1 = quad[2];
      const z2 = quad[3];
      const nz = quad[4];

      switch (Math.floor(nz)) {
        case 0:
          break;
        case 1:
          if (ym < 0) {
            utrise = hour + z1;
            rise = 1;
          } else {
            utset = hour + z1;
            sett = 1;
          }
          break;
        case 2:
          if (ye < 0) {
            utrise = hour + z2;
            utset = hour + z1;
          } else {
            utrise = hour + z1;
            utset = hour + z2;
          }
          rise = 1;
          sett = 1;
          break;
      }
      ym = yp;
      hour = hour + 2;
    } while (!(hour === 25 || rise * sett === 1));

    if (utset !== false) {
      utset = Math.round(jd) - 0.5 + (utset as number) / 24 - (this._j - this.lng) * 4 / 60 / 24;
    }
    if (utrise !== false) {
      utrise = Math.round(jd) - 0.5 + (utrise as number) / 24 - (this._j - this.lng) * 4 / 60 / 24;
    }

    let dt = 0.0;
    let tset: number | boolean = lx === 2 ? utset : 0;
    let trise: number | boolean = lx === 2 ? utrise : 0;

    if (lx === 2 && rise * sett === 1) {
      while ((tset as number) < (trise as number)) {
        tset = (tset as number) + 1;
      }
      dt = Math.round(jd) - ((trise as number) + ((tset as number) - (trise as number)) / 2);
      tset = (tset as number) - dt + (this._j - this.lng) * 4 / 60 / 24;
      trise = (trise as number) - dt + (this._j - this.lng) * 4 / 60 / 24;
    }

    return [utrise, utset, dt, trise, tset];
  }

  private _zty(jd: number): number {
    const dt = this._risenset(jd, 2)[2] as number;
    return jd - (this._j - this.lng) * 4 / 60 / 24 + dt;
  }
}

export default SolarTimeUtil;
