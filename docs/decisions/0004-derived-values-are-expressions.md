# 0004. A value that is calculated from other tokens is an expression, written as calc()

- Status: Accepted
- Date: 2026-10-17
- Revised: 2026-11-04, the refs are kept in the expression (design-token-library 0.3)
- Package: adaptive-ui

## Context

The sizes of a type scale and the padding and gap of the density tokens are calculated from other tokens. They were strings of CSS
(`calc(base * pow(multiplier, 2))`) made from the values of the tokens when they were evaluated. The browser did the math, but the numbers in
the string were already the values of the tokens, so changing a custom property later didn't change them. The density adjustment is the case that
shows it: it was `0` in the string, and changing the token had no effect, so the tokens that used it had to be replaced.

A DTCG dimension is `{ value, unit }` and has no calculation. Working out the numbers in JavaScript when a token is resolved gives a correct
dimension, and is what the first version of the type scale did, but the CSS then has fixed numbers, and the same problem.

## Decision

An `Expression` is plain data: numbers, dimensions, refs of the library to tokens, and math (`add`, `subtract`, `multiply`, `divide`, `pow`,
`round`, `min`, `max`). It has two uses:

- **In CSS** it is a `calc()` of the custom properties of the tokens it refers to. So a change to one of those custom properties, in a
  stylesheet or on an element, changes the result in the browser.
- **In JavaScript**, `evaluate` gets the number or dimension, with the rules of units that CSS has: a dimension plus a dimension of the same
  unit, a dimension times a number, and a dimension over a dimension for a number. Only the result is rounded, to four decimal places.

A token of the `expression` type holds a number, a dimension, or an expression, so a value is fixed or calculated, and can be changed from one
to the other. A reference is a ref of the library (`refs<Tokens>().size`, or `ref("size")`), typed by the value of its token, and not a string.
The expression keeps the ref as it is given (`ConfiguredOperand`): the library keeps what a token was configured with (`configuredValueOf`), and
resolves the refs only in `$value`. So the tokens it refers to are the library's dependencies of the token (`dependenciesOf`), tokens that use
each other are the library's `CircularReferenceError`, and an expression is a `calc()` of the custom properties of those tokens, which the CSS
converter writes from the configured value of the token it is given, with the name of each custom property from the library (`toProperties`).
`evaluate(value, library)` reads the tokens as configured, and gets the number or dimension by following the refs.

## Consequences

- The value of a derived token isn't a DTCG dimension. A consumer that needs the number, like the Figma plugin, calls `evaluate`, which replaces
  evaluating the CSS string.
- `$value` of an expression token has the values of the tokens it refers to in place of the refs, so it is a number or a dimension in the
  state of the library, and the expression is read with `configuredValueOf`. A change to a token changes `$value`, and the library tells
  what depends on it, so the expression stays the same and what changes is what `evaluate` gets, and what the browser calculates.
- The units of what is added or rounded have to match, and `evaluate` says so when they don't.
- A ref has the path of its token and not its type, so `evaluate` checks that the value of a token is a number, a dimension, or an expression.
- The refs of an expression aren't typed with the shape of one library, since the operands of one expression may be of more than one shape.
  A path that isn't a token is found when the value of the token is read.
- A value that a recipe computes in an expression token isn't a calculation, and is written as the value it has.

## Alternatives

- **Work out the numbers when the token is resolved.** It was the first version, and it doesn't change in the browser.
- **CSS strings**, as before. They can't be evaluated without parsing, and they have the problem above.
- **Keep the path of the ref in the expression**, as `{ ref: "size" }`, which this decision replaces. The library 0.2 resolved the refs in a
  value, which would have put the values of the tokens in the expression, and a path was the way to keep the token. The library doesn't know
  a dependency that is a string, so it didn't track it, and the cycles of tokens were found by `evaluate`.
- **A recipe of the library.** A recipe's value is computed when the token is read, so the CSS would have the numbers, as in the first version.
- **Support in the library.** It would be shared, but the library holds DTCG values and the calculation isn't part of the format. It is likely
  to move there, and until then it's an add-on that uses the library's refs.
