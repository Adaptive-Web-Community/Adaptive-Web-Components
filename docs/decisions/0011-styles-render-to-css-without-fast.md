# 0011. Styles render to rules of CSS, without FAST, and refer to tokens by ref

- Status: Accepted
- Date: 2026-10-28
- Package: adaptive-ui

## Context

`ElementStylesRenderer` turns `Styles` into FAST `ElementStyles`: each value is a FAST `CSSDesignToken` or a `CSSDirective`, written
through FAST's `css` and its behaviors. Four things use it: the `aui` CLI, which flattens the `ElementStyles` to a string and needs a DOM
shim (happy-dom) to do it, AWC at runtime, the Figma plugin, and the explorer. The tokens are the token library's now, which knows the name of
each token's custom property, and FAST is to leave `adaptive-ui` (plan, phase 3 step 4).

## Decision

- A style refers to a token by a **ref of the library** (`refs<Tokens>().color.accent.fill.readable`), which is data, the path of the token,
  and serves every library of the shape. The renderer writes it as `var(--name)`, the custom property the library writes for the token, with
  the library's naming (and its `name` option).
- Rendering is two functions of plain data. `renderRules(properties, target, tokens)` makes `CssRule`s (a selector and its declarations)
  with `makeSelector`, as the FAST renderer did: a rule for each state, in the order rest, focus, hover, active, disabled, a state only where
  the target is interactive or can be disabled, and the declarations of one state in one rule. `formatRules(rules)` writes them as CSS.
- The rules stay in the order of the states whatever order the properties give them. The FAST renderer kept the order in which a selector
  first came, so a property with a rest and an active value, before one with a hover value, put the hover rule after the active one. The two
  have the same specificity and a pressed element is also hovered, so it showed the hover value. Sparse sets (decision 0006) make that
  more likely.
- A ref to an interactive token (decision 0006) is a rule for each state that the token's value has, `var(--name)` at rest and
  `var(--name-<state>)` for the others, the properties the interactive converter writes. `libraryTokenProperties(library)` tells the renderer
  the property and the states of a token, from the library.
- In a set of values, a ref to an interactive token in a state is the value of the token in that state: `{ rest: a, disabled: b }` is the rest
  of `a` and the disabled of `b`, which is how a style takes some states of one token and some of another. A state the token doesn't have
  isn't written.
- A value that isn't a ref is written as the library writes a token of its type (`formatValue`: a color, a gradient, a shadow, a dimension),
  or as it is.
- The FAST half of the renderer (rules into `ElementStyles`, and keeping the custom properties up to date from the library's `subscribe`)
  moves out of `adaptive-ui`, to AWC, which the plugin and the explorer use. The CLI uses only the two functions, so its DOM shim goes.

## Consequences

- The CLI and any consumer of CSS (a React app, the generated CSS) need no DOM and no FAST to render styles.
- The states of an interactive token come from its value in a library, so the rules of a style depend on the library the CSS is for (a
  system whose token has fewer states has fewer rules). The CLI renders with the library of the system it writes.
- `Styles`, the style modules (`reference/modules.ts`), the anatomy handling of `renderStyleRules` (disabled, focus, and cursor rules), and
  the CLI moved onto these in the next step, where `Styles` became the treatments of decision 0012, which hold refs.
- A ref is told from a value, and its token found, with the library's `isRef` and `pathOf`.

## Alternatives

- **Styles hold the tokens of a library** (`library.tokens.color...`). A token knows its name and value, but a style would be bound to one
  library, and the styles are defined once, for any system.
- **Say which values are interactive in the style** (a wrapper, `interactive(ref)`). It is explicit, but the library already knows a token's
  type, and the wrapper would be a second place to say it, which can disagree.
- **Keep `ElementStyles` as the output.** It keeps FAST in `adaptive-ui`, and the CLI's DOM shim.
