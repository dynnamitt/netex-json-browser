# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A read-only React SPA for browsing the NeTEx (Network Timetable Exchange) JSON
Schema: search, filter definitions by role, and inspect each definition with its
XSD source link. Live at https://dynnamitt.github.io/netex-json-browser/.

**The schema is not authored here.** `public/netex-schema.json` is a generated
artifact from [entur/netex-typescript-model](https://github.com/entur/netex-typescript-model),
where the NeTEx XSD is converted to JSON Schema and refined (naming, role
classification, pruning, `x-netex-*` annotations). To change which definitions
appear or how they're modeled, work upstream — this app only renders the artifact.

## Commands

- `npm install` — install. `.npmrc` pins `legacy-peer-deps=true` (needed for the
  MUI 9 / React 19 peer ranges); keep it.
- `npm start` — dev server at http://localhost:3000 (hot reload).
- `npm run build` — production bundle to `build/`.
- `npm test` — Jest + React Testing Library in CRA interactive watch mode. For a
  single test non-interactively: `CI=true npx react-scripts test src/path/Foo.test.tsx`.
- `npm run update-schema` — re-download `public/netex-schema.json` from the latest
  `entur/netex-typescript-model` GitHub release (`scripts/update-schema.mjs`).

No standalone lint command — ESLint (`react-app` config) runs inside the CRA
build/test pipeline.

## Architecture

One-way data flow, no state-management library:

```
useSchema (fetch + parse) → App (theme, loading) → SchemaTable → DefinitionDrawer → JsonViewer
```

- `src/hooks/useSchema.ts` — fetches `${PUBLIC_URL}/netex-schema.json`, reads
  `.definitions` or `.$defs` (handles both), normalizes each entry into a
  `DefinitionRow` (`src/types.ts`): `{id, name, netexRole, xsdLocation, description, raw}`.
- `src/components/SchemaTable.tsx` — core MUI DataGrid; owns search/role-filter,
  the column defs, selection, and **URL state sync** (`?def=Name` via
  `URLSearchParams` + `popstate`, with a `navDepth` counter for the back button).
- `src/components/DefinitionDrawer.tsx` — detail panel; right drawer on desktop,
  bottom sheet on mobile (`useMediaQuery`). Surfaces `x-netex-*` annotations.
- `src/components/JsonViewer.tsx` — syntax-highlighted JSON with **clickable
  `$ref` links**: `#/definitions/X` → `onNavigate('X')` → drawer navigates without leaving the table.
- `src/components/RoleBadge.tsx` — `ROLE_COLORS` map per NeTEx role; `/deprecated`
  suffix renders grayscale + strikethrough.
- Themes: `src/theme-amber.ts`, `src/theme-neon.ts`, toggled in `App.tsx`.

### Data shape that drives the UI

Each schema definition carries `x-netex-*` annotations that the UI reads directly:
`x-netex-role` (entity / reference / enum / frame / version / collection / …),
`x-netex-source` (XSD path), `x-netex-refTarget`, `x-netex-atom`. When adding
features, these annotations on `raw` are the source of truth.

### Common change points

- New table column → `COLUMNS` in `SchemaTable.tsx`.
- New filter → `displayRows` computation in `SchemaTable.tsx`.
- Role colors → `ROLE_COLORS` in `RoleBadge.tsx`.
- More `x-netex-*` fields in detail view → `DefinitionDrawer.tsx`.

## Deploy

Push to `master` → `.github/workflows/pages.yml` runs `npm ci` + `npm run build`
(with `CI=false` so CRA warnings don't fail the build) and publishes `build/` to
GitHub Pages. `package.json` `homepage: "."` keeps asset paths relative for the
project-subpath Pages URL.
