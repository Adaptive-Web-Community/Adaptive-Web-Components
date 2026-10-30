# Checkbox

A checkbox, which the user checks and unchecks, and which can be indeterminate. It is the host element, a form control through
`ElementInternals` ([decision 0010](../../../../docs/decisions/0010-a-control-is-its-host-element.md)), and its content is its label.

- Contract: `CheckboxElement` and `CheckboxParts` (`checkbox.ts`), on `CheckableElement` (`../checkable/checkable.ts`), which the switch and
  the radio share.
- Behavior: `CheckboxController` (`checkbox.controller.ts`), on `CheckableController` (`../checkable/checkable.controller.ts`), which uses
  the `SpacePressController` that the button uses too.

## What was taken from where

| Aspect | FAST Foundation | Here |
| --- | --- | --- |
| Element | The host, with `role="checkbox"` written to it, and a proxy `<input>` in the light DOM for the form | The host, with the role and the form through `ElementInternals` |
| `checked` | The `checked` attribute is the default (`defaultChecked`), and `checked` the state now, with a dirty flag | FAST Foundation, as a native checkbox, with the attribute as `defaultChecked` |
| Shown as checked | `aria-checked` written to the host, which the styles selected | `ariaChecked` and the `checked` custom state, `:state(checked)` |
| Indeterminate | A property, `aria-checked="mixed"`, ended by the user | The property, `mixed`, and `:state(indeterminate)` |
| Keyboard | Space on `keypress` | Space when released, `:state(active)` while held, with the button's `SpacePressController` |
| Events | `change` (from the proxy) | `input` (composed) and `change`, as a native checkbox's |
| Form value | Through the proxy | `setFormValue`: the value when checked |
| `value` | `on` by default | `on` when the attribute is absent, without writing it |
| Reset | The proxy's | `formResetCallback`: back to the default |
| Required | Through the proxy | `valueMissing`, with the browser's message from a native checkbox |
| Disabled | `aria-disabled` written, and `tabindex` removed | The platform's (decision 0010): the `disabled` attribute or a fieldset, selected as `:disabled` |
| Read only | `readonly` (alpha.31) | `readonly`: it takes focus, a click and Space change nothing, `aria-readonly`, `:state(readonly)`, and it isn't validated, as a read only native input isn't |
| Label | The default slot, in a `label` part, with a class when empty | The `label` attribute, or the `label` slot for more than text, in the `label` part, hidden when empty; `hide-label` hides it, and it still names the element ([0016](../../../../docs/decisions/0016-a-control-is-labelled-as-its-native-element-is.md)). A `<label for>` works too |
| Indicators | `checked-indicator` and `indeterminate-indicator` slots in the `control` part, shown by the styles | The same slots, shown with `hidden` |

Considered and not taken yet:

- `autofocus` for an element defined after the page loaded, as for the button.
- Restoring the state on back navigation (`formStateRestoreCallback`).
- `shape` and `size` attributes: appearance, for Adaptive UI.
