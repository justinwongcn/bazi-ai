---
name: subagent-driven-development
description: Use when executing a plan with many tasks. Dispatches fresh subagent per task with two-stage review - spec compliance then code quality. Enables autonomous work for extended periods.
---

# Subagent-Driven Development

**THE RULE: Use subagents for parallel task execution and review.**

## Why This Exists

Doing everything yourself leads to:
- Context switching overhead
- Missing details in large tasks
- No independent verification
- Slower progress

## The Process

### Step 1: Prepare Tasks

From your plan (`docs/plans/YYYY-MM-DD-feature.md`), extract tasks.

### Step 2: Dispatch Subagents

For each task, create a fresh subagent with:
- The task specification
- Relevant context
- Clear success criteria

### Step 3: Two-Stage Review

Every subagent output gets reviewed:

**Stage 1: Spec Compliance**
- Does it match the task specification?
- Are all requirements met?
- Are there any omissions?

**Stage 2: Code Quality**
- Does it follow project conventions?
- Is it well-tested?
- Is it maintainable?

### Step 4: Iterate

If review finds issues:
1. Send feedback to subagent
2. Subagent fixes issues
3. Re-review
4. Repeat until approved

## Subagent Prompt Template

```
You are implementing a specific task from a larger plan.

TASK:
[Exact task from plan]

CONTEXT:
- Project: [name]
- Relevant files: [paths]
- Design doc: [path to design.md]

SUCCESS CRITERIA:
- [ ] Criterion 1
- [ ] Criterion 2

CONSTRAINTS:
- Follow existing code patterns
- Write tests first (TDD)
- Match the plan exactly

Return:
1. Summary of changes
2. Files modified/created
3. Verification that criteria are met
```

## Review Checklist

### Spec Compliance
- [ ] Implements exactly what was specified
- [ ] No scope creep
- [ ] No missing requirements
- [ ] Matches design document

### Code Quality
- [ ] Follows project conventions
- [ ] Tests included
- [ ] No obvious bugs
- [ ] Clean, readable code

## When to Use

Use subagents when:
- Plan has 5+ tasks
- Tasks are independent
- You need parallel progress
- You want independent review

## Anti-Patterns

❌ Giving subagent vague instructions  
❌ Not reviewing subagent output  
❌ Accepting code that doesn't match spec  
❌ Skipping quality review  
❌ Having subagents work on dependent tasks simultaneously  

## Remember

**Subagents extend your capabilities, not replace your judgment.**

Always review. Always verify. Always follow the plan.
