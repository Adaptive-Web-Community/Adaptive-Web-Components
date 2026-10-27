# Skeleton

The shape of content that is loading, in its place. It is hidden from assistive technology, since it has nothing to read; the container that is
loading has `aria-busy`.

- Contract: `SkeletonElement`, `SkeletonShape`, `SkeletonParts` (`skeleton.ts`).
- Behavior: `skeletonAria`, the default ARIA (hidden), which the binding assigns to the element's `ElementInternals`.

## What was taken from where

| Aspect | FAST Foundation | Here |
| --- | --- | --- |
| Semantics | None: the shapes are in the accessibility tree, and the pattern's `<img>` has no `alt` | Hidden (`aria-hidden` through `ElementInternals`), and the pattern image has `alt=""` |
| Shape | `shape`: `rect` or `circle` | FAST Foundation |
| Shimmer | `shimmer`, a highlight drawn by the styles | FAST Foundation, with the `shimmer` part |
| Pattern | `pattern`, a URL shown by an `<object>` with an `<img>` inside | The URL shown by an `<img>`, the `pattern` part |
| `fill` | An attribute that nothing used | Not taken |

Considered and not taken: stopping the shimmer for `prefers-reduced-motion`. The animation is in the Adaptive UI styles, which should respect it.
