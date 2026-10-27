# Tooltip

A short description of an element, shown while it has the focus or the pointer. The tooltip is a popover (`popover="manual"`) in the top
layer, shown with its anchor as the source, which makes the anchor its implicit anchor for CSS anchor positioning, so it is placed next to
the anchor by the styles alone.

- Contract: `TooltipElement`, `TooltipPlacement` (`tooltip.ts`).
- Behavior: `TooltipController` (`tooltip.controller.ts`).

## What was taken from where

| Aspect | FAST Foundation | Here |
| --- | --- | --- |
| Element | An element positioned by `@floating-ui/dom` | A popover with the `tooltip` role, `manual` so it doesn't close an open menu, as an `auto` one would; `popover="hint"` is only in Chromium |
| Positioning | Floating UI, by script | CSS anchor positioning with the anchor as the implicit anchor (`showPopover({ source })`): nothing written to the anchor, and no script |
| Placement | `placement`: `top`, `bottom`, `left`, `right`, and `-start`, `-end` | `above`, `below`, `before`, and `after`, with alignments, in the writing direction, as `placement`, mapped to `position-area`, flipped when there is no room |
| Anchor | `anchor`, an id | `anchor`, an id, or `anchorElement`, an element; any element that takes focus |
| Showing | Hover and focus, a `delay`, and `visible` to force it | Focus at once, the pointer after `delay` (300 ms), kept while the pointer is on the tooltip (WCAG 1.4.13) |
| Escape | Hides it, and emits `dismiss` | Hides it, wherever the focus is while it is shown |
| Description | Its id added to the anchor's `aria-describedby` | Added to the anchor's `ariaDescribedByElements`, after what the author's `aria-describedby` has, without an id; removed when it disconnects |

Considered and not taken:

- The `interestfor` attribute (interest invokers), which only Chromium has, and which works only on links and buttons.
- FAST Foundation's `visible`, which forced it shown: `showPopover()` and `hidePopover()` do that.
