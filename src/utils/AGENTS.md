# Utils 模块

核心算法库。16 个文件，包含八字计算、真太阳时、干支推算等。

## 结构

```
utils/
├── index.ts              # 统一导出
├── trueSolarTime.ts      # 真太阳时计算 (315 行，核心)
├── baziCalculator.ts     # 八字排盘核心
├── ganzhiCalculator.ts   # 天干地支计算
├── elementHelper.ts      # 五行辅助函数
├── hiddenStems.ts        # 藏干计算
├── solarTimeUtil.ts      # 太阳时工具
├── julianDay.ts          # 儒略日计算
├── dateParser.ts         # 日期解析
├── dateHelpers.ts        # 日期辅助
├── pillarStepLogic.ts    # 柱步进逻辑
├── baziTimeSearcher.ts   # 八字时间搜索
├── cityLocator.ts        # 城市定位 (经纬度)
├── defaultParams.ts      # 默认参数
├── format.ts             # 格式化工具
└── *.test.ts             # 测试文件 (同目录)
```

## 查找指南

| 功能 | 文件 | 说明 |
|------|------|------|
| 真太阳时 | `trueSolarTime.ts` | `SolarTimeUtil` 类，经纬度→真太阳时 |
| 八字排盘 | `baziCalculator.ts` | 四柱八字计算入口 |
| 干支计算 | `ganzhiCalculator.ts` | 天干地支推算 |
| 五行颜色 | `elementHelper.ts` | `getElementColor`, `getElementMeta` |
| 藏干 | `hiddenStems.ts` | `getHiddenStems` |
| 儒略日 | `julianDay.ts` | 天文计算基础 |
| 城市定位 | `cityLocator.ts` | 城市→经纬度查询 |

## 核心类

### SolarTimeUtil

```typescript
// 真太阳时计算
const util = SolarTimeUtil.initLocation(longitude, latitude);
const trueTime = util.getTrueSolarTimeFromDate(date);
const meanTime = util.getMeanSolarTime(solarTime);
const eot = util.getEquationOfTime(date); // 均时差 (分钟)
```

## 约定

- **导出**: 在 `index.ts` 中统一导出
- **测试**: 测试文件与源文件同目录，`.test.ts` 后缀
- **纯函数**: 优先纯函数，有状态用类 (如 `SolarTimeUtil`)
- **异常处理**: 非法参数抛 `Error`

## 注意事项

- `trueSolarTime.ts` 包含天文算法，修改需谨慎
- 经度范围: -180 ~ 180，纬度: -90 ~ 90
- 时间精度: 秒级 + 毫秒小数
