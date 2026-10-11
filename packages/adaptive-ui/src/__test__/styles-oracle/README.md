# Styles oracle

Test only fixtures for the style generation of the `aui` CLI (`compile-styles`, `compile-style`, and `compile-json-anatomy`).

The fixtures are compiled by [`scripts/styles-oracle.mjs`](../../../scripts/styles-oracle.mjs) using the CLI, and the
generated stylesheets (and anything the CLI reports) are compared to the checked in [`baseline`](./baseline). The
capabilities of the style generation are also asserted directly in [`styles-oracle.spec.ts`](./styles-oracle.spec.ts),
so the baseline does not need to be taken on trust. The spec runs with the unit tests.

```sh
npm run build
npm run styles:oracle          # Compile and diff against the baseline.
npm run styles:oracle:update   # Replace the baseline, review the diff.
```

The CSS only has references to design tokens, not the evaluated values. See `src/reference/parity.spec.ts` for the values.

## Fixtures

- `components`: Anatomy and style modules defined in code, compiled from the build output.
    - `button`, `anchor`, `text-field`, `tab`, `divider`, `tooltip` are copies from Adaptive Web Components, with the templates removed.
    - `stress-*` are made up to cover capabilities not covered by the samples.
- `anatomies`: Anatomy and style rules defined in JSON.
    - `button`, `text-field`, `checkbox`, `dialog`, `avatar` and the `_input-*` partial files they import are copies from Polar UI.
    - `stress-*` are made up to cover capabilities not covered by the samples.

The copies are not kept in sync with their source, they only represent real world anatomies. A file starting with `_` is a
partial anatomy only used for `imports`, and is not compiled by itself.

## Adding a capability

1. Add or change a fixture. Make sure what is being tested is not silently ignored, for example a token name that
   doesn't exist is treated as a literal value.
2. Run `npm run styles:oracle:update`, and read the changes in the baseline to verify they are what's intended.
3. Add the capability to the table in `styles-oracle.spec.ts`.
