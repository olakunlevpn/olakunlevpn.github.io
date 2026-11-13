---
layout: post
title:  "Six skills so your features actually connect"
date:   2026-11-13 21:30:00 +0100
tags: Architecture Testing Workflow Skills
---

Most broken features do not fail in the backend or the frontend. They die at the seam.

A button bound to an empty handler. A controller sending snake_case while the component reads camelCase. A job queued with no worker. An error path nobody designed, so a network drop leaves the user staring at a frozen screen. Both files review clean. The feature is dead.

I got tired of watching AI agents write plausible code on both sides of a request and still ship a broken feature. You ask "is this wired?" and the agent skims both files, sees reasonable code, and says yes. It never wrote down the list of connections, so it never noticed the link that was missing. You cannot see the absence of something you never listed.

So I built and published six new agent skills to guard each phase of the feature lifecycle.

### 1. Interaction Map

Design before you code. This skill writes three complete lists to a spec file before either side is built: every user step with all six states decided (idle, loading, success, empty, error, forbidden), the full server chain, and the seam contract between them.

A state nobody designed becomes a blank screen in production. This skill forces you to decide it when it costs nothing.

```
npx skills add olakunlevpn/olakunlevpn-interaction-map
```

Repo: [olakunlevpn-interaction-map](https://github.com/olakunlevpn/olakunlevpn-interaction-map)

### 2. Seam Contract

Two people write the same shape twice and the copies drift. Seam Contract fixes that by establishing one source of truth for the wire shape and deriving both sides from it.

Then it runs a duplication scan to prove no hand-written mirror survives. If you rename a field in the source, the typecheck fails on both ends. A field mismatch turns into a compile error instead of an afternoon of debugging undefined.

```
npx skills add olakunlevpn/olakunlevpn-seam-contract
```

Repo: [olakunlevpn-seam-contract](https://github.com/olakunlevpn/olakunlevpn-seam-contract)

### 3. Flow Check

Map the flow, then prove every link. This skill audits a built feature end to end. It writes out the interaction flow and the server hops into a seam table, then walks every link with thirteen mandatory checks.

Evidence means a file path and a line number, not "looks fine." It also runs a contamination scan for TODOs and debug leftovers, plus an execution gate with real commands and raw output pasted into the report.

```
npx skills add olakunlevpn/olakunlevpn-flow-check
```

Repo: [olakunlevpn-flow-check](https://github.com/olakunlevpn/olakunlevpn-flow-check)

### 4. Flow Soundness

A flow that worked once will break during the next refactor unless tests lock it in. Flow Soundness turns a working flow into committed tests, one per interaction, covering the happy path, every error branch, every state, and every actor.

The trick is proving the tests actually work. The skill breaks each link on purpose and watches the test turn red. A test that survives its own mutation gets rewritten.

```
npx skills add olakunlevpn/olakunlevpn-flow-soundness
```

Repo: [olakunlevpn-flow-soundness](https://github.com/olakunlevpn/olakunlevpn-flow-soundness)

### 5. Safe Bug Fix

Telling an agent to "be careful" when fixing a bug changes nothing. Safe Bug Fix forces an evidence-based search of every caller before a single file gets touched.

Five strict steps: reproduce the failure, map every dependent call site, choose whether the fix is universal or isolated, make the smallest possible diff, and prove the fix with tests. Zero drive-by cleanups allowed.

```
npx skills add olakunlevpn/olakunlevpn-safe-bug-fix
```

Repo: [olakunlevpn-safe-bug-fix](https://github.com/olakunlevpn/olakunlevpn-safe-bug-fix)

### 6. Diataxis Framework

Good documentation fails when different user needs get mixed together. A tutorial that starts explaining theory loses the learner; a reference doc full of recipes annoys the person looking for a flag.

This skill applies the Diátaxis framework to separate tutorials, how-to guides, reference, and explanation. It includes a `--sudo` flag that requires working, verified code in every section.

```
npx skills add olakunlevpn/olakunlevpn-diataxis-framework
```

Repo: [olakunlevpn-diataxis-framework](https://github.com/olakunlevpn/olakunlevpn-diataxis-framework)

---

They work across Claude Code, Cursor, Cline, Gemini CLI and 40+ other coding agents.

Features break when assumptions replace proof. These skills put the proof back in.
