import type { TableColumn } from '../../hooks';

const DV_ATTR = { 'data-v-07b66fb4': '' } as const;

interface ProTableHeaderProps {
  columns: TableColumn[];
}

export function ProTableHeader({ columns }: ProTableHeaderProps) {
  return (
    <div className="pro-pan-row paipanTitleColor" {...DV_ATTR}>
      <div className="pro-pan-row-item paipanTitleColor" {...DV_ATTR}>日期</div>
      {columns.map((col) => (
        <div key={col.key} className="pro-pan-row-item shadowBoder" {...DV_ATTR}>
          {col.label}
        </div>
      ))}
    </div>
  );
}
