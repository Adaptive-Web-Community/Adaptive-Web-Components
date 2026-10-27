# Breadcrumb and Breadcrumb Item

A breadcrumb is a navigation landmark with the list of the pages on the path to the current one: the
[ARIA breadcrumb pattern](https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/). Each item is a link, which wraps a native `<a>` as the
Anchor does, and a separator.

- Contract: `BreadcrumbElement`, `BreadcrumbParts`, and `breadcrumbAria` (`breadcrumb.ts`), `BreadcrumbItemElement`, `BreadcrumbItemParts`,
  and `breadcrumbItemAria` (`../breadcrumb-item/breadcrumb-item.ts`).
- Behavior: `setBreadcrumbItems`, which makes the last item the current page. The item's link is the Anchor's, with its ARIA forwarded by
  the `AriaForwardingController`.

## What was taken from where

The source: FAST Foundation 3.0.0-alpha.33 (the archive).

| Aspect | FAST Foundation | Here |
| --- | --- | --- |
| Landmark | `role="navigation"` written to the host | `ElementInternals`. The author names it (`aria-label`), as the ARIA pattern asks: it has no default name, which would need a translation |
| List | A `role="list"` element in the shadow root, around the slot | The same (the `list` part), since the host is the landmark |
| Item | `role="listitem"` on the host, and the Anchor's template inline | `ElementInternals`, and the Anchor's link: the item extends it, with its attributes and the author's ARIA forwarded to the link |
| Current page | The breadcrumb finds the `<a>` in the last item, in its light DOM or its shadow root, and sets `aria-current="page"` on it | The breadcrumb gives its last item `current`, and the item's template puts `aria-current="page"` on its own link. The breadcrumb doesn't reach into an item |
| Separator | A `separator` property, given by the breadcrumb, which renders the separator or not, with the `separator` slot and a default from the options | Shown or `hidden` by `current`, `aria-hidden`; the `separator` slot, with a default from the design system's statics |
| Children | `slotted`, items recognized by class | By their class, waiting for those not defined yet |

Considered and not taken:

- A current item that isn't the last, which an author might want for a path that goes on past the current page: add it on the first real
  use.
- The `listitem` part around the item's content (alpha.31): the host is the list item.
