---
name: test-driven-development
description: Use during implementation phase. Enforces RED-GREEN-REFACTOR cycle - write failing test, watch it fail, write minimal code, watch it pass, refactor. Deletes code written before tests.
---

# Test-Driven Development (TDD)

**THE RULE: You MUST follow RED-GREEN-REFACTOR. No exceptions.**

## The Cycle

```
┌─────────┐    ┌─────────┐    ┌─────────┐
│   RED   │───→│  GREEN  │───→│ REFACTOR│
│Write    │    │Minimal  │    │Clean up │
│failing  │    │code to  │    │while    │
│test     │    │pass     │    │passing  │
└────┬────┘    └────┬────┘    └────┬────┘
     └──────────────┴──────────────┘
              Repeat
```

## RED Phase (Write Failing Test)

1. Write a test for the behavior you want
2. Run the test - it should FAIL
3. If it passes, something is wrong (test isn't testing what you think)

**Example:**
```typescript
// test/calculator.test.ts
import { add } from './calculator';

test('adds two numbers', () => {
  expect(add(2, 3)).toBe(5);  // Fails - add() doesn't exist yet
});
```

Run: `npm test` → **FAILS** ✓

## GREEN Phase (Make It Pass)

1. Write the MINIMUM code to make the test pass
2. Don't worry about elegance
3. Just make it green

**Example:**
```typescript
// src/calculator.ts
export function add(a: number, b: number): number {
  return a + b;  // Simplest possible implementation
}
```

Run: `npm test` → **PASSES** ✓

## REFACTOR Phase (Clean Up)

1. Improve the code
2. Keep all tests passing
3. Run tests after each change

**Example:**
```typescript
// Maybe add input validation while keeping tests green
export function add(a: number, b: number): number {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('Arguments must be numbers');
  }
  return a + b;
}
```

Run: `npm test` → **PASSES** ✓

## The Golden Rule

**🚨 DELETE ANY CODE WRITTEN BEFORE TESTS 🚨**

If you wrote implementation code before tests:
1. Delete it
2. Write the test
3. Re-implement following RED-GREEN-REFACTOR

## Common Mistakes

❌ Writing multiple tests at once  
❌ Writing implementation before tests  
❌ Skipping the RED phase (not watching test fail)  
❌ Refactoring while test is failing  
❌ Writing too much code in GREEN phase  

## Testing Anti-Patterns

| Anti-Pattern | Why It's Bad | Fix |
|--------------|--------------|-----|
| Testing implementation | Brittle tests | Test behavior, not internals |
| No assertions | Tests always pass | Assert on actual outcomes |
| Testing everything | Slow, brittle | Test critical paths |
| Mocking everything | Tests don't verify reality | Use real deps when possible |

## TDD Checklist

For every behavior:
- [ ] Write failing test (RED)
- [ ] Watch it fail
- [ ] Write minimum code to pass (GREEN)
- [ ] Watch it pass
- [ ] Refactor while green
- [ ] Commit: "Add [feature]: [test description]"

## Remember

**If you think TDD is slowing you down, you're doing it wrong.**

TDD done right:
- Catches bugs immediately
- Documents behavior
- Enables confident refactoring
- Produces simpler designs
