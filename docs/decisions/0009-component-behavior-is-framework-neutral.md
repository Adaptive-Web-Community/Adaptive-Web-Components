# 0009. The behavior of a component is framework-neutral, and each framework binds it

- Status: Accepted
- Date: 2026-10-27
- Package: components-foundation, components-fast, components-lit

## Context

The Adaptive web components are built on FAST Foundation, which is archived (its last version, 3.0.0-alpha.33, is for `fast-element` 2 betas).
The components move to `fast-element` 3, with FAST Foundation as the starting point. A set built on Lit is also likely. The styles are already
independent of the framework: Adaptive UI styles the parts and the conditions of a component's anatomy. What a FAST Foundation component does
(keyboard interaction, form submission, the coordination of an accordion and its items) is written into the FAST element class, with FAST's
observation (`Observable.getNotifier(child).subscribe(...)`), so a second framework would copy it and keep it in step by hand.

## Decision

- A component has three layers. The **contract** is what the element exposes: an interface of its properties, its enumerations, its parts,
  slots, and events. The **behavior** is a controller that works on the host element and the DOM only. The **binding** is a framework's element
  class, which implements the contract with that framework's reactive properties, has its template, and wires its lifecycle to the controller.
- The contract and the behavior are a package of their own, `@adaptive-web/components-foundation`, which depends on no framework. It has
  the `DesignSystem` that brings the components of any framework together, so it depends on Adaptive UI and the token library
  ([0017](0017-a-design-system-renders-the-styles-with-its-library.md)). The styles of a component are there too, as data that a binding
  gives its framework: its CSS as strings, and its Adaptive UI anatomy and style rules. So is what a design system composes it from, its
  composition: the name of its element, its CSS, its anatomy, and the keys of its statics. A components package (`@adaptive-web/components-fast`
  for FAST, `@adaptive-web/components-lit` for Lit) has the bindings: the element classes, their templates, and what composes them with a
  design system.
- A binding keeps its framework's observation. It observes its properties, and those of its child elements, with the framework (an `@attr`
  change handler, a notifier subscription in FAST) and calls the controller. A controller doesn't observe, and has a method for each change it
  reacts to. Lit doesn't observe the properties of another element, so a Lit binding observes the attribute that a child reflects, with a
  reactive controller of Lit ([0020](0020-a-lit-binding-composes-a-class-for-each-design-system.md)).
- The parts are in the contract, so the styles of each framework's components target the same names.

## Consequences

- A binding is short: properties, a template, and the calls to the controller. The template is written once for each framework, since the
  syntax of templates differs.
- The foundation builds and is tested without a framework.
- A controller gets the parts of `ElementInternals` it uses from the binding, since only the element class can attach them.
- The Adaptive UI anatomy (conditions, focus, interactivity), the CSS, the style rules, and the composition of a component are in the
  foundation, so the components of each framework have the same styles and names. So far those of the button, the accordion, and the accordion item, which a second
  framework binds first; the others move as they get a second binding.

## Alternatives

- **Port FAST Foundation into the FAST components.** The least code now, and a Lit set mirrors it by hand.
- **Controllers in the components package, moved out when Lit starts.** Avoids a package with one consumer, but nothing keeps a FAST import
  out of the controllers until then.
- **Controllers that observe for themselves** (DOM events or a `MutationObserver` for every change). Neutral, but it gives up each framework's
  observation, which is synchronous and cheaper, and adds events that are only there for the controller.
