# 0024. The designer overrides the given tokens, as strings parsed by their type

- Status: Accepted
- Date: 2026-11-18
- Package: adaptive-ui-designer-figma-plugin

## Context

A designer overrides the value of a token for a node, in the plugin, to see the styles that follow from it: a different base color, a
bigger design unit. The override is saved on the node in the design file, and applies to the node and its children. In 0.14 the tokens that
could be overridden were a list, and the value was a string that the plugin turned into a `Color`, a number, or the string, by its shape.

Most tokens of the reference library are derived from others (a fill is made by a recipe of the base color, a ramp step by an expression of
the design unit). A value given to a derived token ends its link to the tokens it is derived from, so it is not changed by the base that
the designer meant to change, and the designer can't tell why.

## Decision

- **The designer is offered the given tokens**: those whose configured value (`configuredValueOf`) has no ref and no computed value
  (`isComputed`) at any depth, of a type that can be written as text. The tokens that follow from them follow the override.
- **An override is a string on the node** (`DesignTokenValue`, `{ value: string }`), parsed by the `$type` of the token when it is used
  (`parseTokenValue`). A value that isn't one of the type is ignored. The string is what the designer wrote.
- **An evaluated value is never stored.** What a node is painted with is evaluated from the overrides and the applied treatments, as the
  library evaluates a scope that extends another, and sent to the design tool as data, not saved with the node.
- The color context is given, but it is set from the fill of the parent and not by the designer, so it is not offered.

## Consequences

- The offered tokens follow the library: a token that becomes a recipe is no longer offered. An override already on a node for it is still
  set, since the library gives a derived token the value too, and it is shown in the list of the overrides so the designer can remove it.
- A file saved by 0.14 has overrides by the names of 0.14, which `resolveTokenName` finds, so they apply. A node saves the current name
  when its overrides are written again.
- A token that 0.14 let a designer override and that is derived now (a color of the palette, for one) is not offered. The override already on
  a node is still applied and is marked "(legacy)" in the list, so the designer can remove it. The plugin does not detect more than that, nor
  help to move the value to the token it follows (a designer sets that one, which is offered).

## Alternatives

- **Offer every token.** A value for a derived token ends what it is derived from.
- **Store the evaluated value.** It would be stale when the library changes, and it is not what the designer wrote.
- **Store the typed value, as JSON.** Strings are what the 0.14 files have, and the form field is a string.
