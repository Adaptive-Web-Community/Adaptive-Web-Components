# Text Area

A field of several lines that the user types text in. It is a text input, as the text field is (see `../text-field/README.md` for what they
share and where it came from), around a native `<textarea>`. Enter starts a line; it doesn't submit the form.

- Contract: `TextAreaElement`, `TextAreaResize`, `TextAreaParts` (`text-area.ts`), on `TextInputElement`.
- Behavior: `TextAreaController` (`text-area.controller.ts`), on `TextInputController`, without implicit submission.

## What was taken from where

| Aspect | FAST Foundation | Here |
| --- | --- | --- |
| Element | A native `<textarea>` in the shadow root, and a proxy for the form | The shared text input, on a `<textarea>` |
| Enter | A new line | A new line: no implicit submission |
| `rows`, `cols` | Bound to the textarea | Written to the textarea by the controller |
| Resize | `resize`: `none`, `both`, `horizontal`, `vertical`, done by the styles | FAST Foundation's `resize`, done by the template's styles |
| Label | The default slot, in a `<label for="control">` | The shared label |

Considered and not taken yet: growing with its content (an `auto-resize` attribute): the CSS `field-sizing: content` may do it in
the styles, where browsers support it. The rest is as for the text field.
