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
   Used by: Accordion Item (`toggleAccordionItem`), Button and Anchor (`isIconOnly`), Progress and Progress Ring (`progressPercent`).
5. **Components with the same behavior have one contract**, and a template each.
   Used by: Progress and Progress Ring (`ProgressElement`).

## Elements and roles

6. **A control is its host element.** Its role and its form association are `ElementInternals`', and it takes focus itself. No native element
   inside, and no proxy element in the light DOM. ([0010](../../docs/decisions/0010-a-control-is-its-host-element.md))
   Used by: Button. Next: Checkbox, Switch, Radio, the text fields, Slider.
7. **A link wraps a native `<a>`.** What the browser does for a link (its context menu, opening it in a new tab, showing its URL, `:visited`,
   dragging it) can't be done for a custom element, so the link is native, and the host isn't the element with the role.
   Used by: Anchor. Next: Breadcrumb Item, and the links of a menu.
8. **A pattern that nests roles uses native elements in the shadow root for the inner ones**, and the host has no role: the accordion item's
   heading is a `role="heading"` element with a native `<button>` in it.
   Used by: Accordion Item.
9. **The author's ARIA is on the host.** Where the host has the role, it reaches it as written, and nothing is copied. Where a native
   element inside has the role, the `AriaForwardingController` forwards it there.
   Used by: Button (as written), Anchor (forwarded to its link).
10. **The default ARIA of a host is a function of its properties** (a `DefaultAria`), which the binding assigns to the element's
    `ElementInternals` when one of those properties changes. An attribute the author puts on the host overrides it, as the platform does, so
    the default needs no property to turn it off (`role="presentation"` on a divider). In the value, a property that is absent is left as it
    is, and `null` clears one.
    Used by: Avatar (`img`, named by `name`), Divider (`separator`, in its orientation), Progress and Progress Ring
    (`progressbar`, with its values), Skeleton (hidden).
11. **An element works alone.** A container coordinates its children by reacting to their state, not by doing their behavior for them.
    Used by: Accordion Item (it toggles itself), Accordion (it reacts to `expanded`).
12. **A container knows its children by their class**, not by their tag name, which a design system's prefix changes. A child that isn't
    defined yet is waited for with `whenDefined` of the container's registry.
    Used by: Accordion.

## ARIA references and ids

13. **A reference inside a shadow root uses a fixed id of that shadow root, named for its part**: `aria-controls="panel"` and
    `aria-labelledby="button"`. Ids don't leave the shadow root, so they can't collide, and nothing is generated.
    Used by: Accordion Item.
14. **The host's `id` is the author's.** A component never sets or generates it.
    Used by: Accordion, Accordion Item.
