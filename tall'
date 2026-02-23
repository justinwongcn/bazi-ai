import { useCallback, useEffect, useMemo, useState } from 'react';
import Sidebar from './components/Sidebar';
import { useBaseParams, useBirthInfo, useFortuneData, useInitialSelection, useFlowData } from './hooks';
import { buildPillarInfo, getWuXingStatus } from './services';
import { formatSolarTime } from './utils/format';
import { SixtyCycle, HeavenStem, DecadeFortune } from 'tyme4ts';

const DV_ATTR = { 'data-v-07b66fb4': '' } as const;

interface TableColumn {
  key: string;
  label: string;
  pillar: string;
}

function ProPage() {
  const baseParams = useBaseParams();
  const birthInfo = useBirthInfo(baseParams);
  const fortuneData = useFortuneData(birthInfo);
  const initialSelection = useInitialSelection(birthInfo, fortuneData);

  const [selectedDecadeIndex, setSelectedDecadeIndex] = useState(initialSelection.decadeIndex);
  const [selectedFlowYearIndex, setSelectedFlowYearIndex] = useState(initialSelection.flowYearIndex);
  const [selectedSmallFortuneIndex, setSelectedSmallFortuneIndex] = useState(initialSelection.smallFortuneIndex);
  const [selectedFlowMonthIndex, setSelectedFlowMonthIndex] = useState(initialSelection.flowMonthIndex);
  const [selectedFlowDayIndex, setSelectedFlowDayIndex] = useState(initialSelection.flowDayIndex);
  const [selectedFlowHourIndex, setSelectedFlowHourIndex] = useState(initialSelection.flowHourIndex);
  const [showFlowDay, setShowFlowDay] = useState(false);
  const [showFlowHour, setShowFlowHour] = useState(false);

  useEffect(() => {
    setSelectedDecadeIndex(initialSelection.decadeIndex);
    setSelectedFlowYearIndex(initialSelection.flowYearIndex);
    setSelectedSmallFortuneIndex(initialSelection.smallFortuneIndex);
  }, [initialSelection]);

  const flowData = useFlowData(birthInfo, fortuneData, {
    decadeIndex: selectedDecadeIndex,
    flowYearIndex: selectedFlowYearIndex,
    smallFortuneIndex: selectedSmallFortuneIndex,
    flowMonthIndex: selectedFlowMonthIndex,
    flowDayIndex: selectedFlowDayIndex,
    flowHourIndex: selectedFlowHourIndex,
  });

  const selectedDecade = fortuneData.decades[Math.min(Math.max(selectedDecadeIndex, 0), fortuneData.decades.length - 1)];
  const selectedSmallFortune = fortuneData.smallFortunes.length > 0
    ? fortuneData.smallFortunes[Math.min(Math.max(selectedSmallFortuneIndex, 0), fortuneData.smallFortunes.length - 1)]
    : null;
  const selectedFlowYear = flowData.flowYears[Math.min(Math.max(selectedFlowYearIndex, 0), flowData.flowYears.length - 1)];
  const selectedFlowMonth = flowData.flowMonths[Math.min(Math.max(selectedFlowMonthIndex, 0), flowData.flowMonths.length - 1)];
  const selectedFlowDay = flowData.flowDays[Math.min(Math.max(selectedFlowDayIndex, 0), flowData.flowDays.length - 1)];
  const selectedFlowHour = flowData.flowHours[Math.min(Math.max(selectedFlowHourIndex, 0), flowData.flowHours.length - 1)];

  const goToNow = useCallback(() => {
    const now = new Date();
    const nowYear = now.getFullYear();
    const nowMonth = now.getMonth();
    const nowDay = now.getDate();
    const nowHour = now.getHours();

    // 检查是否在小运期间
    const currentAge = nowYear - birthInfo.birthYear + 1;
    const startAge = fortuneData.childLimit.getYearCount() + 1;

    if (currentAge < startAge && fortuneData.smallFortunes.length > 0) {
      // 在小运期间
      setSelectedDecadeIndex(-1);
      setSelectedSmallFortuneIndex(Math.min(currentAge - 1, fortuneData.smallFortunes.length - 1));
      setSelectedFlowYearIndex(Math.min(currentAge - 1, fortuneData.smallFortunes.length - 1));
      setSelectedFlowMonthIndex(nowMonth);
      setSelectedFlowDayIndex(nowDay - 1);
      setSelectedFlowHourIndex(nowHour);
      setShowFlowDay(true);
      setShowFlowHour(true);
      return;
    }

    // 在大运期间
    const decadeIdx = fortuneData.decades.findIndex((d: DecadeFortune) => {
      const startY = d.getStartSixtyCycleYear().getYear();
      const endY = d.getEndSixtyCycleYear().getYear();
      return nowYear >= startY && nowYear <= endY;
    });

    if (decadeIdx >= 0) {
      const decade = fortuneData.decades[decadeIdx];
      const startY = decade.getStartSixtyCycleYear().getYear();
      const flowIdx = Math.min(Math.max(nowYear - startY, 0), 9);

      setSelectedDecadeIndex(decadeIdx);
      setSelectedFlowYearIndex(flowIdx);
      setSelectedFlowMonthIndex(nowMonth);
      setSelectedFlowDayIndex(nowDay - 1);
      setSelectedFlowHourIndex(nowHour);
      setShowFlowDay(true);
      setShowFlowHour(true);
    }
  }, [fortuneData.decades, fortuneData.childLimit, fortuneData.smallFortunes, birthInfo.birthYear]);

  const wuXingStatus = useMemo(() => {
    // 五行旺相休囚死应该根据命局的月柱（出生月令）来判断，而不是流月
    const monthPillar = birthInfo.pillars.month;
    if (!monthPillar) return ['水旺', '木相', '金休', '土囚', '火死'];
    const branch = monthPillar.charAt(1);
    return getWuXingStatus(branch);
  }, [birthInfo.pillars.month]);

  const columns = useMemo(() => {
    const defaultPillar = buildPillarInfo(birthInfo.pillars.hour, birthInfo.dayStem, null);
    
    const liunianInfo = selectedFlowYear
      ? buildPillarInfo(selectedFlowYear.pillar, birthInfo.dayStem, null)
      : defaultPillar;
    
    const dayunInfo = selectedDecadeIndex >= 0
      ? buildPillarInfo(selectedDecade.getName(), birthInfo.dayStem, null)
      : selectedSmallFortune
        ? buildPillarInfo(selectedSmallFortune.pillar, birthInfo.dayStem, null)
        : defaultPillar;

    return {
      liunianInfo,
      dayunInfo,
      yearInfo: buildPillarInfo(birthInfo.pillars.year, birthInfo.dayStem, null),
      monthInfo: buildPillarInfo(birthInfo.pillars.month, birthInfo.dayStem, null),
      dayInfo: buildPillarInfo(birthInfo.pillars.day, birthInfo.dayStem, birthInfo.dayLabel),
      hourInfo: buildPillarInfo(birthInfo.pillars.hour, birthInfo.dayStem, null),
      liuyueInfo: selectedFlowMonth
        ? buildPillarInfo(selectedFlowMonth.pillar, birthInfo.dayStem, null)
        : defaultPillar,
      liuriInfo: selectedFlowDay
        ? buildPillarInfo(selectedFlowDay.pillar, birthInfo.dayStem, null)
        : defaultPillar,
      liushiInfo: selectedFlowHour
        ? buildPillarInfo(selectedFlowHour.pillar, birthInfo.dayStem, null)
        : defaultPillar,
    };
  }, [birthInfo, selectedDecade, selectedDecadeIndex, selectedFlowYear, selectedFlowMonth, selectedFlowDay, selectedFlowHour, selectedSmallFortune]);

  const tableColumns: TableColumn[] = useMemo(() => [
    { key: 'liunian', label: '流年', pillar: columns.liunianInfo.name },
    { key: 'dayun', label: selectedDecadeIndex < 0 ? '小运' : '大运', pillar: columns.dayunInfo.name },
    { key: 'liuyue', label: '流月', pillar: columns.liuyueInfo.name },
    ...(showFlowDay ? [{ key: 'liuri', label: '流日', pillar: columns.liuriInfo.name }] : []),
    ...(showFlowHour ? [{ key: 'liushi', label: '流时', pillar: columns.liushiInfo.name }] : []),
    { key: 'year', label: '年柱', pillar: columns.yearInfo.name },
    { key: 'month', label: '月柱', pillar: columns.monthInfo.name },
    { key: 'day', label: '日柱', pillar: columns.dayInfo.name },
    { key: 'hour', label: '时柱', pillar: columns.hourInfo.name },
  ], [columns, selectedDecadeIndex, showFlowDay, showFlowHour]);

  const startAge = selectedDecadeIndex >= 0 ? selectedDecade.getStartAge() : fortuneData.childLimit.getYearCount() + 1;
  const xiaoyunStartYear = birthInfo.birthYear;
  const xiaoyunAgeText = `1~${Math.max(startAge - 1, 1)}岁 `;

  const birthInfoDisplay = useMemo(() => {
    const solarTime = birthInfo.birthSolarTime;
    const lunarHour = solarTime.getLunarHour();
    const lunarDay = lunarHour.getLunarDay();
    const lunarMonth = lunarDay.getLunarMonth();
    const lunarYear = lunarMonth.getLunarYear();

    return {
      lunarText: `${lunarYear.getName()}年${lunarMonth.getName()}${lunarDay.getName()} ${lunarHour.getName()}`,
      solarText: formatSolarTime(solarTime),
      sexText: baseParams.sex === '1' ? '乾造' : '坤造',
    };
  }, [birthInfo.birthSolarTime, baseParams.sex]);

  return (
    <div className="flex min-h-screen bg-[#f5f5f7] text-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="w-full px-[13px] py-4">
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
                    fallback.textContent = baseParams.name?.slice(0, 1) || '命';
                    parent.insertBefore(fallback, target);
                  }
                }}
              />
              <div>
                <div style={{ fontSize: 30, fontWeight: 600, color: 'rgb(178, 149, 93)' }}>
                  {baseParams.name || '未知'}
                </div>
                <div style={{ fontSize: 16, color: 'white', marginTop: 4 }}>
                  阴历：{birthInfoDisplay.lunarText} <span style={{ color: 'rgb(178, 149, 93)' }}>（{birthInfoDisplay.sexText}）</span>
                </div>
                <div style={{ fontSize: 16, color: 'white', marginTop: 4 }}>
                  阳历：{birthInfoDisplay.solarText}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="pro-pan-content" {...DV_ATTR}>
                <div className="pro-pan-content-left" {...DV_ATTR}>
                  <div className="pro-pan-content-table" {...DV_ATTR}>
                    <TableHeader columns={tableColumns} />
                    <TableBody columns={tableColumns} pillarData={columns} dayLabel={birthInfo.dayLabel} />
                  </div>
                </div>

                <div className="pro-pan-content-right" {...DV_ATTR}>
                  <div className="pro-pan-content-bg" {...DV_ATTR}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px 12px 0 0' }}>
                      <img
                        src="/static/img/btn_now.png"
                        alt="今"
                        onClick={goToNow}
                        style={{ width: '32px', height: '32px', cursor: 'pointer' }}
                      />
                    </div>
                    <QiYunInfo
                      childLimit={fortuneData.childLimit}
                      currentAge={new Date().getFullYear() - birthInfo.birthYear + 1}
                    />
                    <FortuneSection
                      title="大运"
                      items={fortuneData.decades.map((d, idx) => ({
                        label: `${d.getStartSixtyCycleYear().getYear()}`,
                        subLabel: `${d.getStartAge()}岁`,
                        pillar: d.getName(),
                        isSelected: idx === selectedDecadeIndex,
                        onClick: () => {
                          setSelectedDecadeIndex(idx);
                          setSelectedFlowYearIndex(0);
                        },
                      }))}
                      prependItem={{
                        label: String(xiaoyunStartYear),
                        subLabel: xiaoyunAgeText,
                        pillar: '小运',
                        isSelected: selectedDecadeIndex < 0,
                        onClick: () => {
                          setSelectedDecadeIndex(-1);
                          setSelectedSmallFortuneIndex(0);
                          setSelectedFlowYearIndex(0);
                        },
                      }}
                      dayStem={birthInfo.dayStem}
                    />
                    <FortuneSection
                      title={selectedDecadeIndex < 0 ? '小运' : '流年'}
                      items={(selectedDecadeIndex < 0 ? fortuneData.smallFortunes : flowData.flowYears).map((item, idx) => ({
                        label: selectedDecadeIndex < 0 ? `${birthInfo.birthYear + (item.age || 0) - 1}` : `${item.year}`,
                        subLabel: item.age ? `${item.age}岁` : undefined,
                        pillar: item.pillar,
                        isSelected: idx === (selectedDecadeIndex < 0 ? selectedSmallFortuneIndex : selectedFlowYearIndex),
                        onClick: () => {
                          if (selectedDecadeIndex < 0) {
                            setSelectedSmallFortuneIndex(idx);
                            setSelectedFlowYearIndex(idx);
                          } else {
                            setSelectedFlowYearIndex(idx);
                            setSelectedFlowMonthIndex(0);
                            setSelectedFlowDayIndex(0);
                            setSelectedFlowHourIndex(0);
                          }
                        },
                      }))}
                      dayStem={birthInfo.dayStem}
                    />
                    <FortuneSection
                      title="流月"
                      items={flowData.flowMonths.map((item, idx) => ({
                        label: `${item.month}月`,
                        pillar: item.pillar,
                        isSelected: idx === selectedFlowMonthIndex,
                        onClick: () => {
                          setSelectedFlowMonthIndex(idx);
                          setSelectedFlowDayIndex(0);
                          setSelectedFlowHourIndex(0);
                          setShowFlowDay(true);
                          setShowFlowHour(false);
                        },
                      }))}
                      dayStem={birthInfo.dayStem}
                    />
                    {showFlowDay && (
                      <FortuneSection
                        title="流日"
                        items={flowData.flowDays.map((item, idx) => ({
                          label: `${item.day}日`,
                          pillar: item.pillar,
                          isSelected: idx === selectedFlowDayIndex,
                          onClick: () => {
                            setSelectedFlowDayIndex(idx);
                            setSelectedFlowHourIndex(0);
                            setShowFlowHour(true);
                          },
                        }))}
                        dayStem={birthInfo.dayStem}
                      />
                    )}
                    {showFlowHour && (
                      <FortuneSection
                        title="流时"
                        items={flowData.flowHours.map((item, idx) => ({
                          label: `${String(item.hour).padStart(2, '0')}:00`,
                          pillar: item.pillar,
                          isSelected: idx === selectedFlowHourIndex,
                          onClick: () => setSelectedFlowHourIndex(idx),
                        }))}
                        dayStem={birthInfo.dayStem}
                      />
                    )}
                    <WuXingStatusDisplay status={wuXingStatus} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const TableHeader: React.FC<{ columns: TableColumn[] }> = ({ columns }) => (
  <div className="pro-pan-row paipanTitleColor" {...DV_ATTR}>
    <div className="pro-pan-row-item paipanTitleColor" {...DV_ATTR}>日期</div>
    {columns.map((col) => (
      <div key={col.key} className="pro-pan-row-item shadowBoder" {...DV_ATTR}>
        {col.label}
      </div>
    ))}
  </div>
);

