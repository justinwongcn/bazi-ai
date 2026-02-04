import { useMemo } from 'react';

// 五行颜色映射
const getElementColor = (char: string) => {
  // 定义特定颜色
  const colors: Record<string, string> = {
    // 木 (Bright Green)
    '甲': 'text-[#07e930]', '乙': 'text-[#07e930]',
    '寅': 'text-[#07e930]', '卯': 'text-[#07e930]',
    
    // 火 (Deep Red)
    '丙': 'text-[#d30505]', '丁': 'text-[#d30505]',
    '巳': 'text-[#d30505]', '午': 'text-[#d30505]',
    
    // 土 (Brownish Yellow)
    '戊': 'text-[#8b6d03]', '己': 'text-[#8b6d03]',
    '辰': 'text-[#8b6d03]', '戌': 'text-[#8b6d03]', '丑': 'text-[#8b6d03]', '未': 'text-[#8b6d03]',
    
    // 金 (Orange/Gold)
    '庚': 'text-[#ef9104]', '辛': 'text-[#ef9104]',
    '申': 'text-[#ef9104]', '酉': 'text-[#ef9104]',
    
    // 水 (Blue)
    '壬': 'text-[#2e83f6]', '癸': 'text-[#2e83f6]',
    '亥': 'text-[#2e83f6]', '子': 'text-[#2e83f6]',
  };
  
  return colors[char] || 'text-gray-800';
};

// 完整数据结构接口
interface BaziData {
  baseInfo: {
    name: string;
    sex: string;
    solarTime: string;
    lunarTime: string;
    location: string;
  };
  pillars: {
    title: string;
    mainStar: string; // 主星
    tg: string;      // 天干
    dz: string;      // 地支
    hiddenStems: string[]; // 藏干
    subStars: string[];    // 副星
    starLuck: string;      // 星运
    selfSitting: string;   // 自坐
    void: string;          // 空亡
    naYin: string;         // 纳音
    shenSha: string[];     // 神煞
  }[];
}

// 模拟从 URL 参数解析的数据（完全匹配 Snapshot）
const useParsedData = (): BaziData => {
  return useMemo(() => ({
    baseInfo: {
      name: "案例1",
      sex: "乾造",
      solarTime: "阳历：1990年01月01日 00:00",
      lunarTime: "阴历：1989年腊月初五 子时",
      location: "未知地 北京时间",
    },
    pillars: [
      {
        title: "年柱",
        mainStar: "伤官",
        tg: "己",
        dz: "巳",
        hiddenStems: ["丙火", "庚金", "戊土"],
        subStars: ["比肩", "偏财", "食神"],
        starLuck: "临官",
        selfSitting: "帝旺",
        void: "戌亥",
        naYin: "大林木",
        shenSha: ["天厨贵人", "德秀贵人", "天德贵人", "禄神", "亡神"]
      },
      {
        title: "月柱",
        mainStar: "比肩",
        tg: "丙",
        dz: "子",
        hiddenStems: ["癸水"],
        subStars: ["正官"],
        starLuck: "胎",
        selfSitting: "胎",
        void: "申酉",
        naYin: "涧下水",
        shenSha: ["天乙贵人", "福星贵人", "德秀贵人", "飞刃"]
      },
      {
        title: "日柱",
        mainStar: "元男", // Snapshot says 元男
        tg: "丙",
        dz: "寅",
        hiddenStems: ["甲木", "丙火", "戊土"],
        subStars: ["偏印", "比肩", "食神"],
        starLuck: "长生",
        selfSitting: "长生",
        void: "戌亥",
        naYin: "炉中火",
        shenSha: ["国印贵人", "福星贵人", "德秀贵人", "红艳煞", "劫煞", "披麻", "词馆"]
      },
      {
        title: "时柱",
        mainStar: "食神",
        tg: "戊",
        dz: "子",
        hiddenStems: ["癸水"],
        subStars: ["正官"],
        starLuck: "胎",
        selfSitting: "胎",
        void: "午未",
        naYin: "霹雳火",
        shenSha: ["天乙贵人", "福星贵人", "德秀贵人", "飞刃"]
      }
    ]
  }), []);
};

