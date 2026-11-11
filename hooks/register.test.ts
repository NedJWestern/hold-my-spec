import { describe, expect, mock, test } from 'claude-code/testing'
import type { CommandRunInput, EngineInterface, On, PromptComposeInput } from 'claude-code'
import { meetingRules } from './register'

/** The world beneath the plugin: an environment, a status line, a system prompt, and commands that just run. */
function world(on: On, env: Record<string, string> = {}) {
  const status: (string | undefined)[] = []
  mock.env(on, env)
  on('ui.status', ($, e) => {
    status.push(e.text)
    return { value: undefined }
  })
  // Stands for the engine running a command's markdown prompt.
  on('command.run', () => ({ text: '' }))
  // Stands for the engine's own system prompt.
  on('prompt.compose', () => ({ sections: [{ id: 'intro', text: 'You are Claude Code.', scope: 'shared' }] }))
  return { status }
}

/** A slash command as the person types it. */
const typed = (command: string, args = ''): CommandRunInput => ({
  command,
  args,
  origin: { kind: 'composer' },
  presentation: { isFullscreen: false, columns: 80 },
})

/** A system prompt render, as the engine asks for one. */
const COMPOSE: PromptComposeInput = {
  model: 'claude-opus-5-5',
  promptModel: 'claude-opus-5-5',
  surfaces: ['terminal'],
  tools: [],
  outputStyle: null,
  traits: [],
}

/** The ids of the system prompt's sections as composed now. */
async function sectionIds($: EngineInterface): Promise<string[]> {
  const { sections } = await $.prompt.compose(COMPOSE)
  return sections.map((s) => s.id)
}

describe('meetingRules', () => {
  test('names the threshold and the command that ends the meeting', () => {
    const rules = meetingRules(90)
    expect(rules).toContain('90 seconds')
    expect(rules).toContain('/hms:meeting-off')
  })
})

describe('meeting mode', () => {
  test('a conversation starts in a meeting, with the rules in the system prompt', async ($, on) => {
    world(on)
    expect(await sectionIds($)).toEqual(['intro', 'hms:meeting'])
  })

  test('meeting-off drops the rules, meeting-on brings them back, and the status line follows', async ($, on) => {
    const { status } = world(on)
    await $.command.run(typed('hms:meeting-off'))
    expect(await sectionIds($)).toEqual(['intro'])
    await $.command.run(typed('hms:meeting-on'))
    expect(await sectionIds($)).toEqual(['intro', 'hms:meeting'])
    // Claude Code already labels a plugin's status line with its name, so the text is the state alone.
    expect(status).toEqual(['working', 'meeting'])
  })

  test('the threshold setting reaches the rules', { options: { thresholdSeconds: 30 } }, async ($, on) => {
    world(on)
    const { sections } = await $.prompt.compose(COMPOSE)
    expect(sections.at(-1)?.text).toContain('30 seconds')
  })

  test('HOLD_MY_SPEC_DISABLE=1 turns meeting mode off entirely', async ($, on) => {
    const { status } = world(on, { HOLD_MY_SPEC_DISABLE: '1' })
    expect(await sectionIds($)).toEqual(['intro'])
    await $.command.run(typed('hms:meeting-on'))
    expect(await sectionIds($)).toEqual(['intro'])
    expect(status).toEqual([])
  })
})
