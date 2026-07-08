---
layout: post
title:  "One skill that gates done on evidence"
date:   2026-07-08 13:05:00 +0100
tags: Verification Skills Workflow
---

I had two skills that belonged together. One enumerates what a build is supposed to do and audits it from seven angles. One proves a claim against real code before anyone touches it. Meta-Verify runs them as a single loop.

Phase one builds the checklist and audits it. Phase two takes each item and proves it. A pass with no trace to code gets downgraded to unverified. A failure becomes a real investigation with an evidence ledger, not a guess. The run ends in a report with a confidence score, and any item still unproven means the verdict is not done.

It's the shortest honest answer to "is this finished?" Enumerate, prove each item, report. Nothing ships on assumption.

```
npx skills add olakunlevpn/olakunlevpn-meta-verify
```

Repo: [olakunlevpn-meta-verify](https://github.com/olakunlevpn/olakunlevpn-meta-verify)
