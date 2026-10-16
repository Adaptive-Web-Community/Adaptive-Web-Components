# 0004. A value that is calculated from other tokens is an expression, written as calc()

- Status: Accepted
- Date: 2026-10-17
- Package: adaptive-ui

## Context

The sizes of a type scale and the padding and gap of the density tokens are calculated from other tokens. They were strings of CSS
(`calc(base * pow(multiplier, 2))`) made from the values of the tokens when they were evaluated. The browser did the math, but the numbers in
the string were already the values of the tokens, so changing a custom property later didn't change them. The density adjustment is the case that
shows it: it was `0` in the string, and changing the token had no effect, so the tokens that used it had to be replaced.

A DTCG dimension is `{ value, unit }` and has no calculation. Working out the numbers in JavaScript when a token is resolved gives a correct
dimension, and is what the first version of the type scale did, but the CSS then has fixed numbers, and the same problem.

## Decision

An `Expression` is plain data: numbers, dimensions, references to tokens, and math (`add`, `subtract`, `multiply`, `divide`, `pow`, `round`,
`min`, `max`). It has two uses:

- **In CSS** it is a `calc()` of the custom properties of the tokens it refers to. So a change to one of those custom properties, in a
  stylesheet or on an element, changes the result in the browser.
- **In JavaScript**, `evaluate` gets the number or dimension, with the rules of units that CSS has: a dimension plus a dimension of the same
  unit, a dimension times a number, and a dimension over a dimension for a number. Only the result is rounded, to four decimal places.

A token of the `expression` type holds a number, a dimension, or an expression, so a value is fixed or calculated, and can be changed from one
to the other. A reference is made from a token of a library (`ref(token)`) and not from a string, and the name of its custom property comes from
the library (`toProperties`), so there isn't a second way of naming.

## Consequences

- The value of a derived token isn't a DTCG dimension. A consumer that needs the number, like the Figma plugin, calls `evaluate`, which replaces
  evaluating the CSS string.
- The tokens that an expression refers to are not read when it is resolved, so the library doesn't track them. The expression stays the same when
  they change, and what changes is what `evaluate` gets, and what the browser calculates.
- The units of what is added or rounded have to match, and `evaluate` says so when they don't.
- The expression type is recursive, which the library's check for functions in a custom value can't search (library #61), so the type of
  the value has its arguments loosely typed.

## Alternatives

- **Work out the numbers when the token is resolved.** It was the first version, and it doesn't change in the browser.
- **CSS strings**, as before. They can't be evaluated without parsing, and they have the problem above.
- **Support in the library.** It would be shared, but the library holds DTCG values and the calculation isn't part of the format. It can be
  moved there if it proves general.
