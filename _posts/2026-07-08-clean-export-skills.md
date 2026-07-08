---
layout: post
title:  "The skill that keeps junk out of my commits"
date:   2026-07-08 08:35:00 +0100
tags: Skills Git Workflow
---

I've committed a .env by accident. Once is enough. Clean Export Skills is the guardrail I wrote so it doesn't happen again.

Before any git add or zip, it scans what's about to go in. Source files pass. Agent configs, plan files, AI rule files, stray markdown, secrets, those get stopped. It keeps a .exclude list so the decision is remembered, not re-argued every time. And it never runs `git add .`, which is where most accidents start.

When it hits a file it doesn't recognize, it doesn't guess. It flags the file and asks. That one habit has caught things I'd have committed on autopilot.

Zips get the same treatment. Real folder structure, project files only, nothing from the agent's workspace riding along.

It works with Claude Code, Cursor, Cline, Gemini and 40+ other agents.

```
npx skills add olakunlevpn/olakunlevpn-clean-export-skills
```

Repo: [olakunlevpn-clean-export-skills](https://github.com/olakunlevpn/olakunlevpn-clean-export-skills)
