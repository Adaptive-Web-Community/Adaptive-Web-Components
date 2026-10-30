# Button

A button whose element is the button, as a native `<button>` is
([decision 0010](../../../../docs/decisions/0010-a-control-is-its-host-element.md)): it has the `button` role through `ElementInternals`,
takes focus, and is a form control.

- Contract: `ButtonElement`, `ButtonType`, `ButtonParts` (`button.ts`).
- Behavior: `ButtonController` (`button.controller.ts`): the role, focus, activation by Enter and Space, and submitting or resetting the form.
  The binding is form-associated (`static formAssociated = true`) and gives the controller its `ElementInternals`.

## What was taken from where

The source: FAST Foundation 3.0.0-alpha.33.

| Aspect | FAST Foundation | Here |
| --- | --- | --- |
| Element | A native `<button part="control">` in the shadow root, with `delegatesFocus` | The host is the button |
| Role | The inner native button's | `ElementInternals`, without adding an attribute |
| ARIA | About twenty `aria-*` properties mirrored onto the inner button | The author's, on the host, and nothing mirrored |
| Focus | Delegated to the inner button | `tabindex="0"` unless the author set one. The platform makes a disabled form control unfocusable |
| Keyboard | Native | Native timing: Enter clicks when pressed, Space when released and not if the focus left in between, and Space doesn't scroll |
| Pressed by the keyboard | `:active` of the native button | The `active` custom state, `:state(active)` |
| Form association | A proxy `<input>` added to the light DOM | `formAssociated`, with `form` and `labels` from `ElementInternals` |
| Submitting | `requestSubmit(proxy)` | A hidden native button added to the form for the time of `requestSubmit(submitter)`, with the name, the value, and the overrides. One way for every case, and no extra click |
| Resetting | `form.reset()` | `form.reset()` |
| Disabled | The native button's | The platform's: `disabled` and a disabled fieldset make it `:disabled`. Styles select `:disabled` |
| Default `type` | None, which does nothing | `button`, set explicitly. A native button's is `submit` |
| A cancelled click | | A click whose default was prevented before it reached the button doesn't submit or reset |
| `autofocus` | Mirrored onto the inner button | The global attribute on the host |
| Commands | | The Invoker Commands API of a native button (`commandfor`, `command`), with the shared `InvokerController`: a cancelable `command` event at the target, then what a native button does for a popover (`togglePopover` with the button as its source and anchor) or a `<dialog>`; `aria-expanded` as its popover is open. Only as a `button`, as a native one |
| Slots and parts | `start`, the default slot in the `content` part, `end`, and the `control` part | The same, without `control` |
| Hidden label | | `hide-label` hides the content visually, and it still names the button, which shows only its `start` and `end`, such as an icon ([0016](../../../../docs/decisions/0016-a-control-is-labelled-as-its-native-element-is.md)) |

Considered and not taken yet:

- `disabled-focusable`: disabled but focusable, with `aria-disabled`, so that a disabled button can be found by the keyboard (in a
  toolbar or a menu). Left out of every component for now, to be decided for all of them together.
- Implicit submission: Enter in a text field doesn't submit through a custom submit button. It needs a hidden native button in the form.
- `autofocus` for an element defined after the page loaded.
- A minimum target of 44px, and `appearance`, `shape`, `size`, and `icon-only` attributes: they are appearance, for Adaptive
  UI. `hide-label` hides the label of a button that shows only an icon, and the label still names it.
- The toggle button (`aria-pressed`), the menu button, and the split button are components of their own.
