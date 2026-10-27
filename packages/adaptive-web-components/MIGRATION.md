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
| | `commandfor` and `command`, as a native button: it opens and closes a popover or a dialog (ours too) |
| `proxy`, the hidden `<input>` in the light DOM | Gone. A submission adds a hidden native button to the form for its time, which a `submit` listener sees as `event.submitter` |

## Anchored Region

Removed: a popover, positioned by CSS anchor positioning, does what it worked around. The components that used it (the picker)
are migrated to popovers.

## Disclosure

Removed: an `AccordionItem` alone is a disclosure with a heading, and a native `<details>` is one without.

## Flipper

Removed: it was a mouse-only control for scrolling a carousel, out of the tab order. A carousel, when there is one, follows the
[ARIA carousel pattern](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/), whose previous and next buttons are focusable controls, and
can use CSS's `::scroll-button()` when every browser has it.

## Horizontal Scroll

Removed: it was a list laid out in a row, with flippers. A `List` in the `horizontal` orientation is the list, with its overflow scrolled;
scroll snapping and the rest of how it scrolls are CSS.

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
| `focus()` of the element, which focused the `<a>` | `delegatesFocus`: the same, and the element's `tabindex` is the `<a>`'s |

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

## Dialog

The element wraps a native `<dialog>`, which has the top layer, the backdrop, the inert page, and the focus.

| 0.10 | Now |
| --- | --- |
| `FASTDialog` (FAST Foundation) | `Dialog` |
| `modal`, `show()`, `hide()`, `hidden` | The native `show()`, `showModal()`, `close(returnValue)`, `returnValue`, and `open` |
| The `dismiss` event | `cancel` (cancelable), from Escape or, with `closedby="any"`, a click outside |
| `no-focus-trap` | Gone: a modal native dialog makes the page inert |
| The `positioning-region` and `overlay` parts | Gone: the `control` part is the `<dialog>`, and the overlay is its `::backdrop` |
| `aria-label`, `aria-labelledby`, `aria-describedby` properties | The `aria-*` attributes of the element, forwarded to the `<dialog>` |
| | An invoker's `command` opens and closes it (`show-modal`, `close`, `request-close`, or with `--` from a native button) |

## Tooltip

The element is a popover in the top layer, placed next to its anchor by CSS anchor positioning instead of Floating UI.

| 0.10 | Now |
| --- | --- |
| `FASTTooltip` (FAST Foundation) | `Tooltip` |
| `placement`: `top`, `bottom`, `left`, `right`, `-start`, `-end` | `placement` in the writing direction: `above`, `below`, `before`, `after`, with `-start`, `-end` (above and below), `-top`, `-bottom` (before and after). The default is `above` |
| `visible`, `show` | Gone: `showPopover()` and `hidePopover()` |
| The `dismiss` event | Gone: Escape hides it |
| `[visible]` in selectors | `:popover-open` |
| | `anchorElement`, to set the anchor as an element |
| The anchor's `aria-describedby`, by id | The anchor's `ariaDescribedByElements`, added to the author's |

## Tablist

The tabs and the panels are laid out apart now: the tablist is the strip of tabs, and its panels are another element's.

| 0.10 | Now |
| --- | --- |
| `FASTTabs` (FAST Foundation), `<adaptive-tabs>` with the tabs and the panels | `Tablist`, `<adaptive-tablist panels="id">` with the tabs; the `TabPanel`s are the children of the element with that id, in the order of the tabs |
| `activeid`, the id of the active tab, and `activetab` | The `selected` attribute of a `Tab`. The tablist keeps one selected |
| The tabs' `change` event, with the active tab as the detail | The tab's `change`, which bubbles; its target is the tab |
| The tabs set an `id` on each tab and panel, generated when missing | The ids are the author's; the tabs and panels reference each other by ARIA element reflection |
| `role="tablist"` on an element of the shadow root | The host is the tablist, through `ElementInternals` |
| `TabsOrientation` | `Orientation` from `@adaptive-web/components-foundation` |
| The `tablist` and `tabpanel` parts | Gone: the host is the strip, and the panels' element is the author's |
| The `start` and `end` slots | Gone: put content beside the tablist |
| Inline `grid-row` and `grid-column` styles, and a `vertical` class, on each tab | None: the tablist lays out its tabs in its orientation |
| `adjust()` | Gone: select a tab, or press the arrows |

