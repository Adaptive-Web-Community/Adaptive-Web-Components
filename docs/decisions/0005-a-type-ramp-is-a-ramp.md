# 0005. A type ramp is a ramp, whether its values are fixed or come from a scale

- Status: Accepted
- Date: 2026-10-17
- Package: adaptive-ui

## Context

There are two type ramps: the default, which has a size and line height for each position, and the body ramp, which is calculated from a base size
and a multiplier. They have the same shape. The first version of the migration made a ramp and a scale two things, with different types, and
a position of a ramp could only be a dimension.

## Decision

- A ramp is a group for each of the font size, the line heights, and the font variations, with a token for each position from `minus2` to
  `plus6`. They are individual tokens, as they were, and not a DTCG `typography` composite per position: the family and weight don't depend on
  the position in this system, they are `default`, `body`, and `label` of their own.
- The sizes and line heights are tokens of the `expression` type ([0004](0004-derived-values-are-expressions.md)), so the value of any
  position of any ramp is a dimension or an expression of other tokens.
- `typeRamp` creates a ramp from the value of each position. `typeScale` creates a ramp from a base size, a multiplier, and ratios, which are
  tokens next to the positions. The type of a scale is the type of a ramp with those tokens added, so one can be used where the other is.
- The default font family, weight, and style are named `default`, with `body` and `label` next to them. They are three equal roles, and not a
  base with variants, so they are not the `$root` of their group.

## Consequences

- A system can make any position of the default ramp an expression, or the body ramp fixed, by changing a value. Nothing about the type changes.
- A ramp has the same custom property names as before (`--typography-ramp-default-fontSize-base`).
- A font family is a list of names, as in DTCG, and not a string with commas.

## Alternatives

- **A ramp and a scale as two types.** A ramp can be calculated or fixed in the same way a color can come from a recipe or be fixed, and
  the types would say they were different when they aren't.
- **A `typography` composite for each position.** It would tie the family and weight to the position, which a system chooses separately.
- **`$root` for the default font tokens.** It was tried and reverted: it makes `default` a parent of `body` and `label`, it can't be used for a
  ramp, and it changes the custom property names.
