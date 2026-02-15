---
name: requesting-code-review
description: Use between tasks or when completing work. Reviews against plan, reports issues by severity. Critical issues block progress. Ensures quality before moving forward.
---

# Requesting Code Review

**THE RULE: Review code against the plan before proceeding. Quality gates are mandatory.**

## Why This Exists

Skipping review leads to:
- Accumulating technical debt
- Missing bugs
- Drifting from the plan
- Lower code quality

## Review Triggers

Review when:
- Completing a batch of tasks
- Before merging a branch
- When something feels "off"
- User requests review

## Review Process

### Step 1: Gather Context

Collect:
- The original plan
- Design document
- Code changes
- Test results

### Step 2: Review Against Plan

Check each change against the plan:

| Aspect | Check |
|--------|-------|
| Completeness | Did we implement everything specified? |
| Correctness | Does it work as intended? |
| Quality | Is the code clean and maintainable? |
| Tests | Are there adequate tests? |
| Conventions | Does it follow project patterns? |

### Step 3: Categorize Issues

**Critical** - Must fix before proceeding
- Broken functionality
- Security issues
- Missing core requirements

**Major** - Should fix, can proceed with caution
- Code quality issues
- Missing edge case handling
- Poor test coverage

**Minor** - Nice to have
- Style inconsistencies
- Documentation gaps
- Refactoring suggestions

### Step 4: Report Findings

```markdown
## Code Review: [Feature Name]

### Summary
- Files changed: X
- Tests added: X
- Critical issues: X
- Major issues: X
- Minor issues: X

### Critical Issues (Block Progress)
1. [Issue] - [Location] - [Fix required]

### Major Issues (Should Fix)
1. [Issue] - [Location] - [Suggestion]

### Minor Issues (Optional)
1. [Issue] - [Location] - [Suggestion]

### Verification
- [ ] All tests pass
- [ ] No TypeScript errors
- [ ] Matches plan specification

### Recommendation
[Proceed / Fix Issues / Request Changes]
```

## Review Checklist

- [ ] Read the plan first
- [ ] Check each file changed
- [ ] Verify tests exist and pass
- [ ] Look for edge cases
- [ ] Check error handling
- [ ] Verify no console.logs or debug code
- [ ] Confirm no secrets exposed

## Anti-Patterns

❌ Reviewing without reading the plan  
❌ Approving your own code without scrutiny  
❌ Ignoring critical issues  
❌ Not categorizing issues by severity  
❌ Being too lenient  

## Remember

**Code review is quality assurance, not bureaucracy.**

Be thorough. Be honest. Don't approve what isn't ready.
