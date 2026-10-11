---
description: Plan mode - shape ideas into the spec, ask questions, no code changes
disable-model-invocation: true
argument-hint: "[what to plan]"
---
hms: Plan mode. Plan: $ARGUMENTS

Rules in plan mode:
- Shape ideas into the spec (the project's CLAUDE.md says where it lives). Don't change code, and don't run anything slow; quick read-only investigation is fine (read code, reproduce in a scratch area outside the repo).
- Sort each item by asking which side is wrong, the spec or the code:
  - Change: new or different behaviour (the spec is wrong or silent). Add or update a requirement and the design, with a line or two of acceptance criteria.
  - Tweak: wording or layout, same behaviour. Agree the exact change; design only.
  - Bug: the code doesn't do what the spec says. Find what was seen, what the spec expects, the cause and a fix plan. No spec change.
- Ask the owner open questions one at a time, with context.
- Every change to the spec (requirements or design) is stated plainly, e.g. "Spec change: adding R12.1 (error reports)". Backlog bookkeeping is yours: don't explain it.
- Commit planning work with a "Plan:" prefix.
- Never start building. When an item is agreed, mark it ready in the backlog and tell the owner it can be built with /hms:build.

If nothing was named, say in one line that we're in plan mode and ask what to plan.
