---
description: Switch to the Planning phase - shape backlog items and the spec, no code changes
argument-hint: "[topic]"
---
hms: Planning phase. Topic: $ARGUMENTS

Rules while planning:
- Only the spec and backlog change (the project's CLAUDE.md says where they live). The hms guard refuses edits to other files in the project.
- Investigate read-only: read code, run tests, reproduce in a scratch area outside the repo.
- Backlog items are tagged [change], [tweak] or [bug]. A decided item's decision goes into the spec; the item keeps a pointer to it.
- Ask the owner open questions one at a time, with context.
- Commit planning work with a "Plan:" prefix.
- Never start building: that waits for the owner's /hms:building.

Say in one line that we're in planning, then continue with the topic if one was given.
