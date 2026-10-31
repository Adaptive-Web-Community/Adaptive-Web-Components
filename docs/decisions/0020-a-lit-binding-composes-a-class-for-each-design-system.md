# 0020. A Lit binding composes a class of its element for each design system

- Status: Accepted
- Date: 2026-10-30
- Package: components-lit, foundation

## Context

The contract, the behavior, and now the styles of a component are in the foundation: its parts and conditions, its controller, its CSS as
strings, and its anatomy and style rules as Adaptive UI data ([0009](0009-component-behavior-is-framework-neutral.md)). The FAST binding
composes an element definition with a design system, which gives its prefix, its registry, its statics, and the token library that renders
its styles ([0017](0017-a-design-system-renders-the-styles-with-its-library.md)). A second framework, Lit, binds the same contracts, and is
tested by the same conformance tests ([0019](0019-a-binding-is-tested-by-the-conformance-of-its-contract.md)).

In Lit the styles and the template of an element are of its class (`static styles`, `render()`), and a registry defines a class under one
name only. Lit observes the properties of an element, but not of another one, as FAST's `Observable` does.

## Decision

- **An element is a `LitElement` with the properties of its contract**, reflected as FAST's `@attr` reflects them, and with the same
  controller of the foundation, connected with the element's lifecycle.
- **`compose<Name>(ds, options)` makes a class of the element for a design system**: a subclass with the styles that the design system
  renders, the template of the options or the default one, and the shadow root options of the options over those of the class. It returns
  its name, the class, and the options of its definition, and `DesignSystem.defineComponents` defines them. A definition is a function of a
  design system, so it is composed with the design system that defines it, and not with the default one and then renamed.
- **The CSS and the statics of the foundation are trusted strings**: the styles are wrapped in `unsafeCSS`, and the icons are rendered with
  `unsafeHTML`.
- **A template is a function of the design system that returns a function of the element** (`(ds) => (x) => html\`…\``), as FAST's is of the
  design system, and binds only state (`hidden`, `aria-*`), as FAST's does.
- **An accordion observes the `expanded` attribute of its items** with Lit's `MutationController` (`@lit-labs/observers`) on its own
  subtree, since an item reflects it whether the user or code changed it, and tells its controller. One target is observed, as a target of
  the controller can't be unobserved when an item is removed.
- **The custom elements manifest names an element by the `@tagname` of its class**, the name of the default design system, and Storybook
  infers the controls of a story from it.

## Consequences

- A component of the slice is three small files in the Lit package (the element, the template, the compose), and the conformance tests of
  the FAST components pass for it unchanged.
- An item reports its change to its accordion a microtask after it renders, and not at once as with FAST's `Observable`.
- What the bindings still repeat, for the anatomy update to share: the markup of each template, which is the same in both frameworks; the
  registering of the statics in `compose<Name>`; the shape of `ComposeOptions`; and the stories, with the parameters of a disabled control's
  story.

## Alternatives

- **One class for each element, with its styles set on it when it is defined**: a registry defines a class under one name, so two design
  systems, or two prefixes, couldn't define it.
- **A reactive controller of Lit around each controller of the foundation**: the controllers are connected in two lines, and a reactive
  controller would be a second kind of controller for Lit only.
- **An event of the item when it is expanded**, for the accordion: it isn't in the contract, and would be one more event for every binding.
- **A `MutationObserver` of each item**: what the Lit controller does, by hand, with the observing connected to the element's lifecycle by
  hand too.
- **A tag name from a plugin of the analyzer**, as the FAST package reads it from `FASTElementDefinition.compose`: `@tagname` is in the
  analyzer, and the name is in the documentation of the class.
