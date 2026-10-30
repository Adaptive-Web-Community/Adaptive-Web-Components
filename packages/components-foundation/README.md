# Components Foundation

The behavior of the Adaptive web components, without a framework and without styles. It is what the archived
[FAST Foundation](https://github.com/microsoft/fast/tree/archives/fast-foundation-3/packages/web-components/fast-foundation) was for the FAST
components, rebuilt so that more than one framework can implement the same elements. Why: [decision 0009](../../docs/decisions/0009-component-behavior-is-framework-neutral.md).

## What is here, and what isn't

Each component has three layers. This package has the first two:

| Layer | What it is | Where |
| --- | --- | --- |
| Contract | What the element exposes: an interface of its properties (`AccordionItemElement`), the values of its enumerations (`AccordionExpandMode`), its parts, slots, and events | This package |
| Behavior | A controller that implements what isn't a template: keyboard interaction, form submission, coordination between elements. It works on the host element and the DOM only | This package |
| Binding | The element class of a framework, with that framework's reactive properties (`@attr`), its template, and its lifecycle wired to the controller | A components package: `@adaptive-web/components-fast` for FAST |

A binding observes its own properties with its framework (an `@attr` change handler in FAST) and tells the controller, so nothing here
depends on how a framework observes. The styles are not here either: a binding styles the parts that the contract names. Adaptive UI styles
them in `@adaptive-web/components-fast`.

A control is the host element, made a form control through `ElementInternals`, and not a wrapper of a native element
([decision 0010](../../docs/decisions/0010-a-control-is-its-host-element.md)).

How the components are built, so that the set works the same way: [the principles](PRINCIPLES.md).

## Testing

The unit tests (`npm test`) run the controllers in JSDOM, which has no `ElementInternals` and doesn't match `:disabled` on a custom element.
What depends on those (the role, the disabled state of a form control, the submitter of a form) needs a test in a browser, which this package
doesn't have yet.
