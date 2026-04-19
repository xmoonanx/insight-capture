# Post Patterns

Four patterns are available. Choose based on the nature of the insight, not the user's phrasing.

---

## problem-solution

**When to use:** A specific bug or error was encountered, investigated, and resolved.

**Structure:**

```markdown
## Problem

What went wrong, and what symptom the user saw (error message, unexpected behavior, failed build, etc.).

## Root Cause

Why it happened — the underlying technical reason, not just "the config was wrong."

## Solution

What was changed or done to fix it. Include code snippets or config diffs where they add value.

## Takeaway

One or two sentences on what to watch for in future. Optional but valuable.
```

---

## learning-note

**When to use:** The user learned or understood something — a concept, a tool, a pattern — rather than fixing a specific bug.

**Structure:**

```markdown
## What I Learned

The concept or topic, explained clearly. Assume readers know the ecosystem but not this specific thing.

## Why It Matters

How this knowledge changes how they'll work going forward.

## Example

A concrete snippet or scenario illustrating the concept.
```

---

## tutorial

**When to use:** The user wants to document a repeatable multi-step process for others to follow.

**Structure:**

```markdown
## Overview

One paragraph: what this tutorial covers, and what the reader will have at the end.

## Prerequisites

Bullet list of what needs to be in place before starting.

## Steps

### Step 1 — Title

Clear, actionable description. One step = one thing.

### Step 2 — Title

...

## Result

What success looks like — output, screenshot description, or verification command.
```

---

## tips

**When to use:** A short, practical piece of advice — a shortcut, a config trick, a workflow improvement. Not a full explanation or tutorial.

**Structure:**

```markdown
## The Tip

State the tip in 1–2 sentences.

## Why It Helps

Brief context: what problem this solves or what it replaces.

## Example

```code
# minimal snippet showing the tip in action
```
```
