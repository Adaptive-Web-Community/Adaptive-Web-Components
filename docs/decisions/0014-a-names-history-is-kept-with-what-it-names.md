# 0014. A name's history is kept with what it names

- Status: Accepted
- Date: 2026-10-29
- Package: adaptive-ui

## Context

A token's name is stored outside the library: in the plugin data of a design file, in an anatomy written as JSON, in generated code.
Renaming will always happen, so a stored name has to keep finding its token after a rename, and the tool that stored it has to learn
that it was renamed to update what it stored. Not every stored name will be updated by 1.0, so this lasts past the migration.

0.14 kept a table of 969 old names (`TokenNameMapping`, `reference/token-naming.ts`), apart from the tokens, which the designer read
when it loaded a design. It drifted: its layer entries were shifted by one. It also mixed a rename with things that are no longer tokens
(the foregrounds on a fill, the recipes). Most of its entries followed from a rule that the table didn't say.

DTCG has `$deprecated`, which the library carries, but "deprecated" isn't only a rename: a deprecated token may still be the right
name, with no replacement yet, and a renamed token isn't always deprecated.

## Decision

- **The names a token or a group had are kept on it**, as data in its `$extensions["adaptive-ui"].formerNames` (`formerNames(...)`, or
  `tokenMetadata({ intendedFor, formerNames })`). On a group, a former name is the old path of the group, and its tokens keep their path
  within it.
- **A rename that follows a rule is a function next to the tokens**, `withFormerNames(config, namesOf)`, which gives each token the names
  that the function gives for its path. The names are still data on each token; the rule is written once, where the tokens are.
- **The formats of earlier versions are rules of the resolver**, not data: the kebab case of 0.x (each word and number apart, with or
  without the first group), a state after the name of an interactive token (`.rest`, `-rest`), and `.value` after the name of a set.
- **`tokenNames(library)` indexes the names, and `resolveTokenName(index, name)` finds the token** of a stored name, with its current
  name, the state, whether it was renamed, and its `$deprecated`. A name given for two tokens is an error; a kebab case that two tokens
  share finds neither.
- **Deprecation is DTCG `$deprecated`**, reported and not resolved, and kept apart from renaming.
- **The deprecated names of the exports** (`reference/deprecated.ts`, decision 0002) are a different matter: they are code, which
  TypeScript's `@deprecated` covers, and they go before 1.0. A name's history is data, and stays.
- A treatment is named the same way next, as a token of the hierarchy, so the same history applies to it.

## Consequences

- A rename is made where the token is, with its former name, and a stored name keeps working. The CLI warns with the name to write
  instead, and the designer can rewrite what it stored (phase 4).
- The 685 names of 0.x and 0.14 that are still tokens are a fixture (`reference/token-names-before-1.0.json`), and a spec checks that each
  finds the same token as its name in 0.14, so a rename that isn't kept fails it.
- The foregrounds on a fill and the recipes of 0.14 find no token. They were never applied to a design directly, and the designer
  handles a stray one when it is migrated.
- The library has no way to walk its tokens, so the index walks `library.tokens` (an upstream gap).

## Alternatives

- **A table apart from the tokens** (0.14): it drifts, and nothing ties it to the token it is for.
- **The old name as a token, an alias with `$deprecated`** (DTCG): every old name would be a token of the library, about 700 of them in
  its tree and in its CSS, and a deprecated alias says "don't use this", not "this was renamed". An export to DTCG can still make
  them from the former names if a tool needs them.
- **Every old name as data**, no rules: most of them follow from the path, and a rule is what they were made by.
