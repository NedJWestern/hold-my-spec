---
description: New Tweak (wording or layout, same behaviour) - propose the exact change
argument-hint: "<what>"
---
hms: New Tweak (planning phase): $ARGUMENTS

Add it to the planning backlog tagged [tweak]. Propose the exact wording or layout and where it lives in the design. If it changes behaviour, it's a Change: say so. If nothing was described, ask what.

Rules while planning:
- Only the spec and backlog change (the project's CLAUDE.md says where they live). The hms guard refuses edits to other files in the project.
- Investigate read-only: read code, run tests, reproduce in a scratch area outside the repo.
- Backlog items are tagged [change], [tweak] or [bug]. A decided item's decision goes into the spec; the item keeps a pointer to it.
- Ask the owner open questions one at a time, with context.
- Commit planning work with a "Plan:" prefix.
- Never start building: that waits for the owner's /hms:building.
