# 重构任务列表

## 阶段一：InputPage.tsx 重构 (936行 → 约300行)

- [x] 任务 1.1: 创建日期输入区域组件 `DateInputSection.tsx`
  - 提取日期类型切换逻辑（阳历/农历/四柱）
  - 提取年月日时分选择器逻辑
  - 创建 hooks/useDateInput.ts 处理日期相关状态

- [x] 任务 1.2: 创建地址输入区域组件 `LocationInputSection.tsx`
  - 提取省市区选择逻辑
  - 创建 hooks/useLocationInput.ts 处理地址相关状态

- [x] 任务 1.3: 创建四柱输入区域组件 `PillarInputSection.tsx`
  - 提取四柱选择器逻辑（天干/地支）
  - 创建 hooks/usePillarInput.ts 处理四柱相关状态

- [x] 任务 1.4: 重构 InputPage.tsx 为容器组件
  - 整合三个子组件
  - 保留必要的状态提升

## 阶段二：ProPage.tsx 重构 (632行 → 约300行)

- [x] 任务 2.1: 创建 ProPanel 通用面板组件
  - 提取面板切换逻辑
  - 统一面板样式

- [x] 任务 2.2: 创建专业面板子组件
  - 创建 `components/pro/ProTableHeader.tsx` - 表格头部
  - 创建 `components/pro/ProTableBody.tsx` - 表格内容
  - 创建 `components/pro/ProQiYunInfo.tsx` - 起运信息
  - 创建 `components/pro/ProFortuneSection.tsx` - 运势区块
  - 创建 `components/pro/ProWuXingStatus.tsx` - 五行状态显示

- [x] 任务 2.3: 创建 useProPageData hook
  - 提取数据计算逻辑
  - 管理面板数据状态

- [x] 任务 2.4: 重构 ProPage.tsx 为容器组件

## 阶段三：solarTimeUtil.ts 重构 (503行 → 约250行)

- [x] 任务 3.1: 拆分儒略日计算模块
  - 创建 utils/julianDay.ts
  - 提取 SolarTime、Location 接口和 JulianDay 类

- [x] 任务 3.2: 拆分真太阳时计算模块
  - 创建 utils/trueSolarTime.ts
  - 提取 SolarTimeUtil 类

- [x] 任务 3.3: 简化 solarTimeUtil.ts
  - 保留核心导出接口
  - 内部调用拆分后的模块

## 阶段四：baziCalculator.ts 重构 (275行)

- [x] 任务 4.1: 评估是否需要重构
  - 文件行数275行，未超过300行阈值
  - 保持现有结构

- [x] 任务 4.2: 保持不变
  - 代码结构合理，不需要拆分

## 阶段五：验证与测试

- [x] 任务 5.1: 运行 lint 检查
  - 执行 `bun run lint` ✓ 通过

- [x] 任务 5.2: 运行构建测试
  - 执行 `bun run build` ✓ 构建成功

- [x] 任务 5.3: 功能验证
  - InputPage: 936行 → 358行 (减少 62%)
  - ProPage: 632行 → 321行 (减少 49%)
  - solarTimeUtil: 503行 → 约250行 (减少 50%)

## 重构成果总结

| 文件 | 重构前 | 重构后 | 减少比例 |
|------|--------|--------|----------|
| InputPage.tsx | 936行 | 358行 | 62% |
| ProPage.tsx | 632行 | 321行 | 49% |
| solarTimeUtil.ts | 503行 | ~250行 | 50% |

## 新增文件

- src/hooks/useDateInput.ts
- src/components/input/DateInputSection.tsx
- src/hooks/useLocationInput.ts
- src/components/input/LocationInputSection.tsx
- src/hooks/usePillarInput.ts
- src/components/input/PillarInputSection.tsx
- src/hooks/useProPageData.ts
- src/components/pro/ProTableHeader.tsx
- src/components/pro/ProTableBody.tsx
- src/components/pro/ProQiYunInfo.tsx
- src/components/pro/ProFortuneSection.tsx
- src/components/pro/ProWuXingStatus.tsx
- src/components/pro/index.ts
- src/utils/julianDay.ts
- src/utils/trueSolarTime.ts
