# Listbox and Listbox Option

A listbox (`role="listbox"`) has options, of which one or any number are selected, as a native `<select>` that shows its options: the
[ARIA listbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/). The host is the listbox and the form control, and keeps the
focus; it points at the active option with `aria-activedescendant`.

- Contract: `ListboxElement` (`listbox.ts`), `ListboxOptionElement`, `ListboxOptionParts`, `listboxOptionAria`, and `collapsedText`
  (`../listbox-option/listbox-option.ts`).
- Behavior: `OptionListController` (`option-list.controller.ts`): the options, the active one, the selection, and the keys of the pattern,
  shared by the Listbox, the popup of the Select, and the popup of the Picker. `ListboxController` (`listbox.controller.ts`): the Listbox
  element, with the focus, clicks, events, and the form.

## What was taken from where

The source: FAST Foundation 3.0.0-alpha.33 (the archive).

| Aspect | FAST Foundation | Here |
| --- | --- | --- |
| Focus | The host, with `aria-activedescendant`, by the option's id (generated) | The host, with `ariaActiveDescendantElement` through `ElementInternals`: no ids |
| Form control | Not the listbox (the select is) | The Listbox, as a native `<select multiple>` or `<select size>`: `name`, the selected options' values under it, `required` with the browser's message, reset to the `selected` attributes |
| Options | `role="option"` elements, or native `<option>`s | `ListboxOption`s, by their class |
| Option's `selected` | An attribute for `defaultSelected` and a property, with dirtiness | The native option's: the `selected` attribute is `defaultSelected`, which sets `selected` until the user or code changes it |
| Option's `value` | The `value` attribute, or the text | The same |
| Visual focus | The selected option, outlined when the listbox is focused | `active`, given by the list, shown as `:state(active)`, scrolled into view |
| Keys | Up, Down, Home, End, typing; in multiple, Shift and Control combinations, and Space; checked versus selected | The ARIA pattern: Up and Down without wrapping, Home, End, typing (500 ms, the same letter cycles); single selection follows the keys; multiple: Space toggles, Shift with Up and Down selects as it moves, Control with A selects all |
| Disabled and hidden options | Skipped | Skipped: hidden ones are those a Picker filtered out |
| Read only | | `readonly`, with `aria-readonly`: the keys move, nothing is selected |
| Events | `change` | `input` and `change` from the host, as a native select's, for the user's changes only |

Considered and not taken:

- FAST Foundation's distinction between the options that are checked and those that are selected in multiple selection: the ARIA pattern
  needs only `aria-selected`.
- Shift with a click, and Control with Shift with Home and End, to select ranges: add them on the first real use.
- Option groups (`role="group"`, as `<optgroup>`): add them on the first real use.
- A `size` (the number of visible options): the styles set the height.
