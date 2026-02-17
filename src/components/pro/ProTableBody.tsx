import type { PillarData } from '../../types';
import type { TableColumn } from '../../hooks';

const DV_ATTR = { 'data-v-07b66fb4': '' } as const;

interface ProTableBodyProps {
  columns: TableColumn[];
  pillarData: Record<string, PillarData>;
  dayLabel: string;
}

const pillarKeys = ['liunianInfo', 'dayunInfo', 'liuyueInfo', 'liuriInfo', 'liushiInfo', 'yearInfo', 'monthInfo', 'dayInfo', 'hourInfo'];

export function ProTableBody({ columns, pillarData, dayLabel }: ProTableBodyProps) {
  const rows = ['主星', '天干', '地支', '藏干', '星运', '自坐', '空亡', '纳音'];

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
}
