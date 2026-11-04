---
"@adaptive-web/adaptive-ui": minor
---

An expression and a treatment token keep the refs of the library, not paths (`Reference` is gone), so the library tracks what they depend on, and `configuredValueOf` reads them. `treatment()` takes the `.$root` of a group. See the [migration guide](./MIGRATION.md#derived-values-are-expressions).
