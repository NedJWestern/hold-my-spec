import { describe, expect, mock, test } from 'claude-code/testing'
import type { CommandRunInput, On } from 'claude-code'
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
  return { status }
}

/** A slash command as the person types it. */
const typed = (command: string, args = ''): CommandRunInput => ({
  command,
  args,
  origin: { kind: 'composer' },
  presentation: { isFullscreen: false, columns: 80 },
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
    expect(status).toEqual(['hms: plan', 'hms: build', 'hms: discuss'])
  })
})
