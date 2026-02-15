---
name: executing-plans
description: Use when executing a plan with human oversight. Processes tasks in batches of 3 with human checkpoint after each batch. Alternative to subagent-driven-development when more control is needed.
---

# Executing Plans

**THE RULE: Execute plans systematically with verification at each step.**

## Why This Exists

Ad-hoc implementation leads to:
- Skipping important steps
- Losing track of progress
- Introducing bugs
- Not following the design

## The Process

### Step 1: Load the Plan

Read the plan document:
```
docs/plans/YYYY-MM-DD-feature.md
```

### Step 2: Process in Batches

Work through tasks in batches of 3:

**Batch 1: Tasks 1-3**
1. Complete Task 1
2. Verify Task 1
3. Complete Task 2
4. Verify Task 2
5. Complete Task 3
6. Verify Task 3
7. **Human Checkpoint** - Review with user

**Batch 2: Tasks 4-6**
- Repeat pattern
- Another checkpoint

### Step 3: Human Checkpoints

After each batch, present:
- What was completed
- Any issues encountered
- Plan for next batch
- Request for approval to continue

## Task Execution Template

For each task:

```markdown
## Task X: [Name]

### Implementation
[What you're doing]

### Code Changes
```[language]
[The actual code]
```

### Verification
- [ ] Test passes
- [ ] No TypeScript errors
- [ ] Matches plan specification

### Status: [In Progress / Complete / Blocked]
```

## Checkpoint Template

```markdown
## Batch X Complete

### Completed
1. Task A - [brief description]
2. Task B - [brief description]
3. Task C - [brief description]

### Issues
- [Any blockers or concerns]

### Next Batch
- Task D
- Task E
- Task F

**Ready to continue?** [Yes / No / Need changes]
```

## Progress Tracking

Update plan document as you go:

```markdown
## Tasks

- [x] Task 1: Done
- [x] Task 2: Done
- [x] Task 3: Done (awaiting checkpoint)
- [ ] Task 4: Pending
- [ ] Task 5: Pending
```

## Anti-Patterns

❌ Working on more than 3 tasks without checkpoint  
❌ Skipping verification steps  
❌ Not updating progress in plan  
❌ Continuing when blocked  
❌ Changing plan without approval  

## When to Use vs Subagent-Driven

| Use Executing Plans | Use Subagent-Driven |
|---------------------|---------------------|
| Need tight control | Many independent tasks |
| Complex dependencies | Clear parallel work |
| User wants frequent updates | Need autonomous operation |
| Learning/exploring | Well-defined specifications |

## Remember

**The plan is your contract. Follow it. Verify each step. Check in frequently.**
