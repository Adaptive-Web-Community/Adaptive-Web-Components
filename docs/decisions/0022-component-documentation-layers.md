# 0022. Component documentation is layered: structure, binding, rules, and usage

- Status: Accepted
- Date: 2026-11-10
- Package: adaptive-ui, components-foundation

## Context

`ComponentAnatomy` in `packages/adaptive-ui/src/core/styles/anatomy.ts` maps part and condition **keys** to CSS **selectors**. The style renderer,
CEM, and designer tooling all read that shape, so “what the component is” and “how we select it in CSS” are one value. That blocks non-web
renderers, pushes selector strings into focus and interactivity, and forces renderer-owned compensations (`AnatomyTreatments`, `anatomyRules`,
`ignoreInteractivity` on style targets).

Product guidance for components often lived beside styling hooks in separate Markdown, with no typed split between **built-in capabilities** and
**product usage rules**, and much of it described visual implementation (colors, spacing, cursors) rather than semantic policy for consuming teams.
An internal PoC split component-owned hooks from theme `styleRules` but still named the hook bundle **anatomy**, which read as “the whole component
doc” even though it was only the **structure** slice plus selectors. Adaptive UI needs a named aggregate for the full doc, the same split for
**structure** vs **platform binding** vs **theme rules**, and one typed source for narrative, accessibility, usage, and changelog.

Decision 0009 puts framework behavior in a neutral controller and a per-framework **binding**; this record extends that idea to **documentation and
styles**: semantic structure is framework-neutral, selectors live only in a binding profile.

## Decision

### Naming: aggregate vs slices vs files

- The **whole** typed object—every slice in one logical document—is `Documentation`. In prose, “component documentation” is fine;
avoid `doc` in code and file names (ambiguous with Storybook, JSDoc, and package `docs/`).
- `anatomy` is retired for the aggregate. It names only the legacy compile type `ComponentAnatomy` during migration. The portable hook
model is the `structure` slice (`Structure`), not “anatomy.”
- `StyleProfile` is the style compile bundle (`structure` + `PlatformBinding` + rules), not the full component doc—usage and narrative are not
part of it.
- **Recommended** reference modules: `{component}.documentation.ts` exporting a `Documentation` value (for example `buttonDocumentation`),
with bindings in a sibling such as `{component}.{platform}.binding.ts`. Teams may choose other paths and file names; generators and linters key off
the **type**, not the filename.

### Canonical model and package layout

- `packages/adaptive-ui/src/core/documentation/` holds the doc aggregate (`Documentation`), `Structure`, contract and usage
slices, shared usage rule sets, and helpers that project docs to Storybook, CEM, linters, and MCP. Documentation does not import style selectors.
- `packages/adaptive-ui/src/core/styles/` owns `PlatformBinding`, `StyleProfile`, and `structureToComponentAnatomy` (structure from
documentation plus binding merged for `renderStyleRules` until the renderer is layer-aware). It compiles CSS from `structure` + binding +
optional `StyleRules`. Rules refer to semantic hook **ids**; only binding maps ids to selectors (`conditionSelectors`, `partSelectors`, `contextSelector`) or their equivalent on the platform.
- Reference **instances** (for example Button documentation and a FAST web binding) live in **components-foundation**; consumers depend on
`@adaptive-web/adaptive-ui` for types only.

### Section model and `Documentation`

Documentation is composed from **section types**—each a single top-level key (`IdentitySection`, `StructureSection`, `ContractSection`, …). Each section
type is generic so reference slice values can be extended while APIs still accept **minimum reference shapes** (for example `Structure`,
`Contract`) when that is all they need. Typescript intersects the sections into `Documentation`, the Adaptive Web **reference profile**:
every first-party slice may be present, but only `id` is required (`Identity` on `IdentitySection`). `definition` lives in  
identity. Reference implementations (for example Button)  
typically fill structure, contract, usage, and changelog; consumers may define their own intersections (for example extended profiles) and omit
slices AWC does not own.

APIs depend on **sections**, not the full reference profile: style compile uses `DocumentationForAnatomy` (identity plus structure); contract codegen uses
structure and contract together; markdown renderers skip absent slices.

There is **no doc semver**; package semver and `@deprecated` / `formerNames` govern API removal. Changelog is encouraged for reference docs but optional
at the type level (dated entries, author, summary, `changeKind` when present).

