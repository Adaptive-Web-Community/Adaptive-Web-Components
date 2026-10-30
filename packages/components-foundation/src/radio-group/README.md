# Radio Group

Radios of which one is checked (`role="radiogroup"`). The arrow keys move the focus between the radios and check the one they move to, and
only that radio is in the tab order. Each radio is the form control; the group keeps one checked, gives its name to them, and is named by
its label.

- Contract: `RadioGroupElement` and `RadioGroupParts` (`radio-group.ts`).
- Behavior: `RadioGroupController` (`radio-group.controller.ts`), with the `RovingFocusController` (`../utilities/roving-focus.controller.ts`),
  which the composites to come (toolbar, tabs, listbox, menu, tree) can share.

## What was taken from where

| Aspect | FAST Foundation | Here |
| --- | --- | --- |
| Role | `role="radiogroup"` written to the host | `ElementInternals` |
| Name | A `label` slot, not connected to the role | The `label` attribute, the group's `ariaLabel`, or the `label` slot, whose elements are its `ariaLabelledByElements` ([0016](../../../../docs/decisions/0016-a-control-is-labelled-as-its-native-element-is.md)), in the `label` part, which is hidden from assistive technology so it isn't read twice |
| Keyboard | Arrows, by its own code, swapped right to left, and out of a toolbar at the ends | Our own `RovingFocusController` (no dependency): all four arrows, wrapping, skipping disabled radios, Left and Right swapped right to left. The focus moving checks the radio, as the ARIA pattern has it |
| Tab order | The checked radio, or the first | The checked radio, or the first that isn't disabled |
| Form | Each radio, through its proxy | Each radio gives its value, as native radios. The group is a form control too, without a value, for its validity |
| One checked | The group, on a change | The group reacts to each radio's `checked`, by the user or code; of several checked at the start, the last stays |
| `value` | An attribute and a property | A property: the checked radio's value, which sets the checked radio |
| `name` | Given to the radios | Given to the radios |
| Disabled | `disabled`, which blocked clicks and focus | `disabled`. As a form control, the group is `:disabled` from its attribute or a fieldset around it (`formDisabledCallback`), so its label can show it. It gives its radios `groupDisabled`, so the radios' own `disabled` stays the author's; they act disabled, with `:state(disabled)` |
| Read only | `readonly` | `readonly`, with `aria-readonly`, given to the radios as `groupReadOnly`: the arrows move the focus without checking |
| Required | | `required`, the group missing its value when no radio is checked, shown at the first radio that isn't disabled, with the browser's message. Not validated when read only |
| Orientation | `orientation`, `aria-orientation` written | `ariaOrientation` through `ElementInternals`, and the reflected attribute for the styles |
| Children | By `role="radio"` among the slotted elements | By their class, among the slotted elements, waiting for those not defined yet |

Considered and not taken: leaving a toolbar at the ends of the group with the arrows (FAST Foundation): to decide with the toolbar.
