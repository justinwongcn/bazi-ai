# 代码重构规格说明书

## 背景

当前项目存在以下问题：
- **InputPage.tsx** 936行 - 包含过多状态和逻辑，违反单一职责原则
- **ProPage.tsx** 632行 - 组件过大，包含复杂的面板切换逻辑
- **solarTimeUtil.ts** 503行 - 太阳时计算工具类职责过多
- **baziCalculator.ts** 275行 - 八字计算逻辑可以进一步模块化
- **ganzhiCalculator.ts** 212行 - 干支计算逻辑可提取更多可复用函数

## 重构目标

通过以下方式降低模块间耦合度并提升代码可维护性：
1. 识别并拆分超过200行的大型文件（组件）或300行（工具类）
2. 提取公共逻辑到独立的hooks或utils
3. 抽象接口类型，统一组件间数据传递格式
4. 遵循单一职责原则和开闭原则

## 影响范围

### 需要重构的主要文件
| 文件 | 当前行数 | 重构策略 |
|------|----------|----------|
| InputPage.tsx | 936 | 拆分为多个子组件 + 自定义hooks |
| ProPage.tsx | 632 | 提取面板组件 + 拆分复杂逻辑 |
| solarTimeUtil.ts | 503 | 按功能模块拆分（真太阳时/地方时/时区） |
| baziCalculator.ts | 275 | 提取计算规则到constants |
| cityLocator.ts | 189 | 保持或微调 |

### 涉及模块
- 输入页面组件层 (InputPage → 子组件)
- 专业版页面组件层 (ProPage → 面板组件)
- 工具函数层 (utils → 细分工具)
- 自定义Hooks层 (hooks → 提取复用逻辑)

## 重构要求

### 功能保持
- 所有原有功能必须保持不变
- URL参数解析逻辑必须保持兼容
- 页面路由跳转必须保持一致

### 架构改进

#### 1. InputPage.tsx 重构
将936行的InputPage拆分为：
- `InputPage` - 页面容器，仅负责状态提升和协调
- `DateInputSection` - 日期输入区域组件
- `LocationInputSection` - 地址输入区域组件  
- `PillarInputSection` - 四柱输入区域组件
- `useInputPageLogic` - 提取表单处理、时间选择等业务逻辑

#### 2. ProPage.tsx 重构  
将632行的ProPage拆分为：
- `ProPage` - 页面容器
- `ProPanel` - 专业面板通用组件
- `useProPageData` - 提取数据计算逻辑
- 按功能拆分为多个专用面板组件

#### 3. solarTimeUtil.ts 重构
将503行的工具拆分为：
- `solarTimeUtil.ts` - 保留核心接口
- `trueSolarTime.ts` - 真太阳时计算
- `apparentSolarTime.ts` - 视太阳时计算

#### 4. baziCalculator.ts 重构
提取常量规则到constants目录：
- `baziRules.ts` - 八字起算规则
- `pillarPatterns.ts` - 柱式模式定义

### 验证标准
- 重构后运行 `bun run lint` 无错误
- 重构后运行 `bun run build` 构建成功
- 应用功能正常运行，输入输出结果与重构前一致
