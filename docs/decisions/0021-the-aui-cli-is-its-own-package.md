# 0021. The `aui` CLI is its own package

- Status: Accepted
- Date: 2026-11-09
- Package: adaptive-ui

## Context

The `aui` command compiled style rules to CSS using PostCSS, Prettier, Commander, and other Node-only tools. Those dependencies shipped with
`@adaptive-web/adaptive-ui`, so every install of the library pulled a toolchain that browser and bundler consumers do not need. The compile
logic itself (turning JSON anatomy and style rules into CSS) belongs with the library; file I/O, globbing, and formatting belong at the edge.

The sequencing plan also calls for a thin CLI and a configurable library later; separating packages first keeps the core dependency tree small
while the programmatic API moves into the library.

## Decision

- `@adaptive-web/adaptive-ui` does not publish a `bin`. It exports a compile API (`CompileContext`, `jsonToStyleSheet`, `compileStyleRulesToCss`,
  `onFillsFromStyleSheet`, `referenceCompileContext`, and related types).
- The `aui` command is published as `@adaptive-web/adaptive-ui-cli`, which depends on `@adaptive-web/adaptive-ui` and owns Commander, glob,
  PostCSS, Prettier, and the other Node-only dependencies.

## Consequences

- Consumers that only need tokens, recipes, and style rules install a smaller core package.
- Build scripts and tools must depend on `@adaptive-web/adaptive-ui-cli` explicitly to get `aui` on the PATH.
- A later step can add `aui.config.js` and in-process compile for designer-figma without moving dependencies back onto core.

## Alternatives

- **Optional dependency on the CLI from core** — Rejected: does not shrink the default install and hides the missing tool.
- **A `bin` shim on core that forwards to the CLI package** — Rejected for 1.0 beta: a breaking major removes the shim so consumers migrate
  explicitly.
