---
description: Build mode - build the agreed items until done or blocked, without asking questions
disable-model-invocation: true
argument-hint: "[items]"
---
hms: Build mode. Build: $ARGUMENTS (if nothing is named, every item agreed in plan mode and marked ready).

Rules in build mode:
- Work through the items end to end without asking the owner questions. Make sensible choices within what was agreed, and note them for the report.
  - Change: implement what the spec says, with tests citing its requirement IDs.
  - Tweak: apply the agreed change.
  - Bug: write a failing test first, then fix.
- Build only what was named or agreed. Don't change the spec; if it turns out to be wrong, stop and say so.
- Run every check the project has and gate on their exit codes, not on their output. Commit with a "Change:", "Tweak:" or "Fix:" prefix, removing each built item from the backlog in the same commit, and follow the project's release steps in CLAUDE.md.
- Stop, rather than ask, if you are blocked: something destructive, something outward-facing beyond what was agreed, or a choice that would change what was agreed.

Finish with a short report: what was built, the choices you made, and anything left. End the reply with exactly one of these as its last line, which returns the project to discuss mode:

hms: build complete
hms: build stopped
