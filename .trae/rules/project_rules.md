# 项目规则

## 项目概述
- **技术栈**: React 19 + TypeScript 5.9 + Vite 7 + Tailwind CSS 4
- **包管理器**: Bun
- **核心库**: tyme4ts (万年历计算)

## 开发工作流
- 修改代码后运行: `bun run dev`
- 提交前执行: `bun run lint && bun run build`

## Skills 使用规范
| 场景 | Skill |
|------|-------|
| 新功能/需求不明确 | `brainstorming` |
| 设计已确认 | `writing-plans` |
| 编写代码 | `test-driven-development` |
| 遇到 Bug | `systematic-debugging` |
| 代码审查 | `requesting-code-review` |
| 完成任务 | `finishing-a-development-branch` |

> **1% 规则**: 只要有 1% 的可能性某个 skill 适用，就必须调用它。

## 技术规范
- 使用 `tyme4ts` 实现农历、节气、干支计算 (https://github.com/6tail/tyme4ts)
- 函数组件 + Hooks，严格类型，避免 `any`
- 类型定义放 `src/types/`，组件放 `src/components/`
- 使用 Tailwind CSS 4 工具类

## 信息查询
- GitHub 文档: 使用 deepwiki 工具
- 联网搜索: 使用 WebSearch 工具

## 提交检查清单
- [ ] 通过 `bun run lint`
- [ ] 构建成功 `bun run build`
- [ ] 已使用相关 skills
