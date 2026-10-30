# Slider and Slider Label

A slider (`role="slider"`) is a value in a range, which the user changes with the arrows or by dragging the thumb, as a native
`<input type="range">`: the [ARIA slider pattern](https://www.w3.org/WAI/ARIA/apg/patterns/slider/). Slider labels mark values along its track.

- Contract: `SliderElement`, `SliderParts`, and `sliderPercent` (`slider.ts`), `SliderLabelElement` and `SliderLabelParts`
  (`../slider-label/slider-label.ts`).
- Behavior: `SliderController` (`slider.controller.ts`): the value, the keys, dragging, the form, and where the labels are.

## What was taken from where

The source: FAST Foundation 3.0.0-alpha.33 (the archive).

| Aspect | FAST Foundation | Here |
| --- | --- | --- |
| Element | The host is the slider, `role="slider"` written, with a proxy `<input>` for the form | The host, through `ElementInternals`, as a form control: the thumb and track are its parts, which a native range's aren't |
| Name | The author's `aria-label` | The `label` attribute, its `ariaLabel`, or the `label` slot, whose elements are its `ariaLabelledByElements` ([0016](../../../../docs/decisions/0016-a-control-is-labelled-as-its-native-element-is.md)), shown in the `label` part, which is hidden from assistive technology so it isn't read twice; `hide-label` hides it. A press on the label focuses the slider without moving the thumb |
| Range | `min` 0, `max` 10, `step` 1 | A native range's: `min` 0, `max` 100, `step` 1; the value is kept in the range and on a step from `min`, rounded to the decimals of the step |
| Value | `value`, the attribute and the property | A native range's: a string; the `value` attribute is `defaultValue`, which sets it until the user or code changes it, and a reset goes back to it; without it, the middle of the range |
| Keys | Arrows by a step, Home, End | The ARIA pattern: the arrows by a step (Left and Right swapped right to left), Page Up and Page Down by a tenth of the range, Home and End |
| Pointer | A drag on the thumb, and a click on the track | Pointer capture from a press anywhere on the slider: the value follows the pointer along the track, `input` as it moves, and `change` when it is released |
| Position | Inline `left`, `right`, `top`, `bottom` styles, computed for the direction | The `--slider-position` custom property (0 to 100) on the positioning region; the styles place the thumb with logical properties, so right to left needs nothing |
| Read only | `readonly`, `aria-readonly` | The same |
| Value text | `valueTextFormatter` | `valueTextFormatter`, as `aria-valuetext` through `ElementInternals` |
| Labels | Slider labels with `position`, whose place is computed from their slider | The slider gives each label its `percent` and `orientation`, shown as `--slider-label-position` and `:state(vertical)` |
| Mode | `mode`, single value only | Not taken: one value |

Considered and not taken:

- A native `<input type="range">` inside: its thumb and track have no parts, only pseudo-elements that differ by browser.
- Two thumbs (a range of values): add it on the first real use.
