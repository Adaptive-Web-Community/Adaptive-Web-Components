# Principles of the components

How every component is built, so that the set works the same way. Each principle names the components that apply it now; a new component
applies them too, or says here why it doesn't. The decisions that cross packages are records in `docs/decisions/` and are linked.

## Layers

1. **The components need a modern browser**, and use the platform's features without fallbacks: `ElementInternals`, custom states, ARIA
   element reflection, popovers, CSS anchor positioning, and the invoker commands.
   Used by: all.
2. **Contract, behavior, binding.** The contract (an interface of the element's properties, its enumerations, its parts) and the behavior (a
   controller) are in this package, with no framework and no design system. A framework's binding implements the contract, has the template,
   and wires the lifecycle. ([0009](../../docs/decisions/0009-component-behavior-is-framework-neutral.md))
   Used by: all but Card, which has no behavior and no parts, so it has nothing to share and no contract here: its binding is an element with
   a default slot.
3. **A controller doesn't observe.** The binding observes with its framework's own reactivity and calls the controller's method for each
   change (`setItems`, `expandModeChanged`, `itemExpandedChanged`), and `connect` and `disconnect` with the element's lifecycle. What isn't
   in the contract, such as the author's ARIA to forward, the controller observes itself.
   Used by: Accordion, Button; Anchor (its `AriaForwardingController` observes the author's ARIA); Tablist,
   Toolbar.
4. **A controller gets only what it uses**, as a narrow type (`ButtonInternals` is the role, the form, and the states of `ElementInternals`), so
   it can be tested without a browser feature it doesn't need.
   Used by: Button.
5. **Behavior without state or lifecycle is a function**, not a controller.
   Used by: Accordion Item (`toggleAccordionItem`), Button and Anchor (`isIconOnly`), Progress and Progress Ring (`progressPercent`),
   Checkbox (`hasContent`, for its label), Tab (`selectTab`), Breadcrumb (`setBreadcrumbItems`).
6. **Components with the same behavior have one contract**, and a template each.
   Used by: Progress and Progress Ring (`ProgressElement`).
7. **Behavior that several components share is a controller of its own**, which their controllers use or extend.
   Used by: `SpacePressController` (Button, Checkbox, Switch, Radio), `CheckableController` (Checkbox, Switch, Radio),
   `TextInputController` (Text Field, Text Area, Number Field, Search), `InvokerController` (Button),
   `RovingFocusController` (Radio Group, Tablist, Toolbar; next: Menu, Tree).
8. **The controller writes what the contract gives a native element**, not the template: the native element's state (its validity) is then
   right as soon as an attribute changes, and each framework's template has the bare element.
   Used by: Text Field (its `<input>`), Text Area (its `<textarea>`), Number Field (its `<input type="number">`),
   Search (its `<input type="search">`).

## Elements and roles

9. **A control is its host element.** Its role and its form association are `ElementInternals`', and it takes focus itself. No native element
   inside, and no proxy element in the light DOM. ([0010](../../docs/decisions/0010-a-control-is-its-host-element.md))
   Used by: Button, Checkbox, Switch, Radio, and Tab, which is its host though it isn't a form control. Next: Slider.
10. **A control's label is its content**, in a `label` part that is hidden when it is empty. The role takes its name from it, clicking it
    activates the control, and a `<label for>` outside works too, through `ElementInternals`.
    Used by: Checkbox, Switch, Radio, Text Field (in a `<label for>` of its input), Text Area, Number Field, Search.
11. **A link, a text field, or a dialog wraps the native element.** What the browser does for a link (its context menu, opening it in a new
    tab, its URL, `:visited`), a text field (selection, input methods, spelling, autofill), or a dialog (the top layer, the inert page, focus
    moved in and back) can't be done for a custom element, so the native element is inside and has the role. A text field's host is still the
    form control, through `ElementInternals`.
    Used by: Anchor, Text Field, Text Area, Number Field, Search, Dialog, Breadcrumb Item (its link is the Anchor's). Next: the links of a
    menu.
12. **An element that invokes a command does it as a native button**: `commandfor` and `command` (the Invoker Commands API), a cancelable
    `command` event at the target first, then the native default for a popover or a `<dialog>`, with the invoker as the popover's source and
    anchor. A component whose native element would answer a command answers it from its host (a dialog's `show-modal`), since a native
    button's built-in commands work only on native elements; from a native button, the same command with `--`.
    Used by: Button (it invokes, with the `InvokerController`), Dialog (it answers).
13. **A floating element is a popover**, in the top layer, shown with the element it belongs to as its source, which is its implicit anchor,
    and placed by CSS anchor positioning in the styles: nothing is written to the anchor, and nothing is positioned by script.
    Used by: Tooltip, and the popovers a Button opens.
14. **A pattern that nests roles uses native elements in the shadow root for the inner ones**, and the host has no role: the accordion item's
    heading is a `role="heading"` element with a native `<button>` in it.
    Used by: Accordion Item, Breadcrumb (its list,
    inside the landmark that the host is).
15. **The author's ARIA is on the host.** Where the host has the role, it reaches it as written, and nothing is copied. Where a native
    element inside has the role, the `AriaForwardingController` forwards it there.
    Used by: Button (as written), Anchor (forwarded to its link), Text Field (forwarded to its input), Text Area, Number Field, Search,
    Dialog (forwarded to its `<dialog>`), Breadcrumb Item (forwarded to its link).
16. **The default ARIA of a host is a function of its properties** (a `DefaultAria`), which the binding assigns to the element's
    `ElementInternals` when one of those properties changes. An attribute the author puts on the host overrides it, as the platform does, so
    the default needs no property to turn it off (`role="presentation"` on a divider). In the value, a property that is absent is left as it
    is, and `null` clears one. A component that has a controller has the controller set it.
    Used by: Avatar (`img`, named by `name`), Divider (`separator`, in its orientation), Progress and Progress Ring (`progressbar`,
    with its values), Skeleton (hidden), Radio Group (`radiogroup`, in its orientation, through its controller), Tablist (`tablist`,
    in its orientation, through its controller), Tab (`tab`, selected,
    disabled, and the panel it controls), Tab Panel (`tabpanel`, named by its tab), Toolbar (`toolbar`, in its orientation,
    through its controller), List (`list`), List Item (`listitem`), Breadcrumb (`navigation`), Breadcrumb Item (`listitem`).
17. **An element works alone.** A container coordinates its children by reacting to their state, and by giving them what is the container's
    (a property each child reads), not by doing their behavior for them.
    Used by: Accordion Item (it toggles itself), Accordion (it reacts to `expanded`, and gives `collapsible`), Radio (it checks itself),
    Radio Group (it reacts to `checked`, and gives `groupReadOnly` and `groupDisabled`), Tab (it selects itself),
    Tablist (it reacts to `selected`, and gives each tab its `panel` and each panel of its panels' element its `tab`),
    Breadcrumb (it gives its last item `current`, and its item puts `aria-current` on its own link).
18. **A container knows its children by their class**, not by their tag name, which a design system's prefix changes. A child that isn't
    defined yet is waited for with `whenDefined` of the container's registry.
    Used by: Accordion, Radio Group (both with AWC's `onDefined`), Tablist (its tabs, and the panels of its panels' element),
    Toolbar (its items by whether they take focus,
    again when one is defined), Breadcrumb.

## ARIA references and ids

19. **A reference inside a shadow root uses a fixed id of that shadow root, named for its part**: `aria-controls="panel"` and
    `aria-labelledby="button"`. Ids don't leave the shadow root, so they can't collide, and nothing is generated.
    Used by: Accordion Item.
20. **The host's `id` is the author's.** A component never sets or generates it.
    Used by: Accordion, Accordion Item, Tablist, Tab, Tab Panel.
21. **A reference across shadow roots is ARIA element reflection** (`ariaDescribedByElements`), with the elements found by their ids where the
    host is. An id never crosses a shadow root as an id: it doesn't resolve there.
    Used by: Anchor (the author's `aria-describedby`, `aria-labelledby`, and the like, forwarded to its link), Radio Group (its `label` slot,
    as the `ariaLabelledByElements` of its `ElementInternals`), Text Field (an outside `<label for>`,
    as its input's `ariaLabelledByElements`), Text Area, Number Field, Search,
    Tooltip (it is added to its anchor's `ariaDescribedByElements`, after the author's), Tab and Tab Panel (each other,
    through their `ElementInternals`, which can't take an id at all), Toolbar (its `label` slot).

## State

22. **What the author sets is a reflected attribute; what the component works out is a custom state.** `expanded`, `disabled`, `expand-mode`,
    and `type` are attributes. `:state(active)` and `:state(icon-only)` are states of `ElementInternals`. A component doesn't add classes or
    attributes to its host for its own state, except `tabindex`, which focus needs, and `popover` (when the author gave none), which the top
    layer needs.
    Used by: Accordion, Accordion Item, Anchor (`:state(icon-only)`), Button, Divider (`orientation`), Skeleton (`shape`, `shimmer`),
    Checkbox (`:state(checked)`, `:state(indeterminate)`), Switch (`:state(checked)`), Radio (`:state(checked)`), Dialog (`:state(open)`,
    `:state(modal)`), Tab (`selected`, `disabled`), Tablist (`orientation`, `panels`), Toolbar (`orientation`), List (`orientation`).
23. **An attribute is the default of a state that the user changes**, as on a native element: the `checked` attribute is `defaultChecked`,
    `checked` is the state now, and a reset of the form goes back to the default.
    Used by: Checkbox, Switch, Radio, Text Field (the `value` attribute is `defaultValue`), Text Area, Number Field, Search.
24. **The platform's state where there is one.** A form control is `:disabled` from its `disabled` attribute or a disabled fieldset. Content
    that isn't shown has the `hidden` attribute, so it is hidden without the styles and from assistive technology.
    Used by: Button (`:disabled`), Accordion Item (the panel and the icons),
    Checkbox (`:disabled`; `hidden` on its indicators and an empty label), Switch (`:disabled`; `hidden` on an empty label),
    Radio (`:disabled`; `hidden` on its indicator and an empty label), Text Field (`:disabled`; the input's own `readonly`, `required`,
    and validity), Text Area, Number Field (also its range and step), Search (and `hidden` on its clear button without a value),
    Dialog (the `<dialog>`'s top layer, `::backdrop`, and inert page), Tablist (`hidden` on the panels it doesn't show),
    Breadcrumb Item (`hidden` on its separator when it is the current page).
25. **What is only decoration or a placeholder is hidden from assistive technology**: `aria-hidden` on an element, `alt=""` on an image.
    Used by: Accordion Item (its icons), Skeleton (itself, and its pattern image), Number Field (its step buttons, which the arrow keys do),
    Search (its clear button, which Escape does), Breadcrumb Item (its separator).
26. **Disabled isn't focusable.** A control's disabled is the platform's; an element that isn't a control disables its native element.
    A group of controls is a form control without a value, so it is `:disabled` from its own `disabled` or a fieldset around it, and it gives
    its controls that state (`groupDisabled`), which they show as `:state(disabled)`: their own `disabled` stays the author's.
    Disabled but focusable (`aria-disabled`, for a button in a toolbar or a menu) is left out of every component, to be decided for all of
    them together.
    Used by: Button, Accordion Item, Checkbox, Switch, Radio, Radio Group (its `disabled` or a fieldset), Text Field (its input,
    from `formDisabledCallback`), Text Area, Number Field, Search, Tab (`aria-disabled`, out of the tab order and skipped by the arrows).
27. **A control can be read only** (`readonly`): it takes focus, the user doesn't change it, it has `aria-readonly` and `:state(readonly)`,
    and it isn't validated, as a read only native input isn't. A group that is read only makes its controls read only.
    Used by: Checkbox, Switch, Radio Group (and its radios, through `groupReadOnly`), Text Field (natively), Text Area,
    Number Field (no stepping), Search (no clearing).
28. **A value outside its range is shown and reported at the nearest end**, and the property keeps the author's value: a component doesn't
    rewrite what the author set.
    Used by: Progress, Progress Ring.

## Keyboard and focus

29. **The keys of the ARIA pattern, with the timing of the native element** where there is one: a button clicks on Enter when it is pressed and
    on Space when it is released, and not if the focus left in between.
    Used by: Accordion (Up, Down, Home, End), Button, Checkbox (Space when it is released), Switch (the same),
    Radio (Space checks it when it is released), Radio Group (all four arrows, wrapping, Left and Right swapped right to left),
    Number Field (the native input's arrows), Tablist (the arrows of its orientation, wrapping, Home, End),
    Toolbar (the arrows of its orientation, wrapping, Home, End).
30. **A handler handles its own element's keys only.** It checks the event's target, so a key in slotted content isn't taken; it ignores an
    event whose default was already prevented; and it prevents the default of the keys it handles. A key of a text that the user edits isn't
    taken: an input in a toolbar keeps its caret. A tooltip's Escape is the exception: it hides it wherever the focus is while it is shown,
    as WCAG 1.4.13 asks.
    Used by: Accordion, Button, Checkbox, Switch, Radio, Radio Group (a key of a radio, not of its content), Tablist (a key of a tab),
    Toolbar (a key of an item, not of a text input).
31. **A focusable host takes focus itself, and keeps the author's `tabindex`.** An element whose focusable part is in its shadow root
    implements `focus()` to focus it, instead of `delegatesFocus`, unless it wraps a native form control, whose host delegates its focus
    (`delegatesFocus`), so a label of it, a click on it, and `focus()` reach the control.
    Used by: Button (the host), Accordion Item (its button), Anchor (its link), Checkbox (the host), Switch (the host), Radio (the host),
    Text Field (`delegatesFocus`, to its input), Text Area, Number Field, Search, Tab (the host), Breadcrumb Item (its link, as the Anchor).
32. **A composite has one item in the tab order**, the active one, and the arrow keys move the focus between its items. The composite owns
    their `tabindex`. An item that gets the focus by a click becomes the active one. A list whose items the arrows don't move between isn't a
    composite: the content of its items is in the tab order.
    Used by: Radio Group (the checked radio, with the `RovingFocusController`), Tablist (the selected tab), Toolbar (the first,
    or the last focused); List (static: none).

## Events

33. **Events are the native ones, or named and shaped like them.** They bubble, are composed only where the native one is (`input`), are for
    what the user did, and their target is the element that changed, without an id in the detail.
    Used by: Accordion Item (`change`), Button (`click`), Checkbox (`input`, `change`), Switch (the same), Radio (`input`, `change`,
    only when it becomes checked), Radio Group (none of its own: its radios' bubble through it),
    Text Field (the input's `input`; `change` dispatched again from the host, since the input's isn't composed), Text Area,
    Number Field (and `input` and `change` from its step buttons, as the user's), Search (and from its clear button, as the user's),
    Dialog (the `<dialog>`'s `cancel`, cancelable, and `close`, dispatched again from the host), Button and its targets (`command`),
    Tab (`change`, when the user selects it, which bubbles through its tabs).
34. **A cancelled event cancels the default behavior.** A click whose default was prevented before it reached the button doesn't submit or
    reset.
    Used by: Button, Checkbox, Switch, Radio, Dialog (a cancelled `cancel` keeps it open).

## Properties

35. **Property names are camelCase and the native element's** where there is one (`formAction`, `formNoValidate`); attribute names are HTML's
    (`formaction`, `heading-level`).
    Used by: Accordion (`expandMode`), Accordion Item (`headingLevel`), Anchor (`referrerPolicy`), Button, Checkbox (`defaultChecked`,
    `indeterminate`), Text Field (`maxLength`, `minLength`), Number Field (`stepUp()`, `stepDown()`), Dialog (`showModal()`, `returnValue`,
    `closedBy`).
36. **A reference to another element is an element property**, as a native one is (`commandForElement`), with an attribute of its id for
    HTML, found where the element is.
    Used by: Button (`commandForElement`), Tooltip (`anchorElement`), Tablist (`panelsElement`, with `panels`).
37. **Defaults are explicit values**, and the contract says where one differs from the native element's: `type` is `button`, unlike a native
    button's `submit`.
    Used by: Accordion (`multi`), Accordion Item (heading level 2, `collapsible`), Button (`type`), Divider (`horizontal`),
    Progress and Progress Ring (`min` 0, `max` 100), Skeleton (`rect`), Checkbox (`value` is `on`), Switch (`value` is `on`),
    Radio (`value` is `on`), Radio Group (`horizontal`), Text Field (`type` is `text`), Text Area (`resize` is `none`),
    Dialog (`closedby` is `closerequest`), Tooltip (`above`, a delay of 300), Tablist (`horizontal`), Toolbar (`horizontal`), List (`vertical`,
    as a list is).
38. **A number attribute with a default is the default when it is removed**, or isn't a number, as a native element's is (`max` of a
    `<progress>`).
    Used by: Progress, Progress Ring (`min`, `max`).
39. **An enumeration is a constant object and a union type of the same name**, `ValuesOf<typeof X>`, and not an `enum`, which isn't erasable
    syntax and whose string values aren't assignable from an attribute's. The components packages use the components foundation's `ValuesOf`.
    Used by: `AccordionExpandMode`, `ButtonType`, `SkeletonShape`.
40. **An enumeration that more than one component has is the components foundation's**, in `utilities`.
    Used by: `Orientation` (Divider, Radio Group, Tablist, Toolbar, List; next: Slider).

## Parts and styles

41. **The parts are in the contract**, so every framework's template has the same ones and the styles target the same names.
    Used by: `AccordionItemParts`, `AnchorParts`, `AvatarParts`, `BadgeParts`, `ButtonParts`, `ProgressParts`, `ProgressRingParts`,
    `SkeletonParts`, `CheckboxParts`, `SwitchParts`, `RadioParts`, `RadioGroupParts`, `TextFieldParts`, `TextAreaParts`, `NumberFieldParts`,
    `SearchParts`, `DialogParts`, `TabParts`, `ToolbarParts`, `BreadcrumbParts`, `BreadcrumbItemParts`.
42. **The host is the box, and a `content` part wraps the default slot between `start` and `end`.** Where a native element is the box, the
    `content` part is in it.
    Used by: Badge, Button; Anchor (its link is the box), Tab, Breadcrumb Item (as the Anchor).
43. **A template's own styles are what makes it work**: the layout of its slots, content that is hidden, a heading that is clickable all over.
    The appearance is Adaptive UI's.
    Used by: all.
44. **Interactive states are selected as the element has them**: `:disabled` and `:state(disabled)` for a control, and
    `:is(:active, :state(active))` for a press by the keyboard.
    Used by: Button, Checkbox, Switch, Radio, Text Field, Text Area, Number Field, Search (all through AWC's `controlInteractivity`,
    with `:state(disabled)` for a radio its group
    disables), Radio Group (`:disabled`, for its label).
45. **A number that the styles show is a custom property of the part**, so the styles decide how it is shown.
    Used by: Progress, Progress Ring (`--percent-complete`).

## Forms

46. **What a custom element lacks in a form is done with the platform's own parts**: a hidden native submit button for the time of
    `requestSubmit`, which takes only a native submitter, and `form.reset()`.
    Used by: Button, Checkbox (its form value, reset, and `required` with the browser's own message), Switch (the same),
    Radio (its form value and reset), Radio Group (`required`, as the validity of the group, a form control without a value,
    shown at its first radio), Text Field (the input's value and validity, and Enter clicking the form's first submit button,
    as native implicit submission), Text Area (its value and validity, without implicit submission), Number Field (the same),
    Search (the same).
47. **A form control has what a native one has**: its form and labels, and the validity API (`validity`, `validationMessage`, `willValidate`,
    `checkValidity()`, `reportValidity()`), from its `ElementInternals` (`FormControlElement`).
    Used by: Checkbox, Switch, Radio (through AWC's `BaseFormControl`), Radio Group, Text Field, Text Area, Number Field, Search.

## To decide for all components

- Disabled but focusable (State).
