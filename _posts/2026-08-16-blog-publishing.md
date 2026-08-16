---
layout: post
title:  "A runbook so I stop breaking my own blog"
date:   2026-08-16 12:00:00 +0100
tags: Automation Workflow Skills
---

Publishing a post here is easy right up until you forget one small thing. The branch is master, not main, so a push to main runs clean and changes nothing. The commit has to land under the right name, and the account I push with keeps resetting to the wrong one. Post-date it by accident and the page just never shows up. Every one of those has bitten me, and not one of them throws an error.

So I wrote the whole thing down as a skill. Blog Publishing is a runbook the agent follows end to end. Clone the repo, write the post, humanize it, commit under the right identity, switch accounts, push to the right branch, wait for the build, then check the post is actually live. No step left to memory.

The point isn't the steps I already know. It's the session that doesn't. Lose the chat that learned all this and the next one starts from zero, guessing at the branch name and the account and wondering why the post returns a 404. The runbook hands that context over cold.

What it pins down:

- The repo, the engine, and the branch. Master, in bold, so nobody pushes main again.
- The front-matter template and the tag format, so the post parses and sorts by date.
- The prose check. It runs the human-writing rules over the draft and fails on em-dashes and filler before anything ships.
- The commit identity, and a hard no on AI attribution.
- The account switch before the push, and back again after.
- The build poll and a live check, because "it pushed" and "it's live" are not the same sentence.

There's a checklist at the bottom that has to come back all green. Post named right. Prose clean. One commit, pushed to master under the right account, build finished, URL returns 200, account put back where it was. If a single line fails, the job isn't done yet.

It won't run without three other skills. Human-writing handles the voice. Clean-export keeps junk out of git, and the git standards shape the commit message. The runbook names all three up front so a fresh agent loads them before it touches anything.

Installs in one line, works across Claude Code, Cursor, Gemini and 40+ other agents:

```
npx skills add olakunlevpn/olakunlevpn-blog-publishing
```

Now the process outlives the chat that figured it out. That's the whole reason it exists.

Repo: [olakunlevpn-blog-publishing](https://github.com/olakunlevpn/olakunlevpn-blog-publishing)
