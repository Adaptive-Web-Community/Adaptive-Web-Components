# Select

A select is a combobox that shows the selected option and opens a popup of its options, of which one is selected, as a native `<select>`:
the [ARIA select-only combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/).

- Contract: `SelectElement` and `SelectParts` (`select.ts`); the options are `ListboxOptionElement`s.
- Behavior: `SelectController` (`select.controller.ts`), with the `OptionListController` of the Listbox for the options, the active one,
  the selection, and typing to find an option.

The host is the form control, and delegates its focus to the combobox in its shadow root. A combobox has to reference its popup
(`aria-controls`) while it is open, which ARIA 1.2 requires, and an ARIA reference can't point from a host into its own shadow root. So the
combobox is an element of the shadow root, beside the listbox popover, and it points at the active option, which is in the light DOM, by
ARIA element reflection. The host stays the form control, as a text field's does.

## What was taken from where

The source: FAST Foundation 3.0.0-alpha.33 (the archive).

| Aspect | FAST Foundation | Here |
| --- | --- | --- |
| Elements | The host is the combobox (`role="combobox"` written to it), with the listbox in its shadow root, and a proxy `<select>` for the form | The host is the form control; the combobox and the listbox popover are in the shadow root, with `aria-controls` by a fixed id, and the active option by element reflection: nothing is added to the light DOM |
| Multiple and size | `multiple` and `size` show the listbox inline | Single selection only: a Listbox is the inline and multiple select |
| Popup | `position: fixed`, placed by script above or below by the space | A popover (`auto`, so a click outside and Escape close it), shown with the combobox as its source, which is its anchor; placed below, flipped above, at least as wide as the combobox, by CSS anchor positioning |
| A selected option | The first, when none is | The first that isn't disabled when none is, as the options change, one is unselected, or the form is reset; none when `value` is set to one no option has, as a native select |
| Keys, closed | Up and Down change the selection; Space and Enter open | The ARIA pattern: Up, Down, Enter, Space, Home, End open; a letter opens at the option it starts |
| Keys, open | Up, Down, Home, End, typing move and select; Enter and Escape close | The ARIA pattern: Up, Down, Home, End, typing move the active option without selecting; Enter, Space, Alt with Up, and Tab select it and close; Escape closes |
| Visual focus | The selected option | `:state(active)`, from the shared options controller |
| Required | `required` through the proxy | `required`: missing its value when the selected option's value is empty (a placeholder option), with the browser's message |
| Read only | | `readonly`, with `aria-readonly`: it opens, nothing is selected |
| Name | `aria-label` on the host | An outside `<label for>`, as the combobox's `ariaLabelledByElements`; the author's ARIA on the host forwarded to the combobox |
| Events | `input` and `change` | `input` and `change` from the host, for the user's selection |

Considered and not taken:

- The customizable `<select>` (`appearance: base-select`): only Chromium has it, and its options have to be its own children, so the
  component can't wrap it.
- Multiple selection in the popup: a Listbox, or the Picker with chips.
- `showPicker()`, as a native select's, to open it by code: add it on the first real use.
