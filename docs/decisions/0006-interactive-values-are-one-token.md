# 0006. The values of an interactive element are one composite token

- Status: Accepted
- Date: 2026-10-17
- Package: adaptive-ui

It is implemented as `InteractiveToken` and `InteractiveDeltaTokens` of `src/core/token-types.ts`, `InteractiveSet` of `src/core/interactive.ts`, and the `interactive` converter of
`src/core/token-css.ts`, and the interactive fill of the layer (`src/reference/layer.ts`) is the first use. The prototype it started from, which was bigger, is on the
branch `token-library/sets-prototype`, which isn't for merging.

## Context

What an interactive element looks like depends on its state: rest, hover, active, focus, and disabled. Those five are `InteractiveState`, and nothing else is a
state: a condition of the element like read-only, or success and error, is a variant of the role or of the palette that the styles choose. Adaptive UI has a
convention for the values of the states, an interactive set, usually colors, that a recipe creates and that travel together. In the FAST tokens each state was a token of its own
that ran the recipe again and kept one result, and the group was a shape that nothing could check.

What it needs:

- the recipe that makes the values is authoritative, and runs once, for all the states, since they are calculated together. Changing a single value is allowed and isn't made easy;
- it isn't only for colors: the value can be a dimension, and it is one type for all of them;
- DTCG can't say that a group is a set, since a group has no shape to check.

## Decision

- The values of the states are **one token**, at its own name, of one custom type, `interactive`, whose value is `InteractiveSet<V>`: the values of the states that it has, of the five that an
  interactive element has. A state that is not given is not there, and `null` clears it on purpose. The value type is a parameter, `InteractiveToken<V>`, so there is no type for each kind of value.
  Even `rest` is not needed: a ring that is only for the focus, or a lift that is only on hover, has no honest value for the others, and would need a made up one (`transparent`, `0`).
- The recipe is the **alias of the token**, so it runs once. A recipe is a function, as it was: `deltaColorSet(palette, reference, deltas, options)` for colors.
- The deltas that a recipe reads are **number tokens in a group**, and nothing more. `InteractiveDeltaTokens` is the type of a group with a number for each of the states that it says (all five unless it says
  `InteractiveDeltaTokens<InteractiveState.hover | InteractiveState.active>`), since a recipe doesn't need a delta for every state, and `interactiveDeltas` gets the numbers that a recipe is given, so a
  group can be shared (the disabled deltas of the recipes of one kind) or be alone, as the layer's are.
- In CSS `--x` is the `rest` value, and a state is `--x-<state>`. Only a state that has a value is written, and a state without one is not there for a style to use, as it was when each state was a token. The
  states are mutually exclusive in the rules that a style renders, and the order of the rules is where the precedence of one over another is, so a value doesn't fall back to another. The converter writes the
  other states after the value of `--x`, until the library can write more than one property for a token (library #64), and the property of a set that has no `rest` is empty.
- A recipe that gives a set gives the states that it has, and leaves the others out, so a set that is spread over another leaves what it doesn't mention. A recipe that follows another set (a foreground of a
  background) gives the states that the other set has.
- A palette is a token of its own custom type, `palette`, that isn't CSS. Until the library can leave a token out (#58), it is written as an empty value.

## Consequences

- A token whose value a system might want by state later has to be defined as an interactive token, since the type of a token can't change when it's extended. There is no type for "a single
  value or a set" until something needs one.
- The set can have logic about the states together, which separate tokens couldn't: inverting the deltas when they would leave the palette.
- A state that changes alone isn't tracked as its own token. A change to what the recipe reads changes the whole set.
- A consumer that reads a state in code has `V | null | undefined`. A style doesn't read the value, it renders a rule for each state that has one.
- A plain value that might be by state later is `{ rest: value }`, so a token that is interactive from the start costs nothing and a system can add a state by extending the value.
- A recipe is a plain function with the parameters that it needs, and the deltas are a convention and not a requirement: a recipe may need one delta, or none, and the recipes that are here take them
  as an `InteractiveSet<number>`. A later change gives every recipe a single options object, and a recipe is free to require some of its options (`{ restDelta: number, hoverDelta?: number, palette: Palette }`).
- There are no helper functions to define a set and its deltas: the config is written as it is, and a recipe that is a function of the numbers is the alias.

## Alternatives

- **A value for every state, or for the `rest`.** A recipe with no value for a state has to make one up (`transparent`, `0`, `1`), which says something that isn't true, and some values have no neutral one (an outline style, a shadow, a transition).
- **A `var(--x-hover, var(--x))` fallback to the `rest`.** The states are not alternatives to fall back across, and the rules are rendered in the order that decides which applies. It also needs the `rest` to be there.

- **The set as the `$root` of a group,** with the inputs in the group. The value is the set and the siblings aren't its variants, which isn't what `$root` is, and every reference is `$root.$value.rest`.
- **A token for each state that read a hidden token for the set.** It shows the states to a style and the designer, but the shape isn't checked and the same value is in two places.
- **A custom type for each kind of value** (`colorSet`, `dimensionSet`). The same code for each.
- **Open states, a helper that defines a set with its deltas, and a type for a value that may or may not be a set.** The first draft had them, and nothing needed them: the states are the five,
  the deltas are number tokens, and the layer is written without a helper.
