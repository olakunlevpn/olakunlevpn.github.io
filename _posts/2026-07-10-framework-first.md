---
layout: post
title:  "Write code the framework would've written"
date:   2026-07-10 11:00:00 +0100
tags: Architecture Conventions Skills
---

You can usually tell when someone brought a habit from their last framework. There's a hand-rolled router sitting next to the built-in one. Business logic lands in a spot the framework never puts it, so nobody thinks to look there. A library does a job the framework already ships a tool for. None of it is broken on day one. All of it is foreign, and the next person to read it pays for that.

Framework First is an agent skill that keeps code native to whatever it's built on. Laravel, XenForo, Django, Rails, WordPress, Spring, doesn't matter. Every framework has a grain. You work with it, not against it.

Six rules:

- **Identify the framework and version first.** Idioms shift between versions. You can't follow conventions you haven't pinned down.
- **Follow its conventions and architecture exactly.** Put logic where the framework expects it. Use its generators. Conventions are shared memory, and breaking them makes everyone relearn your corner of the codebase.
- **Native solutions first.** Most frameworks already ship an ORM, a router, validation, queues, auth. Reach for a dependency only when there's genuinely no native answer.
- **Stay consistent with the project.** Match the code that's already there, not the code you'd write from scratch. Consistency beats your personal taste.
- **Never mix in patterns from other frameworks.** The way Rails does a thing isn't how Laravel does it. Don't carry one framework's habits into another.
- **Aim for code a senior of that framework would recognize.** Boring and idiomatic beats clever and foreign every time.

There's one test the skill runs every change through. Would an experienced developer of this exact framework, at this version, read it and think "yeah, that's how you do it here"? If they'd pause or ask why, it isn't idiomatic yet. Fix it before it becomes the pattern the next person copies.

The security angle matters too. Use the framework's own escaping, its CSRF protection, its query builder, its auth guards. Rolling your own around a framework that already solved the problem is how holes get in.

Installs in one line, works across Claude Code, Cursor, Gemini and 40+ other agents:

```
npx skills add olakunlevpn/olakunlevpn-framework-first
```

Write code that looks like the framework wrote it. That's the whole job.

Repo: [olakunlevpn-framework-first](https://github.com/olakunlevpn/olakunlevpn-framework-first)
