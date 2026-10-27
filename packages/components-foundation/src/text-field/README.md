# Text Field

A field of one line that the user types text in. It wraps a native `<input>` (the `control` part), since what the browser does for one
(selection, input methods, spelling, autofill) can't be done for a custom element, and the host is the form control, through
`ElementInternals`.

- Contract: `TextFieldElement`, `TextFieldType`, `TextFieldParts` (`text-field.ts`), on `TextInputElement` (`../text-input/text-input.ts`),
  which the text area, the number field, and the search share.
- Behavior: `TextFieldController` (`text-field.controller.ts`), on `TextInputController` (`../text-input/text-input.controller.ts`).

## What was taken from where

| Aspect | FAST Foundation | Here |
| --- | --- | --- |
| Element | A native `<input>` in the shadow root, and a proxy `<input>` in the light DOM for the form | A native `<input>` in the shadow root; the host is the form control through `ElementInternals` |
| Attributes of the input | Bound by the template | Written by the controller, so the validity is right as soon as one changes, and the template is a bare `<input>` |
| Value | `value`, and the `value` attribute as the default, with a dirty flag | The same, as a native input |
| Form value and validity | The proxy's | `setFormValue`, and the input's validity, shown at the input |
| `change` | Dispatched again from the host | Dispatched again from the host, bubbling, as a native `change` |
| Enter | | Implicit submission, with the HTML standard's types that block it |
| Focus | `focus()` focuses the input (AWC) | `delegatesFocus`, so a label of the element, a click on it, and `focus()` reach the input |
| Label | The default slot, in a `<label for="control">` | FAST Foundation's default slot, in a `<label for="control">`, hidden when empty. An outside `<label for>` of the element names the input, as its `ariaLabelledByElements` |
| The author's ARIA | About twenty properties written to the input | Forwarded to the input by the `AriaForwardingController`, as for the anchor |
| Disabled | The proxy's, and the input's `disabled` | The platform's: `formDisabledCallback` (its attribute or a fieldset) disables the input |
| Read only and required | Bound to the input | Written to the input; a read only field takes focus and isn't validated, natively |
| Types | `text`, `email`, `password`, `tel`, `url` | FAST Foundation's |
| `pattern`, `maxlength`, `minlength`, `placeholder`, `autocomplete` | Bound to the input (not `autocomplete`) | Written to the input, as `maxLength` and `minLength` |

Considered and not taken yet:

- `list` (a `<datalist>` by id): the id doesn't reach into the shadow root, and element reflection doesn't cover `list`.
- `spellcheck`, `size`, `inputmode`, `enterkeyhint`: global or rarely used attributes that the controller would need to observe.
- `select()` and the selection API of a native input.
- `autofocus` for an element defined after the page loaded, as for the button.
