---
name: systematic-debugging
description: Use when encountering bugs, errors, or unexpected behavior. Follows 4-phase root cause process - observe, hypothesize, verify, fix. Prevents random guessing and cargo cult fixes.
---

# Systematic Debugging

**THE RULE: You MUST follow this process. No guessing allowed.**

## Why This Exists

Random debugging leads to:
- Wasting hours on wrong hypotheses
- "Fixing" symptoms instead of root causes
- Introducing new bugs
- Never understanding what went wrong

## The 4-Phase Process

### Phase 1: OBSERVE

**Gather facts. Don't guess.**

Collect:
- Exact error message
- Stack trace
- When did it start happening?
- What changed recently?
- What works vs what doesn't?
- Environment details (browser, OS, versions)

**Output:** A clear problem statement

**Example:**
```
Problem: User login fails with "Invalid credentials" error
Observed:
- Error occurs on POST /api/login
- Happens for all users, not just one
- Started after deployment on 2024-01-15
- Database connection logs show timeout errors
- Error rate: 100% of login attempts
```

### Phase 2: HYPOTHESIZE

**Generate possible causes.**

List all hypotheses that could explain the observations:

| Hypothesis | Likelihood | Test Idea |
|------------|------------|-----------|
| Database connection pool exhausted | High | Check connection count |
| Recent migration broke auth table | Medium | Check migration logs |
| Environment variable missing | Medium | Check env vars |
| Third-party auth service down | Low | Check service status |

### Phase 3: VERIFY

**Test your hypotheses.**

Design experiments to confirm or reject each hypothesis:

1. Start with highest likelihood
2. Design a test that definitively proves/disproves it
3. Run the test
4. Record results

**Example:**
```
Hypothesis: Database connection pool exhausted

Test: Check active connections
Command: SELECT count(*) FROM pg_stat_activity;
Result: 100/100 connections active
Conclusion: CONFIRMED - pool is exhausted
```

### Phase 4: FIX

**Implement and verify the fix.**

1. Fix the root cause (not the symptom)
2. Test the fix
3. Verify no regressions
4. Document what happened

**Example:**
```
Root Cause: Connection leak in user service - connections not being closed

Fix: Add connection.close() in finally block

Verification:
- [ ] Login works now
- [ ] Connection count stays below 20
- [ ] All existing tests pass
- [ ] No new errors in logs
```

## Debugging Log Template

```markdown
## Debug Log: [Brief Description]

### Observations
- Error: 
- When: 
- Scope: 
- Recent changes: 

### Hypotheses
1. [ ] Hypothesis 1
2. [ ] Hypothesis 2
3. [ ] Hypothesis 3

### Verification
| Hypothesis | Test | Result |
|------------|------|--------|
| H1 | | |
| H2 | | |

### Fix
Root cause: 
Solution: 

### Verification
- [ ] Fix works
- [ ] No regressions
```

## Anti-Patterns

❌ Changing code randomly hoping it fixes the issue  
❌ Assuming the cause without verification  
❌ Fixing symptoms without understanding root cause  
❌ Not documenting what you learned  
❌ "It works now, let's move on" (without understanding why)  

## Common Rationalizations (WRONG!)

- ❌ "I just know what the problem is" → Verify it anyway
- ❌ "This is taking too long" → Rushing causes more bugs
- ❌ "Let me try this quick fix" → Quick fixes become permanent
- ❌ "It's probably X" → "Probably" isn't good enough

## Remember

**The goal isn't to fix the bug. The goal is to understand the bug.**

Once you truly understand it, the fix is obvious.
