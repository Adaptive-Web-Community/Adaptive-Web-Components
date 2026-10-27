# Decisions

The decisions that shape the code and that the code can't explain by itself, with why they were made and what else was considered. They are
[architecture decision records](https://adr.github.io/): short, numbered, and not edited after they are accepted. A decision that changes is
a new record that says it supersedes the old one.

## When to write one

When a reader of the code would ask "why is it like this?" and the answer is a choice between real options, and not a convention that is
obvious from the code or a detail of one file. A rename or a bug fix is not one. A change in the shape of a value that every consumer sees is.

A record is for a decision that crosses files or packages, or whose reason outlives the code. How a module works is a `README.md` next to
it, and the reason for a line is a comment, which can link to a record by its number (`See docs/decisions/0001-...`).

## How

Copy [`0000-template.md`](0000-template.md), take the next number, and keep it to a page. Put the status at the top: `Proposed` for what is
being tried and not settled, `Accepted`, or `Superseded by NNNN`. The pull request that makes the change adds the record, so a review sees the
reason with the code.

## Records

| | Decision | Status |
| --- | --- | --- |
| [0001](0001-colors-are-plain-data.md) | Colors, palettes, and gradients are plain data with functions | Accepted |
| [0002](0002-deprecated-names-for-the-beta.md) | The 1.0 beta keeps deprecated names in one file, with a ledger | Accepted |
| [0003](0003-migrate-behind-an-exclusion-frontier.md) | Migrate in steps, with what isn't migrated excluded from the build | Accepted |
| [0004](0004-derived-values-are-expressions.md) | A value calculated from other tokens is an expression, written as `calc()` | Accepted |
| [0005](0005-a-type-ramp-is-a-ramp.md) | A type ramp is a ramp, whether its values are fixed or come from a scale | Accepted |
| [0006](0006-interactive-values-are-one-token.md) | The values of an interactive element are one composite token | Accepted |
| [0008](0008-disabled-is-fixed-in-tokens.md) | The disabled color is fixed in tokens, shared by the recipes | Accepted |
| [0009](0009-component-behavior-is-framework-neutral.md) | The behavior of a component is framework-neutral, and each framework binds it | Accepted |
| [0010](0010-a-control-is-its-host-element.md) | A control is its host element, made a form control through ElementInternals | Accepted |
| [0011](0011-styles-render-to-css-without-fast.md) | Styles render to rules of CSS, without FAST, and refer to tokens by ref | Accepted |
| [0012](0012-a-treatment-is-a-named-set-of-style-properties.md) | A treatment is a named set of style properties, as plain data | Accepted, its pairs superseded by 0013, its names by 0015 |
| [0013](0013-a-value-on-a-fill-is-made-in-the-context-of-the-fill.md) | A value on a fill is made in the context of the fill, for the pairs the treatments have | Accepted |
| [0014](0014-a-names-history-is-kept-with-what-it-names.md) | A name's history is kept with what it names | Accepted |
| [0015](0015-a-treatment-is-a-token.md) | A treatment is a token, named in the group it styles | Accepted |
