---
layout: post
title:  "Deploys I don't have to think about"
date:   2026-07-08 10:35:00 +0100
tags: Deployment Laravel DevOps
---

The scariest part of a small project is usually the deploy. A manual sequence, a step you forget, a site down while you try to remember it. Deployment Skills turns that into a script.

It generates the deploy scripts for Laravel and Inertia apps: pull, install, migrate, cache, restart, in the right order, with logging and error handling so a failure tells you where it stopped instead of leaving you guessing. It sets up the cron for auto-deploy too. The sequence gets written once and runs the same way every time.

Predictable beats clever here. I want deploys boring, and this makes them boring.

Runs across Claude Code, Cursor, Cline, Gemini and 40+ agents.

```
npx skills add olakunlevpn/olakunlevpn-deployment-skills
```

Repo: [olakunlevpn-deployment-skills](https://github.com/olakunlevpn/olakunlevpn-deployment-skills)
