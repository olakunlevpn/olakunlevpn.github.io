---
layout: post
title:  "Make every docs page sound like one author"
date:   2026-08-16 10:00:00 +0100
tags: Documentation Writing Skills
---

Open a docs site written by six people and you feel it before you can name it. One page opens with a chatty rhetorical question. The next drops a wall of abstract nouns on you. Code blocks show up cold, with no sentence telling you what you're about to read. Half the caveats are yellow boxes, half are red, and they all wear a different little icon. Nothing's wrong exactly. It just reads like a committee wrote it, and you stop trusting the page.

Docs Writing is an agent skill that fixes that. It holds the agent to one structure and one voice, so every page reads like the same careful person wrote it. It came out of reading a pile of well-run package docs and writing down what they actually do, page after page, with almost no deviation.

Here's the rule that never breaks. Every code block gets exactly one sentence before it, and that sentence ends in a colon. Never a bare block. Never three paragraphs of setup first. On an intro page that sentence invites you in ("Here's a quick example:"). On a reference page it states a requirement ("To associate media with a model, the model must implement this interface:"). Same rule, different warmth.

That warmth split is the part most people miss. Tone isn't uniform across a good docs site, and it doesn't change by topic. It changes by depth. Intro pages use contractions and the occasional rhetorical question. Reference pages go full forms only and flat imperative instructions. No questions. The reader who's three pages deep wants the fact, not the small talk.

A few more things it pins down:

- One fixed page skeleton. Name, a one-line capability statement under ten words, an intro, an anchor list, then one concept per section in reading order. Order does the sequencing, so no numbered steps.
- Short sentences that state a fact and then unpack it in the next one. Nothing runs past about 25 words. "This package does X" is the workhorse opener.
- Caveats are sentences, not boxes. Name the edge case, state the consequence, link to the page that covers it in full. No colored admonition block, no warning icon.
- A shared phrase bank for installs, optional steps, and cross-references, so the whole site sounds like one hand wrote it instead of ten.

There's a list of things it refuses to write, too. No "furthermore" or "moreover". No "leverage", no "seamless". No marketing superlative standing in for a real capability statement. No single sentence hauling four subordinate clauses on its back.

It covers how the docs read, not how the code reads. The language skills handle the code. This one just makes sure a reader moving through your docs never trips over a change in voice.

Installs in one line, works across Claude Code, Cursor, Gemini and 40+ other agents:

```
npx skills add olakunlevpn/maylancer-docs-writing
```

Write every page like one person wrote the whole site. That's the job.

Repo: [maylancer-docs-writing](https://github.com/olakunlevpn/maylancer-docs-writing)
