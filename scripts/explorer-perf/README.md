# Measuring the explorer

Scripts that measure a build of the explorer in Chromium. They are for the work on scopes (decision 0018) and on the token library: how long a
change takes, how many token sheets are written, and whether the heap grows. They aren't a test and don't run in CI.

```shell
cd scripts/explorer-perf && npm ci          # playwright-core only, not a workspace of the repository
npx playwright-core install chromium        # once, or set CHROME to a Chromium you have
(cd ../../packages/adaptive-ui-explorer && npm run build)

npm run perf                                # one run of the explorer's dist, about 45 s
node perf.mjs <dist> 3                      # another build, the median of 3 runs
node profile.mjs <dist> neutral             # where the time of three neutral changes goes; or `toggle`
```

## Comparing two versions

Build each into its own directory and measure both, in the same session of the machine: the times vary by about 20% from one run to the
next, and more between sessions.

```shell
cd packages/adaptive-ui-explorer
npx vite build --outDir /tmp/explorer-a     # one version
# check out the other, build what changed (adaptive-ui, components-fast), then
npx vite build --outDir /tmp/explorer-b
cd ../../scripts/explorer-perf && node perf.mjs /tmp/explorer-a 3 && node perf.mjs /tmp/explorer-b 3
```

`vite build` bundles the packages from their `dist`, so build `packages/adaptive-ui` and `packages/components-fast` first when they
changed. To measure an unpublished design-token-library, link its build as `node_modules/design-token-library` and build the packages
again. For `profile.mjs`, build with `--minify false`, or the names are minified.

## What to look at

- `writesPerNeutralChange`: one per scope (67 with every background) is the least. More means a scope is written before the values of its
  element are set, and again after.
- `neutralAll` and `toggleMedian`: the cost of the scopes, which grows with the number of backgrounds. `neutralDefault` is what a user sees
  most.
- `heapAfter50Changes` and `heapAfter20Toggles` should stay near `heapLoaded` and `heapAll`. A scope that isn't collected shows here.
- In `profile.mjs`, `tokenStyles` is the writing of the scopes, `walk` is the library resolving values, `dependents` is its index of what
  refers to a token, and `valueOnFill` the values on a fill.

## Numbers so far

Chromium, the median of 3 runs: the first three columns on 2026-11-04, the last on 2026-11-16 (a different session, so the times differ by up to 20%).

| | design-token-library 0.3.1, comparing declarations | `changesOf`, each scope written twice | written once, names made once | 0.4.0, `ownTokensOf` (the median of 3, 2026-11-16) |
| --- | --- | --- | --- | --- |
| load | 1.2 s | 1.5 s | 0.9 s | 0.8 s |
| neutral change, default view | 0.21-0.26 s | 0.24 s | 0.16 s | 0.19 s |
| neutral change, every background | 1.2-1.6 s | 1.5 s | 0.9-1.1 s | 1.0 s |
| show every background | 2.4 s | 2.4 s | 1.5 s | 1.2-1.3 s |
| token sheet writes for a change | 130 | 131 | 67 | 67 |
| heap, loaded / every background / after 20 toggles | 15 / 62 / 60 MB | 15 / 63 / 65 MB | 16 / 63 / 51-59 MB | 12 / 40 / 15 MB |
