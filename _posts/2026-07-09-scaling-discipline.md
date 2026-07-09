---
layout: post
title:  "Ten rules for software that doesn't fall over"
date:   2026-07-09 10:00:00 +0100
tags: Architecture Scaling Skills
---

Most apps don't break because of a bug. They break because they grew, and the design never planned for it. The query that was fine with ten rows crawls at ten million. The email that sent inline now makes every user wait. The controller that did one job quietly took on five. I kept hitting the same failures across projects, so I wrote them down and turned them into an agent skill.

Scaling Discipline is ten principles for building systems that stay predictable under load. It's language-agnostic on purpose. A queue is a queue whether it runs on Redis, SQS or Kafka. An N+1 query is an N+1 query in any ORM. The rules hold in Node, Python, Go, PHP, Ruby, whatever you reach for.

The short version:

- **Dependencies aren't productivity.** Master patterns, not packages.
- **The data layer is a bottleneck, not a bucket.** Index, cache, kill N+1, profile before you guess.
- **Queues are oxygen.** If it can wait, make it async.
- **Events decouple logic.** Emit events, isolate side effects.
- **Telemetry is your radar.** Read the logs on a normal day, not during a fire.
- **Scalability isn't speed.** Fast is a snapshot. Scalable is consistency under load you didn't predict.
- **Design systems, not code.** Ask where a feature belongs before asking how to build it.
- **Mindset beats tools.** A bigger server postpones a design problem, it doesn't fix it.
- **Reuse before you build.** Check what already exists, follow DRY, and don't over-engineer the other way.
- **Verify.** Trust nothing, prove everything, and don't call it done below 0.9 confidence.

That last one is the whole point. Systems fail less from missing code than from a false belief that they're finished. So the skill makes the agent trace the real execution path and confirm every piece is wired before it signs off on anything.

It installs in one line and runs across Claude Code, Cursor, Gemini and 40+ other agents:

```
npx skills add olakunlevpn/olakunlevpn-scaling-discipline
```

You can't optimize your way to scale. You design for it, then you verify it.

Repo: [olakunlevpn-scaling-discipline](https://github.com/olakunlevpn/olakunlevpn-scaling-discipline)
