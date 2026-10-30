# Badge

A short label, such as a count or a status. It has no behavior, so its contract is its parts (`BadgeParts`, `badge.ts`).

## What was taken from where

| Aspect | FAST Foundation | Here |
| --- | --- | --- |
| Element and parts | A `control` part around the default slot (alpha.31); `start`, the `content` part, and `end` (alpha.33) | FAST Foundation alpha.33: the host is the badge's box, with `start`, `content`, and `end` |
| Semantics | None | None: a badge is text. A badge that changes, like a count, is announced by a live region the author places, not by the badge |
| Counter | | Not taken yet: a counter badge would be its own component, with its own contract |

Considered and not taken: `appearance`, `color`, `shape`, and `size` attributes, which are appearance, for Adaptive UI.
