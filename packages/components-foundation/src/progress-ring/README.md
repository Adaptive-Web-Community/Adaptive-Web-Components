# Progress Ring

A progress shown as a ring. It is a progress (`ProgressElement`, in `../progress`), with the same behavior; its parts are its own
(`ProgressRingParts`, `progress-ring.ts`).

## What was taken from where

| Aspect | FAST Foundation | Here |
| --- | --- | --- |
| Contract | `FASTBaseProgress`, shared with the progress bar | FAST Foundation's sharing, as `ProgressElement` |
| Indicator | An SVG ring, its arc drawn by an inline `stroke-dasharray` from the percent | AWC's SVG ring with `background` and `indicator`, and the arc drawn by the styles from `--percent-complete` |
| Slots | `determinate` and `indeterminate` | `determinate` and `indeterminate` |

Everything else (the role, the values, the range, indeterminate) is the progress's: see `../progress/README.md`.
