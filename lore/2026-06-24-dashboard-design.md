---
date: 2026-06-24
title: Astro dashboard design decisions
areas: [dashboard]
topics: [astro, frontend, architecture, data-model, cloudflare-pages]
stories: []
status: active
supersedes:
superseded-by:
superseded-date:
---

## Summary

Designed a static Astro 5 dashboard (`dashboard/`) that visualises a project's `discussions/` directory. Users fork this repo, commit their discussions content directly, and deploy to Cloudflare Pages or run locally. All design decisions were resolved in a structured interview session.

## Decisions / outcomes

- One deployment per project; users fork the whole repo and commit `discussions/` directly — no symlink, no submodule
- Astro 5 static output; vanilla CSS with custom properties (light + dark via `prefers-color-scheme`); vanilla JS + data attributes for client-side filtering; one 640px breakpoint
- Two Astro content collections: `log` (`discussions/log/*.md`) and `questions` (`discussions/questions/*.md`); question files are individual `Q-NNN.md` with YAML frontmatter
- Five pages: home (last 5 current entries + open questions), log list (filterable), entry detail (with supersession banner), questions (open/resolved tabs), tags (stacked sections with counts)
- Filter controls on log list: area dropdown + topic dropdown + "Show superseded" toggle (off by default) + text search; AND logic; URL params pre-set filters from tag page links
- Entry cards: two-line layout (title + date/chip row); entries sorted by date desc, questions by ID desc
- Site title from `dashboard/config.ts` with `"Discussion Log"` fallback; nav: Log · Questions · Tags; no footer or sidebar
- Tags page counts exclude superseded entries; tag clicks navigate to `/log?area=...` or `/log?topic=...`

## Why

Static output keeps the dashboard free on CF Pages with no runtime cost. Vanilla JS avoids framework overhead for what is a small filtered list. Forking the whole repo keeps the dashboard and plugin versioned together. The two-collection data model was made clean by updating the skill during this session to write individual question files (`discussions/questions/Q-NNN.md`) instead of appending blocks to `QUESTIONS.md` — so questions become a standard Astro content collection with zero custom parsing.

## Alternatives considered

- Symlink or env-var for discussions dir — rejected for simplicity; committing directly is one less moving part
- Single hosted instance switching between projects — rejected; one-deployment-per-project is simpler and sufficient
- Tailwind CSS — rejected in favour of vanilla CSS for hackability and zero build dependency
- Pre-generated static pages per tag — rejected in favour of `URLSearchParams` approach, which gives shareable filtered URLs without combinatorial page explosion
- Multi-file custom parser for QUESTIONS.md — made unnecessary by migrating to individual question files

## Open questions / follow-ups

None.
