---
description: New Change (new or different behaviour) - draft its requirement and design
disable-model-invocation: true
argument-hint: "<idea>"
---
hms: New Change (planning phase): $ARGUMENTS

Add it to the planning backlog tagged [change]. Draft the new or changed requirement (with an ID), the design notes and one or two acceptance criteria. Note trade-offs, then ask the owner the open questions one at a time. If no idea was given, ask for one.

Rules while planning:
- Only the spec and backlog change (the project's CLAUDE.md says where they live). The hms guard refuses edits to other files in the project.
- Investigate read-only: read code, run tests, reproduce in a scratch area outside the repo.
- Backlog items are tagged [change], [tweak] or [bug]. A decided item's decision goes into the spec; the item keeps a pointer to it.
- Ask the owner open questions one at a time, with context.
- Commit planning work with a "Plan:" prefix.
- Never start building: that waits for the owner's /hms:building.
