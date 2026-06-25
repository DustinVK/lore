# @dustinvk/lore-dashboard

Build tool that reads a `lore/` directory (produced by the [lore plugin](../../plugins/lore/)) and emits a static dashboard. Deploy to Cloudflare Pages or serve locally.

## Install

```bash
npm install --save-dev @dustinvk/lore-dashboard
```

## Usage

```bash
# local preview
npx lore-dashboard dev

# build static site
npx lore-dashboard build

# options
npx lore-dashboard build --src ./lore --out ./dist --title "My Project Lore"
```

## Cloudflare Pages

- Build command: `npx lore-dashboard build`
- Output directory: `dist`
- Root directory: repo root (or the subfolder containing your package.json)

Commit a `package.json` with the tool pinned as a devDependency for reproducible builds.

## How it works

The CLI reads your `lore/` directory in place and builds a static Astro site. No Astro source lives in your repo. Bumping the dashboard version is a one-line change in your package.json.

Source: [github.com/DustinVK/lore](https://github.com/DustinVK/lore) -- `packages/lore-dashboard/`
