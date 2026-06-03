# NeTEx Schema Browser

> ⚠️ **Work in progress.**

A browser for the [NeTEx](https://netex-cen.eu/) (Network Timetable Exchange)
schema — search, filter by role, and inspect definitions with their XSD source
links. Built with React + MUI DataGrid.

**Live:** https://dynnamitt.github.io/netex-json-browser/

## Data source

The `netex-schema.json` this app browses is produced and shaped in
[entur/netex-typescript-model](https://github.com/entur/netex-typescript-model) —
that repo is where the NeTEx XSD is converted into a JSON Schema and refined
(naming, role classification, pruning). This browser is just a read-only viewer
over that artifact; to change what definitions appear or how they're modeled,
work happens upstream in
[netex-typescript-model](https://github.com/entur/netex-typescript-model).

## Develop

```bash
npm install
npm start        # dev server at http://localhost:3000
```

## Build & deploy

```bash
npm run build    # production bundle in build/
```

Pushing to `master` auto-builds and publishes to GitHub Pages
(see `.github/workflows/pages.yml`).
