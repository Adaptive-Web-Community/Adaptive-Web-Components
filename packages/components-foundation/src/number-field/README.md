# Number Field

A field that the user types a number in. It is a text input, as the text field is (see `../text-field/README.md` for what they share and
where it came from), around a native `<input type="number">`, which parses the number, steps it with the arrow keys, and validates its range
and step. Its step buttons are for the pointer, not the tab order, since the arrow keys step.

- Contract: `NumberFieldElement`, `NumberFieldParts` (`number-field.ts`), on `TextInputElement`.
- Behavior: `NumberFieldController` (`number-field.controller.ts`), on `TextInputController`, with `stepUp()` and `stepDown()`.

## What was taken from where

| Aspect | FAST Foundation | Here |
| --- | --- | --- |
| Element | A native `<input type="text" inputmode="numeric">`, its own parsing, stepping, and range | A native `<input type="number">`: the browser parses, steps with the arrow keys, and validates (`rangeUnderflow`, `rangeOverflow`, `stepMismatch`, `badInput`) |
| Step buttons | `step-up` and `step-down` parts, with glyph slots, hidden when read only or disabled, or by `hide-step` | FAST Foundation's parts and slots, out of the tab order and hidden from assistive technology (the arrow keys step); they call the native `stepUp()` and `stepDown()` and emit `input` and `change` as the user does |
| Native spinners | (a text input has none) | Hidden by the template's styles |
| `min`, `max`, `step` | Bound to the input, and used by its own stepping | Written to the input as numbers |
| Value | A string, its own number parsing | A string, as a native input's |

Considered and not taken yet:

- `valueAsNumber`, as a native number input has.
- Formatting the number for the locale (grouping, decimals): a native number input doesn't.
