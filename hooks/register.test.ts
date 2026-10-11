import { describe, expect, mock, test } from 'claude-code/testing'
import type { CommandRunInput, On, TurnCompleteInput } from 'claude-code'
import { endsBuild } from './register'

const ROOT = '/proj'

/** The world beneath the plugin: a project root, a store, a status line, and commands that just run. */
function world(on: On) {
  const status: (string | undefined)[] = []
  mock.store(on)
  on('session.root', () => ({ value: ROOT }))
  on('ui.status', ($, e) => {
    status.push(e.text)
    return { value: undefined }
  })
  // Stands for the engine running a command's markdown prompt.
  on('command.run', () => ({ text: '' }))
  // Stands for the engine finishing a turn with its reply.
  on('turn.complete', ($, e) => ({ text: e.answer }))
  return { status }
}

/** A slash command as the person types it. */
const typed = (command: string, args = ''): CommandRunInput => ({
  command,
  args,
  origin: { kind: 'composer' },
  presentation: { isFullscreen: false, columns: 80 },
})

/** A turn's final reply, from the main conversation unless a subagent is named. */
const turn = (answer: string, agentId?: string): TurnCompleteInput => ({
  answer,
  agentId,
  durationMs: 0,
  isAborted: false,
  turnId: 'turn-1',
  reason: 'answer',
})

describe('endsBuild', () => {
  test('a reply whose last line is the marker ends the build', () => {
    expect(endsBuild('Built the error report.\n\nhms: build complete')).toBe(true)
    expect(endsBuild('Blocked on the deploy token.\nhms: build stopped\n')).toBe(true)
  })

  test('anything else does not', () => {
    expect(endsBuild('Which name do you prefer?')).toBe(false)
    expect(endsBuild('hms: build complete\nOne more thing: …')).toBe(false)
    expect(endsBuild('')).toBe(false)
  })
})

describe('modes', () => {
  test('each command records its mode and shows it in the status line', async ($, on) => {
    const { status } = world(on)
    await $.command.run(typed('hms:plan', 'the error report'))
    await $.command.run(typed('hms:build'))
    await $.command.run(typed('hms:discuss'))
    // Claude Code already labels a plugin's status line with its name, so the text is the mode alone.
    expect(status).toEqual(['plan', 'build', 'discuss'])
  })

  test("a build returns to discuss on the main conversation's marker, not a subagent's", async ($, on) => {
    const { status } = world(on)
    await $.command.run(typed('hms:build'))
    await $.turn.complete(turn('Which name do you prefer?'))
    await $.turn.complete(turn('Done.\nhms: build complete', 'agent-1'))
    expect(status).toEqual(['build'])
    await $.turn.complete(turn('Built the error report.\n\nhms: build complete'))
    expect(status).toEqual(['build', 'discuss'])
  })
})
