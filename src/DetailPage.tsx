import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LunarHour, SolarTime } from 'tyme4ts';
import { WUXING_ICON_DATA_URI } from './data/wuxingIcons';
import { BaziCalculator } from './utils/baziCalculator';
import { SolarTimeUtil } from './utils/solarTimeUtil';
import { getDefaultParams } from './utils/defaultParams';
import Sidebar from './components/Sidebar';

const parseDateTime = (value: string) => {
  const [datePart, timePart = '00:00'] = value.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);
  return { year, month, day, hour, minute };
};

const formatSolarTime = (solarTime: SolarTime) => {
  const y = solarTime.getYear();
  const m = String(solarTime.getMonth()).padStart(2, '0');
  const d = String(solarTime.getDay()).padStart(2, '0');
  const h = String(solarTime.getHour()).padStart(2, '0');
  const min = String(solarTime.getMinute()).padStart(2, '0');
  return `${y}年${m}月${d}日 ${h}:${min}`;
};

const getElementColor = (char: string) => {
  const colors: Record<string, string> = {
    '甲': 'rgb(7,233,48)', '乙': 'rgb(7,233,48)',
    '寅': 'rgb(7,233,48)', '卯': 'rgb(7,233,48)',
    '丙': 'rgb(211,5,5)', '丁': 'rgb(211,5,5)',
    '巳': 'rgb(211,5,5)', '午': 'rgb(211,5,5)',
    '戊': 'rgb(139,109,3)', '己': 'rgb(139,109,3)',
    '辰': 'rgb(139,109,3)', '戌': 'rgb(139,109,3)', '丑': 'rgb(139,109,3)', '未': 'rgb(139,109,3)',
    '庚': 'rgb(239,145,4)', '辛': 'rgb(239,145,4)',
    '申': 'rgb(239,145,4)', '酉': 'rgb(239,145,4)',
    '壬': 'rgb(46,131,246)', '癸': 'rgb(46,131,246)',
    '亥': 'rgb(46,131,246)', '子': 'rgb(46,131,246)'
  };
  return colors[char] || '#374151';
};

const getElementMeta = (char: string) => {
  const metaMap: Record<string, { label: string; color: string }> = {
    '甲': { label: '木', color: '#07e930' }, '乙': { label: '木', color: '#07e930' },
    '寅': { label: '木', color: '#07e930' }, '卯': { label: '木', color: '#07e930' },
    '丙': { label: '火', color: '#d30505' }, '丁': { label: '火', color: '#d30505' },
    '巳': { label: '火', color: '#d30505' }, '午': { label: '火', color: '#d30505' },
    '戊': { label: '土', color: '#8b6d03' }, '己': { label: '土', color: '#8b6d03' },
    '辰': { label: '土', color: '#8b6d03' }, '戌': { label: '土', color: '#8b6d03' }, '丑': { label: '土', color: '#8b6d03' }, '未': { label: '土', color: '#8b6d03' },
    '庚': { label: '金', color: '#ef9104' }, '辛': { label: '金', color: '#ef9104' },
    '申': { label: '金', color: '#ef9104' }, '酉': { label: '金', color: '#ef9104' },
    '壬': { label: '水', color: '#2e83f6' }, '癸': { label: '水', color: '#2e83f6' },
    '亥': { label: '水', color: '#2e83f6' }, '子': { label: '水', color: '#2e83f6' }
  };
  return metaMap[char] || { label: '', color: '#9ca3af' };
};

const getElementIconDataUri = (char: string) => {
  const meta = getElementMeta(char);
  if (!meta.label) return '';
  return WUXING_ICON_DATA_URI[meta.label as keyof typeof WUXING_ICON_DATA_URI] || '';
};

interface BaziColumn {
  title: string;
  tg: string;
  dz: string;
  hiddenStems: string[];
  mainTenStar: string;
  subTenStars: string[];
  starLuck: string;
  selfSeat: string;
  empty: string;
  naYin: string;
}