const TableBody: React.FC<{
  columns: TableColumn[];
  pillarData: Record<string, ReturnType<typeof buildPillarInfo>>;
  dayLabel: string;
}> = ({ columns, pillarData, dayLabel }) => {
  const rows = ['主星', '天干', '地支', '藏干', '星运', '自坐', '空亡', '纳音'];
  const pillarKeys = ['liunianInfo', 'dayunInfo', 'liuyueInfo', 'liuriInfo', 'liushiInfo', 'yearInfo', 'monthInfo', 'dayInfo', 'hourInfo'];

  return (
    <>
      {rows.map((row) => (
        <div key={row} className={`pro-pan-row ${row === '藏干' ? 'greyBg' : ''}`} {...DV_ATTR}>
          <div className="pro-pan-row-item paipanTitleColor" {...DV_ATTR}>{row}</div>
          {columns.map((col, colIdx) => {
            const pillarKey = pillarKeys.find(k => pillarData[k]?.name === col.pillar) || 'hourInfo';
            const pillar = pillarData[pillarKey];
            if (!pillar) return <div key={colIdx} className="pro-pan-row-item" {...DV_ATTR}>-</div>;

            switch (row) {
              case '主星':
                return (
                  <div key={colIdx} className="pro-pan-row-item" {...DV_ATTR}>
                    <span className={pillar.tenStarName === dayLabel ? '' : 'pointer'} {...DV_ATTR}>
                      {pillar.tenStarName}
                    </span>
                  </div>
                );
              case '天干':
                return (
                  <div key={colIdx} className="pro-pan-row-item gzClass" {...DV_ATTR}>
                    <span className={pillar.stemColor} {...DV_ATTR}>{pillar.stem}</span>
                  </div>
                );
              case '地支':
                return (
                  <div key={colIdx} className="pro-pan-row-item gzClass" {...DV_ATTR}>
                    <span className={pillar.branchColor} {...DV_ATTR}>{pillar.branch}</span>
                  </div>
                );
              case '藏干':
                return (
                  <div key={colIdx} className="pro-pan-row-item columnFlex alignSelfStart" {...DV_ATTR}>
                    {pillar.hiddenStems.map((hs, i) => (
                      <span key={i} className={hs.stemColor} {...DV_ATTR} style={{ fontSize: 0, marginBottom: 2 }}>
                        <span {...DV_ATTR} style={{ fontSize: 15 }}>{hs.stem}</span>
                        <span className="pointer" {...DV_ATTR} style={{ color: 'black', fontSize: 14 }}>{hs.tenStarName}</span>
                      </span>
                    ))}
                  </div>
                );
              case '星运':
                return (
                  <div key={colIdx} className="pro-pan-row-item" {...DV_ATTR}>
                    <span className="pointer" {...DV_ATTR}>{pillar.starLuck}</span>
                  </div>
                );
              case '自坐':
                return (
                  <div key={colIdx} className="pro-pan-row-item" {...DV_ATTR}>
                    <span className="pointer" {...DV_ATTR}>{pillar.selfSeat}</span>
                  </div>
                );
              case '空亡':
                return (
                  <div key={colIdx} className="pro-pan-row-item" {...DV_ATTR}>
                    {pillar.empty}
                  </div>
                );
              case '纳音':
                return (
                  <div key={colIdx} className="pro-pan-row-item" {...DV_ATTR}>
                    <span className="pointer" {...DV_ATTR}>{pillar.naYin}</span>
                  </div>
                );
              default:
                return <div key={colIdx} className="pro-pan-row-item" {...DV_ATTR}>-</div>;
            }
          })}
        </div>
      ))}
    </>
  );
};

