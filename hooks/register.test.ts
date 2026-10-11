import { describe, expect, mock, test } from 'claude-code/testing'
import type { CommandRunInput, On } from 'claude-code'
import { editableWhilePlanning } from './register'

const ROOT = '/proj'

/** The world beneath the plugin: a project root, a store, and commands and tools that just succeed. */
function world(on: On) {
  const ran: string[] = []
  mock.store(on)
  on('session.root', () => ({ value: ROOT }))
  // Stands for the engine running a command's markdown prompt.
  on('command.run', ($, e) => {
    ran.push(e.command)
    return { text: '' }
  })
  on('tool.call', () => ({ text: 'done', result: undefined }))
  return { ran }
}

/** A slash command as the person types it. */
const typed = (command: string, args = ''): CommandRunInput => ({
  command,
  args,
  origin: { kind: 'composer' },
  presentation: { isFullscreen: false, columns: 80 },
})

const editCode = { tool: 'Edit', file_path: '/proj/app/main.ts', old_string: 'a', new_string: 'b' } as const
const editSpec = { tool: 'Edit', file_path: '/proj/spec/tasks.md', old_string: 'a', new_string: 'b' } as const

describe('editableWhilePlanning', () => {
  test('allows the spec, CLAUDE.md, README.md and anything outside the project', () => {
    expect(editableWhilePlanning(ROOT, '/proj/spec/tasks.md')).toBe(true)
    expect(editableWhilePlanning(ROOT, '/proj/CLAUDE.md')).toBe(true)
    expect(editableWhilePlanning(ROOT, '/proj/README.md')).toBe(true)
    expect(editableWhilePlanning(ROOT, '/tmp/scratch/try.ts')).toBe(true)
    expect(editableWhilePlanning(ROOT, 'spec/design.md')).toBe(true)
  })

  test('refuses everything else in the project', () => {
    expect(editableWhilePlanning(ROOT, '/proj/app/src/main.ts')).toBe(false)
    expect(editableWhilePlanning(ROOT, '/proj/specs/x.md')).toBe(false)
    expect(editableWhilePlanning(ROOT, '/proj/docs/CLAUDE.md')).toBe(false)
    expect(editableWhilePlanning('/pro', '/proj/app.ts')).toBe(true)
  })
})

describe('phases and the guard', () => {
  test('with no phase set, the guard leaves edits alone', async ($, on) => {
    world(on)
    expect((await $.tool.call(editCode)).deny).toBeUndefined()
  })

  test('/hms:planning runs its prompt and blocks code edits, not the spec', async ($, on) => {
    const { ran } = world(on)
    await $.command.run(typed('hms:planning', 'balances'))
    expect(ran).toEqual(['hms:planning'])
    expect((await $.tool.call(editCode)).deny).toContain('planning phase')
    expect((await $.tool.call(editSpec)).deny).toBeUndefined()
  })

  for (const command of ['hms:change', 'hms:tweak', 'hms:bug']) {
    test(`/${command} puts the project in planning`, async ($, on) => {
      world(on)
      await $.command.run(typed(command, 'something'))
      expect((await $.tool.call(editCode)).deny).toContain('planning phase')
    })
  }

  test('/hms:building lifts the guard', async ($, on) => {
    world(on)
    await $.command.run(typed('hms:planning'))
    await $.command.run(typed('hms:building', 'balances bug'))
    expect((await $.tool.call({ tool: 'Write', file_path: '/proj/app/main.ts', content: 'x' })).deny).toBeUndefined()
  })
})
