# lore -- a Claude Code plugin

**Also in this repo:** [`packages/lore-dashboard/`](packages/lore-dashboard/) -- a build tool that renders your `lore/` directory as a static dashboard, deployable to Cloudflare Pages.

Capture the why behind technical decisions into queryable lore that lives in your
repo, where Claude can actually read it.

Feed it a discussion (raw notes, a transcript, an AI-generated summary, a Slack
thread) and it outputs compact entries capturing what was decided, why, and what
was rejected. Unresolved questions each get their own file in `lore/questions/`
with a one-line entry in `QUESTIONS.md` so nothing falls through the cracks. An
`INDEX.md` keeps everything scannable, so Claude can answer "why did we build it
this way?" directly from the repo without touching a wiki.

If you've used ADRs, this is the same instinct -- with Claude handling the
capture, querying, question lifecycle, and supersession bookkeeping, so it
actually gets maintained.

## Skills and commands

- **`capture`** -- distills a raw or AI-generated discussion summary into one or
  more compact, tagged entries: what was decided, why, and what was rejected.
  Long discussions covering independent topics are split into one file per
  independently-queryable thread. Genuine unresolved questions each get an
  individual file in `lore/questions/` (Q-001.md, Q-002.md ...) and a one-line
  entry in `QUESTIONS.md`.
- **`ask`** -- answers "why did we build it this way?" / "what did we decide
  about X?" by searching the lore, or tells you plainly when there's nothing.
  After answering, it surfaces any still-open questions in the same area.
- **`resolve`** -- closes out an open question by updating its
  `lore/questions/Q-NNN.md` file and the corresponding index line in
  `QUESTIONS.md`, recording the answer, the rationale, and a link to the
  discussion that settled it.
- **`supersede`** -- marks a past decision superseded (with a pointer to its
  replacement) or obsolete, without requiring a new discussion to be captured.
  Updates the entry file, adds a visible banner, and updates the INDEX line so
  both the `ask` skill and human readers see it is retired.
- **`/lore:seed`** -- inspects the codebase and proposes a starter set of areas
  and topics for `lore/topics.md`, with a short justification for each tag.
  Confirm or edit its proposal and it writes (or merges into) the file.

Entries are tagged on two facets: **areas** (feature slices: `order-process`,
`international-shipping`, `price-calculator`) and **topics** (cross-cutting
concerns: `auth`, `postgres`, `performance`). The lore is committed to each
consuming project's repo, version-controlled and PR-reviewable next to the code.

## Install

```
/plugin marketplace add DustinVK/lore
/plugin install lore@dustinvk
```

Restart Claude Code once after installing so the new skills are picked up. On
first use in a project, `capture` scaffolds a `lore/` folder (`INDEX.md`,
`QUESTIONS.md`, a starter `topics.md`, a `log/` subdirectory, and a `questions/`
subdirectory) in that repo -- the plugin ships the tooling, the lore itself is
per-project data.

### Usage

First-time setup in a project (optional but recommended):

1. Paste the block from `CLAUDE.snippet.md` into the project's `CLAUDE.md`. This
   makes Claude offer to capture a decision when a session reaches one, so
   capturing becomes a "yes" instead of a chore someone has to remember.
2. Run `/lore:seed` and Claude inspects the codebase (module layout, routes,
   dependency manifests, migrations) and proposes a starter set of areas and
   topics. Confirm or edit its proposal and it writes (or merges into)
   `lore/topics.md`.

Both steps are optional -- the lore still works without them; the trigger just
becomes manual and the vocabulary grows organically as you go.

End of a huddle: paste the summary and say "log this discussion". `capture`
distills it, tags it, and writes one file per independently-queryable decision
thread under `lore/log/`. A long, meandering discussion can produce several files
if its threads are unrelated enough to be searched separately. If the discussion
leaves genuine unresolved questions, each gets its own file in `lore/questions/`
(e.g. `Q-001.md`) with a one-line entry in `QUESTIONS.md`.

Later, ask "why did we implement the price calculator the way we did?" and `ask`
searches the lore, summarizes the relevant entries (with dates and source files),
and appends any still-open questions in the same area.

When a question gets answered, say "mark Q-007 resolved -- we decided X because
Y" (or name the lore entry if you just logged it). `resolve` updates
`QUESTIONS.md` and annotates the source entry so the audit trail is complete.

**Question lifecycle:** `capture` creates questions, `ask` surfaces them,
`resolve` closes them.

**Decision lifecycle:** `capture` captures (and supersedes on the way in),
`supersede` retires entries after the fact, `ask` follows chains to the active
answer.

## Repo layout

```
lore/
├── .claude-plugin/
│   └── marketplace.json               # the registry
├── .github/
│   └── workflows/
│       └── validate-plugins.yml       # CI: validates manifests + plugin on every push
├── plugins/
│   └── lore/
│       ├── .claude-plugin/
│       │   └── plugin.json            # plugin manifest
│       ├── CLAUDE.snippet.md          # paste into a project's CLAUDE.md
│       ├── commands/
│       │   └── seed.md                # /lore:seed -- bootstrap vocabulary from the codebase
│       └── skills/
│           ├── capture/
│           │   ├── SKILL.md           # capture skill
│           │   └── topics.seed.md     # starter vocabulary, copied on first run
│           ├── ask/
│           │   └── SKILL.md           # query skill
│           ├── resolve/
│           │   └── SKILL.md           # close out open questions
│           └── supersede/
│               └── SKILL.md           # retire decisions (superseded or obsolete)
└── README.md
```

Each consuming project's lore lives in its own repo, not here:

```
<your-project>/
└── lore/
    ├── INDEX.md          # one line per entry; maintained by capture
    ├── QUESTIONS.md      # one-line-per-question index
    ├── topics.md         # controlled tag vocabulary (areas + topics)
    ├── questions/
    │   └── Q-NNN.md      # one file per question
    └── log/
        └── YYYY-MM-DD-short-slug.md   # one file per independently-queryable thread
```

## Publishing this yourself

1. Validate locally: `claude plugin validate ./plugins/lore`
   (a GitHub Actions workflow also runs this on every push and pull request, so
   a future edit can't quietly break the manifest for people who've installed it).
2. Test locally before pushing: `/plugin marketplace add ./` from this repo,
   then `/plugin install lore@dustinvk`.
3. Push to github.com/DustinVK/lore -- users add it with
   `/plugin marketplace add DustinVK/lore`.
   Updates are just commits; users run `/plugin marketplace update` to refresh.

GitHub topics to add: `claude-code`, `claude-code-plugin`,
`architecture-decision-records`, `adr`, `decision-log`, `knowledge-management`.

Private repo? Auto-updates need a `GITHUB_TOKEN` / `GH_TOKEN` in the environment.

## License

MIT.
