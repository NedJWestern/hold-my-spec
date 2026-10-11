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

- A project starts in discuss, and returns to discuss by itself when a build finishes or stops.
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

## Your project's side

Say in the project's `CLAUDE.md` where the spec and backlog live (for example `spec/requirements.md`, `spec/design.md` and `spec/tasks.md`), and its checks and release steps. The commands refer to those.

## How it works

The commands are markdown prompts in `commands/`. A small hooks module (`hooks/register.ts`) records the mode per project in the plugin's own store (nothing is written to your repo), shows it in the status line, and returns to discuss when a build's final reply ends with `hms: build complete` or `hms: build stopped`.

There are no guards yet: the modes are instructions Claude follows, not restrictions. They may be tightened later (for example, refusing code edits outside build).

## Developing

```
claude plugin validate .
claude plugin test .
```
