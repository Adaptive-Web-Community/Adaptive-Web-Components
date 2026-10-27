# Switch

A switch, which turns something on and off. It is a checkable control, as the checkbox is (see `../checkbox/README.md` for what they
share and where it came from), with the `switch` role.

- Contract: `SwitchElement` and `SwitchParts` (`switch.ts`), on `CheckableElement`.
- Behavior: `SwitchController` (`switch.controller.ts`), on `CheckableController`.

## What was taken from where

| Aspect | FAST Foundation | Here |
| --- | --- | --- |
| Element | The host, `role="switch"` written to it, and a proxy `<input>` | The host, with `ElementInternals`, on the shared checkable behavior |
| Keyboard | Space and Enter on `keypress` | Space when released, as a native checkbox `switch` (and a checkbox). The ARIA pattern makes Enter optional |
| Read only | `readonly`, with `aria-readonly` | FAST Foundation's `readonly`, as the checkbox's: focus, no change, `aria-readonly`, `:state(readonly)`, not validated |
| Required | Through the proxy | `valueMissing`, with the browser's message |
| Label and parts | The default slot in a `label` part, then the `switch` part with a `thumb` (alpha.31) | FAST Foundation alpha.31: `label`, `switch`, `thumb`, with a `switch` slot for a track of the author's |
| On | `aria-checked` written to the host, which the styles selected | `ariaChecked`, and `:state(checked)` |

Considered and not taken: messages for on and off next to the switch (FAST Foundation's earlier `checked-message` and
`unchecked-message`): a label that changes with the state confuses the name of the control. The author's own text can do it.
