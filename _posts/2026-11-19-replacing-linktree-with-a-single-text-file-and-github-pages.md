---
layout: post
title:  "Replacing Linktree with a single text file and GitHub Pages"
date:   2026-11-19 12:00:00 +0100
tags: WebDev OpenSource JavaScript GitHubPages Tooling
---

Paying ten dollars every month to show a short list of links on your bio is absurd. It shouldn't cost you a dime.

Platforms like Linktree and Beacons charge you ongoing fees for what's fundamentally an HTML unordered list. In return, they inject tracking scripts, cookie banners, and their company logo at the bottom of your profile unless you're on their priciest tier. If they decide to change their terms, raise their rates, or suspend your account, you'll watch your links vanish overnight.

Engineers usually respond by overcorrecting. They'll spin up an entire Next.js project, spend half a week tuning Tailwind configs, and set up Docker containers for six URLs. That works fine until you need to update a link from your phone while walking between meetings. Nobody wants to clone a repo, edit a JSX component, resolve merge conflicts, and wait for a heavy bundle build just because they're swapping an Instagram handle for a newsletter link.

I wanted something clean that sits right in the middle. One text file. Zero monthly bills. No tracking bloat. And an edit workflow that doesn't take more than ten seconds from any phone or browser.

That's why I built [linkprofile](https://github.com/olakunlevpn/linkprofile) (now published on [npm](https://www.npmjs.com/package/linkprofile)) and paired it with a click-to-deploy template called [linkprofile-starter](https://github.com/olakunlevpn/linkprofile-starter).

### One Text File to Rule Your Profile

Your entire page lives inside a single configuration file named `profile.hjson`. That's the whole setup.

Standard JSON isn't fun to write by hand. Forget one trailing comma or leave out a double quote on a key, and the parser crashes. YAML isn't much better with its invisible indentation traps.

Hjson solves both problems. It lets you write comments wherever you want, skips quotes around ordinary strings and keys, and doesn't care about trailing commas.

Here's what a complete `profile.hjson` looks like:

```hjson
name: Olakunlevpn
bio: Software engineer building tools for the web.
avatar: images/avatar.png
theme: classic

links: [
  {
    title: Latest technical articles
    url: https://olakunlevpn.github.io
    icon: globe
  }
  {
    title: Linkprofile on GitHub
    url: https://github.com/olakunlevpn/linkprofile
    icon: github
  }
  {
    title: Get the starter template
    url: https://github.com/olakunlevpn/linkprofile-starter
    icon: layout-grid
  }
]

socials: [
  { type: github, url: https://github.com/olakunlevpn }
  { type: twitter, url: https://twitter.com/oxkunle }
  { type: linkedin, url: https://www.linkedin.com/in/olakunlevpn/ }
  { type: email, url: mailto:olakunle@maylancer.org }
]
```

Everything stays readable. When you're ready to reorder links, you cut and paste two lines. That's it.

### Zero Install Workflow with GitHub Actions

Most static site generators require Node installed on your machine, package managers, and a terminal prompt. That leaves out anyone who doesn't want to wrestle with developer tooling just to share their links.

With the [linkprofile-starter](https://github.com/olakunlevpn/linkprofile-starter) repository, you won't install a single thing.

Open the starter repo on GitHub and click **Use this template**. That'll create your personal copy under your GitHub account. Inside your new repository, head to **Settings**, open the **Pages** menu, and select **GitHub Actions** as the build source.

From that moment on, whenever you're adding or changing a link, you click `profile.hjson` right inside the github.com web editor, press the pencil icon, make your edits, and hit commit. A GitHub Actions runner picks up the commit, compiles your static HTML and CSS in thirty seconds, and deploys it straight to GitHub Pages.

If you make a typo in your file, the build step won't leave you guessing with cryptic stack traces. The validator checks your file, flags the exact line, and prints a clear sentence telling you what's wrong and how to fix it.

### Five Built-in Themes

A personal link page shouldn't look like generic cards from a decade ago. Linkprofile comes with five distinct looks out of the box:

- `classic`: Clean rounded cards when you don't want any visual fuss, plus a light and dark mode toggle.
- `bento`: Frosted translucent tiles in an asymmetrical grid so your links don't look like a standard list.
- `cover`: A bold top banner that'll overlap your portrait photo.
- `crimson`: Dark charcoal canvas with scarlet accents when you're after high contrast.
- `editorial`: Warm gradient backgrounds paired with serif typography that doesn't feel like a template.

Switching looks doesn't take more than one word in `profile.hjson`:

```hjson
theme: bento
```

You can customize accent colors with any hex code, set light or dark preference, and control whether visitors see an interactive theme toggle. You're never boxed into rigid defaults.

### Built-in Icons Without the Weight

Most bio tools load massive font icon libraries or heavy SVG bundles that tank your mobile load speed. You shouldn't need a megabyte of icon fonts just to show a GitHub cat and a mail envelope.

Linkprofile pulls icons from Simple Icons for social platforms and Lucide Icons for general navigation. But instead of shipping an entire icon library over the wire, the compiler extracts only the specific SVGs you've declared in your file and inlines them directly into the output HTML.

If you specify `icon: github`, the engine embeds that single SVG symbol. There isn't any extra junk traveling down the wire.

### A Local CLI for Developers

If you'd rather work on your local machine, the npm package gives you a command line workflow that's ready in seconds:

```bash
npx linkprofile init
```

That creates your starter `profile.hjson` and a placeholder avatar in whatever folder you're in.

When you'd like to see your changes live in a local browser:

```bash
npx linkprofile preview
```

This starts a local development server on port 4000. Every time you save `profile.hjson`, the page reloads automatically in your browser. When you're ready for static deployment to your own server or S3 bucket, run:

```bash
npx linkprofile build
```

The output compiles into clean static files inside `dist/`. There's no client runtime, no JavaScript hydration step, and zero third-party dependencies loaded at runtime.

### Custom Domains on Free Hosting

GitHub Pages gives you free hosting on `yourname.github.io/links`. It's fast, free, and backed by a global CDN.

If you want your own branded address like `links.yourdomain.com`, you'll enter it into the Custom Domain box in your repository settings and tick the Enforce HTTPS option. GitHub provisions a free Let's Encrypt SSL certificate automatically.

You get fast load times, your own domain name, total data ownership, and you aren't paying a single cent in recurring fees.

### Getting Started

You're welcome to inspect the source code, open issues, or contribute on GitHub:
- Core package: [olakunlevpn/linkprofile](https://github.com/olakunlevpn/linkprofile)
- Starter template: [olakunlevpn/linkprofile-starter](https://github.com/olakunlevpn/linkprofile-starter)
- Package registry: [linkprofile on npm](https://www.npmjs.com/package/linkprofile)
- Full documentation and theme gallery: [Linkprofile Docs](https://olakunlevpn.github.io/linkprofile/docs/)

Pick a theme, add your links, and don't pay rent for an unordered list.
