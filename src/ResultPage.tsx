import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BaziCalculator } from './utils/baziCalculator';
import { SolarTime, LunarHour } from 'tyme4ts';
import { getElementMeta, getElementIconDataUri, parseDateTime, getHiddenStems } from './utils';
import Sidebar from './components/Sidebar';

const getElementColorClass = (char: string) => {
  const colors: Record<string, string> = {
    '甲': 'text-[rgb(7,233,48)]', '乙': 'text-[rgb(7,233,48)]',
    '寅': 'text-[rgb(7,233,48)]', '卯': 'text-[rgb(7,233,48)]',
    '丙': 'text-[rgb(211,5,5)]', '丁': 'text-[rgb(211,5,5)]',
    '巳': 'text-[rgb(211,5,5)]', '午': 'text-[rgb(211,5,5)]',
    '戊': 'text-[rgb(139,109,3)]', '己': 'text-[rgb(139,109,3)]',
    '辰': 'text-[rgb(139,109,3)]', '戌': 'text-[rgb(139,109,3)]', '丑': 'text-[rgb(139,109,3)]', '未': 'text-[rgb(139,109,3)]',
    '庚': 'text-[rgb(239,145,4)]', '辛': 'text-[rgb(239,145,4)]',
    '申': 'text-[rgb(239,145,4)]', '酉': 'text-[rgb(239,145,4)]',
    '壬': 'text-[rgb(46,131,246)]', '癸': 'text-[rgb(46,131,246)]',
    '亥': 'text-[rgb(46,131,246)]', '子': 'text-[rgb(46,131,246)]',
  };
  return colors[char] || 'text-gray-800';
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

interface BaziData {
  baseInfo: {
    name: string;
    sex: string;
    solarTime: string;
    lunarTime: string;
    location: string;
  };
  columns: BaziColumn[];
}

function ResultPage() {
  const [searchParams] = useSearchParams();
  const data: BaziData = useMemo(() => {
    const name = searchParams.get('name') || '未知';
    const sex = searchParams.get('sex') === '1' ? '乾造' : '坤造';
    const dateStr = searchParams.get('date') || '1990-01-01T00:00';
    const dateType = searchParams.get('dateType') || '1';
    const lunarMonthParam = parseInt(searchParams.get('lunarMonth') || '', 10);
    const lunarLeap = searchParams.get('lunarLeap') === '1';
    const location = searchParams.get('location') || '未知地';
    const isTrueSolar = searchParams.get('isTrueSolar') === '1';
    const isDst = searchParams.get('isDst') === '1';
    const isEarlyRat = searchParams.get('isEarlyRat') === '1';
    
    const { year, month, day, hour, minute } = parseDateTime(dateStr);
    const lunarMonthValue = Number.isNaN(lunarMonthParam) ? month : lunarMonthParam;
    const monthForCalc = dateType === '0'
      ? (lunarLeap ? -Math.abs(lunarMonthValue) : Math.abs(lunarMonthValue))
      : month;
    
    const longitude = parseFloat(searchParams.get('longitude') || '116.407394');
    const latitude = parseFloat(searchParams.get('latitude') || '39.904211');
    
    const baziResult = BaziCalculator.calculate({
      year, month: monthForCalc, day, hour, minute,
      dateType,
      longitude,
      latitude,
      useTrueSolar: isTrueSolar,
      useDst: isDst,
      useEarlyRat: isEarlyRat
    });
    
    let solarTime: SolarTime;
    let lunarHour: LunarHour;

    if (dateType === '0') {
      lunarHour = LunarHour.fromYmdHms(year, monthForCalc, day, hour, minute, 0);
      solarTime = lunarHour.getSolarTime();
    } else {
      solarTime = SolarTime.fromYmdHms(year, month, day, hour, minute, 0);
      lunarHour = solarTime.getLunarHour();
    }

    const solarYear = solarTime.getYear();
    const solarMonth = solarTime.getMonth();
    const solarDay = solarTime.getDay();
    const solarHour = solarTime.getHour();
    const solarMinute = solarTime.getMinute();

    return {
      baseInfo: {
        name,
        sex,
        solarTime: `阳历：${solarYear}年${String(solarMonth).padStart(2, '0')}月${String(solarDay).padStart(2, '0')}日 ${String(solarHour).padStart(2, '0')}:${String(solarMinute).padStart(2, '0')}`,
        lunarTime: lunarHour.toString(),
        location
      },
      columns: [
        {
          title: "年柱",
          tg: baziResult.yearPillar[0],
          dz: baziResult.yearPillar[1],
          hiddenStems: getHiddenStems(baziResult.yearPillar[1]),
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
          hiddenStems: getHiddenStems(baziResult.monthPillar[1]),
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
          hiddenStems: getHiddenStems(baziResult.dayPillar[1]),
          mainTenStar: sex === '乾造' ? '元男' : '元女',
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
          hiddenStems: getHiddenStems(baziResult.hourPillar[1]),
          mainTenStar: baziResult.hourTenStar,
          subTenStars: baziResult.hourHiddenTenStars,
          starLuck: baziResult.hourStarLuck,
          selfSeat: baziResult.hourSelfSeat,
          empty: baziResult.hourEmpty,
          naYin: baziResult.hourNaYin
        }
      ]
    };
  }, [searchParams]);

  const pillars = data.columns;

  return (
    <div className="flex min-h-screen bg-[rgb(245,245,245)] text-gray-900">
      <Sidebar />
      <div className="flex-1" style={{ padding: '24px 13px 12px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
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
            <div>
              <div style={{ fontSize: 30, fontWeight: 600, color: 'rgb(178, 149, 93)' }}>
                {data.baseInfo.name}
              </div>
              <div style={{ fontSize: 16, color: 'white', marginTop: 4 }}>
                {data.baseInfo.lunarTime} <span style={{ color: 'rgb(178, 149, 93)' }}>（{data.baseInfo.sex}）</span>
              </div>
              <div style={{ fontSize: 16, color: 'white', marginTop: 4 }}>
                {data.baseInfo.solarTime}
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden" style={{ borderRadius: '0 0 15px 15px' }}>
          <div className="overflow-x-auto" style={{ padding: 0 }}>
            <table
              className="w-full border-collapse text-center"
              style={{
                minWidth: `${(pillars.length + 1) * 124}px`,
                border: '1px solid rgb(240, 240, 240)',
                borderRadius: 10,
                fontFamily: '"Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif'
              }}
            >
              <colgroup>
                <col style={{ width: 124, backgroundColor: 'white' }} />
                {pillars.map((_, index) => (
                  <col key={index} style={{ width: 124 }} />
                ))}
              </colgroup>
              <thead>
                <tr style={{ backgroundColor: 'white' }}>
                  <th style={{
                    padding: '13px 0 5px',
                    fontSize: 15,
                    fontWeight: 400,
                    color: 'rgb(158, 158, 158)'
                  }}>四柱</th>
                  {pillars.map((p, i) => (
                    <th key={i} style={{
                      padding: '13px 0 5px',
                      fontSize: 15,
                      fontWeight: 400,
                      color: 'rgb(158, 158, 158)'
                    }}>
                      {p.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{
                    padding: '5px 0',
                    textAlign: 'center',
                    color: 'rgb(158, 158, 158)',
                    fontSize: 15,
                    lineHeight: '15px',
                    whiteSpace: 'nowrap'
                  }}>主星</td>
                  {pillars.map((p, i) => (
                    <td key={i} style={{ padding: '5px 0', textAlign: 'center' }}>
                      <span style={{
                        fontSize: 14,
                        lineHeight: '15px',
                        color: 'rgb(161, 161, 161)'
                      }}>{p.mainTenStar}</span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td style={{
                    padding: '5px 0',
                    textAlign: 'center',
                    color: 'rgb(158, 158, 158)',
                    fontSize: 15,
                    lineHeight: '15px',
                    whiteSpace: 'nowrap'
                  }}>天干</td>
                  {pillars.map((p, i) => (
                    <td key={i} style={{ padding: '5px 0', textAlign: 'center' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 0
                      }}>
                        <span className={`${getElementColorClass(p.tg)}`} style={{
                          fontSize: 28,
                          lineHeight: '30px',
                          fontWeight: 700
                        }}>{p.tg}</span>
                        <img src={getElementIconDataUri(p.tg)} alt={getElementMeta(p.tg).label} style={{ width: 28, height: 28 }} />
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td style={{
                    padding: '5px 0',
                    textAlign: 'center',
                    color: 'rgb(158, 158, 158)',
                    fontSize: 15,
                    lineHeight: '15px',
                    whiteSpace: 'nowrap'
                  }}>地支</td>
                  {pillars.map((p, i) => (
                    <td key={i} style={{ padding: '5px 0', textAlign: 'center' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 0
                      }}>
                        <span className={`${getElementColorClass(p.dz)}`} style={{
                          fontSize: 28,
                          lineHeight: '30px',
                          fontWeight: 700
                        }}>{p.dz}</span>
                        <img src={getElementIconDataUri(p.dz)} alt={getElementMeta(p.dz).label} style={{ width: 28, height: 28 }} />
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultPage;
