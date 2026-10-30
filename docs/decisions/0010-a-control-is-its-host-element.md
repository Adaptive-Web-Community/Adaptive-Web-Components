# 0010. A control is its host element, made a form control through ElementInternals

- Status: Accepted
- Date: 2026-10-27
- Package: foundation, adaptive-web-components

## Context

A FAST Foundation control wraps a native element: the button template is a `<button part="control">`, with `delegatesFocus`. So the host has
no role, and what an author puts on the host doesn't reach the element that has one. FAST mirrors about twenty ARIA attributes onto the inner
element (`ARIAGlobalStatesAndProperties`), and takes part in a form through a proxy `<input>` that it adds to the light DOM
(`FormAssociated`). `ElementInternals` is in every browser since 2023: a custom element can have a role, be in a form, and be disabled by a
`<fieldset>` without an inner element.

## Decision

- The host element is the control. Its role and its form association are set through `ElementInternals` (`static formAssociated = true`),
  and it takes focus itself.
- An author's ARIA attributes go on the host, as for a native element, and nothing is mirrored.
- What a native element does that a custom element doesn't (activation by Enter and Space, submitting and resetting its form) is done by the
  component's controller.
- Disabled is the platform's: the `disabled` attribute and a disabled `<fieldset>` both make the element `:disabled`, not focusable, and not
  clickable. Styles select `:disabled`, so a control disabled by its fieldset looks disabled.

## Consequences

- The anatomy of a control has no inner `control` part. The host is styled, and focused (`Focus.contextFocused()` in Adaptive UI).
- Submitting with a name and value, or with the overrides of `formaction` and the like, needs a native submit button, because `requestSubmit()`
  accepts only a native one as the submitter (WICG/webcomponents#814). The controller adds a hidden one to the form for the submission, so a
  `submit` listener sees that element as `event.submitter`.
- `:active` doesn't match while Space is held on a custom element, so the controller sets a custom state, `:state(active)`, for the time.
- Implicit submission (Enter in a text field) doesn't use a custom submit button. A hidden native button in the form would do it; that is
  left for when it is needed.

## Alternatives

- **Wrap a native element (FAST Foundation).** Native activation and `:active`, but the ARIA mirroring, the proxy element in the light DOM, and a
  host without a role.
- **Mirror the disabled state to the `disabled` attribute** (in `formDisabledCallback`). It keeps `[disabled]` selectors, but the
  attribute then outlives the fieldset that set it, and the element stays disabled when the fieldset is enabled.
