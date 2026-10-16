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
