---
layout: post
title:  "Stop fixing bugs straight on the server"
date:   2026-07-10 10:00:00 +0100
tags: Workflow Deployment Skills
---

Everyone's done it. Production goes down, you SSH into the box, edit the file, the site comes back, and you move on. It worked. That's the trap. A fix that lives only on a server is already scheduled for deletion. The next deploy overwrites it, the bug comes back, and nobody remembers why it was ever fine. Or worse, the server drifts so far from the repo that you can't reproduce anything locally anymore.

Local Source of Truth is a small agent skill that closes that door. One idea, five rules. The local development workspace is the only place permanent code lives. The server runs that code. It doesn't get to author it.

The short version:

- **The local workspace is canonical.** If a change isn't in the repo, it doesn't exist. It's a liability waiting for the next deploy to wipe it.
- **Servers verify, they don't author.** Read the logs, reproduce the bug. Fine. Editing app code on the box and leaving it there? No.
- **Permanent changes go through the pipeline.** Ship the way the project ships. Git, a build step, a version bump, a zip upload. No side doors.
- **Temporary diagnostics are fine, permanent hacks aren't.** A scratch script to inspect state is fair game while you're digging. Tear it down when you're done.
- **No permanent server-side hacks. Ever.** The running server always traces back to a commit you can name.

There's an escape hatch for the 2am outage, because sometimes the fix has to land right now. It's a bridge, not a fix. Patch the server to stop the bleeding, write down exactly what you changed, fix it properly in the local workspace the same day, redeploy, then revert the manual change so the box matches the repo again. A live patch that never makes it back to the repo isn't a fix. It's a landmine with your name on it.

One line to install, and it runs across Claude Code, Cursor, Gemini and 40+ other agents:

```
npx skills add olakunlevpn/olakunlevpn-local-source-of-truth
```

The server runs your code. It doesn't write it.

Repo: [olakunlevpn-local-source-of-truth](https://github.com/olakunlevpn/olakunlevpn-local-source-of-truth)
