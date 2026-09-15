# CLAUDE.md

Guidance for Claude Code and other AI assistants working in this repository.

## What this is

A Gatsby 4 + TypeScript site that renders SpaceX launch statistics, deployed from `master`
to [spacexstats.xyz](https://www.spacexstats.xyz/). Everything on the page is derived at build
time from one upstream API — there is no backend and no database.

## Toolchain

`.nvmrc` pins **Node 16**, and it means it. Gatsby 4's `lmdb` native module fails to load on
Node 18+ on Apple Silicon (`gatsby build` dies in `lmdb-datastore.ts` before it reaches any
project code), so use Node 16 rather than assuming that error is a repo problem.

```sh
yarn                 # install
yarn start           # gatsby develop on :8000
yarn build           # gatsby build
yarn test            # tsc --noEmit, then eslint --fix .
```

Two things to know about `yarn test`:

- **`test:lint` is `eslint --fix .`, which rewrites files in place.** To check without mutating
  the tree, run `npx eslint .`.
- **`tsc` does not currently pass on `master`.** The Launch Library migration left ~12 errors in
  blocks that still read `SpaceXStatsData.crew` / `company` / `roadster` / `cores` / `starlink`,
  fields the LL2 transformer does not supply yet. Don't assume your change caused them: capture
  `npx tsc --noEmit` before and after and compare the two sets.

## How data reaches the page

```
plugins/gatsby-source-spacex-api/gatsby-node.js   fetches Launch Library 2, creates the
                                                  `spacexdatalaunches` Gatsby node
  -> src/pages/index.tsx                          GraphQL query selecting the fields it wants
  -> src/data/launch-library/                     LLAPI* types + transformAPIData
  -> types/index.ts SpaceXStatsData               the shape the UI consumes
  -> src/components/blocks/<Block>/modelizer.ts   pure SpaceXStatsData -> view-model functions
  -> src/components/blocks/<Block>/component.tsx  rendering
```

**Adding an API field takes three edits, not one**: the GraphQL query in `src/pages/index.tsx`,
the interface in `src/data/launch-library/types.ts`, and the transformer. Miss the query and the
field is silently `undefined` at runtime — the types will not catch it.

`src/data/r-spacex/` is the previous adapter for the r-spacex API. That API is frozen and no
longer receives data updates (`r-spacex/SpaceX-API#1243`), which is why the migration exists.

## Working against the API

- The production API (`ll.thespacedevs.com`) is **rate limited to 15 requests/hour** and the
  source plugin paginates, so a couple of builds will exhaust it. Set `USE_PROD_API = false` in
  `plugins/gatsby-source-spacex-api/gatsby-node.js` to use the `lldev.thespacedevs.com` mirror
  while developing. Both need a `User-Agent` header if you query them by hand.
- `plugins/gatsby-source-spacex-api/launches.json` is a **stale local fixture**, used only when
  `NODE_ENV=development` and `USE_JSON_FALLBACK` is on. It predates fields and launch pads that
  now exist, so `yarn start` will not reproduce problems that only appear with live data —
  production builds hit the API. Reproduce data bugs with a real build, or by feeding live JSON
  through the transformer directly.
- `config/` endpoints are the authority for the API's enumerations. `/2.2.0/config/netprecision/`
  lists all 17 `net_precision` values, `/2.2.0/config/launchstatus/` the statuses, and so on —
  read those rather than inferring the set from whatever a sample happens to contain.

## The failure mode to design against

`transformAPIData` maps over every launch, and `IndexPage` transforms during render. **A single
throw anywhere in that path fails the entire build** with `ERROR #95313 Building static HTML failed for path "/"`, and the site cannot deploy.

So a value the API returns that our enums do not cover must never throw. SpaceX adds launch pads
and rocket variants continuously, and they appear in _upcoming_ launches first, so this is a
matter of when rather than whether. Warn and fall back to a sensible value; drop the individual
launch only when nothing usable is left.

Also be careful reading `net`. It is always a real timestamp, but for an unconfirmed launch it is
the last instant of the announced period — a mission slated for "2027" arrives as
`2027-12-31T00:00:00Z`. `net_precision` is the field that says how much of that timestamp is
real, and `LaunchDatePrecision` plus `Upcoming/modelizer.ts` already model the distinction.

## Conventions

- Keep transformation logic in `dataTransformers.ts` and view logic in `modelizer.ts`. Both are
  pure functions over plain data, which is what makes them checkable without a running site.
- Prettier runs through eslint; match the existing formatting rather than reformatting files.
- No test framework is configured. Verify with a real `gatsby build`, and by exercising the
  pure functions directly (`ts-node -r tsconfig-paths/register --transpile-only`, with a
  `tsconfig` overriding `module: commonjs` and `noEmit: false`).
