# Antigravity Carry-Over Kit — Orion Media

Everything Antigravity needs to pick up this project with full context.

## What is in here

```
.agents/rules/         Always-on context. Antigravity loads these automatically.
  01-orion-brand.md      Colors, typography, components, voice, business facts
  02-site-architecture.md  Stack, structure, and the things that must not break
  03-standards.md        Performance budget, SEO requirements, definition of done

.agents/workflows/     Slash commands you invoke by name
  fix-critical-bugs.md   -> /fix-critical-bugs
  optimize-images.md     -> /optimize-images
  new-city-page.md       -> /new-city-page

BACKLOG.md             The prioritized task list with measured baselines
```

## Install

1. Clone the site repo locally if you have not already, and open that folder as your
   workspace in Antigravity.
2. Copy the `.agents/` folder and `BACKLOG.md` from this kit into the **root of that repo**
   (the folder containing `index.html`).
3. Restart Antigravity, or open the Customizations panel to confirm the rules loaded.

Workspace rules live in `.agents/rules/` at the workspace or git root — that path is
documented. The `.agents/workflows/` location is my best inference and is **not**
explicitly documented; if the workflows do not appear as slash commands, open the
Customizations panel and paste each file's contents into a new workflow there. The
content is what matters, not the path.

Each rules and workflow file is capped at 12,000 characters by Antigravity. All files
here are well under that.

## A note on scope

Two items in the backlog are not code tasks and no agent can do them for you:

- **Directory listings.** The Knot, WeddingWire, and Zola own the wedding search results
  in Albany. Getting listed there will likely do more for wedding bookings than anything
  in the codebase.
- **The address mismatch.** Your BBB profile says Ballston Lake, your site says Cohoes.
  Fix that in the directories themselves.

## Suggested first session

```
/fix-critical-bugs
```

Then `/optimize-images`. Those two cover the highest-value work in the audit.

---

Generated 31 August 2026 alongside the full site audit
(`Orion Media - Website Audit - Aug 2026.pdf`, one folder up).
