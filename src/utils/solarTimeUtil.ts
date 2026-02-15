/**
 * 真太阳时计算工具
 * 基于 dart_iztro 项目实现改编
 * 参考: https://github.com/EdwinXiang/dart_iztro
 * 
 * 真太阳时 = 平太阳时 + 均时差
 * 平太阳时 = 标准时间 + 经度修正(每度4分钟)
 */

export interface SolarTime {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

export interface Location {
  longitude: number; // 经度，东经为正，西经为负
  latitude: number;  // 纬度，北纬为正，南纬为负
}

/**
 * 儒略日类 - 用于日期和儒略日之间的转换
 */
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

  /**
   * 获取对应的公历时间
   */
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

    // 计算时分秒
    const totalSeconds = f * 86400.0; // 一天有86400秒
    const hour = Math.floor(totalSeconds / 3600);
    const minute = Math.floor((totalSeconds - hour * 3600) / 60);
    const second = totalSeconds - hour * 3600 - minute * 60;

    return {
      year,
      month,
      day,
      hour,
      minute,
      second: Math.round(second * 100) / 100 // 保留两位小数
    };
  }
}

/**
 * 公历时间工具类
 */
export class SolarTimeUtil {
  private _j: number = 120.0;
  private lng: number;
  private lat: number;

  /**
   * 构造函数
   * @param longitude 经度 -180~180，东经为正，西经为负
   * @param latitude 纬度 -90~90，北纬为正，南纬为负
   */
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

  /**
   * 创建太阳时工具实例
   * @param longitude 经度 -180~180
   * @param latitude 纬度 -90~90
   */
  static initLocation(longitude: number = 120.0, latitude: number = 35.0): SolarTimeUtil {
    return new SolarTimeUtil(longitude, latitude);
  }

  /**
   * 将 Date 对象转换为 SolarTime
   */
  static dateToSolarTime(date: Date): SolarTime {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1, // JavaScript month is 0-based
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds() + date.getMilliseconds() / 1000
    };
  }

  /**
   * 将 SolarTime 转换为 Date 对象
   */
  static solarTimeToDate(solarTime: SolarTime): Date {
    return new Date(
      solarTime.year,
      solarTime.month - 1, // JavaScript month is 0-based
      solarTime.day,
      solarTime.hour,
      solarTime.minute,
      Math.floor(solarTime.second),
      Math.round((solarTime.second % 1) * 1000)
    );
  }

  /**
   * 将 SolarTime 格式化为字符串
   */
  static formatSolarTime(solarTime: SolarTime): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const sec = solarTime.second.toFixed(2).padStart(5, '0');
    return `${solarTime.year}-${pad(solarTime.month)}-${pad(solarTime.day)} ${pad(solarTime.hour)}:${pad(solarTime.minute)}:${sec}`;
  }

  /**
   * 获取儒略日
   */
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

    // 加上时分秒的部分
    jd += solarTime.hour / 24.0 + solarTime.minute / 1440.0 + solarTime.second / 86400.0;

    return new JulianDay(jd);
  }

  /**
   * 计算平太阳时
   * @param solarTime 公历时间
   * @returns 平太阳时的公历时间 SolarTime
   */
  getMeanSolarTime(solarTime: SolarTime): SolarTime {
    const spcjd = this.getJulianDay(solarTime).getDay();
    // 计算地方平太阳时,每经度时差4分钟
    const deltPty = spcjd - (this._j - this.lng) * 4 / 60 / 24;
    return JulianDay.fromJulianDay(deltPty).getSolarTime();
  }

  /**
   * 计算真太阳时
   * @param solarTime 公历时间
   * @returns 真太阳时的公历时间 SolarTime
   */
  getTrueSolarTime(solarTime: SolarTime): SolarTime {
    const spcjd = this.getJulianDay(solarTime).getDay();
    const realZty = this._zty(spcjd);
    return JulianDay.fromJulianDay(realZty).getSolarTime();
  }

  /**
   * 计算真太阳时（从 Date 对象）
   * @param date JavaScript Date 对象
   * @returns 真太阳时的 Date 对象
   */
  getTrueSolarTimeFromDate(date: Date): Date {
    const solarTime = SolarTimeUtil.dateToSolarTime(date);
    const trueSolarTime = this.getTrueSolarTime(solarTime);
    return SolarTimeUtil.solarTimeToDate(trueSolarTime);
  }

  /**
   * 获取时差（真太阳时 - 平太阳时），单位为分钟
   */
  getEquationOfTime(date: Date): number {
    const solarTime = SolarTimeUtil.dateToSolarTime(date);
    const spcjd = this.getJulianDay(solarTime).getDay();
    const dt = this._risenset(spcjd, 2)[2] as number;
    return dt * 24 * 60; // 转换为分钟
  }

  // ============ 私有辅助方法 ============

  /** sin 函数，角度转弧度 */
  private _sn(x: number): number {
    return Math.sin(x * 1.74532925199433e-2);
  }

  /** cos 函数，角度转弧度 */
  private _cn(x: number): number {
    return Math.cos(x * 1.74532925199433e-2);
  }

  /** 返回小数部分(负数特殊) */
  private _fpart(x: number): number {
    x = x - Math.floor(x);
    if (x < 0) {
      x = x + 1;
    }
    return x;
  }

  /** 只取整数部份 */
  private _ipart(x: number): number {
    if (x === 0) {
      return 0;
    }
    return (x / Math.abs(x)) * Math.floor(Math.abs(x));
  }

  /**
   *  finds a parabola through three points
   */
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

  /**
   * 计算太阳或月亮的地平高度正弦值
   */
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

  /**
   * 计算太阳的视赤经和视赤纬
   */
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

  /**
   * 计算月球的视赤经和视赤纬
   */
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

  /**
   * 计算升降时刻
   * @param jd 儒略日
   * @param lx 类型:1月亮;2太阳日升日落;3太阳海上微光
   */
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

  /**
   * 真太阳时计算核心
   * 原理:用天文方法计算出太阳升起和落下时刻,中间则为当地正午,与12点比较得到时差
   * 与寿星万年历比较,两者相差在20秒内
   */
  private _zty(jd: number): number {
    const dt = this._risenset(jd, 2)[2] as number;
    return jd - (this._j - this.lng) * 4 / 60 / 24 + dt;
  }
}

export default SolarTimeUtil;
