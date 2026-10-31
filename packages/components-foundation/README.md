# Components Foundation

The behavior and the styles of the Adaptive web components, without a framework. It is what the archived
[FAST Foundation](https://github.com/microsoft/fast/tree/archives/fast-foundation-3/packages/web-components/fast-foundation) was for the FAST
components, rebuilt so that more than one framework can implement the same elements. Why: [decision 0009](../../docs/decisions/0009-component-behavior-is-framework-neutral.md).

## What is here, and what isn't

Each component has three layers. This package has the first two:

| Layer | What it is | Where |
| --- | --- | --- |
| Contract | What the element exposes: an interface of its properties (`AccordionItemElement`), the values of its enumerations (`AccordionExpandMode`), its parts, slots, and events | This package |
| Behavior | A controller that implements what isn't a template: keyboard interaction, form submission, coordination between elements. It works on the host element and the DOM only | This package |
| Binding | The element class of a framework, with that framework's reactive properties (`@attr`), its template, and its lifecycle wired to the controller | A components package: `@adaptive-web/components-fast` for FAST, `@adaptive-web/components-lit` for Lit |

A binding observes its own properties with its framework (an `@attr` change handler in FAST) and tells the controller, so nothing here
depends on how a framework observes. The styles of a component are here too, as data that a binding gives its framework: its CSS as
strings, and its anatomy and style rules, which style the parts and the conditions of the contract with Adaptive UI (so far of the button,
the accordion, and the accordion item). What brings the components of any framework together is: the `DesignSystem`, with the prefix and the
registry of the elements, their statics, and the token library that renders their style rules to CSS (`renderStyles`) and writes the tokens
(`adoptTokenStyles`). A framework's components extend it, to define their elements and to give their framework the CSS.

A control is the host element, made a form control through `ElementInternals`, and not a wrapper of a native element
([decision 0010](../../docs/decisions/0010-a-control-is-its-host-element.md)).

How the components are built, so that the set works the same way: [the principles](PRINCIPLES.md).

## Testing

The unit tests (`npm test`) run the controllers in JSDOM, which has no `ElementInternals` and doesn't match `:disabled` on a custom element.
What depends on those (the role, the disabled state of a form control, the submitter of a form) is in the conformance tests of each contract
(`<component>.conformance.ts`), which a binding runs in a browser
([decision 0019](../../docs/decisions/0019-a-binding-is-tested-by-the-conformance-of-its-contract.md)):

```ts
import { buttonConformance } from "@adaptive-web/components-foundation/conformance";

buttonConformance("adaptive-button");
```

They need Vitest's browser mode with the Playwright provider and Chromium, and read the accessibility of an element from the browser
(`accessibilityNodeOf`), since what `ElementInternals` sets isn't in the DOM.