## Tab

| 0.10 | Now |
| --- | --- |
| `FASTTab` (FAST Foundation) | `Tab` |
| `role`, `aria-selected`, `aria-controls`, and `slot` written to the element | `ElementInternals`; no slot |
| `[aria-selected="true"]` in selectors | `[selected]` |
| | `selected`, reflected; clicking the tab selects it |
| | The `content` part, around the default slot |

## Tab Panel

| 0.10 | Now |
| --- | --- |
| `FASTTabPanel` (FAST Foundation) | `TabPanel` |
| `role`, `aria-labelledby`, and `slot` written to the element | `ElementInternals`, named by its tab; it is a child of the tablist's panels' element |

## Toolbar

| 0.10 | Now |
| --- | --- |
| `FASTToolbar` (FAST Foundation) | `Toolbar` |
| `role` and `aria-*` written to the element | `ElementInternals`. The `label` slot now names the toolbar |
| Items: anything focusable, found with `tabbable`, including inside components | Elements that take focus, hosts that delegate their focus (a link, a text field), and those in a plain element around them |
| The arrows stop at the ends | They wrap; Home and End move to the ends. The keys of a text input aren't taken |
| `activeIndex`, `direction` | Gone: the toolbar keeps the active item, and reads the direction when a key is pressed |
| `Orientation` from `@microsoft/fast-web-utilities` | From `@adaptive-web/components-foundation` |
| `ToolbarParts` from this package | The components foundation's (`positioning-region`), also exported here |

## List and List Item

New: a list (`role="list"`) of items (`role="listitem"`), in an `orientation` (`vertical` by default). In the `horizontal` orientation it
takes the place of the Horizontal Scroll: its overflow scrolls, and the styles decide how.

## Breadcrumb

| 0.10 | Now |
| --- | --- |
| `FASTBreadcrumb` (FAST Foundation) | `Breadcrumb` |
| `role="navigation"` written to the element | `ElementInternals`. Give it an `aria-label` |
| The breadcrumb sets `aria-current` on the last item's `<a>`, wherever it is | The last item's `current`; the item sets `aria-current="page"` on its link |

## Breadcrumb Item

| 0.10 | Now |
| --- | --- |
| `FASTBreadcrumbItem` and `AdaptiveBreadcrumbItem` | `BreadcrumbItem`, which extends `Anchor` |
| `role="listitem"` written to the element, and the `listitem` part | `ElementInternals`; the host is the list item |
| `separator`, given by the breadcrumb | `current`, given by the breadcrumb: the separator is hidden for the current item |
| `ValuesOf` (of `BreadcrumbItemStatics`) from `@microsoft/fast-foundation` | From `@adaptive-web/components-foundation` |

## Listbox

The listbox is a form control now, as a native `<select multiple>` or `<select size>`.

| 0.10 | Now |
| --- | --- |
| `FASTListboxElement` (FAST Foundation) | `Listbox` |
| `role`, `aria-multiselectable`, and `aria-activedescendant` (by id) written to the element | `ElementInternals`; the active option as an element |
| | `name`, `required`, `readonly`, `value`, `selectedOptions`, and the validity API; the selected options' values go to the form |
| `size` | Gone: the styles set the height |
| `selectedIndex`, `selectFirstOption()`, and the other methods | Gone: `value`, or the options' `selected` |
| The `change` event | `input` and `change`, for the user's changes |
| The selected option outlined when the listbox has the focus | The active option, `:state(active)` |

## Listbox Option

| 0.10 | Now |
| --- | --- |
| `FASTListboxOption` (FAST Foundation) | `ListboxOption` (still `<adaptive-option>`) |
| `role`, `aria-selected`, and `aria-checked` written to the element | `ElementInternals`; `checked` is gone |
| `[aria-selected="true"]` and `[aria-checked="true"]` in selectors | `:state(selected)`; the active option is `:state(active)` |
| A proxy `<option>`, and the `Option`-like constructor arguments | Gone |

## Select

The select's host is the form control, and its combobox is in its shadow root, beside the popup, which is a popover now.

