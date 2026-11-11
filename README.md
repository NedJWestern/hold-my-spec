<p align="center">
  <img src="assets/hms.jpg" alt="HMS Hold My Spec, a tall ship under full sail in a storm" width="200">
</p>

# hold my spec

A Claude Code plugin that adds **meeting mode**, so you know whether your next message gets a quick reply or starts a long task. It works like a meeting with a colleague: you talk and plan first, and the long work starts only once the meeting is over.

## Install

```
/plugin install hms --marketplace NedJWestern/hold-my-spec
```

Answer `y` to add the marketplace, then pick a scope.

## How a meeting works

- **Every new conversation starts in a meeting.**
- **Quick actions are allowed.** During a meeting Claude may do anything it estimates will take less than the threshold (60 seconds by default), such as reading a file or making a quick web request. No tool is banned outright.
- **Long actions are deferred.** Claude doesn't start anything it estimates will take longer. It adds it to the meeting to-do list instead.
- **These are estimates, not enforcement.** Claude judges the duration itself, and nothing times it out.
- **You review the to-do list during the meeting.** Ask to see it, change items, or tell Claude to drop them. Claude doesn't read the list back when the meeting ends.

The status line shows `hms: meeting` or `hms: working`.

## Commands

| Command | What it does |
|---|---|
| `/hms:meeting-off [anything]` | Ends the meeting. Claude works through the to-do list in order. If an item needs a question answered, Claude parks it and carries on, then asks all the parked questions together at the end. |
| `/hms:meeting-on [anything]` | Starts a meeting again, for example after `/hms:meeting-off`. |

Only you can run these commands; Claude can't end a meeting by itself.

## Settings

| Setting | Default | Where |
|---|---|---|
| Quick-action threshold (seconds) | 60 | `/config`, under the hms plugin (`thresholdSeconds`) |
| Turn meeting mode off | off | Environment variable `HOLD_MY_SPEC_DISABLE=1` |

Scripts, scheduled jobs and other runs with nobody present should set `HOLD_MY_SPEC_DISABLE=1`, or they would wait forever for a meeting to end.

## How it works

The commands are markdown prompts in `commands/`. A small hooks module (`hooks/register.ts`) keeps track of whether the conversation is in a meeting. During a meeting it adds the meeting rules to the system prompt, and it updates the status line. The to-do list lives in the conversation; nothing is written to your repo.

## Open questions

- When an old conversation is resumed, should it go back to a meeting or keep its previous state?
- Should a hard timeout be added if Claude's estimates prove unreliable?
- Should the to-do list live in the conversation only (as now) or in a file in the repo?

## Developing

```
claude plugin validate .
claude plugin test .
```

## License

MIT, see [LICENSE](LICENSE).