const QiYunInfo: React.FC<{
  childLimit: { getYearCount: () => number; getMonthCount: () => number; getDayCount: () => number; getHourCount: () => number; getMinuteCount: () => number; getEndTime: () => { getYear: () => number; getMonth: () => number; getDay: () => number } };
  currentAge: number;
}> = ({ childLimit, currentAge }) => (
  <div className="pro-pan-qiyun" {...DV_ATTR}>
    <div className="pro-pan-qiyun-left" {...DV_ATTR}>
      <div {...DV_ATTR}>
        <span {...DV_ATTR}>起运：</span>
        出生后{childLimit.getYearCount()}年{childLimit.getMonthCount()}月{childLimit.getDayCount()}
        天{childLimit.getHourCount()}时{childLimit.getMinuteCount()}分起运
      </div>
      <div {...DV_ATTR}>
        <span {...DV_ATTR}>交运：</span>
        {childLimit.getEndTime().getYear()}年{childLimit.getEndTime().getMonth()}月
        {childLimit.getEndTime().getDay()}日交大运
      </div>
    </div>
    <div className="pro-pan-qiyun-middle" {...DV_ATTR} />
    <div className="pro-pan-qiyun-right" {...DV_ATTR}>
      <div className="right" {...DV_ATTR}>
        <span className="age" {...DV_ATTR}>{currentAge}岁</span>
        <span className="rysl" {...DV_ATTR} />
      </div>
      <div className="pro-pan-qiyun-icon" {...DV_ATTR} />
    </div>
  </div>
);

