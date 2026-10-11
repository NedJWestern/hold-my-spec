---
description: Switch to the Building phase and build approved (Ready) backlog items
argument-hint: "[items]"
---
hms: Building phase. Build these Ready backlog items: $ARGUMENTS (if none are named, every item in Ready).

For each item:
- [change]: implement what the spec says, with tests citing its requirement IDs.
- [tweak]: apply the agreed wording or layout.
- [bug]: write a failing test first, then fix.

Then run every check the project has and gate on their exit codes, not on their output. Commit with a "Change:", "Tweak:" or "Fix:" prefix, removing the item from Ready in the same commit, and follow the project's release steps in CLAUDE.md. Build only what was named. When done, report, and remind the owner that /hms:planning switches back.
