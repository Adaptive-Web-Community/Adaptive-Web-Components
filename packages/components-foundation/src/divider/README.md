# Divider

A line that separates content: `role="separator"`, in its `orientation`. A divider that is only decoration has the author's
`role="presentation"`, which overrides the default role.

- Contract: `DividerElement` (`divider.ts`), and `Orientation`, which other components share.
- Behavior: `dividerAria`, the default ARIA from the orientation, which the binding assigns to the element's `ElementInternals`.

## What was taken from where

| Aspect | FAST Foundation | Here |
| --- | --- | --- |
| Role | A `role` property, `separator` or `presentation`, written to the host's `role` attribute | `ElementInternals`, without the property: the author's `role` attribute already overrides the default |
| Orientation | `aria-orientation` written to the host, except for `presentation` | `ariaOrientation` through `ElementInternals`, which a `presentation` role ignores. The `orientation` attribute is reflected, for the styles |
| Orientation values | From `@microsoft/fast-web-utilities` | The components foundation's `Orientation` |
| Content | A default slot | A default slot |

Considered and not taken:

- A `role` property: it shadows the element's own `role` (the ARIA reflection of the attribute), and the attribute does the job.
- Text in a divider is not read, since a separator's content is presentational. A divider with a label would need its own pattern.
- `align-content`, `appearance`, and `inset` attributes: appearance, for Adaptive UI.
