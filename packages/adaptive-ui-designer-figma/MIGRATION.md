# Migration

What changed in the Figma compiler since 0.6, as it moves to the 1.0 beta of `@adaptive-web/adaptive-ui` and of the
[designer core](../adaptive-ui-designer-core/MIGRATION.md), and what to use instead.

## The anatomy is plain data

The anatomy of a component is the `SerializableAnatomy` of Adaptive UI, the JSON that the `aui` CLI compiles, and not a set of classes
that wrote it. A boolean condition is its class name, a string condition a record of a class name by value.

| 0.6 | Now |
| --- | --- |
| `Anatomy.fromPluginUINodeData(node)` | `anatomyOf(node)`, a `SerializableAnatomy` |
| `Anatomy`, `StyleRule`, with `Set`s and `Map`s and a `toJSON` | `SerializableAnatomy`, `SerializableStyleRule` of `@adaptive-web/adaptive-ui` |
| `Condition`, `BooleanCondition`, `StringCondition`, `instanceof BooleanCondition` | `SerializableCondition`: `typeof condition === "string"` for a boolean condition |
| `Anatomy.create()` | An object literal |

## What the compiler writes

The anatomies that the CLI writes are what it wrote before, with these changes:

- A style rule names its treatments in `treatments`, not `styles` (Adaptive UI 1.0).
- A token or a treatment that a node stored by a name it had, like a name of 0.14, is written by its current name, as the reference
  library has it, the library that the `aui` CLI compiles with
  ([decision 0014](../../docs/decisions/0014-a-names-history-is-kept-with-what-it-names.md)). A name that finds nothing is written as it is,
  and the `aui` CLI reports it.

An anatomy that the CLI wrote before is kept, as before, and the `aui` CLI still reads it: it reads `styles`, and warns for each name to update.
Delete it to have the CLI write it again.

## Reading the data of a node

The data that the plugin stored on a node is read as the designer core reads it.

| 0.6 | Now |
| --- | --- |
| `parseNode(node)` of the CLI, with the 0.6 model of the core (`Map`s, `deserializeMap`) | `parseNode(node, tokenNames(library))`, with the core's records and `deserializeRecord` |
| The treatments, from `appliedStyleModules` | From `appliedTreatments`, or `appliedStyleModules` for a node the plugin hasn't saved since |
| A whole node of the REST API's types | `RestNode`, the fields of a node that the parser reads |

## The CLI

- It runs without a DOM: the shim of `window` and `document` that Adaptive UI 0.14 needed is removed.
- It depends on `commander`, which it used without listing.