| Section                                                                                                      | Role                                                             |
| ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| `IdentitySection` (`id`, optional `label`, `definition`, and `remarks`)                                      | Documented subject identity and overview (`id` **required**)     |
| `GovernanceSection`                                                                                          | Record lifecycle: status, owner, last reviewed                   |
| `DisambiguationSection`                                                                                      | Related components and when to choose each                       |
| `StructureSection`                                                                                           | Semantic hooks: the parts and their participation (no separate conditions map) |
| `ContractSection`                                                                                            | `Contract`: typed properties (the boolean and enumerated ones are also style condition ids) and slots |
| `AccessibilitySection`, `CapabilitiesSection`, `UsageSection`, `KnownIssuesSection`, `ChangelogSection`      | Optional slices per their section types (`Accessibility`, `Usage`, …)           |

Canonical **section order** favors human readers; Storybook MDX and MCP tools **project** slices—they do not define the source shape.

`definition` is the summary, and `remarks` is what a reader needs after it (how it behaves, what is shared, an event, a pointer to a decision), in Markdown with
paragraphs separated by a blank line. The Markdown projection renders it after the definition, and the generated contract carries it as its `@remarks`, so the
TypeScript interface and the page say the same thing. The remarks that were written on an interface (`LabelledElement`) move to the documentation.

### Shared contracts: `include`

Components that are one kind of thing share a contract: a text field, a text area, a number field, and a search are each a text input, and `TextInputElement` is
the interface they extend. The documentation says the same, so a property is described once.

- A `Contract` may `include` other contracts, by value: `include: [textInputDocumentation]`. What is included is any record with an `id` and a `contract`
(`ContractInclude`), so the documentation of an interface is included as it is, and the literal ids stay, which `PlatformBindingFor` types the binding from
(`ContractProperties` is the properties of a contract and of what it includes). A binding supplies a selector for every condition, the included ones too.
- What is shared is the **contract and nothing else**. Structure, disambiguation, usage, and accessibility belong to the concrete component: the control is an
`<input>` in one and a `<textarea>` in another. So the documentation of an interface has no structure, which the generator allows.
- `resolveContract` is the whole contract: what is included first, then the contract's own. A property or slot of an included id **overrides it for the
component, to change its text** (`label`, `description`), and may not change what it is (the kind and the nullability), so a component can't diverge from the
interface it extends. Generators, the Markdown projection, and the binding check read the resolved contract.
- The generated contract follows the model: `TextFieldContract extends TextInputContract`, imported from the module generated from the included record (the scan
finds it by id), with only its own properties. The slots (`TextFieldSlots`) are those of the whole contract, since a template uses them all.
- The explicit `include` is the same choice as for usage rule sets: an override stays visible, and nothing is inherited by being of a kind.
- A contract is of an interface, which may be a component's, an element's, or neither, so the generated source **assumes no element**: the interface is documented by
the identity's `definition` (and `remarks`), and the parts and slots by its label (`Slot names of Text Input`), never as "of the element". `LabelledElement` and
`ContentLabelledElement` are kept only until the components that extend them have migrated, and then they go: they were never elements (they don't extend
`HTMLElement`), and a component extends the contract (`TextInputElement extends FormControlElement, TextInputContract`).
- The generated contract is the **component's API as a consumer uses it**: the properties an author sets or reads, whether or not one is an attribute
(`checked`, `value`), and the slots. What isn't that stays in the hand-written element interface, which extends the generated contract of its leaf (the chain
of includes carries the rest). The **default of a property** that the user changes (`defaultValue`, `defaultChecked`), which the attribute sets and a form
reset restores, is how a web element keeps its state, as an uncontrolled React component does: an implementation detail, so it isn't documented, and
`TextInputElement extends FormControlElement, TextInputContract` adds `defaultValue`. The form association, validity, and methods come from
`FormControlElement`, which the documentation describes as a capability. An element lists the element interface
of an included record too when that has members beyond its contract. The contracts don't extend element interfaces: they would pull DOM types into plain data,
import each other in a cycle, and rely on a hand-written module that the generator can't check.
- The interfaces that components share are documented this way: `LabelledElement` (`labelled`: `label`, `hideLabel`, and the `label` slot) and `ContentLabelledElement`
(`contentLabelled`: `hideLabel` and the default slot), and `TextInputElement` (`textInput`), which includes `labelled`. A component includes the one it is labelled by
(a text field gets its `label` property and slot through the text input, a button its default slot from `contentLabelled`), so each of them is described once.

