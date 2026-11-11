// hold-my-spec (hms): meeting mode for Claude Code.
//
// Every conversation starts in a meeting: Claude talks and plans, does only quick actions, and
// puts anything long on a meeting to-do list. /hms:meeting-off ends the meeting and Claude works
// through the list; /hms:meeting-on starts a meeting again. The commands are markdown prompts in
// ../commands. This module:
// - keeps whether the conversation is in a meeting (per session, in $.state; none recorded means
//   a meeting);
// - while in a meeting, adds the meeting rules to the system prompt;
// - shows "meeting" or "working" in the status line;
// - stays out of the way entirely when nobody is at the prompt (a `claude -p` run, the SDK) or
//   HOLD_MY_SPEC_DISABLE=1 is set.
import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

const isWorking = atom({ plugin: 'hms', key: 'isWorking' } as const, false)
const isUnattended = atom({ plugin: 'hms', key: 'isUnattended' } as const, false)

/** The meeting rules Claude follows while in a meeting. */
export function meetingRules(thresholdSeconds: number): string {
  return [
    '# Meeting mode (hms)',
    '',
    'You are in a meeting with the user, as with a human colleague: talk and plan now, do the long work once the meeting is over.',
    `- Quick actions are fine: anything you estimate will take less than about ${thresholdSeconds} seconds, such as reading a file or a quick web request. No tool is banned outright.`,
    `- Don't start anything you estimate will take longer than that. Add it to the meeting to-do list instead, and say in one line that you have.`,
    '- Keep the to-do list in the conversation. Show it whenever the user asks, and change or remove items when they say so.',
    '- Only the user ends the meeting, with /hms:meeting-off. Don\'t read the list back unprompted.',
  ].join('\n')
}

/** Whether meeting mode is off for this run: nobody at the prompt, or switched off by the variable. */
async function isDisabled($: EngineInterface): Promise<boolean> {
  return (await read($, isUnattended)) || (await $.env.get('HOLD_MY_SPEC_DISABLE')) === '1'
}

async function setWorking($: EngineInterface, working: boolean): Promise<void> {
  await update($, isWorking, () => working)
  $.ui.status(working ? 'working' : 'meeting') // Claude Code labels it "hms:" itself
}

export const register: Register = (on, options) => {
  const thresholdSeconds = Number(options.thresholdSeconds ?? 60)

  on('session.start', async ($, e, next) => {
    await update($, isUnattended, () => !e.isInteractive)
    if (!(await isDisabled($))) {
      $.ui.status((await read($, isWorking)) ? 'working' : 'meeting')
    }
    return next(e)
  })

  on('command.run', { command: 'hms:meeting-on' }, async ($, e, next) => {
    if (!(await isDisabled($))) await setWorking($, false)
    return next(e)
  })
  on('command.run', { command: 'hms:meeting-off' }, async ($, e, next) => {
    if (!(await isDisabled($))) await setWorking($, true)
    return next(e)
  })

  // While in a meeting, the rules go last in the system prompt.
  on('prompt.compose', async ($, e, next) => {
    const result = await next(e)
    if ((await isDisabled($)) || (await read($, isWorking))) return result
    return {
      sections: [
        ...result.sections,
        { id: 'hms:meeting', text: meetingRules(thresholdSeconds), scope: 'session' as const },
      ],
    }
  })
}
