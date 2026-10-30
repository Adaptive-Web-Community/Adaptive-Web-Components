# 0016. A control is labelled as its native element is

- Status: Accepted
- Date: 2026-10-30
- Package: foundation, adaptive-web-components

## Context

FAST Foundation made the default slot the label of the checkable controls and the text fields (`<fast-checkbox>Accept</fast-checkbox>`),
and gave a Select, a Picker, a Slider, a Listbox, and a Calendar no label at all: they were named by an outside `<label for>` or `aria-label`
only. The radio group had a `label` slot. So there were three ways to label a control, and some controls had none of their own.

The default slot as the label is also a poor fit for frameworks: in React it is `children`, typed as any node, though a label should be text
or a little markup, and the same name means the label in one component and the content in another.

## Decision

Label a control as its native element is labelled:

- A control whose native element is labelled from outside, by a `<label>` (an `<input>`, a `<select>`, a `<textarea>`), has a label of its
  own: the `label` attribute, or the `label` slot for a label that is more than text, which replaces it. The default slot is never the
  label; where the control has items (options, radios), they are its default slot, as a native `<select>`'s options are its children. This
  is `LabelledElement`: the checkable controls, the text inputs, Radio Group, Select, Picker, Slider, Listbox, and Calendar.
- A control whose native element is named by its content (a `<button>`, an `<a>`, an `<option>`) is labelled by its default slot. This is
  `ContentLabelledElement`: Button and Anchor now, and later the other elements named by their content (Tab, Menu Item, Listbox Option,
  Tree Item) when they need what it adds.
- `hide-label` hides the label visually, and the label still names the control. A button whose label is hidden shows only its `start` and
  `end` (an icon), and is named by its text, which is translated with the page unlike an `aria-label`. It replaces 0.10's `icon-only`,
  which was worked out from content that was one icon: styles select `[hide-label]`.
- An outside `<label for>` of the element names it too.

How the label names the control follows from where the role is (decision 0010): the checkable controls are named by their content, which
the label is; a text field's and a Picker's label is a native `<label for>` of the input; a Select's and a Calendar's names the combobox or
the grid by a fixed id in the shadow root; and where the host has the role (Radio Group, Slider, Listbox), which a reference from the host
can't reach into its shadow root, the elements of the slot are the host's `ariaLabelledByElements` and the text of the attribute is its
`ariaLabel` (`labelHost`).

## Consequences

- A breaking change from 0.10 for the checkable controls and the text fields: `<adaptive-checkbox>Accept</adaptive-checkbox>` is now
  `<adaptive-checkbox label="Accept">`, or `<span slot="label">` for markup.
- Every input-like control has a `label` part, which the styles of each component target the same way.
- The label of a control whose host has the role is in the host's box, so the box of a Listbox moved to an `options` part, below the label.
- A press on a Slider's label focuses it without moving the thumb, as a native label does.
- `hide-label` is a boolean attribute, so it is absent by default: an attribute can't default to true, which `show-label` would need.

## Alternatives

- **Keep FAST Foundation's default slot for the checkable controls and the text fields**, and add a `label` slot only to those without a
  label. Fewer changes, but two ways to label an input, and the React typing problem stays.
- **Only an outside `<label for>`**, with no label of the control's own. It is how native controls are labelled, but each use needs an id
  and an element, and a label hidden visually would be the author's to do.
- **A `label` attribute only**, without a slot. Simpler, but a label with a link or a mark of a required field couldn't be written.
- **Keep `icon-only`, worked out from the content**, beside `hide-label`. It is what 0.10 did, but its name assumes the content is an
  icon, it isn't the word the other controls use, and a button whose content is only an icon has no name of its own.
- **`show-label`, true by default.** It reads better, but a boolean attribute is true when present, so it would need `show-label="false"`.
