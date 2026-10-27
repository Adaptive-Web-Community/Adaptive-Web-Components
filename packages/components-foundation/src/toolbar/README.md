# Toolbar

A toolbar (`role="toolbar"`) groups controls, of which one is in the tab order, and the arrow keys move the focus between them: the
[ARIA toolbar pattern](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/).

- Contract: `ToolbarElement` and `ToolbarParts` (`toolbar.ts`).
- Behavior: `ToolbarController` (`toolbar.controller.ts`), with the `RovingFocusController` (`../utilities/roving-focus.controller.ts`).

## What was taken from where

The source: FAST Foundation 3.0.0-alpha.33 (the archive).

| Aspect | FAST Foundation | Here |
| --- | --- | --- |
| Role | `role="toolbar"` and `aria-orientation` written to the host | `ElementInternals` |
| Name | `aria-label` and `aria-labelledby` attributes copied to the host, and a `label` slot that wasn't connected | The author's ARIA on the host, as written, and the `label` slot connected: its elements are the toolbar's `ariaLabelledByElements` |
| Items | The focusable elements among the slotted ones and their descendants, by `tabbable`'s `isFocusable`, a shadow root with something focusable, or `role="radio"` | The elements that take focus themselves (`tabIndex` 0, or a `tabindex`, which a focusable component sets on its host), and those in a plain element around them, such as a `<label>`. A custom element that isn't focusable itself is left as it is: a radio group keeps its radios, and a text field or a link is focusable in its shadow root. No dependency |
| Keyboard | The arrows of the orientation, without wrapping, Left and Right swapped right to left; out of a radio group at its ends | The `RovingFocusController`: the arrows of the orientation, wrapping, skipping disabled items, Home and End, as the ARIA pattern has them |
| A text input | Its arrows moved the focus | Its keys aren't taken, so it keeps the caret: Tab leaves it |
| Tab order | The active item, which a mouse down or a focus from outside sets | The active item, which the arrows, a click, or a focus set |
| Start and end slots | Items, before and after the default slot | FAST |
| Children | `children` with a subtree observer of `disabled` and `hidden` | The elements in the three slots, again when one is defined |

Considered and not taken:

- An item whose focusable part is in its shadow root (a link, a text field) in the roving focus: it needs the toolbar to set the `tabindex`
  of what is inside the component. Such an item stays in the tab order on its own.
- Moving out of a radio group at its ends (FAST Foundation): the ARIA pattern doesn't have it, and the radio group wraps.
- Disabled items that stay focusable, which the ARIA pattern suggests for a toolbar: part of the holistic decision about disabled but
  focusable.
