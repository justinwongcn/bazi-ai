import { useEffect, useRef } from 'react';
import { SixtyCycle, HeavenStem } from 'tyme4ts';

const DV_ATTR = { 'data-v-07b66fb4': '' } as const;

export interface FortuneItemData {
  label: string;
  subLabel?: string;
  pillar: string;
  isSelected: boolean;
  onClick: () => void;
}

interface ProFortuneSectionProps {
  title: string;
  items: FortuneItemData[];
  prependItem?: FortuneItemData;
  dayStem: HeavenStem;
}

function getElementColor(char: string): string {
  if ('甲乙寅卯'.includes(char)) return 'woodColor';
  if ('丙丁巳午'.includes(char)) return 'fireColor';
  if ('戊己辰戌丑未'.includes(char)) return 'soilColor';
  if ('庚辛申酉'.includes(char)) return 'goldColor';
  return 'waterColor';
}

function getTenStarShort(name: string): string {
  const map: Record<string, string> = {
    '比肩': '比', '劫财': '劫', '食神': '食', '伤官': '伤',
    '偏财': '才', '正财': '财', '七杀': '杀', '正官': '官',
    '偏印': '枭', '正印': '印',
  };
  return map[name] || name.slice(0, 1);
}

export function ProFortuneSection({ title, items, prependItem, dayStem }: ProFortuneSectionProps) {
  const itemsContainerRef = useRef<HTMLDivElement>(null);
  const itemRefsMap = useRef<Map<number, HTMLDivElement | null>>(new Map());

  useEffect(() => {
    const selectedIndex = items.findIndex(item => item.isSelected);
    const actualIndex = prependItem ? selectedIndex + 1 : selectedIndex;
    const targetItem = itemRefsMap.current.get(actualIndex);
    const container = itemsContainerRef.current;

    if (targetItem && container) {
      const containerRect = container.getBoundingClientRect();
      const itemRect = targetItem.getBoundingClientRect();

      const scrollLeft = itemRect.left - containerRect.left + container.scrollLeft;
      const itemWidth = itemRect.width;
      const containerWidth = containerRect.width;

      if (scrollLeft < container.scrollLeft || scrollLeft + itemWidth > container.scrollLeft + containerWidth) {
        const targetScroll = scrollLeft - containerWidth / 2 + itemWidth / 2;
        container.scrollTo({ left: Math.max(0, targetScroll), behavior: 'smooth' });
      }
    }
  }, [items, prependItem]);

  const renderItem = (item: FortuneItemData, index: number) => {
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
        ref={(el) => { itemRefsMap.current.set(index, el); }}
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
      <div ref={itemsContainerRef} className="pro-pan-yun-items" {...DV_ATTR}>
        {prependItem && renderItem(prependItem, 0)}
        {items.map((item, idx) => renderItem(item, prependItem ? idx + 1 : idx))}
      </div>
    </div>
  );
}
