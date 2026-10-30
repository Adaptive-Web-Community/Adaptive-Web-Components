# 0015. A treatment is a token, named in the group it styles

- Status: Accepted
- Date: 2026-10-29
- Package: adaptive-ui
- Supersedes: the registry and the names of the treatments in [0012](0012-a-treatment-is-a-named-set-of-style-properties.md)

## Context

A treatment is a named set of style properties (decision 0012). Its name was a string apart from the tree of the tokens, in categories
(`color.accent-fill-readable-control`, `styles.action-control`), and a list (`referenceTreatments`) and a map from a name to the name of an
export (`TreatmentNameMapping`) found one. Code referred to an export (`accentFillReadableControlTreatment`), a name of no meaning. The
designer groups a treatment with the tokens of its category by its name. A system couldn't change a treatment of the reference, or have the
treatments composed of it follow, the way a token is changed by extending the library.

The names a token had are kept on it (decision 0014), which a treatment needs as well. A prototype
(`token-library/treatments-prototype`, `docs/treatments-as-tokens.md` there) tried a treatment as a token, and rendered the same CSS.

## Decision

- **A treatment is a token of the library**, of the `treatment` type (`TreatmentToken`), which isn't written to CSS. Its name is its path,
  its only identifier; it is extended, renamed and deprecated as a token is.
- **Its value is plain data.** `treatment({ treatments, properties })` makes its config, written with refs, and keeps each ref as the path of
  its token, as an expression does (decision 0004), since the library resolves the refs in a value (design-token-library#106). In JSON a ref
  is a DTCG alias, `"{color.accent.fill.readable}"`.
- **The names follow two patterns, with the word in the path**, so a treatment isn't taken for a token, and a tool groups it with its
  tokens by taking the word out:
  - The treatment of a set of tokens is the set's `treatment`, beside its tokens (`density.control.treatment`). With variants, it is a
    group whose `$root` is the treatment and whose children are the variants (`density.control.treatment.square`).
  - The other treatments of a group are in its `treatments` group (`color.accent.treatments.fillReadableControl`), and those composed
    across the groups are in the `treatments` group of the root (`treatments.actionControl`).
- **A ref to a group whose `$root` is a treatment stands for the root**, by name and by ref (`TreatmentRef`), so adding a variant changes
  nothing that refers to the treatment. The library takes no alias to a group, so a token's own value still writes `.$root`.
- **A rule refers to a treatment by ref, or has one written in place**, and the renderer reads a ref from the library
  (`libraryTreatments(library)`). The treatments of the anatomy are refs.
- **A treatment is changed by extending the library**: with a new value, `treatment(...)`, or with changes to the one it extends,
  `changeTreatment(library, ref, { treatments, properties })`. The steps replace, remove, or insert a treatment, named by ref, before or after
  another, or at the start or the end, in order; the properties are merged, and `null` removes one. A replace, or an insert next to a treatment,
  that the list doesn't have is an error, and a remove of one is a warning. The changes are applied when the library is extended, so a
  library holds full values only, and a full value and changes are two functions, never both.
- **The 0.14 names are former names** of the treatments, and the categories follow the tokens: `text` is `typography`, `shadow` is
  `elevation`, and `styles` is the root's `treatments`.

## Consequences

- Any treatment of the reference can be changed by a system, and the treatments composed of it follow.
- `TreatmentNameMapping`, `referenceTreatments` and the `...Treatment` constants are gone: they came with the beta. The `...Styles` names of
  0.14 are deprecated names read from the library.
- A stored name of 0.14 finds its treatment, and the CLI says what to write instead.
- In JSON, a file that extends another may write a treatment as changes, which its loader applies to the file it extends.
- The values of a rule's own properties don't take a group for its root yet; only the treatments do.

## Alternatives

- **The treatments in a library of their own**, with the same structure: no collisions with the tokens, but two libraries to give and to
  extend, and refs between them that no library checks.
- **All the treatments in the root's `treatments` group**: uniform, but away from the tokens they style.
- **The treatment of a set as the set's `$root`**: it stretches `$root`, which is the group's own value, and fails where the group has one
  (`elevation.card`).
- **Composition by role** (`{ shape, density, type, fill }`): a treatment isn't bound to one role, as the composites show.
- **The changes as a value of the library**: a value that refers to the one it replaces needs the library to know the value before the
  extension; applying them when extending is enough, since the values are read only.
