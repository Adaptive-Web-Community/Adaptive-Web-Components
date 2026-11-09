# @adaptive-web/adaptive-ui-cli

Command-line tools to compile Adaptive UI style rules to CSS.

## Install

```bash
npm install --save-dev @adaptive-web/adaptive-ui-cli
```

The CLI depends on `@adaptive-web/adaptive-ui` for the compile API and the reference design system.

## Commands

- **`aui compile-style <inFile> <outFile>`** — Compile a single module that exports anatomy and style rules.
- **`aui compile-styles <glob>`** — Compile every matching module or JSON anatomy.
- **`aui compile-json-anatomy <anatomyPath>`** — Compile a JSON anatomy and write CSS to stdout.

Use `--anatomy` and `--styles` to match export names (wildcards supported). With `--on-fills <file>`, the CLI writes the values on a fill of
the compiled styles as JSON for token CSS.

Today the CLI uses the reference token library. A configurable library is planned; see
[docs/decisions/0021-the-aui-cli-is-its-own-package.md](../../docs/decisions/0021-the-aui-cli-is-its-own-package.md).