A **property that can have no value is `nullable`**, typed `T | null`, like an attribute that isn't set (`name`, `maxLength`). `null` is the one way a property of
an element says so: it always has a value, so `undefined` isn't one of its states, and the platform's own properties and element reflection use `null` too. A boolean isn't
nullable (it is `false`). This is different from options and sets of values (`InteractiveSet`), where an absent member means "not given, fall through" and `null` clears
it on purpose; there the two do differ, and the contract doesn't need the difference.

### Structure (semantic hooks)

- Stable **camelCase ids** everywhere structure is referenced (`content`, `purposePrimary`), and for documented components (`textField`, so
a `DocRef` and a disambiguation entry are ids too). Display copy is `label`, which defaults to the words of the id (`textField` is `Text Field`),
and `description` (Markdown), not object keys. "Label" is the readable text throughout; there is no `name`. A part may be an instance of another
component (`component`, a `DocRef`).
- **Conditions** are not duplicated on structure: a contract property that is a boolean or an enum is a style condition of its id, unless it says
`condition: false`, and `PlatformBinding.conditionSelectors` maps those ids to platform selectors. A condition is a state that the component presents and
styles key on (`checked`, `readOnly`, `orientation`), so its values are a known set. A string or a number property (`label`, `name`, `value`, `maxLength`)
is never one: a selector for it can only test whether it is set, which is a web idiom (`[label]`) and not the property. The opt-out is for a boolean or an enum
that only configures behavior, and since nearly every one is a condition, it is the exception that is written. An override of an included property can't change
whether it is a condition, since the binding fragment of the interface supplies its selector. `disabled` is a condition and also the binding's `interactivity`
for now, until the interactivity model is revised. `defineDocumentation` keeps the literal ids and kinds, so `PlatformBindingFor` types the binding from the
documentation: the conditions (and the values of an enumerated property) and the parts get autocomplete and checking, and a selector for a property that isn't a
condition is an error.
- A state that isn't a property (whether a text input has a value, or the slot an item is in) isn't a condition yet. When a component needs one, it is
declared in the documentation and named for what it tests (`hasValue`, not `value`), so a rule doesn't read as matching the value.
- Structure is a **tree of parts whose root is the component's context**. The structure is itself the context part, so its
markers are the context's, and its `parts` nest: a part's `parts` are the parts inside it. Part ids are unique across the whole tree, so a binding's
`partSelectors` stays one flat map. Nesting says what is inside what, so an interactive part inside an interactive context (an expand control in a
tree item) is visible. The structure is flat in its own fields (no wrapper), and can add structure-level fields later without changing parts.
- Each **part** may be `interactive` (it does something when the user acts on it, like handling a click, so it can present as interactive, as
Adaptive UI treats an interactive element) and `indicatesFocus` (focus presents on it, so the focus indicator is drawn there; not necessarily the element that takes focus, and a
component may have several, like a stepper's buttons). Nothing else about participation is modeled: disabled presentation, which element takes
focus and the reset of the platform's own indicator there, and the cursor are binding or style concerns. A binding without a focus of its own gets
the focus of the first part that indicates focus.
- **Interactivity, focus, and cursor** are not on structure. They say how a platform selects and styles the interactive and disabled states,
where the focus indicator is drawn and the platform's own indicator is reset, and the pointer, so they are in the binding (below).
- **Treatments** in themes style named targets on this model; renderer-owned `AnatomyTreatments` and per-target `ignoreInteractivity` retire in favor
of participation plus binding-derived selector params.

### Binding and rules

- `PlatformBinding` is per framework (FAST/Lit web, React class map, designer adapter, etc.). Conditions may map to attributes or classes per
platform; **structure stays shared**.
- The binding has the component's `interactivity` (the interactive and disabled selectors, and the selectors of the states, like
`:state(active)`), its `focus` (the focus and reset targets, with the presets of `Focus`), and its `cursor`. The parts of `focus` and `cursor`
are part ids, which the adapter resolves through the binding's `partSelectors`. Selectors are only in a binding: the part ids are listed by
structure, and the binding's `partSelectors` maps each id to its selector.
- **Style rules** stay in the theme or reference system, keyed by semantic targets and `InteractiveState` (decision 0006). A missing target in
structure causes rules for that target to be skipped, not invented selectors in structure.

