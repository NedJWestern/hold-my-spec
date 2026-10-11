---
description: New Bug (code doesn't do what the spec says) - investigate read-only
argument-hint: "<what you saw>"
---
hms: New Bug (planning phase): $ARGUMENTS

Investigate without changing the project: reproduce it, find the requirement it breaks, the cause and a fix plan. Add it to the planning backlog tagged [bug] with Seen / Expected (citing the requirement) / Cause / Plan. If the spec is silent or wrong about it, it's a Change: say so and suggest reclassifying it. If nothing was described, ask what was seen.

Rules while planning:
- Only the spec and backlog change (the project's CLAUDE.md says where they live). The hms guard refuses edits to other files in the project.
- Investigate read-only: read code, run tests, reproduce in a scratch area outside the repo.
- Backlog items are tagged [change], [tweak] or [bug]. A decided item's decision goes into the spec; the item keeps a pointer to it.
- Ask the owner open questions one at a time, with context.
- Commit planning work with a "Plan:" prefix.
- Never start building: that waits for the owner's /hms:building.
