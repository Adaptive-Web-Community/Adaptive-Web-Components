# 0018. A scope writes the tokens it sets and the tokens that depend on them

- Status: Accepted
- Date: 2026-10-30
- Package: adaptive-web-components

## Context

A design system writes the tokens of its library as custom properties of the document or of a shadow root
([0017](0017-a-design-system-renders-the-styles-with-its-library.md)). A layer has values of its own: its color context, and so every
color made in the context, is another. In the library a layer is a library that extends another, `library.extend({ color: { context: {
$value: layerColor } } })`, whose tokens follow the ones they extend until they are set, and which notifies its subscribers when they
change. In 0.14 FAST's design tokens set a value for an element and wrote the custom properties on it.

The explorer is the first that needs it: its canvas, each of its layers and each block of a background color are scopes. A density
adjustment of a single button is another: it changes a few paddings and gaps, and nothing else.

A custom property is inherited by everything in its element, through shadow roots too, so a scope only needs the properties whose values
it changes. A calculated token is the exception. It is written as a `calc()` of the custom properties it is calculated from
([0004](0004-derived-values-are-expressions.md)), and a property that refers to another is resolved where it is written: an element in a
scope inherits the result of the scope above, not the calculation. Setting the density adjustment of a scope doesn't change the padding it
inherits; declaring the padding's `calc()` again in the scope does.

## Decision

- **A scope is a library that extends the library of the scope it is in.** A value of the scope is set on its library
  (`library.tokens.color.context.set(color)`), not by extending it again.
- **A scope writes the tokens that its library changes**, which it tells with `ownTokensOf`: the tokens it sets, the tokens that are new in
  it, the tokens that call a recipe it replaces, and the tokens that depend on any of those, through the refs of the values, so it also
  finds the expressions that refer to a token that changed. A calculation is declared again in the scope when, and only when, it refers
  to a token that the scope changes. No token outside of that is read, so no value is calculated for a token that the scope inherits.
  `ds.adoptTokenStyles(shadowRoot, library)` writes them on `:host` with `toCSS(library, { filter })` of those tokens, and the values on a fill
  of the components whose token or fill is among them. `ds.tokenStyles(selector, library)` writes the same rule. The others are inherited.
- **A token made by a recipe is written as its value**, which the library computes in the scope; a calculation is left to CSS.
- **It writes them again when the library of the scope notifies a change**, which includes a change of a token it extends, and only when
  the rule changed. `ds.removeTokenStyles(shadowRoot)` stops that, for an element that is disconnected.
- **The element is the explorer's for now**, which finds the scope it is in by the context protocol of `fast-element`. It moves to the
  components when one of them is a scope (a fill as the context of its content), or the plugin needs it in the DOM.

## Consequences

- A scope of a color context writes the colors made in it and what depends on them, and inherits the palettes, the fonts, the shapes, and
  the shadows. A scope of a density adjustment writes the adjustment and the calculations of the density sets and the type ramps that
  refer to it: 17 declarations of the 596 of the reference library.
- The rule is a superset of what differs: a token that depends on a token the scope sets may come to have the value it inherits, and is
  written anyway. For a neutral color set in a scope, 444 declarations are written and 119 differ. It is less to compare and no value to
  calculate for the rest, at the price of some declarations that say what is inherited.
- The library knows which of its tokens have a value of their own, so the design system doesn't walk the scope to compare its values with
  the ones of the library it extends, and the scope needs no more than its library. `ownTokensOf` and the `filter` of `toCSS` are in
  design-token-library 0.4.0 (#123, #136).
- A change at the top of the explorer, like the neutral color, rewrites the scopes under it from the notifications of their libraries.

## Alternatives

- **Write every token in each scope** (the first version of this record): it is what the scope inherits anyway, but for the calculations.
- **Write a calculated token as its value**, so that no property refers to another: then the CSS doesn't calculate anything, and a scope
  writes the values that the library calculates. It was tried, and left for the calculations in CSS, which are right once a scope declares
  them again.
- **Compare the declarations of the scope with those of the library it inherits from** (the first revision of this record): it writes
  what differs, and no more, but it calculates every token of both libraries, and compares the strings that the library writes as one rule.
- **Set the properties on the element's style** (`style.setProperty`), as FAST did: the same writes, in the attribute of the element, where
  a page's own styles and the inspector see them as inline styles.
