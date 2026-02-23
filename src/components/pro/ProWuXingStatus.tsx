interface ProWuXingStatusProps {
  status: string[];
}

export function ProWuXingStatus({ status }: ProWuXingStatusProps) {
  return (
    <div className="pro-pan-wuxing">
      {status.map((t) => (
        <div key={t} className="pro-pan-wuxing-item">
          {t}
        </div>
      ))}
    </div>
  );
}
