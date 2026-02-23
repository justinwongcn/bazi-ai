import { ChildLimit } from 'tyme4ts';

interface ProQiYunInfoProps {
  childLimit: ChildLimit;
  currentAge: number;
}

export function ProQiYunInfo({ childLimit, currentAge }: ProQiYunInfoProps) {
  return (
    <div className="pro-pan-qiyun">
      <div className="pro-pan-qiyun-left">
        <div>
          <span>起运：</span>
          出生后{childLimit.getYearCount()}年{childLimit.getMonthCount()}月{childLimit.getDayCount()}
          天{childLimit.getHourCount()}时{childLimit.getMinuteCount()}分起运
        </div>
        <div>
          <span>交运：</span>
          {childLimit.getEndTime().getYear()}年{childLimit.getEndTime().getMonth()}月
          {childLimit.getEndTime().getDay()}日交大运
        </div>
      </div>
      <div className="pro-pan-qiyun-middle" />
      <div className="pro-pan-qiyun-right">
        <div className="right">
          <span className="age">{currentAge}岁</span>
          <span className="rysl" />
        </div>
        <div className="pro-pan-qiyun-icon" />
      </div>
    </div>
  );
}
