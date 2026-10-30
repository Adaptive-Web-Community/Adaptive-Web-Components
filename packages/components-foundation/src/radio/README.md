# Radio

A radio of a radio group, of which one is checked. It is a checkable control, as the checkbox is (see `../checkbox/README.md` for what they
share and where it came from), with the `radio` role. Each radio is a form control, as a native radio is: the checked one gives its value
to the form. The radio group (`../radio-group`) keeps one checked and moves between them with the keyboard.

- Contract: `RadioElement` and `RadioParts` (`radio.ts`), on `CheckableElement`.
- Behavior: `RadioController` (`radio.controller.ts`), on `CheckableController`: a click or Space only checks it.

## What was taken from where

| Aspect | FAST Foundation | Here |
| --- | --- | --- |
| Element | The host, `role="radio"` written to it, and a proxy `<input type="radio">` | The host, with `ElementInternals`, on the shared checkable behavior |
| Form value | Each radio, through its proxy | Each radio, as a native radio |
| Disabled by its group | | `groupDisabled`, given by the group: no focus, no click, no value, `aria-disabled`, and `:state(disabled)` |
| A click on a checked radio | Stays checked | Stays checked, without `input` or `change` |
| Alone | Grouped with others of its `name`, and focusable | Used in a radio group, as the ARIA pattern has it; alone, it checks and stays checked |
| Required | Its own, through its proxy | The group's (see the radio group) |
| Read only | The group's `readonly` | The group's: it sets the radio's `groupReadOnly`, so the radio takes focus but isn't checked by the user, with `:state(readonly)` |
| Label and parts | The default slot in a `label` part, and a `checked-indicator` slot in the `control` part | The `label` attribute, or the `label` slot for more than text, in the `label` part, hidden when empty; `hide-label` hides it, and it still names the element ([0016](../../../../docs/decisions/0016-a-control-is-labelled-as-its-native-element-is.md)). The indicator as FAST Foundation's, shown by `hidden` |

Considered and not taken: grouping radios by `name` without a radio group, as native radios are. It needs a registry of radios by form and
name, and the ARIA pattern has a `radiogroup` around them.
