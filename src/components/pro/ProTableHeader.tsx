import type { TableColumn } from '../../hooks';

interface ProTableHeaderProps {
  columns: TableColumn[];
}

export function ProTableHeader({ columns }: ProTableHeaderProps) {
  return (
    <div className="pro-pan-row paipanTitleColor">
      <div className="pro-pan-row-item paipanTitleColor">日期</div>
      {columns.map((col) => (
        <div key={col.key} className="pro-pan-row-item shadowBoder">
          {col.label}
        </div>
      ))}
    </div>
  );
}
