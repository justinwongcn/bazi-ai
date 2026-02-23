# 前端代码规范化重构 Spec

## Why

当前项目存在严重的代码重复、架构混乱、样式不一致等问题，导致可维护性差、扩展困难，无法支持后续新功能的高效开发。需要进行系统性重构以建立清晰、可维护、可扩展的前端架构。

## What Changes

* 统一五行元素相关的工具函数，消除重复代码

* 拆分大型页面组件，建立清晰的组件层次结构

* 统一样式方案，迁移至 Tailwind CSS 工具类

* 完善类型定义系统，提高类型复用性

* 优化文件组织结构，建立清晰的模块边界

* 建立单元测试体系，覆盖核心业务逻辑

## Impact

* Affected specs: 所有页面组件、工具函数、类型定义

* Affected code:

  * `src/DetailPage.tsx`

  * `src/ResultPage.tsx`

  * `src/ProPage.tsx`

  * `src/InputPage.tsx`

  * `src/utils/` 目录

  * `src/services/` 目录

  * `src/types/` 目录

  * `src/styles/` 目录

## ADDED Requirements

### Requirement: 统一五行元素工具函数

系统 SHALL 提供统一的五行元素工具函数模块，消除代码重复。

#### Scenario: 五行颜色获取统一

* **WHEN** 任何组件需要获取天干地支的五行颜色

* **THEN** 应从 `src/utils/elementHelper.ts` 统一导入 `getElementColor` 函数

#### Scenario: 五行元数据获取统一

* **WHEN** 任何组件需要获取五行元数据（名称、颜色、图标）

* **THEN** 应从 `src/services/elementService.ts` 统一导入相关函数

### Requirement: 组件层次结构优化

系统 SHALL 建立清晰的组件层次结构，页面组件专注于布局和协调。

#### Scenario: 页面组件拆分

* **WHEN** 页面组件超过 200 行代码

* **THEN** 应将渲染逻辑拆分为独立的子组件

#### Scenario: 共享组件提取

* **WHEN** 多个页面使用相同的 UI 模式

* **THEN** 应提取为 `src/components/shared/` 下的共享组件

### Requirement: 样式方案统一

系统 SHALL 统一使用 Tailwind CSS 工具类进行样式定义。

#### Scenario: 内联样式迁移

* **WHEN** 组件使用内联 style 属性定义样式

* **THEN** 应迁移为 Tailwind CSS 类名或 CSS 模块

#### Scenario: 样式常量管理

* **WHEN** 需要定义全局样式常量

* **THEN** 应在 `tailwind.config.js` 中定义或使用 CSS 变量

### Requirement: 类型定义完善

系统 SHALL 建立完善的类型定义体系，提高代码可维护性。

#### Scenario: 共享类型定义

* **WHEN** 多个组件使用相同的数据结构

* **THEN** 应在 `src/types/` 目录下定义共享类型

#### Scenario: 组件 Props 类型

* **WHEN** 定义组件 Props

* **THEN** 应使用明确的接口定义，避免使用 any 类型

### Requirement: 单元测试覆盖

系统 SHALL 建立单元测试体系，覆盖核心业务逻辑。

#### Scenario: 工具函数测试

* **WHEN** 添加新的工具函数

* **THEN** 应编写对应的单元测试

#### Scenario: 测试覆盖率

* **WHEN** 执行测试

* **THEN** 核心业务逻辑测试覆盖率应达到 80% 以上

## MODIFIED Requirements

### Requirement: 文件组织结构优化

现有文件组织结构 SHALL 按照以下规范进行调整：

```
src/
├── components/
│   ├── shared/          # 共享组件
│   │   ├── Avatar.tsx
│   │   ├── HeaderCard.tsx
│   │   └── PillarTable.tsx
│   ├── input/           # 输入相关组件
│   ├── pro/             # 专业排盘组件
│   └── ui/              # 基础 UI 组件
├── hooks/               # 自定义 Hooks
├── services/            # 业务服务层
├── utils/               # 工具函数
├── types/               # 类型定义
├── constants/           # 常量定义
├── styles/              # 全局样式
└── pages/               # 页面组件（可选迁移）
```

## REMOVED Requirements

### Requirement: 内联样式定义

**Reason**: 内联样式难以维护、复用困难，应迁移至 Tailwind CSS
**Migration**: 将所有内联样式迁移为 Tailwind CSS 类名

### Requirement: 重复的工具函数

**Reason**: `getElementColor`、`getElementMeta` 等函数在多个文件中重复定义
**Migration**: 统一使用 `src/utils/elementHelper.ts` 和 `src/services/elementService.ts` 中的函数

## 重构优先级

### P0 - 紧急（代码重复消除）

1. 统一五行元素工具函数
2. 提取共享类型定义
3. 消除重复的 parseDateTime 函数

### P1 - 高优先级（架构优化）

1. 拆分大型页面组件
2. 提取共享 UI 组件
3. 统一样式方案

### P2 - 中优先级（质量提升）

1. 完善单元测试
2. 添加代码注释
3. 优化文件组织

## 风险评估

| 风险       | 影响 | 缓解措施          |
| -------- | -- | ------------- |
| 重构引入功能缺陷 | 高  | 保持现有功能不变，增量重构 |
| 样式迁移不一致  | 中  | 视觉回归测试        |
| 测试覆盖不足   | 中  | 优先测试核心业务逻辑    |

