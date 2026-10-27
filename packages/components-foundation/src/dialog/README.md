# Dialog

A dialog around a native `<dialog>` (the `control` part), which has the role, the top layer and its backdrop, the inertness of the page while
it is modal, focus moved into it and back to what opened it, and Escape.

- Contract: `DialogElement`, `DialogClosedBy`, `DialogParts` (`dialog.ts`).
- Behavior: `DialogController` (`dialog.controller.ts`).

## What was taken from where

| Aspect | FAST Foundation | Here |
| --- | --- | --- |
| Element | A `role="dialog"` element, with an overlay and a positioning region, and its own focus trap | A native `<dialog>`, so the top layer, the backdrop, inertness, and focus are the browser's |
| Modal | A `modal` attribute | The native methods: `show()` and `showModal()` |
| Opening and closing | `show()`, `hide()`, `hidden` | The native `show()`, `showModal()`, `close(returnValue)`, `returnValue`, and an invoker's `command` (`show-modal`, `close`, `request-close`, also with `--` for a native button) |
| Escape | Its own handler: `dismiss` and `cancel` events | The native `cancel`, emitted again from the element, cancelable |
| Click outside | The overlay emits `dismiss` | `closedby`, as the native attribute: `any` closes on a click outside, `closerequest` (the default) on Escape, `none` neither; done by the controller, since not every browser has the attribute |
| Focus | Its own trap, and `no-focus-trap` | The native, and `autofocus` of the content focused by the controller, since the browser doesn't look in slots |
| Name | `aria-label`, `aria-labelledby`, `aria-describedby` written to the dialog | Every `aria-*` attribute forwarded to the `<dialog>`, as for the anchor |
| Events | `dismiss`, `cancel`, `close` | The native `cancel` and `close`, from the element |
| Parts | `positioning-region`, `overlay`, `control` | `control`, the `<dialog>`; the overlay is its `::backdrop` |

Considered and not taken yet:

- An alert dialog (`role="alertdialog"`, an `alert` type): a `role` of the author's doesn't reach the `<dialog>` yet.
- `beforetoggle` and `toggle`, which newer browsers fire on a `<dialog>`.
- FAST Foundation's `no-focus-trap`: a modal native dialog makes the page inert, which is the trap.

TypeScript's DOM types (5.9) lack the `command` event and the `source` of `showPopover()`; `../utilities/dom.ts` declares them until
TypeScript has them.
