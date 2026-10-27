# Anchor

A link. Unlike a control, it wraps a native `<a>` (the `control` part), since what the browser does for a link can't be done for a custom
element: its context menu (open in a new tab, copy the address), a click with the middle button or a modifier key, the URL shown on hover,
`:visited`, dragging it, and the browser's settings for links.

- Contract: `AnchorElement`, `AnchorParts` (`anchor.ts`).
- Behavior: the `AriaForwardingController` (`../utilities/aria-forwarding.controller.ts`) forwards the author's ARIA attributes from the
  element to the `<a>`, and `isIconOnly` (`../utilities/icon-only.ts`) is shared with the button.

## What was taken from where

| Aspect | FAST Foundation | Here |
| --- | --- | --- |
| Element | A native `<a part="control">` in the shadow root | FAST Foundation's native `<a>` |
| Link behavior | Native | Native |
| The author's ARIA | About twenty `aria-*` properties, written to the `<a>` by the template. The ids of `aria-describedby` and the like don't resolve inside the shadow root | Every `aria-*` attribute of the host, forwarded to the `<a>` as it changes; the ids as the elements (element reflection), found where the host is |
| Link attributes | `download`, `href`, `hreflang`, `ping`, `referrerpolicy`, `rel`, `target`, `type`, given to the `<a>` | The same, with `referrerPolicy` named as the native property |
| `target` values | `AnchorTarget` (`_self`, `_blank`, `_parent`, `_top`) | A string: a target can also be the name of a frame |
| Focus | `delegatesFocus`, and `focus()` focuses the `<a>` (AWC) | `delegatesFocus`, as the text fields: focusing the host focuses the `<a>`, and a `tabindex` of `-1` on the host takes the `<a>` out of the tab order, which a toolbar's roving focus needs |
| Icon only | A class on the `<a>` (AWC) | The `icon-only` custom state, from the content, with `isIconOnly`, which the button shares |
| Slots and parts | `start`, the `content` part, `end`, in the `control` part | FAST Foundation |

Considered and not taken:

- The host as the link: consistent with the button, but the link is then not a link to the browser.
- Mirroring a fixed list of ARIA properties (FAST Foundation): the forwarding takes any `aria-*` attribute, and resolves the ids.
- `appearance` and `inline` attributes: appearance, for Adaptive UI.
