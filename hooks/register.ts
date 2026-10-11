// hold-my-spec (hms): three modes, discuss (the default), plan and build.
//
// The commands are markdown prompts in ../commands (/hms:discuss, /hms:plan, /hms:build). This
// module only keeps the project's mode:
// - each command records its mode, then runs as usual;
// - a build returns the project to discuss once its final reply ends with
//   "hms: build complete" or "hms: build stopped";
// - the mode is shown in the status line.
//
// The mode is kept per project root in the plugin's store. No mode recorded means discuss.
import type { EngineInterface, Register } from 'claude-code'

export type Mode = 'discuss' | 'plan' | 'build'

const modeKey = (root: string) => `mode:${root}`

/** Whether a reply ends a build: its last line is the build's closing marker. */
export function endsBuild(answer: string): boolean {
  const last = answer.trimEnd().split('\n').at(-1)?.trim() ?? ''
  return last === 'hms: build complete' || last === 'hms: build stopped'
}

async function getMode($: EngineInterface): Promise<Mode> {
  const value = await $.store.get(modeKey(await $.session.root()))
  return value === 'plan' || value === 'build' ? value : 'discuss'
}

async function setMode($: EngineInterface, mode: Mode): Promise<void> {
  await $.store.set(modeKey(await $.session.root()), mode)
  $.ui.status(mode) // Claude Code labels it "hms:" itself
}

export const register: Register = (on) => {
  on('session.start', async ($, e, next) => {
    $.ui.status(await getMode($))
    return next(e)
  })

  // Each command records its mode, then runs as usual (its markdown prompt).
  on('command.run', { command: 'hms:discuss' }, async ($, e, next) => {
    await setMode($, 'discuss')
    return next(e)
  })
  on('command.run', { command: 'hms:plan' }, async ($, e, next) => {
    await setMode($, 'plan')
    return next(e)
  })
  on('command.run', { command: 'hms:build' }, async ($, e, next) => {
    await setMode($, 'build')
    return next(e)
  })

  // A build ends when the main conversation's reply closes with the marker.
  on('turn.complete', async ($, e, next) => {
    if (e.agentId === undefined && endsBuild(e.answer) && (await getMode($)) === 'build') {
      await setMode($, 'discuss')
    }
    return next(e)
  })
}
