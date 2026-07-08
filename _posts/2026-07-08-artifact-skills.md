---
layout: post
title:  "Making AI output read like a real document"
date:   2026-07-08 08:05:00 +0100
tags: Skills Design HTML
---

Ask an AI for a status report or a plan and you usually get a wall of markdown. Fine to read, ugly to share. I wanted the output to look like something a person laid out, so I built a small CSS library and a set of agent skills around it.

That's Artifact Skills. A light stylesheet plus skills that tell the agent how to use it: reports, plans, reviews, explainers, diagrams, slide decks. The agent writes one self-contained HTML file with a real color system, real typography, and components that fit together. No framework, no build step, no calls out to a CDN.

The point isn't decoration. A plan with a proper risk table and a milestone list gets read differently than the same words in a flat bullet dump. Structure carries meaning. When the artifact looks finished, people treat the thinking behind it as finished too.

It runs across Claude Code, Cursor, Cline, Gemini and the other agents that read skills, so I'm not rewriting the same styling notes in every tool.

```
npx skills add olakunlevpn/olakunlevpn-artifact-skills
```

Repo: [olakunlevpn-artifact-skills](https://github.com/olakunlevpn/olakunlevpn-artifact-skills)
