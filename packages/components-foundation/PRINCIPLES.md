# Principles of the components

How every component is built, so that the set works the same way. Each principle names the components that apply it now; a new component
applies them too, or says here why it doesn't. The decisions that cross packages are records in `docs/decisions/` and are linked.

## Layers

1. **Contract, behavior, binding.** The contract (an interface of the element's properties, its enumerations, its parts) and the behavior (a
   controller) are in this package, with no framework and no design system. A framework's binding implements the contract, has the template,
   and wires the lifecycle. ([0009](../../docs/decisions/0009-component-behavior-is-framework-neutral.md))
   Used by: all but Card, which has no behavior and no parts, so it has nothing to share and no contract here: its binding is an element with
   a default slot.
2. **A controller doesn't observe.** The binding observes with its framework's own reactivity and calls the controller's method for each
   change (`setItems`, `expandModeChanged`, `itemExpandedChanged`), and `connect` and `disconnect` with the element's lifecycle. What isn't
   in the contract, such as the author's ARIA to forward, the controller observes itself.
   Used by: Accordion, Button; Anchor (its `AriaForwardingController` observes the author's ARIA).
3. **A controller gets only what it uses**, as a narrow type (`ButtonInternals` is the role, the form, and the states of `ElementInternals`), so
   it can be tested without a browser feature it doesn't need.
   Used by: Button.
4. **Behavior without state or lifecycle is a function**, not a controller.
   Used by: Accordion Item (`toggleAccordionItem`), Button and Anchor (`isIconOnly`), Progress and Progress Ring (`progressPercent`),
   Checkbox (`hasContent`, for its label).
5. **Components with the same behavior have one contract**, and a template each.
   Used by: Progress and Progress Ring (`ProgressElement`).
6. **Behavior that several components share is a controller of its own**, which their controllers use or extend.
   Used by: `SpacePressController` (Button, Checkbox, Switch, Radio), `CheckableController` (Checkbox, Switch, Radio),
   `RovingFocusController` (Radio Group; next: Toolbar, Tabs,
   Listbox, Menu, Tree).

## Elements and roles

7. **A control is its host element.** Its role and its form association are `ElementInternals`', and it takes focus itself. No native element
   inside, and no proxy element in the light DOM. ([0010](../../docs/decisions/0010-a-control-is-its-host-element.md))
   Used by: Button, Checkbox, Switch, Radio. Next: the text fields, Slider.
8. **A control's label is its content**, in a `label` part that is hidden when it is empty. The role takes its name from it, clicking it
   activates the control, and a `<label for>` outside works too, through `ElementInternals`.
   Used by: Checkbox, Switch, Radio.
9. **A link wraps a native `<a>`.** What the browser does for a link (its context menu, opening it in a new tab, showing its URL, `:visited`,
   dragging it) can't be done for a custom element, so the link is native, and the host isn't the element with the role.
   Used by: Anchor. Next: Breadcrumb Item, and the links of a menu.
10. **A pattern that nests roles uses native elements in the shadow root for the inner ones**, and the host has no role: the accordion item's
    heading is a `role="heading"` element with a native `<button>` in it.
    Used by: Accordion Item.
11. **The author's ARIA is on the host.** Where the host has the role, it reaches it as written, and nothing is copied. Where a native
    element inside has the role, the `AriaForwardingController` forwards it there.
    Used by: Button (as written), Anchor (forwarded to its link).
12. **The default ARIA of a host is a function of its properties** (a `DefaultAria`), which the binding assigns to the element's
    `ElementInternals` when one of those properties changes. An attribute the author puts on the host overrides it, as the platform does, so
    the default needs no property to turn it off (`role="presentation"` on a divider). In the value, a property that is absent is left as it
    is, and `null` clears one. A component that has a controller has the controller set it.
    Used by: Avatar (`img`, named by `name`), Divider (`separator`, in its orientation), Progress and Progress Ring (`progressbar`,
    with its values), Skeleton (hidden), Radio Group (`radiogroup`, in its orientation, through its controller).
13. **An element works alone.** A container coordinates its children by reacting to their state, and by giving them what is the container's
    (a property each child reads), not by doing their behavior for them.
    Used by: Accordion Item (it toggles itself), Accordion (it reacts to `expanded`, and gives `collapsible`), Radio (it checks itself),
    Radio Group (it reacts to `checked`, and gives `groupReadOnly` and `groupDisabled`).
14. **A container knows its children by their class**, not by their tag name, which a design system's prefix changes. A child that isn't
    defined yet is waited for with `whenDefined` of the container's registry.
    Used by: Accordion, Radio Group (both with AWC's `onDefined`).

## ARIA references and ids

15. **A reference inside a shadow root uses a fixed id of that shadow root, named for its part**: `aria-controls="panel"` and
    `aria-labelledby="button"`. Ids don't leave the shadow root, so they can't collide, and nothing is generated.
    Used by: Accordion Item.
16. **The host's `id` is the author's.** A component never sets or generates it.
    Used by: Accordion, Accordion Item.
17. **A reference across shadow roots is ARIA element reflection** (`ariaDescribedByElements`), with the elements found by their ids where the
    host is. An id never crosses a shadow root as an id: it doesn't resolve there.
    Used by: Anchor (the author's `aria-describedby`, `aria-labelledby`, and the like, forwarded to its link), Radio Group (its `label` slot,
    as the `ariaLabelledByElements` of its `ElementInternals`).

## State

18. **What the author sets is a reflected attribute; what the component works out is a custom state.** `expanded`, `disabled`, `expand-mode`,
    and `type` are attributes. `:state(active)` and `:state(icon-only)` are states of `ElementInternals`. A component doesn't add classes or
    attributes to its host for its own state, except `tabindex`, which focus needs.
    Used by: Accordion, Accordion Item, Anchor (`:state(icon-only)`), Button, Divider (`orientation`), Skeleton (`shape`, `shimmer`),
    Checkbox (`:state(checked)`, `:state(indeterminate)`), Switch (`:state(checked)`), Radio (`:state(checked)`).
19. **An attribute is the default of a state that the user changes**, as on a native element: the `checked` attribute is `defaultChecked`,
    `checked` is the state now, and a reset of the form goes back to the default.
    Used by: Checkbox, Switch, Radio.
20. **The platform's state where there is one.** A form control is `:disabled` from its `disabled` attribute or a disabled fieldset. Content
    that isn't shown has the `hidden` attribute, so it is hidden without the styles and from assistive technology.
    Used by: Button (`:disabled`), Accordion Item (the panel and the icons),
    Checkbox (`:disabled`; `hidden` on its indicators and an empty label), Switch (`:disabled`; `hidden` on an empty label),
    Radio (`:disabled`; `hidden` on its indicator and an empty label).
21. **What is only decoration or a placeholder is hidden from assistive technology**: `aria-hidden` on an element, `alt=""` on an image.
    Used by: Accordion Item (its icons), Skeleton (itself, and its pattern image).
22. **Disabled isn't focusable.** A control's disabled is the platform's; an element that isn't a control disables its native element.
    A group of controls is a form control without a value, so it is `:disabled` from its own `disabled` or a fieldset around it, and it gives
    its controls that state (`groupDisabled`), which they show as `:state(disabled)`: their own `disabled` stays the author's.
    Disabled but focusable (`aria-disabled`, for a button in a toolbar or a menu) is left out of every component, to be decided for all of
    them together.
    Used by: Button, Accordion Item, Checkbox, Switch, Radio, Radio Group (its `disabled` or a fieldset).
23. **A control can be read only** (`readonly`): it takes focus, the user doesn't change it, it has `aria-readonly` and `:state(readonly)`,
    and it isn't validated, as a read only native input isn't. A group that is read only makes its controls read only.
    Used by: Checkbox, Switch, Radio Group (and its radios, through `groupReadOnly`).
24. **A value outside its range is shown and reported at the nearest end**, and the property keeps the author's value: a component doesn't
    rewrite what the author set.
    Used by: Progress, Progress Ring.

## Keyboard and focus

25. **The keys of the ARIA pattern, with the timing of the native element** where there is one: a button clicks on Enter when it is pressed and
    on Space when it is released, and not if the focus left in between.
    Used by: Accordion (Up, Down, Home, End), Button, Checkbox (Space when it is released), Switch (the same),
    Radio (Space checks it when it is released), Radio Group (all four arrows, wrapping, Left and Right swapped right to left).
26. **A handler handles its own element's keys only.** It checks the event's target, so a key in slotted content isn't taken; it ignores an
    event whose default was already prevented; and it prevents the default of the keys it handles.
    Used by: Accordion, Button, Checkbox, Switch, Radio, Radio Group (a key of a radio, not of its content).
27. **A focusable host takes focus itself, and keeps the author's `tabindex`.** An element whose focusable part is in its shadow root
    implements `focus()` to focus it, instead of `delegatesFocus`.
    Used by: Button (the host), Accordion Item (its button), Anchor (its link), Checkbox (the host), Switch (the host), Radio (the host).
28. **A composite has one item in the tab order**, the active one, and the arrow keys move the focus between its items. The composite owns
    their `tabindex`.
    Used by: Radio Group (the checked radio, with the `RovingFocusController`).

## Events

29. **Events are the native ones, or named and shaped like them.** They bubble, are composed only where the native one is (`input`), are for
    what the user did, and their target is the element that changed, without an id in the detail.
    Used by: Accordion Item (`change`), Button (`click`), Checkbox (`input`, `change`), Switch (the same), Radio (`input`, `change`,
    only when it becomes checked), Radio Group (none of its own: its radios' bubble through it).
30. **A cancelled event cancels the default behavior.** A click whose default was prevented before it reached the button doesn't submit or
    reset.
    Used by: Button, Checkbox, Switch, Radio.

## Properties

31. **Property names are camelCase and the native element's** where there is one (`formAction`, `formNoValidate`); attribute names are HTML's
    (`formaction`, `heading-level`).
    Used by: Accordion (`expandMode`), Accordion Item (`headingLevel`), Anchor (`referrerPolicy`), Button, Checkbox (`defaultChecked`,
    `indeterminate`).
32. **Defaults are explicit values**, and the contract says where one differs from the native element's: `type` is `button`, unlike a native
    button's `submit`.
    Used by: Accordion (`multi`), Accordion Item (heading level 2, `collapsible`), Button (`type`), Divider (`horizontal`),
    Progress and Progress Ring (`min` 0, `max` 100), Skeleton (`rect`), Checkbox (`value` is `on`), Switch (`value` is `on`),
    Radio (`value` is `on`), Radio Group (`horizontal`).
33. **A number attribute with a default is the default when it is removed**, or isn't a number, as a native element's is (`max` of a
    `<progress>`).
    Used by: Progress, Progress Ring (`min`, `max`).
34. **An enumeration is a constant object and a union type of the same name**, `ValuesOf<typeof X>`, and not an `enum`, which isn't erasable
    syntax and whose string values aren't assignable from an attribute's. The components packages use the components foundation's `ValuesOf`.
    Used by: `AccordionExpandMode`, `ButtonType`, `SkeletonShape`.
35. **An enumeration that more than one component has is the components foundation's**, in `utilities`.
    Used by: `Orientation` (Divider, Radio Group; next: Slider, Tabs, Toolbar).

## Parts and styles

36. **The parts are in the contract**, so every framework's template has the same ones and the styles target the same names.
    Used by: `AccordionItemParts`, `AnchorParts`, `AvatarParts`, `BadgeParts`, `ButtonParts`, `ProgressParts`, `ProgressRingParts`,
    `SkeletonParts`, `CheckboxParts`, `SwitchParts`, `RadioParts`, `RadioGroupParts`.
37. **The host is the box, and a `content` part wraps the default slot between `start` and `end`.** Where a native element is the box, the
    `content` part is in it.
    Used by: Badge, Button; Anchor (its link is the box).
38. **A template's own styles are what makes it work**: the layout of its slots, content that is hidden, a heading that is clickable all over.
    The appearance is Adaptive UI's.
    Used by: all.
39. **Interactive states are selected as the element has them**: `:disabled` and `:state(disabled)` for a control, and
    `:is(:active, :state(active))` for a press by the keyboard.
    Used by: Button, Checkbox, Switch, Radio (all through AWC's `controlInteractivity`, with `:state(disabled)` for a radio its group
    disables), Radio Group (`:disabled`, for its label).
40. **A number that the styles show is a custom property of the part**, so the styles decide how it is shown.
    Used by: Progress, Progress Ring (`--percent-complete`).

## Forms

41. **What a custom element lacks in a form is done with the platform's own parts**: a hidden native submit button for the time of
    `requestSubmit`, which takes only a native submitter, and `form.reset()`.
    Used by: Button, Checkbox (its form value, reset, and `required` with the browser's own message), Switch (the same),
    Radio (its form value and reset), Radio Group (`required`, as the validity of the group, a form control without a value,
    shown at its first radio).
42. **A form control has what a native one has**: its form and labels, and the validity API (`validity`, `validationMessage`, `willValidate`,
    `checkValidity()`, `reportValidity()`), from its `ElementInternals` (`FormControlElement`).
    Used by: Checkbox, Switch, Radio (through AWC's `BaseFormControl`), Radio Group.

## To decide for all components

- Disabled but focusable (State).
