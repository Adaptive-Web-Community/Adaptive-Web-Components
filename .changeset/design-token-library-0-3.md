---
"@adaptive-web/adaptive-ui": major
---

Requires design token library 0.3.1. The `interactive` converter of `adaptiveConverters()` returns a record (`{ "": rest, hover }`) that the library writes as `--x` and `--x-hover`, not a string of properties, and a set with no `rest` no longer writes an empty `--x:;`. See the [migration guide](./MIGRATION.md#interactive-values).
