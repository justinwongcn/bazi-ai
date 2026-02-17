# Hooks 模块

自定义 React hooks 集中管理。12 个 hooks，统一导出。

## 结构

```
hooks/
├── index.ts              # 统一导出
├── useBaseParams.ts      # URL 参数解析
├── useBirthInfo.ts       # 出生信息
├── useFortuneData.ts     # 大运数据
├── useFlowData.ts        # 流年/流月数据
├── useDateInput.ts       # 日期输入状态 (300+ 行)
├── useAddressPicker.ts   # 地点选择
├── useLocationInput.ts   # 位置输入
├── usePillarInput.ts     # 柱输入
├── usePillarSelector.ts  # 柱选择器
├── useBaziSearch.ts      # 八字搜索
└── useProPageData.ts     # Pro 页面数据聚合
```

## 查找指南

| Hook | 用途 | 返回值 |
|------|------|--------|
| `useBaseParams` | 解析 URL 参数 | `{ birthDate, calendarType, ... }` |
| `useBirthInfo` | 出生信息聚合 | `BirthInfo` 对象 |
| `useFortuneData` | 大运排盘数据 | `FortuneData` 对象 |
| `useFlowData` | 流年/流月 | `{ selection, flowData }` |
| `useDateInput` | 日期选择器状态 | 状态 + 操作方法 |
| `useAddressPicker` | 城市→经纬度 | 地址选择逻辑 |
| `useProPageData` | Pro 页表格 | `ProPageColumns` |

## 约定

- **命名**: `use` 前缀
- **导出**: 在 `index.ts` 中统一导出，类型用 `export type`
- **返回值**: 复杂状态返回对象，简单状态返回数组
- **依赖**: hooks 之间可相互调用 (如 `useFortuneData` 调用 `useBirthInfo`)

## 类型导出

```typescript
export type { BaseParams } from './useBaseParams';
export type { BirthInfo } from './useBirthInfo';
export type { FortuneData } from './useFortuneData';
export type { SelectionState, FlowData } from './useFlowData';
export type { PillarType } from './usePillarSelector';
export type { TableColumn, ProPageColumns, BirthInfoDisplay } from './useProPageData';
```
