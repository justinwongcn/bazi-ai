# 项目知识库

**生成时间:** 2026-02-18
**Commit:** 887af03
**Branch:** main

## 概览

八字排盘 SPA 应用。React 19 + TypeScript + Vite + Tailwind CSS 4 + React Router DOM。核心功能: 生辰八字计算、真太阳时、天干地支排盘、五行分析。纯前端，无后端。

## 命令

```bash
npm run dev              # 开发服务器
npm run build            # 类型检查 + 构建 (tsc -b && vite build)
npm run lint             # ESLint 检查
npm run test             # Vitest 运行所有测试
npm run test:watch       # 测试监听模式

# 运行单个测试文件
npx vitest run src/utils/baziTimeSearcher.test.ts

# 运行匹配模式的测试
npx vitest run -t "validatePillar"
```

## 结构

```
bazi-ai/
├── src/
│   ├── hooks/           # 自定义 React hooks (12个)
│   ├── utils/           # 核心算法: 八字计算、真太阳时、干支 (16个)
│   ├── components/
│   │   ├── input/       # 输入组件: 日期/时间/地点选择器
│   │   ├── pro/         # Pro 版功能组件
│   │   └── ui/          # 通用 UI 组件
│   ├── services/        # 业务服务层
│   ├── types/           # TypeScript 类型定义
│   ├── constants/       # 常量: 干支、五行规则
│   └── data/            # 静态数据
├── main.tsx             # 入口
└── App.tsx              # 路由配置
```

## 代码风格

### 导入顺序

```typescript
// 1. 外部依赖
import { useState, useMemo, useCallback } from 'react';
import { SolarTime, EightChar } from 'tyme4ts';

// 2. 内部模块 (相对路径)
import { SolarTimeUtil } from './solarTimeUtil';
import type { PillarData } from '../types/bazi';
```

### 导出约定

```typescript
// index.ts 统一导出模式
export * from './format';                          // 重导出所有
export { getElementColor } from './elementHelper'; // 具名导出
export type { BaseParams } from './useBaseParams'; // 类型单独导出
export { default as Header } from './Header';      // 默认导出重命名
```

### 类型定义

- **接口**: PascalCase (如 `BaziResult`, `PillarData`)
- **类型别名**: PascalCase (如 `ElementName`, `StemBranch`)
- **类型导入**: 必须使用 `import type { X }` (启用 `verbatimModuleSyntax`)
- **类型导出**: 必须使用 `export type { X }`

### 命名约定

| 类型 | 约定 | 示例 |
|------|------|------|
| 组件 | PascalCase | `PillarDisplay`, `TimePickerModal` |
| Hook | use 前缀 | `useDateInput`, `useBaziSearch` |
| 工具函数 | camelCase | `getElementColor`, `formatDisplayDate` |
| 常量 | UPPER_SNAKE_CASE | `HOUR_BRANCH_TO_EVEN_HOUR` |
| 类 | PascalCase | `BaziCalculator`, `SolarTimeUtil` |
| 接口 | PascalCase | `BaziOptions`, `FormData` |

### 组件风格

```typescript
// 函数组件 + React.FC 类型
interface PillarColumnProps {
  pillar: PillarData;
  dayLabel: string;
}

export const PillarColumn: React.FC<PillarColumnProps> = ({ pillar, dayLabel }) => {
  return (
    <div className="pro-pan-row">
      {/* Tailwind CSS 类名 */}
    </div>
  );
};
```

### Hook 风格

```typescript
// 返回对象 (复杂状态) 或数组 (简单状态)
export const useDateInput = (options?: UseDateInputOptions) => {
  // 内部状态
  const [selectedYear, setSelectedYear] = useState(() => initialDate.getFullYear());

  // 返回对象包含状态和操作方法
  return {
    selectedYear,
    setSelectedYear,
    handleYearSelect,
    // ...
  };
};
```

### 测试风格

```typescript
// 测试文件与源文件同目录，.test.ts 后缀
import { describe, it, expect } from 'vitest';
import { validatePillar } from './baziTimeSearcher';

describe('baziTimeSearcher', () => {
  describe('validatePillar', () => {
    it('should return true for valid pillars', () => {
      expect(validatePillar('甲子')).toBe(true);
    });

    it('should return false for invalid pillars', () => {
      expect(validatePillar('')).toBe(false);
    });
  });
});
```

### 错误处理

```typescript
// 非法参数抛 Error
if (!validatePillar(yearPillar)) {
  throw new Error('年柱格式不正确');
}
```

## 查找指南

| 任务 | 位置 | 说明 |
|------|------|------|
| 八字计算逻辑 | `src/utils/baziCalculator.ts` | 核心排盘算法 |
| 真太阳时 | `src/utils/trueSolarTime.ts` | 经纬度→真太阳时转换 |
| 干支计算 | `src/utils/ganzhiCalculator.ts` | 天干地支推算 |
| 五行颜色 | `src/utils/elementHelper.ts` | 五行→颜色映射 |
| 日期输入 | `src/hooks/useDateInput.ts` | 日期选择状态管理 |
| 地点选择 | `src/hooks/useAddressPicker.ts` | 城市→经纬度 |
| Pro 页面数据 | `src/hooks/useProPageData.ts` | Pro 版表格数据 |
| 类型定义 | `src/types/bazi.ts` | 核心业务类型 |

## TypeScript 配置

- **严格模式**: 启用 (`strict: true`)
- **未使用变量检查**: 启用 (`noUnusedLocals`, `noUnusedParameters`)
- **模块语法**: `verbatimModuleSyntax: true` (类型导入必须显式声明)
- **目标**: ES2022
- **模块解析**: bundler

## 注意事项

- **无后端**: 纯前端 SPA，所有计算在客户端
- **.trae 目录**: 工具脚本，非业务代码
- **测试文件**: 与源文件同目录，`.test.ts` 后缀
- **时区处理**: 使用 `tyme4ts` 库 + 自定义真太阳时计算
- **天文算法**: `trueSolarTime.ts` 包含天文算法，修改需谨慎
- **经纬度范围**: 经度 -180~180，纬度 -90~90

## 禁止事项

- 禁止使用 `as any` 类型断言
- 禁止使用 `@ts-ignore` 或 `@ts-expect-error`
- 禁止空 catch 块 `catch(e) {}`
- 禁止删除测试来"通过"测试

## Skills 使用规范

| 场景 | Skill |
|------|-------|
| 新功能/需求不明确 | `brainstorming` |
| 设计已确认 | `writing-plans` |
| 编写代码 | `test-driven-development` |
| 遇到 Bug | `systematic-debugging` |
| 代码审查 | `requesting-code-review` |
| 完成任务 | `finishing-a-development-branch` |
| 浏览器自动化/调试 | `chrome-devtools` |

> **1% 规则**: 只要有 1% 的可能性某个 skill 适用，就必须调用它。

## 开发工作流

- 修改代码后运行: `bun run dev` 或 `npm run dev`
- 提交前执行: `bun run lint && bun run build`

## 提交检查清单

- [ ] 通过 `npm run lint`
- [ ] 构建成功 `npm run build`
- [ ] 已使用相关 skills
- [ ] 完成代码审查 (Code Review)

## 信息查询

- GitHub 文档: 使用 deepwiki 工具
- 联网搜索: 使用 WebSearch 工具
