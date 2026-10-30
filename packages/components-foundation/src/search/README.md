# Search

A field that the user types a search in. It is a text input, as the text field is (see `../text-field/README.md` for what they share and
where it came from), around a native `<input type="search">` (the `searchbox` role), with a clear button.

- Contract: `SearchElement`, `SearchParts` (`search.ts`), on `TextInputElement`.
- Behavior: `SearchController` (`search.controller.ts`), on `TextInputController`, with `clear()`.

## What was taken from where

| Aspect | FAST Foundation | Here |
| --- | --- | --- |
| Element | A native `<input type="search">`, and a proxy for the form | The shared text input, on an `<input type="search">` |
| Clear button | A `clear-button` part (a `<button>` out of the tab order), with a `clear-glyph` slot, hidden by a class without a value | FAST Foundation's part and slot, hidden from assistive technology too (Escape clears a search field), and hidden by `hidden` without a value or when read only, keeping its place |
| The native cancel button | Hidden by the styles | Hidden by the template's styles |
| Clearing | Empties the value and emits `change` | `clear()`: empties the value, emits `input` and `change` as the user's, and focuses the field |

The rest is as for the text field.