| 0.10 | Now |
| --- | --- |
| `FASTSelect` and `AdaptiveSelect` | `Select`, defined with `delegatesFocus` |
| `role="combobox"` and `aria-*` written to the element | The `control` part is the combobox; the element's ARIA is forwarded to it |
| `multiple` and `size`, which showed the options inline | Gone: use a `Listbox` |
| `open` | Gone: the `:state(open)` custom state while the popup is open |
| The popup placed by script (`position: fixed`) | A popover, placed by CSS anchor positioning |
| `[aria-haspopup]` and `:not([aria-haspopup])` in the anatomy (`isDropdown`, `isListbox`) | Gone; `open` and `readOnly` conditions |
| `selectedIndex`, `displayValue`, and the other members of FAST's listbox | `value`, and the options' `selected` |
| | `readonly`, and `required` with an empty value as a placeholder |
| `ValuesOf` (of `SelectStatics`) from `@microsoft/fast-foundation` | From `@adaptive-web/components-foundation` |

## Picker

The picker is a form control of options now, with one value or several, and takes the place of the Combobox (see there).

| 0.10 | Now |
| --- | --- |
| `FASTPicker` (FAST Foundation) | `Picker`, defined with `delegatesFocus` |
| `options`, a comma-separated attribute | `ListboxOption`s in the default slot |
| `selection`, a comma-separated attribute | `value` and `values`; the options' `selected` |
| Several values, always; `max-selected` | `multiple`; one value without it. No maximum |
| `filter-query` and `filter-selected` | Filtering by what the options contain, after a cancelable `filter` event |
| `menu-placement` | Gone: the popup is placed by CSS anchor positioning |
| `label`, `labelled-by` | An outside `<label for>`, or `aria-label` on the element |
| `loading-text`, `no-suggestions-text`, `suggestions-available-text` | The `loading` and `no-results` slots of the popup's status ("Loading" and "No results" by default); `loading` while the author finds the options |
| The `region`, `loading-display`, `no-options-display`, and `loading-progress` parts | `root`, `values`, `value`, `value-label`, `value-remove`, `control`, `indicator`, `popup`, `listbox`, `status` |
| | `PickerStatics.removeValue`, the content of a value's remove button |
| | `freeform`, `name`, `required`, `readonly`, `placeholder`, and the validity API |

## Combobox

Removed: a `Picker` with `freeform` is a combobox, whose text is the value when no option has it.

| 0.10 | Now |
| --- | --- |
| `<adaptive-combobox>` | `<adaptive-picker freeform>` |
| `autocomplete` (`inline`, `list`, `both`, `none`) | List autocomplete: the options that contain the text are shown |
| `ComboboxStatics.indicator` | `PickerStatics.indicator` |

## Picker List, Picker List Item, Picker Menu, Picker Menu Option

Removed: the picker's input and values are its own parts, and its options are `ListboxOption`s.

## Menu

A menu that opens is a popover now: give it `popover`, and open it with a button's `commandfor`.

| 0.10 | Now |
| --- | --- |
| `FASTMenu` and `AdaptiveMenu` | `Menu` |
| `role="menu"` written to the element | `ElementInternals` |
| Shown inline, or in an anchored region | Inline, or a popover the author marks with `popover`; a submenu is a popover anchored to its item |
| `focus()`, which focused the first item | The first item has the focus when it opens; `focus()` is the element's own |
| `collapseExpandedItem()` and the other members | Gone |

## Menu Item

| 0.10 | Now |
| --- | --- |
| `FASTMenuItem` and `AdaptiveMenuItem` | `MenuItem` |
| The `role` attribute (`menuitem`, `menuitemcheckbox`, `menuitemradio`), and `MenuItemRole` | `type` (`item`, `checkbox`, `radio`), and `MenuItemType` from `@adaptive-web/components-foundation`; the role is through `ElementInternals` |
| `expanded`, an attribute | The `:state(expanded)` custom state while the submenu is open |
| `start-column-count`, given by the menu | `startColumns`, given by the menu, and the `:state(start-columns-1)` and `:state(start-columns-2)` custom states |
| `[aria-checked="true"]` in selectors | `:state(checked)` |
| The `checkbox-indicator` and `radio-indicator` parts | `indicator` |
| The `submenu-container` part, placed by Floating UI | Gone: the submenu is a popover |
| `change`, for every item | `click` when it is activated; `change` when a checkbox or radio is checked |
| `ValuesOf` (of `MenuItemStatics`) from `@microsoft/fast-foundation` | From `@adaptive-web/components-foundation` |
