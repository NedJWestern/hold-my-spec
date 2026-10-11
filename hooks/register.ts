// hold-my-spec (hms): spec-driven development with an explicit gate between planning and building.
//
// The commands themselves are markdown prompts in ../commands (/hms:planning, /hms:building,
// /hms:change, /hms:tweak, /hms:bug). This module only:
// - records the project's phase when one of them runs (building for /hms:building, planning
//   for the rest), and
// - while a project is in planning, refuses edits to files outside its spec.
//
// The phase is kept per project root in the plugin's store. A project that never ran an
// /hms command has no phase, and the guard leaves it alone.
import type { EngineInterface, Register } from 'claude-code'

export type Phase = 'planning' | 'building'

/** Paths, relative to the project root, that may change while planning. */
export const PLANNING_PATHS = ['spec/', 'CLAUDE.md', 'README.md']

const phaseKey = (root: string) => `phase:${root}`

/** Whether `path` may be edited while planning: outside the project, or one of its spec paths. */
export function editableWhilePlanning(root: string, path: string): boolean {
  const base = root.endsWith('/') ? root : `${root}/`
  const abs = path.startsWith('/') ? path : base + path
  if (!abs.startsWith(base)) return true
  const rel = abs.slice(base.length)
  return PLANNING_PATHS.some((p) => (p.endsWith('/') ? rel.startsWith(p) : rel === p))
}

async function refusal($: EngineInterface, path: string): Promise<{ deny: string } | undefined> {
  const root = await $.session.root()
  if ((await $.store.get(phaseKey(root))) !== 'planning') return undefined
  if (editableWhilePlanning(root, path)) return undefined
  return {
    deny: `hms: planning phase: only the spec may change (${PLANNING_PATHS.join(', ')}), not ${path}. Record the plan in the spec instead, or ask the owner to run /hms:building.`,
  }
}

const guardFailed = { deny: 'hms: the planning guard failed, so the edit is refused.' }

export const register: Register = (on) => {
  // Each command records its phase, then runs as usual (its markdown prompt).
  on('command.run', { command: 'hms:planning' }, async ($, e, next) => {
    await $.store.set(phaseKey(await $.session.root()), 'planning')
    return next(e)
  })
  on('command.run', { command: 'hms:change' }, async ($, e, next) => {
    await $.store.set(phaseKey(await $.session.root()), 'planning')
    return next(e)
  })
  on('command.run', { command: 'hms:tweak' }, async ($, e, next) => {
    await $.store.set(phaseKey(await $.session.root()), 'planning')
    return next(e)
  })
  on('command.run', { command: 'hms:bug' }, async ($, e, next) => {
    await $.store.set(phaseKey(await $.session.root()), 'planning')
    return next(e)
  })
  on('command.run', { command: 'hms:building' }, async ($, e, next) => {
    await $.store.set(phaseKey(await $.session.root()), 'building')
    return next(e)
  })

  // The guard: while planning, only the spec may change. If it fails, it refuses.
  on('tool.call', { tool: 'Edit' }, async ($, e, next) => (await refusal($, e.file_path)) ?? next(e)).catch(
    ($, e, next) => (next.called ? next(e) : guardFailed),
  )
  on('tool.call', { tool: 'Write' }, async ($, e, next) => (await refusal($, e.file_path)) ?? next(e)).catch(
    ($, e, next) => (next.called ? next(e) : guardFailed),
  )
  on('tool.call', { tool: 'NotebookEdit' }, async ($, e, next) =>
    (await refusal($, e.notebook_path)) ?? next(e),
  ).catch(($, e, next) => (next.called ? next(e) : guardFailed))
}