const getAdjustedDate = (date: Date, longitude: number, latitude: number, useTrueSolar: boolean, useDst: boolean, useEarlyRat: boolean) => {
  let target = new Date(date.getTime());
  if (useDst) {
    target = new Date(target.getTime() - 60 * 60 * 1000);
  }
  if (useTrueSolar && longitude && latitude) {
    const util = new SolarTimeUtil(longitude, latitude);
    target = util.getTrueSolarTimeFromDate(target);
  }
  if (useEarlyRat && target.getHours() === 23) {
    target = new Date(target.getFullYear(), target.getMonth(), target.getDate() + 1, target.getHours(), target.getMinutes(), target.getSeconds());
  }
  return target;
};

function DetailPage() {
  const [searchParams] = useSearchParams();

  const data = useMemo(() => {
    const hasParams = searchParams.toString().length > 0;
    const defaultParams = getDefaultParams();
    
    const name = searchParams.get('name') || (hasParams ? '未知' : defaultParams.name);
    const sexLabel = (searchParams.get('sex') || (hasParams ? '1' : defaultParams.sex)) === '1' ? '乾造' : '坤造';
    const dateStr = searchParams.get('date') || (hasParams ? '1990-01-01T00:00' : defaultParams.date);
    const dateType = searchParams.get('dateType') || (hasParams ? '1' : defaultParams.dateType);
    const lunarMonthParam = parseInt(searchParams.get('lunarMonth') || '', 10);
    const lunarLeap = searchParams.get('lunarLeap') === '1';
    const location = searchParams.get('location') || (hasParams ? '未知地' : defaultParams.location);
    const isTrueSolar = (searchParams.get('isTrueSolar') || (hasParams ? '0' : defaultParams.isTrueSolar)) === '1';
    const isDst = searchParams.get('isDst') === '1';
    const isEarlyRat = searchParams.get('isEarlyRat') === '1';

    const { year, month, day, hour, minute } = parseDateTime(dateStr);
    const lunarMonthValue = Number.isNaN(lunarMonthParam) ? month : lunarMonthParam;
    const monthForCalc = dateType === '0'
      ? (lunarLeap ? -Math.abs(lunarMonthValue) : Math.abs(lunarMonthValue))
      : month;

    const longitude = parseFloat(searchParams.get('longitude') || (hasParams ? '116.407394' : defaultParams.longitude));
    const latitude = parseFloat(searchParams.get('latitude') || (hasParams ? '39.904211' : defaultParams.latitude));

    const baziResult = BaziCalculator.calculate({
      year,
      month: monthForCalc,
      day,
      hour,
      minute,
      dateType,
      longitude,
      latitude,
      useTrueSolar: isTrueSolar,
      useDst: isDst,
      useEarlyRat: isEarlyRat
    });

    let baseDate: Date;
    if (dateType === '0') {
      const lunarHour = LunarHour.fromYmdHms(year, monthForCalc, day, hour, minute, 0);
      const solarTime = lunarHour.getSolarTime();
      baseDate = new Date(
        solarTime.getYear(),
        solarTime.getMonth() - 1,
        solarTime.getDay(),
        solarTime.getHour(),
        solarTime.getMinute(),
        solarTime.getSecond()
      );
    } else {
      baseDate = new Date(year, month - 1, day, hour, minute, 0);
    }

    const adjustedDate = getAdjustedDate(baseDate, longitude, latitude, isTrueSolar, isDst, isEarlyRat);
    const birthSolarTime = SolarTime.fromYmdHms(
      adjustedDate.getFullYear(),
      adjustedDate.getMonth() + 1,
      adjustedDate.getDate(),
      adjustedDate.getHours(),
      adjustedDate.getMinutes(),
      adjustedDate.getSeconds()
    );
    const lunarText = birthSolarTime.getLunarHour().toString();
    const formattedSolarTime = formatSolarTime(birthSolarTime);

    const columns: BaziColumn[] = [
      {
        title: "年柱",
        tg: baziResult.yearPillar[0],
        dz: baziResult.yearPillar[1],
        hiddenStems: baziResult.yearHiddenStems,
        mainTenStar: baziResult.yearTenStar,
        subTenStars: baziResult.yearHiddenTenStars,
        starLuck: baziResult.yearStarLuck,
        selfSeat: baziResult.yearSelfSeat,
        empty: baziResult.yearEmpty,
        naYin: baziResult.yearNaYin
      },
      {
        title: "月柱",
        tg: baziResult.monthPillar[0],
        dz: baziResult.monthPillar[1],
        hiddenStems: baziResult.monthHiddenStems,
        mainTenStar: baziResult.monthTenStar,
        subTenStars: baziResult.monthHiddenTenStars,
        starLuck: baziResult.monthStarLuck,
        selfSeat: baziResult.monthSelfSeat,
        empty: baziResult.monthEmpty,
        naYin: baziResult.monthNaYin
      },
      {
        title: "日柱",
        tg: baziResult.dayPillar[0],
        dz: baziResult.dayPillar[1],
        hiddenStems: baziResult.dayHiddenStems,
        mainTenStar: baziResult.dayTenStar,
        subTenStars: baziResult.dayHiddenTenStars,
        starLuck: baziResult.dayStarLuck,
        selfSeat: baziResult.daySelfSeat,
        empty: baziResult.dayEmpty,
        naYin: baziResult.dayNaYin
      },
      {
        title: "时柱",
        tg: baziResult.hourPillar[0],
        dz: baziResult.hourPillar[1],
        hiddenStems: baziResult.hourHiddenStems,
        mainTenStar: baziResult.hourTenStar,
        subTenStars: baziResult.hourHiddenTenStars,
        starLuck: baziResult.hourStarLuck,
        selfSeat: baziResult.hourSelfSeat,
        empty: baziResult.hourEmpty,
        naYin: baziResult.hourNaYin
      }
    ];

    return {
      baseInfo: {
        name,
        sex: sexLabel,
        lunarText,
        solarTime: formattedSolarTime,
        location
      },
      columns
    };
  }, [searchParams]);

  const rowLabels = ['四柱', '主星', '天干', '地支', '藏干', '副星', '星运', '自坐', '空亡', '纳音'];

  // 定义哪些行需要深色背景 - 隔行交替，奇数行(1,3,5...)为浅灰背景
  const isDarkRow = (index: number) => index % 2 === 1;

  return (
    <div className="flex min-h-screen bg-[#f5f5f5] text-gray-900">
      <Sidebar />
      <div className="flex-1">
        <div style={{ maxWidth: 1170, margin: '0 auto', padding: '24px 13px' }}>
          {/* Header */}
          <div
            style={{
              backgroundImage: 'url(/static/img/paipan_header_bg.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              padding: '20px 24px',
              borderRadius: '15px 15px 0 0',
              minHeight: 105,
              display: 'flex',
              alignItems: 'center',
              gap: 16
            }}
          >
            {/* 生肖头像 */}
            <img
              src="/static/img/sx_7.png"
              alt="生肖头像"
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.6)',
                flexShrink: 0
              }}
              onError={(e) => {
                // 如果图片加载失败，显示默认头像
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  const fallback = document.createElement('div');
                  fallback.style.cssText = 'width:64px;height:64px;border-radius:50%;border:1px solid rgba(255,255,255,0.6);background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:600;color:white;flex-shrink:0;';
                  fallback.textContent = data.baseInfo.name?.slice(0, 1) || '命';
                  parent.insertBefore(fallback, target);
                }
              }}
            />
            {/* 用户信息 */}
            <div>
              <div style={{ fontSize: 30, fontWeight: 600, color: 'rgb(178, 149, 93)' }}>
                {data.baseInfo.name}
              </div>
              <div style={{ fontSize: 16, color: 'white', marginTop: 4 }}>
                阴历：{data.baseInfo.lunarText} <span style={{ color: 'rgb(178, 149, 93)' }}>（{data.baseInfo.sex}）</span>
              </div>
              <div style={{ fontSize: 16, color: 'white', marginTop: 4 }}>
                阳历：{data.baseInfo.solarTime}
              </div>
            </div>
          </div>

          {/* Content */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {/* Left Panel - Bazi Table */}
            <div style={{ 
              flex: 1, 
              minWidth: '320px',
              border: '1px solid rgb(240, 240, 240)', 
              borderRadius: 10, 
              overflow: 'hidden',
              backgroundColor: '#fff'
            }}>
              {rowLabels.map((label, rowIndex) => {
                // 根据行类型设置高度
                let rowHeight = 33;
                if (rowIndex === 0) rowHeight = 40; // 日期行
                else if (label === '天干' || label === '地支') rowHeight = 48;
                else if (label === '藏干' || label === '副星') rowHeight = 68;

                const darkRow = isDarkRow(rowIndex);

                return (
                  <div
                    key={label}
                    style={{
                      display: 'flex',
                      minHeight: rowHeight,
                      backgroundColor: darkRow ? 'rgb(248, 248, 248)' : 'transparent'
                    }}
                  >
                  {/* Row Label */}
                  <div
                    style={{
                      width: 60,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 15,
                      color: 'rgb(158, 158, 158)',
                      borderRight: '1px solid rgb(240, 240, 240)',
                      flexShrink: 0,
                      backgroundColor: darkRow ? 'rgb(248, 248, 248)' : 'transparent'
                    }}
                  >
                    {label}
                  </div>
                  {/* Columns */}
                  {data.columns.map((col, colIndex) => (
                    <div
                      key={colIndex}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRight: colIndex < data.columns.length - 1 ? '1px solid rgb(240, 240, 240)' : 'none',
                        fontSize: 15,
                        color: 'rgb(0, 0, 0)',
                        backgroundColor: darkRow ? 'rgb(248, 248, 248)' : 'transparent'
                      }}
                    >
                      {rowIndex === 0 && (
                        <span style={{ fontSize: 15, color: 'rgb(158, 158, 158)' }}>{col.title}</span>
                      )}
                      {rowIndex === 1 && (
                        <span style={{ fontSize: 14, color: 'rgb(161, 161, 161)' }}>{col.mainTenStar}</span>
                      )}
                      {rowIndex === 2 && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                          <span style={{ fontSize: 28, fontWeight: 700, color: getElementColor(col.tg), paddingLeft: '16px' }}>{col.tg}</span>
                          <img src={getElementIconDataUri(col.tg)} alt="" style={{ width: 20, height: 20 }} />
                        </div>
                      )}
                      {rowIndex === 3 && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                          <span style={{ fontSize: 28, fontWeight: 700, color: getElementColor(col.dz), paddingLeft: '16px' }}>{col.dz}</span>
                          <img src={getElementIconDataUri(col.dz)} alt="" style={{ width: 20, height: 20 }} />
                        </div>
                      )}
                      {rowIndex === 4 && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          {col.hiddenStems.map((stem, i) => (
                            <span key={i} style={{ fontSize: 13, color: 'rgb(0, 0, 0)' }}>{stem}</span>
                          ))}
                        </div>
                      )}
                      {rowIndex === 5 && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          {col.subTenStars.map((star, i) => (
                            <span key={i} style={{ fontSize: 15, color: 'rgb(0, 0, 0)' }}>{star}</span>
                          ))}
                        </div>
                      )}
                      {rowIndex === 6 && (
                        <span style={{ fontSize: 15, color: 'rgb(0, 0, 0)' }}>{col.starLuck}</span>
                      )}
                      {rowIndex === 7 && (
                        <span style={{ fontSize: 15, color: 'rgb(0, 0, 0)' }}>{col.selfSeat}</span>
                      )}
                      {rowIndex === 8 && (
                        <span style={{ fontSize: 15, color: 'rgb(0, 0, 0)' }}>{col.empty}</span>
                      )}
                      {rowIndex === 9 && (
                        <span style={{ fontSize: 15, color: 'rgb(0, 0, 0)' }}>{col.naYin}</span>
                      )}
                    </div>
                  ))}
                </div>
                );
              })}
            </div>

            {/* Right Panel - Can be used for additional info */}
            <div style={{ 
              width: 512, 
              minWidth: '300px',
              flex: '0 1 auto',
              border: '1px solid rgb(240, 240, 240)', 
              borderRadius: 10,
              backgroundColor: '#fff'
            }}>
              {/* Additional content can go here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailPage;
