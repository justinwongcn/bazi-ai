---
name: writing-plans
description: Use when design is approved and ready to implement. Breaks work into bite-sized tasks (2-5 minutes each) with exact file paths, complete code, and verification steps. Required before any implementation.
---

# Writing Plans

**THE RULE: You MUST write a plan before implementing. No exceptions.**

## Why This Exists

Implementing without a plan leads to:
- Forgetting important steps
- Inconsistent implementation
- Missing edge cases
- Difficult code reviews
- No way to track progress

## Task Size Rule

**Each task must be completable in 2-5 minutes.**

If a task takes longer, break it down further.

## Plan Format

```markdown
# Plan: Feature Name

## Overview
Brief description of what we're building.

## Tasks

### Task 1: [Name]
**Files:** `path/to/file1.ts`, `path/to/file2.ts`

**Changes:**
```typescript
// Exact code to write
```

**Verification:**
- [ ] Step 1
- [ ] Step 2

---

### Task 2: [Name]
...
```

## Task Template

Every task MUST include:

1. **Clear name** - What this task accomplishes
2. **Exact file paths** - No "the component file" - full paths
3. **Complete code** - The actual code to write, not pseudocode
4. **Verification steps** - How to confirm it works

## Example Task

### Task 3: Add Email Validation
**Files:** `src/utils/validation.ts`, `src/utils/validation.test.ts`

**Changes:**
```typescript
// src/utils/validation.ts
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// src/utils/validation.test.ts
import { isValidEmail } from './validation';

describe('isValidEmail', () => {
  it('returns true for valid email', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
  });
  
  it('returns false for invalid email', () => {
    expect(isValidEmail('not-an-email')).toBe(false);
  });
});
```

**Verification:**
- [ ] Run `npm test validation.test.ts` - tests pass
- [ ] Import function in another file - no TypeScript errors

---

## Output Location

Save plan to:
```
docs/plans/YYYY-MM-DD-feature-name.md
```

## Before You Start

Read the design document first:
```
docs/plans/YYYY-MM-DD-feature-name-design.md
```

## Anti-Patterns

❌ Tasks longer than 5 minutes  
❌ Vague file references  
❌ Pseudocode instead of real code  
❌ Missing verification steps  
❌ "I'll figure out the details later"  

## Verification Checklist

Before marking plan complete:
- [ ] Each task is 2-5 minutes max
- [ ] All file paths are exact
- [ ] Code is complete and copy-paste ready
- [ ] Every task has verification steps
- [ ] Tasks are ordered logically
- [ ] Plan covers entire design scope