15. **A reference across shadow roots is ARIA element reflection** (`ariaDescribedByElements`), with the elements found by their ids where the
    host is. An id never crosses a shadow root as an id: it doesn't resolve there.
    Used by: Anchor (the author's `aria-describedby`, `aria-labelledby`, and the like, forwarded to its link).

## State

16. **What the author sets is a reflected attribute; what the component works out is a custom state.** `expanded`, `disabled`, `expand-mode`,
    and `type` are attributes. `:state(active)` and `:state(icon-only)` are states of `ElementInternals`. A component doesn't add classes or
    attributes to its host for its own state, except `tabindex`, which focus needs.
    Used by: Accordion, Accordion Item, Anchor (`:state(icon-only)`), Button, Divider (`orientation`), Skeleton (`shape`, `shimmer`).
17. **The platform's state where there is one.** A form control is `:disabled` from its `disabled` attribute or a disabled fieldset. Content
    that isn't shown has the `hidden` attribute, so it is hidden without the styles and from assistive technology.
    Used by: Button (`:disabled`), Accordion Item (the panel and the icons).
18. **What is only decoration or a placeholder is hidden from assistive technology**: `aria-hidden` on an element, `alt=""` on an image.
    Used by: Accordion Item (its icons), Skeleton (itself, and its pattern image).
19. **Disabled isn't focusable.** A control's disabled is the platform's; an element that isn't a control disables its native element.
    Disabled but focusable (`aria-disabled`, for a button in a toolbar or a menu) is left out of every component, to be decided for all of
    them together.
    Used by: Button, Accordion Item.
20. **A value outside its range is shown and reported at the nearest end**, and the property keeps the author's value: a component doesn't
    rewrite what the author set.
    Used by: Progress, Progress Ring.

## Keyboard and focus

21. **The keys of the ARIA pattern, with the timing of the native element** where there is one: a button clicks on Enter when it is pressed and
    on Space when it is released, and not if the focus left in between.
    Used by: Accordion (Up, Down, Home, End), Button.
22. **A handler handles its own element's keys only.** It checks the event's target, so a key in slotted content isn't taken; it ignores an
    event whose default was already prevented; and it prevents the default of the keys it handles.
    Used by: Accordion, Button.
23. **A focusable host takes focus itself, and keeps the author's `tabindex`.** An element whose focusable part is in its shadow root
    implements `focus()` to focus it, instead of `delegatesFocus`.
    Used by: Button (the host), Accordion Item (its button), Anchor (its link).

## Events

24. **Events are the native ones, or named and shaped like them.** They bubble, aren't composed, are for what the user did, and their target is
    the element that changed, without an id in the detail.
    Used by: Accordion Item (`change`), Button (`click`).
25. **A cancelled event cancels the default behavior.** A click whose default was prevented before it reached the button doesn't submit or
    reset.
    Used by: Button.

## Properties

26. **Property names are camelCase and the native element's** where there is one (`formAction`, `formNoValidate`); attribute names are HTML's
    (`formaction`, `heading-level`).
    Used by: Accordion (`expandMode`), Accordion Item (`headingLevel`), Anchor (`referrerPolicy`), Button.
27. **Defaults are explicit values**, and the contract says where one differs from the native element's: `type` is `button`, unlike a native
    button's `submit`.
    Used by: Accordion (`multi`), Accordion Item (heading level 2, `collapsible`), Button (`type`), Divider (`horizontal`), Progress and
    Progress Ring (`min` 0, `max` 100), Skeleton (`rect`).
28. **A number attribute with a default is the default when it is removed**, or isn't a number, as a native element's is (`max` of a
    `<progress>`).
    Used by: Progress, Progress Ring (`min`, `max`).
29. **An enumeration is a constant object and a union type of the same name**, `ValuesOf<typeof X>`, and not an `enum`, which isn't erasable
    syntax and whose string values aren't assignable from an attribute's. The components packages use the components foundation's `ValuesOf`.
    Used by: `AccordionExpandMode`, `ButtonType`, `SkeletonShape`.
30. **An enumeration that more than one component has is the components foundation's**, in `utilities`.
    Used by: `Orientation` (Divider; next: Slider, Tabs, Toolbar, Radio Group).

## Parts and styles

31. **The parts are in the contract**, so every framework's template has the same ones and the styles target the same names.
    Used by: `AccordionItemParts`, `AnchorParts`, `AvatarParts`, `BadgeParts`, `ButtonParts`, `ProgressParts`, `ProgressRingParts`,
    `SkeletonParts`.
32. **The host is the box, and a `content` part wraps the default slot between `start` and `end`.** Where a native element is the box, the
    `content` part is in it.
    Used by: Badge, Button; Anchor (its link is the box).
33. **A template's own styles are what makes it work**: the layout of its slots, content that is hidden, a heading that is clickable all over.
    The appearance is Adaptive UI's.
    Used by: all.
34. **Interactive states are selected as the element has them**: `:not(:disabled)` and `:disabled` for a control, and
    `:is(:active, :state(active))` for a press by the keyboard.
    Used by: Button.
35. **A number that the styles show is a custom property of the part**, so the styles decide how it is shown.
    Used by: Progress, Progress Ring (`--percent-complete`).

## Forms

36. **What a custom element lacks in a form is done with the platform's own parts**: a hidden native submit button for the time of
    `requestSubmit`, which takes only a native submitter, and `form.reset()`.
    Used by: Button.

## To decide for all components

- Disabled but focusable (State).
