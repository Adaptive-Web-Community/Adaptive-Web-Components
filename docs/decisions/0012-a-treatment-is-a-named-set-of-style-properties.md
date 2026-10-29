# 0012. A treatment is a named set of style properties, as plain data

- Status: Accepted. The pairs of a fill and its foreground are superseded by [0013](0013-a-value-on-a-fill-is-made-in-the-context-of-the-fill.md)
- Date: 2026-10-28
- Package: adaptive-ui

## Context

Adaptive UI groups style decisions under a semantic name and applies them as a set: "the accent fill of a control" is a background, a
foreground, and a border, and "an action" is a shape, a density, a type ramp, and a fill. The group was first a "style module", then `Styles`,
a class with a global registry by name (`Styles.Shared`, which threw for a name used twice), properties that could be changed in place, and
FAST tokens as values. "Module" never stuck with the people who use it, and "styles" reads as the CSS itself. With the token library a style
refers to tokens by ref (decision 0011), so the group is rebuilt anyway.

The rules that apply groups to a component were named after the parts of a CSS style sheet (rule, declaration, selector), and an output for
another platform (Dart, Swift) is expected later.

## Decision

- The group is a **treatment** (`Treatment`), the word designers use for it ("the accent fill treatment"). It is plain data: an optional name,
  the treatments it is composed of, and properties of its own, which are values or refs of a library and are applied after those of the
  treatments. `treatmentProperties(treatment)` gives what applies. A treatment is an object literal; there is no class, no registry, and no
  change in place. An anatomy written as data names a treatment, which is looked up in the treatments it is given (`referenceTreatments`).
- A **rule** keeps its name (`StyleRule`): it is plain English, and a renderer for another platform can use it. A rule has a target, its
  treatments, and its properties. `StyleDeclaration` is gone: in CSS a declaration is one property and its value, not the block it was.
- The model of a style is in `core/styles` (the anatomy, the properties, the rule, the treatment), and the CSS output in `core/styles/css`
  (the selectors, the CSS properties, `renderRules`, `renderStyleRules`, `formatRules`). An output for another platform goes beside `css`.
- A treatment that pairs values computed for each other refers to tokens for both. The foreground on a fill is a token of the library,
  `color.<palette>.onFill.<fill>`, where `Fill.backgroundAndForeground` made a FAST token on the spot.

## Consequences

- A treatment can be serialized as it is, and compared, copied, and composed with the spread syntax.
- The deprecated names of the style modules (`controlShapeStyles`) are the treatments; a 0.14 rule's `styles` is its `treatments` now, and an
  anatomy written as JSON may still say `styles` until 1.0 (decision 0002).
- Nothing changes a treatment at run time any more. The designer plugin did (`styles.properties = ...`): it makes a new treatment instead when
  it comes back (phase 4).
- The anatomy still names its parts and conditions with CSS selectors, which is what an output for another platform would change first. The
  structure of the anatomy is to change soon, separately.

## Alternatives

- **Mixin**, the name CSS gives a group of declarations that is included in a rule (the draft of CSS Functions and Mixins, where `@function`
  is close to a recipe). Developers know it from Sass, but a mixin takes parameters and is included in CSS, which a treatment doesn't, and
  the name would blur the two once AUI can write native mixins. Designers don't use it.
- **Look**, from fashion, and the kitchen words to go with "recipe" (blend, garnish, seasoning). "Look" is too common a word to search for,
  "blend" is a CSS blend mode, and "garnish" is something optional.
- **Preset.** It reads as a default to change, not a set to apply.
- **Keep `Styles` as a class with `compose` and `fromProperties`.** A treatment is data that an anatomy names, so a class adds nothing that an
  object literal doesn't have, and the registry made the order of imports matter.
- **`core/treatments` for the folder.** It holds the anatomy and the rules as well, which aren't treatments.
