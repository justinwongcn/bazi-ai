---
name: deepwiki
description: DeepWiki MCP 客户端工具，用于查询 GitHub 仓库的文档和信息，包含获取文档结构、获取文档内容和向仓库提问三个核心功能。
license: MIT
---

# DeepWiki Skill

通过 DeepWiki MCP 服务器查询 GitHub 仓库的文档和信息。

## 功能

| 命令 | 说明 |
|------|------|
| `list-tools` | 列出 DeepWiki MCP 服务器所有可用工具 |
| `structure` | 获取 GitHub 仓库的文档结构（主题列表） |
| `contents` | 获取 GitHub 仓库的完整文档内容 |
| `ask` | 向指定仓库提问，获取 AI 回答 |

## 前置准备

### 1. 配置默认仓库（可选）

在 `.claude/skills/deepwiki/.env` 中设置默认仓库（根据你所使用的平台，将 `.claude` 替换为对应的配置目录）：

```bash
DEEPWIKI_DEFAULT_REPO=owner/repo
```

配置后，所有命令可省略 `--repo` 参数。

### 2. 确定当前平台的命令

| 平台 | 命令 |
|------|------|
| macOS | `scripts/deepwiki-macos` |
| Linux | `scripts/deepwiki-linux` |
| Windows | `scripts/deepwiki-windows.exe` |

以下示例使用 macOS 命令，其他平台请替换为对应命令。

## 使用示例

### 列出可用工具

```bash
scripts/deepwiki-macos list-tools
```

**输出示例：**

```
=== DeepWiki 可用工具 ===

工具: read_wiki_structure
描述: Get a list of documentation topics for a GitHub repository

工具: read_wiki_contents
描述: View documentation about a GitHub repository

工具: ask_question
描述: Ask any question about a GitHub repository
```

### 获取文档结构

```bash
# 使用默认仓库
scripts/deepwiki-macos structure

# 或指定仓库
scripts/deepwiki-macos structure --repo facebook/react
```

**输出示例：**

```
=== GitHub 仓库文档结构 ===

主题: Getting Started
描述: 如何开始使用 React

主题: Installation
描述: 安装 React

主题: Hooks
描述: React Hooks 参考
```

### 获取文档内容

```bash
# 使用默认仓库
scripts/deepwiki-macos contents

# 或指定仓库
scripts/deepwiki-macos contents --repo facebook/react
```

### 向仓库提问

```bash
# 使用默认仓库
scripts/deepwiki-macos ask --question "What is the main purpose of this project?"

# 或指定仓库
scripts/deepwiki-macos ask --repo facebook/react --question "How to use useEffect?"
```

## 参数说明

| 参数 | 命令 | 必填 | 说明 |
|------|------|------|------|
| `--repo` | structure, contents, ask | 否 | GitHub 仓库（格式：owner/repo），未配置默认仓库时必填 |
| `--question` | ask | 是 | 要提问的问题 |

## 在 Agent 中使用

DeepWiki Skill 已集成到 Agent 工具中，可直接调用：

- `mcp_deepwiki_read_wiki_structure` - 获取文档结构
- `mcp_deepwiki_read_wiki_contents` - 获取文档内容
- `mcp_deepwiki_ask_question` - 向仓库提问

## 常见问题

**Q: 命令找不到？**  
A: 请确保在 `.claude/skills/deepwiki/` 目录下执行命令（根据你所使用的平台，将 `.claude` 替换为对应的配置目录），或使用相对路径。

**Q: 如何切换仓库？**  
A: 使用 `--repo` 参数临时指定，或修改 `.env` 文件中的 `DEEPWIKI_DEFAULT_REPO`。

**Q: 支持哪些 GitHub 仓库？**  
A: 支持 DeepWiki 已索引的公开仓库，如 `modelcontextprotocol/rust-sdk`、`facebook/react` 等。
