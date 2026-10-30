# Avatar

The picture, initials, or icon of a person or an entity. It is an image (`role="img"`), whose accessible name is its `name`.

- Contract: `AvatarElement`, `AvatarParts` (`avatar.ts`).
- Behavior: `avatarAria`, the default ARIA from the `name`, which the binding assigns to the element's `ElementInternals`.

## What was taken from where

| Aspect | FAST Foundation | Here |
| --- | --- | --- |
| Semantics | None: an `alt` of a slotted image, or the text, is what is read | `role="img"`, so the content isn't read twice |
| Accessible name | The slotted content | The `name` attribute, as `aria-label` through `ElementInternals`. An author's `aria-label` overrides it |
| Slots and parts | `media` (with default content from the options), the default slot, `badge`, and the `backplate` part | FAST Foundation: `media`, the default slot, `badge`, and `backplate` |
| Initials | The author's text | The author's text |

Considered and not taken yet:

- Initials made from the name: it needs rules for names in many scripts, and it is a feature to add with a real use.
- A default icon when there is neither media nor text.
- `size`, `shape`, `color`, and `active` attributes: appearance, for Adaptive UI.