function ResultPage() {
  const data = useParsedData();

  return (
    <div className="min-h-screen bg-white flex justify-center p-4 text-gray-900">
      <div className="w-full max-w-4xl bg-white overflow-hidden">
        {/* 顶部标题栏 */}
        <div className="bg-[#b2955d] text-white p-3 text-center relative">
           <button 
             className="absolute left-4 top-1/2 transform -translate-y-1/2 text-sm"
             onClick={() => window.history.back()}
           >
             &lt; 返回
           </button>
          <h1 className="text-lg font-bold">八字排盘结果</h1>
          <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm">
             分享
           </button>
        </div>

        {/* 基本信息区 - 重新设计布局 */}
        <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between">
           <div className="flex items-center gap-4">
              {/* 姓名大字 */}
              <div className="text-[30px] font-bold text-[#b2955d] leading-[34.5px]">
                {data.baseInfo.name}
              </div>
              
              {/* 性别标签 */}
              <div className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                {data.baseInfo.sex}
              </div>
           </div>
           
           {/* 右侧信息堆叠 */}
           <div className="flex flex-col items-end text-sm text-[#101010] leading-[18.4px] gap-1">
              <div>{data.baseInfo.lunarTime}</div>
              <div>{data.baseInfo.solarTime}</div>
              <div className="text-gray-500 text-xs">{data.baseInfo.location}</div>
           </div>
        </div>

        {/* 核心排盘表格 */}
        <div className="p-2 overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse">
             {/* 列宽控制 */}
            <colgroup>
               <col className="w-20 bg-white" />
               <col className="w-1/4" />
               <col className="w-1/4" />
               <col className="w-1/4" />
               <col className="w-1/4" />
            </colgroup>
            
            <tbody>
              {/* 年月日时 标题行 */}
              <tr>
                 <td className="p-2 text-center font-bold"></td>
                 {data.pillars.map((p, i) => (
                    <td key={i} className="p-2 text-center text-[#9e9e9e] text-[15px] leading-[17.25px]">
                       {p.title}
                    </td>
                 ))}
              </tr>

              {/* 主星 */}
              <tr>
                 <td className="py-2 text-center text-[#9e9e9e] text-[15px] leading-[17.25px] whitespace-nowrap">主星</td>
                 {data.pillars.map((p, i) => (
                    <td key={i} className="py-1 text-center text-[15px] text-black leading-[17.25px]">
                       {p.mainStar}
                    </td>
                 ))}
              </tr>

              {/* 天干 */}
              <tr>
                 <td className="py-2 text-center text-[#9e9e9e] text-[15px] leading-[17.25px] whitespace-nowrap">天干</td>
                 {data.pillars.map((p, i) => (
                    <td key={i} className={`py-2 text-center text-[28px] leading-[32px] font-bold ${getElementColor(p.tg)}`}>
                       {p.tg}
                    </td>
                 ))}
              </tr>

              {/* 地支 */}
              <tr>
                 <td className="py-2 text-center text-[#9e9e9e] text-[15px] leading-[17.25px] whitespace-nowrap">地支</td>
                 {data.pillars.map((p, i) => (
                    <td key={i} className={`py-2 text-center text-[28px] leading-[32px] font-bold ${getElementColor(p.dz)}`}>
                       {p.dz}
                    </td>
                 ))}
              </tr>

              {/* 藏干 */}
              <tr>
                 <td className="py-2 text-center text-[#9e9e9e] text-[15px] leading-[17.25px] align-top pt-3 whitespace-nowrap">藏干</td>
                 {data.pillars.map((p, i) => (
                    <td key={i} className="py-2 text-center align-top">
                       <div className="flex flex-col items-center gap-1">
                          {p.hiddenStems.map((hs, idx) => (
                             <span key={idx} className={`text-xs ${getElementColor(hs[0])}`}>
                                {hs}
                             </span>
                          ))}
                       </div>
                    </td>
                 ))}
              </tr>

              {/* 副星 */}
              <tr>
                 <td className="py-2 text-center text-[#9e9e9e] text-[15px] leading-[17.25px] align-top pt-3 whitespace-nowrap">副星</td>
                 {data.pillars.map((p, i) => (
                    <td key={i} className="py-2 text-center align-top">
                       <div className="flex flex-col items-center gap-1 text-black">
                          {p.subStars.map((ss, idx) => (
                             <span key={idx} className="text-[15px] leading-[17.25px] origin-center">
                                {ss}
                             </span>
                          ))}
                       </div>
                    </td>
                 ))}
              </tr>

               {/* 间距行 */}
               <tr><td colSpan={5} className="h-4"></td></tr>

              {/* 星运 */}
              <tr className="bg-gray-50/50">
                 <td className="py-2 text-center text-[#9e9e9e] text-[15px] leading-[17.25px] whitespace-nowrap">星运</td>
                 {data.pillars.map((p, i) => (
                    <td key={i} className="py-2 text-center text-[15px] text-black leading-[17.25px]">
                       {p.starLuck}
                    </td>
                 ))}
              </tr>

              {/* 自坐 */}
              <tr>
                 <td className="py-2 text-center text-[#9e9e9e] text-[15px] leading-[17.25px] whitespace-nowrap">自坐</td>
                 {data.pillars.map((p, i) => (
                    <td key={i} className="py-2 text-center text-[15px] text-black leading-[17.25px]">
                       {p.selfSitting}
                    </td>
                 ))}
              </tr>

              {/* 空亡 */}
              <tr className="bg-gray-50/50">
                 <td className="py-2 text-center text-[#9e9e9e] text-[15px] leading-[17.25px] whitespace-nowrap">空亡</td>
                 {data.pillars.map((p, i) => (
                    <td key={i} className="py-2 text-center text-[15px] text-black leading-[17.25px]">
                       {p.void}
                    </td>
                 ))}
              </tr>

              {/* 纳音 */}
              <tr>
                 <td className="py-2 text-center text-[#9e9e9e] text-[15px] leading-[17.25px] whitespace-nowrap">纳音</td>
                 {data.pillars.map((p, i) => (
                    <td key={i} className="py-2 text-center">
                       <span className="inline-block px-2 py-0.5 border border-gray-200 rounded text-[15px] text-black leading-[17.25px] bg-white">
                          {p.naYin}
                       </span>
                    </td>
                 ))}
              </tr>
              
              {/* 神煞 */}
              <tr>
                 <td className="py-2 text-center text-[#9e9e9e] text-[15px] leading-[17.25px] align-top pt-4 whitespace-nowrap">神煞</td>
                 {data.pillars.map((p, i) => (
                    <td key={i} className="py-2 text-center align-top pt-4">
                       <div className="flex flex-col gap-1 items-center">
                          {p.shenSha.map((ss, idx) => (
                             <span key={idx} className="text-[15px] text-[#b2955d] leading-[17.25px]">
                                {ss}
                             </span>
                          ))}
                       </div>
                    </td>
                 ))}
              </tr>

            </tbody>
          </table>
        </div>

        {/* 底部操作区（模拟） */}
        <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-around mt-4">
          <button className="flex-1 mr-2 py-2.5 bg-[#b2955d] text-white rounded-md text-sm font-medium hover:bg-[#a08553] transition shadow-sm">
             保存案例
          </button>
          <button 
             className="flex-1 ml-2 py-2.5 border border-[#b2955d] bg-white text-[#b2955d] rounded-md text-sm font-medium hover:bg-[#f9f5ed] transition shadow-sm"
             onClick={() => window.history.back()}
           >
             重新排盘
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultPage;
