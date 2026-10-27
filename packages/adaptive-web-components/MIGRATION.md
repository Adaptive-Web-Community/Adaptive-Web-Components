# Migration

What changed in the components since 0.10, as they move from FAST Foundation to `fast-element` 3 and `@adaptive-web/components-foundation`, and what to use
instead. A component that isn't listed hasn't changed yet.

## All components

- The components depend on `@microsoft/fast-element` 3 and `@adaptive-web/components-foundation`, and not on `@microsoft/fast-foundation`. The contract of
  each element (its properties, enumerations, and parts) and its behavior are in the foundation; the element classes and templates are here.
- `compose<Name>(ds, options)` returns a `Promise<FASTElementDefinition>`, since composing a definition is asynchronous in `fast-element` 3.
- A form control has the validity API of a native one (`validity`, `validationMessage`, `willValidate`, `checkValidity()`,
  `reportValidity()`), from `BaseFormControl`.
- `StaticallyComposableHTML` and `staticallyCompose` are this package's, in `utilities/template-helpers.ts`. `ValuesOf` is the components foundation's.

## Accordion

| 0.10 | Now |
| --- | --- |
| `FASTAccordion` (FAST Foundation) | `Accordion` |
| `expandmode` | `expandMode` (the attribute is still `expand-mode`) |
| `AccordionExpandMode` from `@microsoft/fast-foundation` | From `@adaptive-web/components-foundation` |
| The accordion's `change` event, with the active item's id | The item's `change`, which bubbles; its target is the item |
| The accordion sets an `id` on each item | The item's `id` is the author's |

## Accordion Item

| 0.10 | Now |
| --- | --- |
| `FASTAccordionItem` (FAST Foundation) | `AccordionItem` |
| `headinglevel` | `headingLevel` (the attribute is still `heading-level`) |
| The `region` part | `panel`, which has the `hidden` attribute when the item is collapsed |
| `AccordionItemParts` from this package | The foundation's, also exported here |
| An item expands only in an accordion | An item toggles itself, and alone works as a disclosure with a heading |
| The `expandbutton` property | `expandButton`, internal. Use `focus()` to focus the button |
| | `collapsible`, set by the accordion to `false` for the item it keeps expanded in the `single` mode |

## Button

The element is the button now, with the `button` role and form association through `ElementInternals`, and not a wrapper of a native
`<button>`. See `docs/decisions/0010-a-control-is-its-host-element.md`.

