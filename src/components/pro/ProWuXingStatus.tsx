const DV_ATTR = { 'data-v-07b66fb4': '' } as const;

interface ProWuXingStatusProps {
  status: string[];
}

export function ProWuXingStatus({ status }: ProWuXingStatusProps) {
  return (
    <div className="pro-pan-wuxing" {...DV_ATTR}>
      {status.map((t) => (
        <div key={t} className="pro-pan-wuxing-item" {...DV_ATTR}>
          {t}
        </div>
      ))}
    </div>
  );
}
