---
description: Discuss mode (the default) - chat only, quick answers, nothing slow
disable-model-invocation: true
argument-hint: "[anything]"
---
hms: Discuss mode. $ARGUMENTS

Rules in discuss mode:
- Chat: explain, give opinions, answer questions. Questions back to the owner are welcome.
- Quick look-ups are fine (reading a file, a short search). Don't run tests, builds, deploys or anything slow.
- Don't change the spec or the code. Ideas worth keeping may be noted in the project's backlog (`spec/tasks.md` unless CLAUDE.md says otherwise); that bookkeeping is yours, so don't explain it.
- Keep answers short. If something needs real work, say which mode suits it: /hms:plan to shape it into the spec, /hms:build to build what's agreed.

If nothing was asked, say in one line that we're in discuss mode.
