# 0017. A design system renders the styles of its components with its token library

- Status: Accepted
- Date: 2026-10-29
- Package: components-foundation, components-fast, components-lit

## Context

Adaptive UI renders the style rules of a component to rules of CSS without FAST and refers to each token by its custom property
([0011](0011-styles-render-to-css-without-fast.md)), and a treatment is a token of the library ([0015](0015-a-treatment-is-a-token.md)). Its
`ElementStylesRenderer`, which wrote FAST `ElementStyles` with FAST design tokens, is gone, and so are the design tokens, whose values FAST
wrote as custom properties of the document. The half that turns rules into FAST `ElementStyles` and keeps the custom properties up to date
moved out of Adaptive UI, to the components, which the plugin and the explorer use (plan, phase 4). The components of more than one framework
bind the same contracts ([0009](0009-component-behavior-is-framework-neutral.md)), and render the same rules.

The rules of a component depend on the library: an interactive token has a rule for each state its value has, and a ref to a treatment is
read from the library. The values of the tokens are custom properties that the library writes (`toCSS`), and a value on a fill is one only
for the pairs that the rules give ([0013](0013-a-value-on-a-fill-is-made-in-the-context-of-the-fill.md)).

## Decision

- **The `DesignSystem` of the foundation has a token library**, `createReferenceLibrary()` by default, and the treatments that the anatomy
  applies, `referenceAnatomyTreatments` by default, both changed with `configure`. A library has the shape of the reference library, whose
  `color.context` is the context of the values on a fill. The design system of a framework's components extends it.
- **`ds.renderStyles(anatomy, styleRules)` renders a component's rules** with `renderStyleRules` and the library of the design system, as
  CSS, with the parts of the rules as the class names of the templates. A framework's `ds.assembleStyles(styles, anatomy, options)` gives
  its framework the component's own styles and that CSS (FAST `ElementStyles`, Lit `CSSResultGroup`). They are methods of the design system, which each
  `compose<Name>(ds, options)` already has, and were a static function.
- **`ds.adoptTokenStyles(target)` writes the tokens** as custom properties of the document (`:root`) or of a shadow root (`:host`), with the
  values on a fill of the components composed with the design system, in an adopted style sheet. It writes them again when the library
  changes (`subscribe`), when it is replaced, and when a component composed later brings pairs. It takes the place of FAST's
  `DesignToken.registerDefaultStyleTarget()`.
- **The renderer is part of the foundation**, the `DesignSystem`, and not a package of its own, for now: the components of each framework
  use it, and nothing else needs it without them. What of it is shared styling, and not about the foundation's components, may move to
  Adaptive UI.

## Consequences

- The components have no FAST design tokens: a token's value is the custom property the library writes, and a style of a component refers
  to a token or a treatment by a ref of the library.
- A design system with another library renders the same rules for its tokens, and the components composed with it have the rules of its
  states. A library given after the components are composed changes the values, not the rules that were rendered.
- The custom properties are written for the whole document (or shadow root). A layer, or a fill as the context of its content, is a scope of
  its own, with the CSS of a library extended for it, see [0018](0018-a-scope-writes-the-tokens-it-changes.md).
- The custom properties are named as the library names them by default. A design system doesn't take the library's `name` option.

## Alternatives

- **A package of its own for the renderer** (the plan's alternative): the plugin and the explorer depend on the components anyway, and
  a package with only the components as its users is a boundary to keep without a reason yet.
- **The renderer in each framework's components package**: the components of a second framework would copy it.
- **Render the rules once, with the reference library, at build time** (the CLI's CSS): a system's library could not change the states or
  the treatments, and the components would need the generated CSS shipped with them.
- **A FAST directive for each token, as the design tokens were**: it binds the styles to FAST again, and the library already writes the
  properties.
