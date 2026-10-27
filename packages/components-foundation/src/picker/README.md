# Picker

A picker is an input that suggests options as the user types, from a popup, and takes one value, or several, listed before the input: the
[ARIA combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) with list autocomplete. It takes the place of FAST
Foundation's Combobox, which is a picker of one value with `freeform`, and of its Picker, whose list, list item, menu, and menu option
were elements of their own.

- Contract: `PickerElement` and `PickerParts` (`picker.ts`); the options are `ListboxOptionElement`s.
- Behavior: `PickerController` (`picker.controller.ts`), with the Listbox's `OptionListController` for the options, the active one, and the
  selection. It renders the values, so each framework's template has an empty `values` part, and copies the content of their remove
  buttons from an element of the template, such as a design system's icon.

The host is the form control, and delegates its focus to the native input in its shadow root, which is the combobox, beside the popup, as
in the Select. The popup has the listbox and its status, which says that the options are loading or that none is found.

## What was taken from where

The source: FAST Foundation 3.0.0-alpha.33 (the archive: Combobox and Picker).

| Aspect | FAST Foundation | Here |
| --- | --- | --- |
| Elements | Combobox: the host is the combobox, with its input in its shadow root, and a proxy. Picker: an input in a picker list, with list items and a picker menu of menu options, and an anchored region | One element, the form control, with the native input (`role="combobox"`) and the listbox popover in its shadow root; the options are Listbox Options |
| One value or several | Combobox: one. Picker: several, as list items, and `max-selected` | `multiple`: several, listed before the input |
| Values that aren't options | Combobox: any text is the value. Picker: no | `freeform`: in single selection, the text is the value when no option has it; in multiple, Enter adds the text |
| Options | Combobox: its options. Picker: a comma-separated `options` attribute, rendered by templates | Its options, which the author can change, also while the user types |
| Filtering | Combobox: `autocomplete` (`inline`, `list`, `both`), by the start of the text. Picker: `filter-query`, by the start, and `filter-selected` | List autocomplete: the options that contain the text, without case or accents. `filter`, cancelable, comes first, so an author who finds the options otherwise cancels it |
| Selected options in multiple selection | Removed from the menu (`filter-selected`) | Shown, selected, and toggled again by Enter |
| Popup | Combobox: `position: fixed`, by script. Picker: an anchored region | An `auto` popover, with the field as its source and anchor; below, flipped above, at least as wide; it stays open to say that no option is found |
| Keys | Up and Down move; Enter selects; Escape closes or clears; Picker: Left and Right move between list items | The ARIA pattern with manual selection: Down and Up open and move the active option; Enter selects it (and adds the text with `freeform`); Escape closes, then clears; Backspace in the empty input removes the last value. Home, End, and Space stay the input's |
| Values | List items, focusable, with templates | Rendered by the controller in the `values` part (`role="list"`), each with a remove button for the mouse, hidden from assistive technology, as the Search's clear button, whose content is the design system's (`PickerStatics.removeValue`) |
| Text that isn't an option, without `freeform` | Combobox: kept as the value | Put back to the selection when the user leaves; an empty input clears it |
| Name | `aria-label` | An outside `<label for>`, as the input's `ariaLabelledByElements`; the author's ARIA on the host forwarded to the input |
| Form | Combobox: its text, through the proxy. Picker: not a form control | The values, as `FormData` under its name in multiple selection; `required`, `readonly`, reset to the `selected` attributes |
| Loading and no options | Picker: `loading-text`, `no-suggestions-text`, and a progress ring | The popup's `status` part (`role="status"`): the `loading` slot while `loading` is set, which the author sets while finding the options after canceling `filter` (with `aria-busy` on the listbox), and otherwise the `no-results` slot when no option is shown. AWC's defaults are "Loading" and "No results" |

Considered and not taken:

- Inline autocomplete (the rest of the first match written in the input, selected): add it on the first real use.
- Focusable values, moved between with Left and Right (FAST Foundation's Picker): Backspace removes the last, and a value's own keys can
  come with a real need.
- Implicit submission with Enter in single selection, as the text fields do: Enter selects in a picker; add it if needed.
- The browser's `<datalist>`: it can't be styled, and has no multiple selection.
