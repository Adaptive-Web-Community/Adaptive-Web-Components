# Progress

How much of a task is done, or that it is going on (`role="progressbar"`). A progress bar (Progress) and a progress ring (Progress Ring) are
both one, with the same contract and behavior, and templates of their own.

- Contract: `ProgressElement`, `ProgressParts` (`progress.ts`).
- Behavior: `progressAria`, the default ARIA from the value and the range, and `progressPercent`, how much is done, for the template.

## What was taken from where

| Aspect | FAST Foundation | Here |
| --- | --- | --- |
| Role and values | `role` and `aria-value*` written to the host | `ElementInternals`, through the default ARIA |
| Indeterminate | No `value` | No `value` (or one that isn't a number). `aria-valuenow` is cleared, and the range stays |
| Name | The author's | The author's. A localized default needs a localization the components don't have |
| Out of range | Shown out of range | Shown and reported at the nearest end, and the author's value is kept |
| Range defaults | `min` 0 and `max` 100 when they aren't numbers | The same, and the property is the default when the attribute is removed, as a native `<progress>`'s `max` is |
| Percent to the styles | `percentComplete`, as the width of the `determinate` part (alpha.33), or a `--percent-complete` custom property (AWC) | AWC's `--percent-complete` on the `determinate` part, so the styles decide how it is shown |
| Parts and slots | `progress`, `determinate`, and an `indeterminate` slot (alpha.33) | AWC's: `determinate`, `indeterminate`, `indicator`, with a slot in each for an indicator of the author's |

Considered and not taken:

- `validation-state` (`error`, `warning`, `success`), a custom state for the styles: worth adding with the form fields, so the
  states are the same across them.
- `aria-valuetext`, for a value that isn't a percentage (such as "step 2 of 5"): the author's attribute works.
- A native `<progress>` inside: its styling across browsers is what a custom element avoids.
