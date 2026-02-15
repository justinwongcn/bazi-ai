---
name: finishing-a-development-branch
description: Use when all tasks are complete. Verifies tests, presents options (merge/PR/keep/discard), cleans up worktree. Properly closes the development cycle.
---

# Finishing a Development Branch

**THE RULE: Properly close development cycles with verification and cleanup.**

## Why This Exists

Abandoning branches leads to:
- Orphaned work
- Unclear project state
- Lost work
- Repository clutter

## The Process

### Step 1: Final Verification

```bash
# Run all tests
npm test

# Check for TypeScript errors
npm run typecheck

# Lint code
npm run lint

# Verify build
npm run build
```

All must pass before proceeding.

### Step 2: Review Changes

```bash
# See what changed
git diff main

# Review commit history
git log --oneline main..HEAD
```

### Step 3: Present Options

Present the user with clear options:

```markdown
## Branch Complete: [branch-name]

### Summary
- Tasks completed: X
- Files changed: X
- Tests added: X
- Test coverage: X%

### Verification Status
- [x] All tests pass
- [x] No TypeScript errors
- [x] Build successful
- [x] Lint clean

### Options

**A. Merge to Main**
- Fast-forward merge
- Branch will be deleted
- Use when: Work is complete and tested

**B. Create Pull Request**
- Open PR for review
- Branch preserved until merged
- Use when: Want code review or discussion

**C. Keep Branch**
- Leave branch as-is
- Can continue work later
- Use when: More work planned soon

**D. Discard Changes**
- Delete branch without merging
- Work will be lost
- Use when: Experimental/spike work

**Your choice?** [A / B / C / D]
```

### Step 4: Execute Choice

**Option A: Merge**
```bash
git checkout main
git merge --no-ff feature/branch-name
git branch -d feature/branch-name
git push origin main
```

**Option B: Pull Request**
```bash
git push origin feature/branch-name
# Provide PR link
```

**Option C: Keep**
```bash
# Just switch back to main
git checkout main
# Branch remains
```

**Option D: Discard**
```bash
git checkout main
git branch -D feature/branch-name
```

### Step 5: Cleanup

```bash
# Remove worktree if used
git worktree remove ../feature-branch

# Clean up node_modules if needed
# Update any documentation
```

## Final Checklist

- [ ] All tests pass
- [ ] Code reviewed
- [ ] User selected action
- [ ] Action executed
- [ ] Branch cleaned up
- [ ] Worktree removed (if applicable)

## Anti-Patterns

❌ Merging without running tests  
❌ Leaving orphaned branches  
❌ Not getting user confirmation  
❌ Discarding work without confirmation  
❌ Forgetting to clean up worktrees  

## Remember

**A clean finish is as important as a clean start.**

Always verify. Always ask. Always clean up.
