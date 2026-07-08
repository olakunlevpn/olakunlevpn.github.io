---
layout: post
title:  "Prove the bug before you touch the code"
date:   2026-07-08 12:35:00 +0100
tags: Debugging Skills Discipline
---

Most bad fixes come from the same move. See a symptom, change something nearby, hope. Root-Cause Discipline stops that move cold.

Before any edit, it makes the agent earn the right to edit. Understand what the code is supposed to do. Reproduce the failure. Trace the symptom to the exact line and prove the mechanism, not a hunch about it. Map every caller and consumer the change could touch. Then, and only then, make the smallest change that kills the cause. All of it goes into an evidence ledger, and a confidence gate blocks the edit until the proof holds. Under threshold, it stops and asks instead of guessing.

I built this because a fix aimed at a symptom doesn't remove a bug. It relocates it. This is the "before the change" half of my workflow, and it hands off to the verification skill once the fix is in.

```
npx skills add olakunlevpn/olakunlevpn-root-cause-skills
```

Repo: [olakunlevpn-root-cause-skills](https://github.com/olakunlevpn/olakunlevpn-root-cause-skills)
