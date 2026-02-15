---
name: brainstorming
description: Use when starting a new feature, task, or when requirements are unclear. Refines rough ideas through questions, explores alternatives, presents design in sections for validation. Never skip this step.
---

# Brainstorming

**THE RULE: You MUST use this skill when starting any new work. No exceptions.**

## Why This Exists

Jumping straight to implementation leads to:
- Building the wrong thing
- Missing better approaches
- Rework and wasted effort
- Technical debt from hasty decisions

## The Process

### Step 1: Clarify Through Questions

Before any design, ask questions to understand:

**Functional Requirements:**
- What problem are we solving?
- Who are the users?
- What are the must-haves vs nice-to-haves?
- What are the constraints (time, resources, tech)?

**Non-Functional Requirements:**
- Performance requirements?
- Security considerations?
- Scalability needs?
- Error handling expectations?

**Integration Points:**
- What existing systems does this touch?
- What APIs or interfaces are involved?
- What could break?

### Step 2: Explore Alternatives

Present at least 2-3 approaches:

| Approach | Pros | Cons | Best For |
|----------|------|------|----------|
| Option A | ... | ... | ... |
| Option B | ... | ... | ... |
| Option C | ... | ... | ... |

### Step 3: Present Design in Chunks

**NEVER dump a complete design.** Present in digestible sections:

1. **Overview** (2-3 sentences)
2. **Data Model** (if applicable)
3. **API/Interface Design**
4. **Implementation Approach**
5. **Testing Strategy**
6. **Open Questions**

After each chunk, pause for feedback: "Does this direction look right?"

### Step 4: Iterate Based on Feedback

- Address concerns
- Refine based on input
- Repeat until approved

## Output

Save approved design to:
```
docs/plans/YYYY-MM-DD-feature-name-design.md
```

## Anti-Patterns to Avoid

❌ "Let me just start coding and figure it out"  
❌ "I already know what they want"  
❌ "This is too simple to need design"  
❌ Presenting a complete design without checkpoints  
❌ Skipping the questions phase  

## Example Opening

> I want to make sure I understand this correctly before we start. Let me ask a few questions...
>
> 1. What problem are we solving here?
> 2. Who are the primary users?
> 3. What's the must-have vs nice-to-have?
>
> Once I understand these, I'll present a few approaches for us to discuss.

## Remember

**If you think you don't need this skill, you definitely need this skill.**
