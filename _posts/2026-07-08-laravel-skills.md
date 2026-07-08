---
layout: post
title:  "My Laravel standards, written down so the agent follows them"
date:   2026-07-08 09:05:00 +0100
tags: Laravel PHP Standards
---

Every Laravel project drifts. One controller does too much, a model grows a tail of helper methods, validation ends up living in three places. I got tired of correcting the same things, so I put my standards in a skill and let the agent enforce them.

Laravel Coding Standards covers the parts that rot first: models, controllers, services, actions, traits, tests, config, exceptions, providers, package structure. These aren't opinions for their own sake. They're the conventions that keep a codebase readable at month six, when the person reading it isn't you.

The agent applies them while it writes, not after. So the review is shorter, because the code turns up already in the shape I'd have asked for.

It's built for production apps and packages, and it runs across the AI agents I use day to day.

```
npx skills add olakunlevpn/olakunlevpn-laravel-skills
```

Repo: [olakunlevpn-laravel-skills](https://github.com/olakunlevpn/olakunlevpn-laravel-skills)
