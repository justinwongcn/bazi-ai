import { ChildLimit } from 'tyme4ts';

const DV_ATTR = { 'data-v-07b66fb4': '' } as const;

interface ProQiYunInfoProps {
  childLimit: ChildLimit;
  currentAge: number;
}

export function ProQiYunInfo({ childLimit, currentAge }: ProQiYunInfoProps) {
  return (
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
}
