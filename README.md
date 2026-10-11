# hold my spec

A Claude Code plugin for spec-driven development with three modes, so Claude works at the pace you expect: chatting when you're discussing, writing the spec when you're planning, and building without interruptions when you've said go.

## Install

```
/plugin install hms --marketplace NedJWestern/hold-my-spec
```

Answer `y` to add the marketplace, then pick a scope.

## Modes

| Command | Mode | Claude does | Pace |
|---|---|---|---|
| `/hms:discuss [anything]` | discuss (the default) | Chats: answers, opinions, quick look-ups. No spec or code changes, nothing slow. | Quick, back and forth |
| `/hms:plan [what]` | plan | Shapes ideas into the spec, asks questions one at a time, says plainly what changes in the spec. No code. | Medium |
| `/hms:build [items]` | build | Builds what was agreed in plan, end to end, without asking questions. Stops with a report if blocked. | Long, uninterrupted |

- A project starts in discuss.
- After `/hms:build`, the project always returns to discuss by itself, whether the build finished or stopped because it was blocked. You review the report there, then choose what's next: `/hms:plan` to sort out what blocked it, or `/hms:build` again.
- The current mode is shown in the status line: `hms: discuss`, `hms: plan` or `hms: build`.
- Only you can run these commands; Claude can't switch modes on its own.
- Text after a command is passed to Claude as-is, e.g. `/hms:plan the error report`.

## Change, Tweak or Bug

In plan mode, each item is sorted by asking **which side is wrong, the spec or the code**:

| Kind | What it is | Spec | Build |
|---|---|---|---|
| **Change** | New or different behaviour (the spec is wrong or silent) | Requirement and design updated | Implement, with tests citing the requirement |
| **Tweak** | Wording or layout, same behaviour | Design only | Apply it |
| **Bug** | The code doesn't do what the spec says | None | Failing test first, then fix |

## Assumptions

hms is a lightweight, informal take on spec-driven development: no special tooling (unlike GitHub's Spec Kit or Kiro), just plain markdown in the repo, and a person who decides. It assumes:

- **The spec is plain markdown in the repo,** typically three files:
  - **requirements:** *what* the software does, as short statements with IDs (`R6.3`);
  - **design:** *how* it does it;
  - **tasks:** the work, including the backlog of ideas and agreed items.
- **The spec is the source of truth.** Behaviour changes in the spec first, then in the code. Code that differs from the spec is a bug in one or the other: that's how items are sorted into Change, Tweak or Bug.
- **Requirement IDs are cited where useful,** in code comments, test names and commits, so the code can be traced back to the spec. Best effort, not a formal traceability matrix.
- **One owner approves.** The person running the commands decides what's agreed, in conversation; there are no formal reviews or sign-offs.
- **Git holds the history.** Built items are removed from the backlog; the spec keeps the decision and git keeps the rest.
- **The project's `CLAUDE.md` says where things are:** the spec and backlog files, the checks to run (tests, lint, type check), and the release steps (versioning, deploy). The commands refer to those rather than assuming paths.

A good fit for small projects with one decision-maker. Larger teams may want acceptance criteria on every requirement, formal reviews and full traceability, which hms doesn't attempt.

## How it works

The commands are markdown prompts in `commands/`. A small hooks module (`hooks/register.ts`) records the mode per project in the plugin's own store (nothing is written to your repo), shows it in the status line, and returns to discuss when a build's final reply ends with `hms: build complete` or `hms: build stopped`.

There are no guards yet: the modes are instructions Claude follows, not restrictions. They may be tightened later (for example, refusing code edits outside build).

## Developing

```
claude plugin validate .
claude plugin test .
```
