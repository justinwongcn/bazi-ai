---
name: using-git-worktrees
description: Use when design is approved and ready to implement. Creates isolated workspace on new branch, runs project setup, verifies clean test baseline. Required before writing any implementation code.
---

# Using Git Worktrees

**THE RULE: You MUST create an isolated workspace before implementing. No exceptions.**

## Why This Exists

Working on main branch leads to:
- Breaking existing code
- Difficult rollbacks
- Polluted git history
- Conflicts with other work

## The Process

### Step 1: Create a New Branch

```bash
# From main/master
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/your-feature-name
```

### Step 2: Verify Clean Baseline

```bash
# Install dependencies
npm install

# Run tests - they should pass
npm test

# If tests fail on main, STOP and fix main first
```

### Step 3: Set Up Development Environment

```bash
# Start dev server if needed
npm run dev

# Verify it runs without errors
```

### Step 4: Begin Implementation

Now you're ready to follow the plan from `writing-plans`.

## Worktree Structure

```
project/
├── main/                    # Main branch (clean)
└── feature-branch/          # Your work branch
    ├── src/
    ├── tests/
    └── docs/plans/
```

## Commands Reference

| Command | Purpose |
|---------|---------|
| `git worktree list` | Show all worktrees |
| `git worktree add ../feature-branch -b feature/name` | Create new worktree |
| `git worktree remove ../feature-branch` | Remove worktree |

## Checklist

Before writing any code:
- [ ] On a feature branch (not main)
- [ ] Branch is up to date with main
- [ ] Dependencies installed
- [ ] Tests pass on clean branch
- [ ] Dev server runs (if applicable)

## Anti-Patterns

❌ Working directly on main/master  
❌ Not running tests before starting  
❌ Creating branch from outdated main  
❌ Mixing multiple features in one branch  

## Remember

**An isolated workspace protects the main codebase and your sanity.**

Always create a branch. Always verify tests pass. Always.
