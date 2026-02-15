---
name: "superpowers"
description: "Use when starting a new development task, feature implementation, debugging, or code review. Provides complete software development workflow with brainstorming, planning, TDD, and systematic debugging."
---

# Superpowers - Complete Development Workflow

Superpowers 是一个完整的软件开发工作流系统，帮助你在编码前进行充分的设计规划，在编码时遵循最佳实践。

## 核心原则

1. **先设计，后编码** - 任何实现都必须先有明确的设计文档
2. **小步快跑** - 将工作拆分为 2-5 分钟的小任务
3. **测试驱动** - RED-GREEN-REFACTOR 循环
4. **系统调试** - 4 阶段根因分析流程

## 工作流阶段

### 1. 头脑风暴 (Brainstorming)

**触发时机**: 开始任何新功能或任务时

**流程**:
- 通过提问澄清需求
- 探索替代方案
- 分块展示设计以获得验证
- 输出: `docs/plans/YYYY-MM-DD-topic-design.md`

### 2. 使用 Git Worktrees

**触发时机**: 设计获批后

**流程**:
- 在新分支上创建隔离工作区
- 运行项目设置
- 验证测试基线通过

### 3. 编写计划 (Writing Plans)

**触发时机**: 设计获批后

**流程**:
- 将工作拆分为小任务（每个 2-5 分钟）
- 每个任务包含：
  - 确切的文件路径
  - 完整代码
  - 验证步骤
- 输出: `docs/plans/YYYY-MM-DD-feature.md`

### 4. 测试驱动开发 (TDD)

**触发时机**: 实现阶段

**RED-GREEN-REFACTOR 循环**:
1. **RED**: 编写失败的测试
2. **GREEN**: 编写最小代码使测试通过
3. **REFACTOR**: 优化代码，保持测试通过

**重要**: 删除在测试之前编写的任何代码

### 5. 系统调试

**触发时机**: 遇到问题或 Bug 时

**4 阶段流程**:
1. **观察**: 收集症状和错误信息
2. **假设**: 提出可能的根因
3. **验证**: 设计实验验证假设
4. **修复**: 实施修复并验证

### 6. 代码审查

**触发时机**: 任务之间或完成时

**检查清单**:
- 是否符合计划？
- 代码质量是否达标？
- 测试是否充分？

### 7. 完成开发分支

**触发时机**: 所有任务完成

**流程**:
- 验证测试通过
- 选择：合并/PR/保留/丢弃
- 清理 worktree

## 快速参考

| 阶段 | 关键输出 | 强制检查 |
|------|----------|----------|
| 设计 | design.md | 必须有用户确认 |
| 计划 | feature.md | 任务 < 5 分钟 |
| 实现 | 代码 + 测试 | RED-GREEN-REFACTOR |
| 调试 | 根因分析 | 4 阶段流程 |
| 完成 | 合并/PR | 测试通过 |

## 使用规则

**THE RULE**: 如果技能有 1% 的适用可能，就必须调用它。

**常见误区**:
- ❌ "这只是个简单问题" → 简单问题也有复杂最佳实践
- ❌ "我需要先了解更多上下文" → 技能提供上下文，先阅读它
- ❌ "我知道那是什么意思" → 知道概念 ≠ 使用经过验证的技术
- ❌ "让我先探索一下" → 技能防止浪费探索时间

## 项目结构建议

```
project/
├── docs/
│   └── plans/           # 设计文档和计划
├── src/                 # 源代码
├── tests/               # 测试文件
└── .trae/
    └── skills/          # 项目特定技能
```

## 相关技能

- `brainstorming` - 设计阶段
- `writing-plans` - 计划编写
- `test-driven-development` - TDD 实施
- `systematic-debugging` - 系统调试
- `using-git-worktrees` - Git 工作流
- `requesting-code-review` - 代码审查