const FortuneSection: React.FC<{
  title: string;
  items: Array<{
    label: string;
    subLabel?: string;
    pillar: string;
    isSelected: boolean;
    onClick: () => void;
  }>;
  prependItem?: {
    label: string;
    subLabel: string;
    pillar: string;
    isSelected: boolean;
    onClick: () => void;
  };
  dayStem: HeavenStem;
}> = ({ title, items, prependItem, dayStem }) => {
  const getElementColor = (char: string) => {
    if ('甲乙寅卯'.includes(char)) return 'woodColor';
    if ('丙丁巳午'.includes(char)) return 'fireColor';
    if ('戊己辰戌丑未'.includes(char)) return 'soilColor';
    if ('庚辛申酉'.includes(char)) return 'goldColor';
    return 'waterColor';
  };

  const getTenStarShort = (name: string) => {
    const map: Record<string, string> = {
      '比肩': '比', '劫财': '劫', '食神': '食', '伤官': '伤',
      '偏财': '才', '正财': '财', '七杀': '杀', '正官': '官',
      '偏印': '枭', '正印': '印',
    };
    return map[name] || name.slice(0, 1);
  };

  const renderItem = (item: typeof items[0]) => {
    const stem = item.pillar.charAt(0);
    const branch = item.pillar.charAt(1);
    
    const isValidPillar = stem && branch && '甲乙丙丁戊己庚辛壬癸'.includes(stem) && '子丑寅卯辰巳午未申酉戌亥'.includes(branch);
    
    let stemTenStar = '';
    let branchTenStar = '';
    
    if (isValidPillar) {
      try {
        stemTenStar = dayStem.getTenStar(HeavenStem.fromName(stem)).getName();
        const branchMain = SixtyCycle.fromName(item.pillar).getEarthBranch().getHideHeavenStemMain();
        branchTenStar = branchMain ? dayStem.getTenStar(branchMain).getName() : '';
      } catch {
        stemTenStar = '';
        branchTenStar = '';
      }
    }

    return (
      <div
        key={item.label}
        className={`pro-pan-yun-item pointer ${item.isSelected ? 'pro-pan-yun-item-selected' : ''}`}
        {...DV_ATTR}
        onClick={item.onClick}
      >
        <span className="pro-pan-yun-item-small" {...DV_ATTR}>{item.label}</span>
        {item.subLabel && (
          <span className="pro-pan-yun-item-small" {...DV_ATTR} style={{ marginTop: 4 }}>
            {item.subLabel}
          </span>
        )}
        <span className="pro-pan-yun-item-label" {...DV_ATTR}>
          <span className={`pro-pan-yun-item-text ${isValidPillar ? getElementColor(stem) : ''}`} {...DV_ATTR} style={!isValidPillar ? { color: 'black' } : undefined}>
            {stem}
          </span>
          <span className="pro-pan-yun-item-shishen" {...DV_ATTR}>
            {stemTenStar ? getTenStarShort(stemTenStar) : ''}
          </span>
        </span>
        <span className="pro-pan-yun-item-label" {...DV_ATTR}>
          <span className={`pro-pan-yun-item-text ${isValidPillar ? getElementColor(branch) : ''}`} {...DV_ATTR} style={!isValidPillar ? { color: 'black' } : undefined}>
            {branch}
          </span>
          <span className="pro-pan-yun-item-shishen" {...DV_ATTR}>
            {branchTenStar ? getTenStarShort(branchTenStar) : ''}
          </span>
        </span>
      </div>
    );
  };

  return (
    <div className="pro-pan-yun" {...DV_ATTR}>
      <div className="pro-pan-yun-item pro-pan-yun-item-title" {...DV_ATTR}>
        <span {...DV_ATTR}>{title.charAt(0)}</span>
        <span {...DV_ATTR}>{title.charAt(1)}</span>
      </div>
      <div className="pro-pan-yun-items" {...DV_ATTR}>
        {prependItem && renderItem(prependItem)}
        {items.map(renderItem)}
      </div>
    </div>
  );
};

const WuXingStatusDisplay: React.FC<{ status: string[] }> = ({ status }) => (
  <div className="pro-pan-wuxing" {...DV_ATTR}>
    {status.map((t) => (
      <div key={t} className="pro-pan-wuxing-item" {...DV_ATTR}>
        {t}
      </div>
    ))}
  </div>
);

export default ProPage;
