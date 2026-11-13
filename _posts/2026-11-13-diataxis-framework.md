---
layout: post
title:  "Why technical documentation turns terrible and how to fix it"
date:   2026-11-13 21:10:00 +0100
tags: Documentation Architecture Skills
---

Most bad documentation isn't written by lazy engineers. It happens when someone tries to serve four different user needs in a single document.

You sit down to write a setup guide. You write step one. Halfway through, you pause to explain why the database architecture works that way. Then you drop in three alternative configuration flags someone might need later. By paragraph four, the beginner is lost, the experienced engineer looking for a method name is scrolling past wall after wall of text, and nobody learned the architecture anyway.

When different forms of documentation blur together, every single form gets worse.

Daniele Procida solved this problem with the Diataxis framework. It organizes documentation around two clear axes:
- Action (doing) versus Cognition (thinking)
- Acquisition (learning) versus Application (working)

That gives you four distinct quadrants. Each one serves one person in one mode:

1. **Tutorials are lessons.** You take a learner by the hand through a practical exercise. Pick one path, hide options, and guarantee success. You're teaching someone how to cook.
2. **How-to guides solve real problems.** The user already knows the basics and wants to get work done. A recipe in a cookbook.
3. **Reference describes the machinery.** Class names, arguments, return types, flags. Neutral, austere, complete. The nutrition label on the back of a box.
4. **Explanation discusses why.** Design decisions, context, tradeoffs, history. Read away from the keyboard.

The core rule is strict. Each piece of documentation serves exactly one need. Keep them apart and link between them. When your reference doc starts debating architecture, yank that paragraph out and link to an explanation page. When your tutorial offers three different ways to install a dependency, delete two of them.

I packaged this into an agent skill so AI coding agents actually follow these boundaries when writing, restructuring, or reviewing docs.

It includes one killer parameter: `--sudo`.

When you pass `--sudo`, the agent is banned from using pseudocode, placeholders, or hand-waving. No `// TODO: add logic here`. No `something like this`. Every code snippet must compile and run as written. If the doc claims a request retries three times, the Python or PHP code must configure those three retries with real library calls.

It installs in one line across Claude Code, Cursor, Cline, Gemini CLI and 40+ other AI agents:

```
npx skills add olakunlevpn/olakunlevpn-diataxis-framework
```

Write tutorials for the learner. Write recipes for the worker. Keep reference dry. Explain the why in the open.

Stop mixing them up.

Repo: [olakunlevpn-diataxis-framework](https://github.com/olakunlevpn/olakunlevpn-diataxis-framework)
