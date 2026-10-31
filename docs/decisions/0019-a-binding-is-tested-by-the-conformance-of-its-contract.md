# 0019. A binding is tested by the conformance tests of its contract, in a browser

- Status: Accepted
- Date: 2026-10-30
- Package: foundation, adaptive-web-components

## Context

A component's contract and behavior are in the foundation, and each framework binds them with its own properties and template
([0009](0009-component-behavior-is-framework-neutral.md)). FAST has bindings, and Lit will. What a binding has to get right is what a user
and assistive technology get: the role, the name, and the states of the host and its parts, the keyboard, the form. A binding of another
framework, or a fix made in one binding and not the other, can differ there, and the controllers' unit tests, in JSDOM, don't see it.

A control is its host element, with its role and states set through `ElementInternals`
([0010](0010-a-control-is-its-host-element.md)), which aren't in the DOM. axe and the libraries that compute a role or a name from the DOM
(`dom-accessibility-api`, Playwright's role selectors) take such an element for one without semantics: axe reads `ElementInternals` only when
a component publishes it, and then only the role.

## Decision

- **The foundation has the conformance tests of each contract**, a function of the names of the elements (`buttonConformance("adaptive-button")`,
  `accordionConformance({ accordion, item })`), in `<component>.conformance.ts` next to the contract. They are published as the
  `@adaptive-web/components-foundation/conformance` subpath, with Vitest as an optional peer, so a binding outside this repository can run them.
- **Each components package runs them** against its elements, in Vitest's browser mode with Chromium, in a `<component>.spec.ts` of one call.
- **The accessibility of an element is read from the browser**: `accessibilityNodeOf(element)` returns its node of Chromium's accessibility
  tree, through the Chrome DevTools Protocol, with the role, the name, the states, and the relations that `ElementInternals` set.
- **A test reads the contract, not a binding**: the attributes and the parts of the contract, the events, and what the browser exposes. It
  waits for a frame after a change, since a framework may render or reflect an attribute after it.
- **axe runs on the stories** of a components package, for what a story's markup gets wrong. It isn't the test of a component's semantics.

## Consequences

- A difference between the FAST and the Lit binding of the same contract fails the tests of one of them. A fix of behavior adds a test to the
  contract's conformance, and both packages run it.
- The conformance is Chromium's accessibility tree only. Firefox and WebKit compute theirs differently and aren't tested.
- The parts are read from an open shadow root, which the bindings have.
- The foundation has Vitest's types, which aren't compatible with the Chai 4 types of its unit tests, so it skips the checking of libraries'
  declarations (`skipLibCheck`).

## Alternatives

- **Each components package tests its own elements**: the tests are copied for each framework, and drift as the bindings would.
- **A private package of the conformance tests**: they would be in step with the contracts only by convention, and not usable by a binding
  outside the repository.
- **axe on the components, with their `ElementInternals` published** (`globalThis._elementInternals`) for it: axe reads only the role of
  them, and the protocol would be in the components for a test.
- **Roles and names computed from the DOM** (`toHaveRole`, `toHaveAccessibleName`): they don't see `ElementInternals`, as axe doesn't.
