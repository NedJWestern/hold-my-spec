# hold my spec

A Claude Code plugin for spec-driven development with a clear line between **planning** and **building**. Claude plans in the spec, and builds only when you say so.

## Install

```
/plugin install hms --marketplace NedJWestern/hold-my-spec
```

Answer `y` to add the marketplace, then pick a scope.

## Commands

| Command | Phase | What happens |
|---|---|---|
| `/hms:planning [topic]` | planning | Switch to planning. Only the spec may change. |
| `/hms:building [items]` | building | Build the approved (Ready) backlog items, or just the ones named. |
| `/hms:change <idea>` | planning | New **Change** (new or different behaviour): draft its requirement and design. |
| `/hms:tweak <what>` | planning | New **Tweak** (wording or layout, same behaviour): propose the exact change. |
| `/hms:bug <what you saw>` | planning | New **Bug** (code doesn't match the spec): investigate read-only. |

Everything except `/hms:building` puts the project in planning. `/hms:building` is the only way into building.

## The workflow

Every backlog item is one of three kinds. To tell which, ask **which side is wrong, the spec or the code**:

| Kind | What it is | Spec | Code |
|---|---|---|---|
| **Change** | New or different behaviour (the spec is wrong or silent) | Add or update a requirement, then the design | Build, with tests citing the requirement |
| **Tweak** | Wording or layout, same behaviour | Design only | Change it |
| **Bug** | The code doesn't do what the spec says | None | Failing test first, then fix |

A "bug" the spec never covered is really a Change.

Items move from a **planning** backlog to a **ready** backlog when you approve them, and are deleted once built: the spec holds the decision and git holds the history. Commits show the phase: `Plan:` for planning, `Change:`, `Tweak:` or `Fix:` for building.

## The guard

While a project is in planning, the plugin refuses edits (Edit, Write, NotebookEdit) to files in the project outside:

- `spec/`
- `CLAUDE.md`
- `README.md`

Files outside the project, such as a scratch folder, can always be edited. If the guard itself fails, it refuses the edit rather than letting it through.

The phase is kept per project in the plugin's own store, not in the repo. A project that has never run an `/hms` command has no phase, so the guard leaves it alone.

Limits: the guard covers Claude's file-editing tools, not shell commands. Claude is told not to edit code while planning, but a command like `sed -i` isn't blocked.

## Your project's side

Say in the project's `CLAUDE.md` where the spec and backlog live (for example `spec/requirements.md`, `spec/design.md` and `spec/tasks.md` with "Backlog: planning" and "Backlog: ready" sections), and its checks and release steps. The commands refer to those.

## Developing

```
claude plugin validate .
claude plugin test .
```