| 0.10 | Now |
| --- | --- |
| `AdaptiveButton` (extends FAST Foundation's `FASTButton`) | `Button` |
| The `control` part, the native button | The host. Styles target the host, and its focus is the host's (`Focus.contextFocused()`) |
| `ButtonParts.control` | Gone. `ButtonParts` is the foundation's (`content`), also exported here |
| `ButtonType` from `@microsoft/fast-foundation` | From `@adaptive-web/components-foundation` |
| The `aria-*` properties (`ariaLabel`, `ariaDescribedby`, and the others) mirrored onto the native button | The `aria-*` attributes of the host, as for any element |
| `formaction`, `formenctype`, `formmethod`, `formnovalidate`, `formtarget` properties | `formAction`, `formEnctype`, `formMethod`, `formNoValidate`, `formTarget` (the attributes are the same) |
| `formId` (the `form` attribute) | The `form` attribute, which the platform reads. `form` is the form element |
| `[disabled]` in selectors | `:disabled`, which a disabled fieldset also matches |
| `:active` | `:is(:active, :state(active))`, since Space doesn't make a custom element `:active` |
| The `icon-only` class on the control | The `icon-only` custom state, `:state(icon-only)`. Text other than white space isn't icon only |
| `shadowOptions: { delegatesFocus: true }` in its definition | No `delegatesFocus`: the host takes focus |
| `type` absent: does nothing | `type` is `button` by default, which does nothing |
| `proxy`, the hidden `<input>` in the light DOM | Gone. A submission adds a hidden native button to the form for its time, which a `submit` listener sees as `event.submitter` |

## Badge

| 0.10 | Now |
| --- | --- |
| `FASTBadge` (FAST Foundation) | `Badge` |
| The `control` part around the content | The host is the badge's box; styles target the host |
| | `start` and `end` slots, and the `content` part around the default slot |
| `BadgeParts` from this package | The components foundation's (`content`), also exported here |

## Avatar

| 0.10 | Now |
| --- | --- |
| `FASTAvatar` (FAST Foundation) | `Avatar` |
| No role: the `alt` of a slotted image or the text was read | `role="img"`, so the content of the slots isn't read |
| | `name`, the accessible name. An `aria-label` on the element overrides it. Give a slotted image `alt=""` |
| `AvatarParts` from this package | The components foundation's (`backplate`), also exported here |

## Divider

| 0.10 | Now |
| --- | --- |
| `FASTDivider` (FAST Foundation) | `Divider` |
| The `role` property, and `DividerRole` | The `separator` role is the default, through `ElementInternals`. For decoration, set the `role="presentation"` attribute |
| `aria-orientation` written to the element | Through `ElementInternals` |
| `Orientation` from `@microsoft/fast-web-utilities` | From `@adaptive-web/components-foundation` |

## Progress

| 0.10 | Now |
| --- | --- |
| `FASTProgress`, `FASTBaseProgress` (FAST Foundation) | `Progress`, which extends `BaseProgress` |
| `role` and `aria-value*` written to the element | Through `ElementInternals` |
| A value outside the range was shown out of it | Shown and reported at the nearest end; `value` keeps what was set |
| `min` and `max` could be `null` | Numbers, 0 and 100 when the attribute is absent |
| `percentComplete` | Gone: `progressPercent(progress)` of the components foundation, and `--percent-complete` on the `determinate` part |
| `ProgressParts` from this package | The components foundation's, also exported here |

## Progress Ring

| 0.10 | Now |
| --- | --- |
| `FASTProgressRing` (FAST Foundation) | `ProgressRing`, which extends `BaseProgress` |
| | The rest is the progress's (see Progress) |
| `ProgressRingParts` from this package | The components foundation's, which adds `background`, also exported here |

## Skeleton

| 0.10 | Now |
| --- | --- |
| `FASTSkeleton` (FAST Foundation) | `Skeleton` |
| In the accessibility tree | Hidden (`aria-hidden` through `ElementInternals`). Put `aria-busy="true"` on the container that is loading |
| `fill` | Gone: nothing used it |
| The pattern in an `<object>` | An `<img alt="">`, the `pattern` part |
| | The `shimmer` part |
| `SkeletonShape` from `@microsoft/fast-foundation`, `SkeletonParts` from this package | From the components foundation, also exported here |

## Anchor

The element wraps a native `<a>`, as it did, so the browser treats it as a link.

| 0.10 | Now |
| --- | --- |
| `AdaptiveAnchor` (extends FAST Foundation's `FASTAnchor`) | `Anchor` |
| The `aria-*` properties (`ariaLabel`, `ariaDescribedby`, and the others) written to the `<a>` | The `aria-*` attributes of the element, forwarded to the `<a>` as they change. Ids (`aria-describedby`) are forwarded as the elements, so they resolve |
| `referrerpolicy` | `referrerPolicy` (the attribute is the same) |
| `AnchorTarget` from `@microsoft/fast-foundation` | Gone: `target` is a string |
| The `icon-only` class on the control | The `icon-only` custom state, `:state(icon-only)`. Text other than white space isn't icon only |
| `AnchorParts` from this package | The components foundation's (`control`, `content`), also exported here |

## Card

| 0.10 | Now |
| --- | --- |
| `FASTCard` (FAST Foundation) | `Card`, an element with a default slot. It has no contract in the components foundation, since it has nothing to share |

## Checkbox

| 0.10 | Now |
| --- | --- |
| `FASTCheckbox` (FAST Foundation) | `Checkbox`, which extends `BaseCheckable` (with `Switch` and `Radio`) |
| The role and `aria-*` written to the element, and a proxy `<input>` in the light DOM | `ElementInternals`: the role, `ariaChecked`, the form value, and validity |
| `[aria-checked='true']` and `[aria-checked='mixed']` in selectors | `:state(checked)` and `:state(indeterminate)` |
| `[disabled]` in selectors | `:disabled`, which a disabled fieldset also matches |
| `readonly` (alpha.31) | `readonly`: focus, no change, `aria-readonly`, `:state(readonly)`, and not validated |
| The `label__hidden` class on an empty label | The `hidden` attribute |
| | The `input` event before `change`, as a native checkbox's |
| `CheckboxParts` from this package | The components foundation's (`control`, `label`), also exported here |

## Switch

| 0.10 | Now |
| --- | --- |
| `FASTSwitch` (FAST Foundation) | `Switch`, which extends `BaseCheckable` |
| The role and `aria-*` written to the element, and a proxy `<input>` | `ElementInternals`, as the checkbox |
| `[aria-checked='true']` in selectors | `:state(checked)` |
| Enter turned it on and off | Space only, as a native checkbox switch |
| `readonly` | `readonly`, as the checkbox's, with `:state(readonly)` |
| `SwitchParts` from this package | The components foundation's (`switch`, `label`, `thumb`), also exported here |

## Radio

| 0.10 | Now |
| --- | --- |
| `FASTRadio` (FAST Foundation) | `Radio`, which extends `BaseCheckable` |
| The role and `aria-*` written to the element, and a proxy `<input type="radio">` | `ElementInternals`, as the checkbox; each radio still gives its value to the form |
| `[aria-checked='true']` in selectors | `:state(checked)` |
| Radios grouped by `name` without a radio group | Use a `RadioGroup` around them |
| `required` | The radio group's `required` |
| `readonly` | The group's `readonly` makes its radios read only, with `:state(readonly)` |
| `RadioParts` from this package | The components foundation's (`control`, `label`), also exported here |

## Radio Group

| 0.10 | Now |
| --- | --- |
| `FASTRadioGroup` (FAST Foundation) | `RadioGroup` |
| `role` and `aria-*` written to the element | `ElementInternals`. The `label` slot now names the group |
| `disabled` | `disabled`, or a `<fieldset disabled>` around it: the group is `:disabled`, and its radios are `:state(disabled)` |
| `readonly` | `readonly`, with `aria-readonly`, given to its radios |
| | `required`: a radio must be checked; the group is a form control without a value of its own, for its validity |
| The `value` attribute | `value` is a property: the checked radio's value, which sets the checked radio. The radios' `checked` attributes are the default |
| `Orientation` from `@microsoft/fast-web-utilities` | From `@adaptive-web/components-foundation` |
| `RadioGroupParts` from this package | The components foundation's (`positioning-region`), also exported here |

## Text Field

The element wraps a native `<input>`, as it did, and is the form control itself, through `ElementInternals`, instead of a proxy `<input>`.

| 0.10 | Now |
| --- | --- |
| `AdaptiveTextField` (extends FAST Foundation's `FASTTextField`) | `TextField`, which extends `BaseTextInput` (with `TextArea`, `NumberField`, `Search`) |
| A proxy `<input>` in the light DOM | `ElementInternals`: the form value and the input's validity |
| The `aria-*` properties written to the input | The `aria-*` attributes of the element, forwarded to the input |
| `maxlength`, `minlength` properties | `maxLength`, `minLength` (the attributes are the same) |
| | `autocomplete` |
| `list`, `size`, `spellcheck` | Gone for now |
| `focus()` focused the input | `delegatesFocus`: a label of the element, a click on it, and `focus()` reach the input |
| `[disabled]` in selectors | `:disabled`, which a disabled fieldset also matches |
| `TextFieldType` from `@microsoft/fast-foundation`, `TextFieldParts` from this package | From the components foundation, also exported here |

## Text Area

| 0.10 | Now |
| --- | --- |
| `AdaptiveTextArea` (extends FAST Foundation's `FASTTextArea`) | `TextArea`, which extends `BaseTextInput`; the rest is as for the text field |
| `TextAreaResize` from `@microsoft/fast-foundation`, `TextAreaParts` from this package | From the components foundation, also exported here |
| `list`, `form` (a property), `spellcheck` | Gone for now; the `form` attribute works, as for any form control |

## Number Field

| 0.10 | Now |
| --- | --- |
| `AdaptiveNumberField` (extends FAST Foundation's `FASTNumberField`) | `NumberField`, which extends `BaseTextInput`; the rest is as for the text field |
| An `<input type="text" inputmode="numeric">` with its own parsing and stepping | A native `<input type="number">`, which parses, steps, and validates its range and step |
| `maxlength`, `minlength`, `size`, `list` | Gone: they don't apply to a number input |
| `NumberFieldParts` from this package | The components foundation's, also exported here |

## Search

| 0.10 | Now |
| --- | --- |
| `AdaptiveSearch` (extends FAST Foundation's `FASTSearch`) | `Search`, which extends `BaseTextInput`; the rest is as for the text field |
| The `clear-button__hidden` class | The `hidden` attribute, keeping the button's place |
| | `clear()`, which the clear button calls: it emits `input` and `change`, and focuses the field |
| `SearchParts` from this package | The components foundation's, which adds `input-wrapper`, also exported here |
