import type { PillarData } from '../../types';
import type { TableColumn } from '../../hooks';

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
        <div key={row} className={`pro-pan-row ${row === '藏干' ? 'greyBg' : ''}`}>
          <div className="pro-pan-row-item paipanTitleColor">{row}</div>
          {columns.map((col, colIdx) => {
            const pillarKey = pillarKeys.find(k => pillarData[k]?.name === col.pillar) || 'hourInfo';
            const pillar = pillarData[pillarKey];
            if (!pillar) return <div key={colIdx} className="pro-pan-row-item">-</div>;

            switch (row) {
              case '主星':
                return (
                  <div key={colIdx} className="pro-pan-row-item">
                    <span className={pillar.tenStarName === dayLabel ? '' : 'pointer'}>
                      {pillar.tenStarName}
                    </span>
                  </div>
                );
              case '天干':
                return (
                  <div key={colIdx} className="pro-pan-row-item gzClass">
                    <span className={pillar.stemColor}>{pillar.stem}</span>
                  </div>
                );
              case '地支':
                return (
                  <div key={colIdx} className="pro-pan-row-item gzClass">
                    <span className={pillar.branchColor}>{pillar.branch}</span>
                  </div>
                );
              case '藏干':
                return (
                  <div key={colIdx} className="pro-pan-row-item columnFlex alignSelfStart">
                    {pillar.hiddenStems.map((hs, i) => (
                      <span key={i} className={hs.stemColor} style={{ fontSize: 0, marginBottom: 2 }}>
                        <span style={{ fontSize: 15 }}>{hs.stem}</span>
                        <span className="pointer" style={{ color: 'black', fontSize: 14 }}>{hs.tenStarName}</span>
                      </span>
                    ))}
                  </div>
                );
              case '星运':
                return (
                  <div key={colIdx} className="pro-pan-row-item">
                    <span className="pointer">{pillar.starLuck}</span>
                  </div>
                );
              case '自坐':
                return (
                  <div key={colIdx} className="pro-pan-row-item">
                    <span className="pointer">{pillar.selfSeat}</span>
                  </div>
                );
              case '空亡':
                return (
                  <div key={colIdx} className="pro-pan-row-item">
                    {pillar.empty}
                  </div>
                );
              case '纳音':
                return (
                  <div key={colIdx} className="pro-pan-row-item">
                    <span className="pointer">{pillar.naYin}</span>
                  </div>
                );
              default:
                return <div key={colIdx} className="pro-pan-row-item">-</div>;
            }
          })}
        </div>
      ))}
    </>
  );
}