During migration, an adapter may compile `structure + binding` **→** `ComponentAnatomy` for `renderStyleRules` until the renderer is
participation-aware. It maps the binding's interactivity, focus, and cursor onto the anatomy as they are, so the rules the renderer adds for them
(the disabled treatment, the cursor, the focus reset, and the focus indicator) don't change. JSON anatomy is not authored or exported once TypeScript is canonical; legacy `jsonToStyleSheet` remains an internal adapter
only.

### Usage rules: stance, severity, categories

Usage is **semantic policy only**—no color, spacing, typography, or cursor styling in usage rules. Visual/concocted legacy guidance is removed, not
relocated to theme docs.

Each `UsageRule` is data:

- `stance`: `do` | `dont` | `caution` (cautions export as callouts in MDX, not a separate top-level doc section).
- `severity`: `must` | `should` | `may` (product linters enforce `must` where linters exist).
- `text`, optional `reason` and `exceptions` (Markdown), `categories` for export and lint, optional `sources` (for example WCAG),
stable `id` for shared sets and changelog.

`Usage` may `include` shared `UsageRuleSet` refs (for example `form-control`); component rules override shared rules on id
collision. Generators render Do’s, Don’ts, and cautions as **one Usage narrative**.

### Change pipeline

Authors (designers, engineers, agents) edit TypeScript documentation, **append a changelog entry**, and run generators/tests. Additive changes update
docs and changelog; breaking structure id removal requires a prior deprecation changelog line and follows existing changeset rules for the package
API—not a doc-local version bump.

## Consequences

- CEM, Storybook, designer-figma, conformance, and MCP consume one typed source; selectors never leak into manifest or cross-platform docs.
- Theme linters can warn on hover/active rules targeting a part that isn't `interactive`.
- Foundation holds the proof modules (Button, Text Field, Menu Item) as `Documentation` instances with separate binding modules, and the contract that
the text components share (Text Input) as a record that they include.
- Migration work: new `core/documentation/` types, foundation documentation modules, binding modules, MDX generator, then participation-aware renderer
and removal of anatomy treatments.

## Alternatives

- **Keep** `ComponentAnatomy` **as the single model** — Rejected: perpetuates selector-as-structure, blocks non-CSS targets, and overloads “anatomy” past
the structure slice.
- **Call the aggregate** `anatomy` **or** `spec` — Rejected: “anatomy” is tied to the old selector map; “spec” collides with tests and with builder
“Specifications” sections that are projections of slices, not the source file name.
- **Portable interactivity, focus, and cursor on structure** (an interactivity pattern, a graph of who receives focus and where it shows, a
cursor part) — Rejected: the patterns named ways to write a selector, the bindings set their own interactivity and focus anyway, and the
cursor is a pointer style. Each was a second, unchecked copy of what the binding says.
- **Markdown-only usage docs** — Rejected: no categories, severity, shared sets, or lint without a parallel schema.
- **Doc semver on each component** — Rejected: docs ship with code; changelog plus package semver is enough.
- **Implicit inheritance of usage rules from supertypes** — Rejected: explicit `include` of named rule sets keeps overrides and collisions visible.
- **Spread the shared properties into each component's contract** (`properties: [...textInputProperties, ...]`) — Rejected: it works, but every generated
contract repeats the properties, and the interface the components share isn't in the types.
- **A shared contract that is a whole `Documentation`, with a structure of its own** — Rejected: the structure is the concrete component's (an `<input>` or a
`<textarea>` is the control); only the contract is common.
- **`undefined` as well as `null` for a property without a value** — Rejected: an element's property always has a value, so there is one way to say none (`null`).
- **Every contract property is a condition** — Rejected: a binding made up a selector for each (`name: "[name]"`, `maxLength: "[maxlength]"`) that no style
should key on, a selector for a string can only test whether it is set, which another platform has no way to say, and the id hid that (a `placeholder` condition
that tested for a placeholder).
- **Only a property that opts in is a condition** — Rejected: nearly every boolean and enum of a component is one, so the flag would be on almost all of them.
- **The default of a property in the contract** (`defaultChecked`) — Rejected: it is how the element initializes and resets its state, not what a consumer
uses, and as a boolean it was a condition too, which styles the wrong state once the user toggles the control.
