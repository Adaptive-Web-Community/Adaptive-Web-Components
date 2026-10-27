import type { InteractivityDefinition } from "@adaptive-web/adaptive-ui";

/**
 * The interactivity of a control that is its host element (a button, a checkbox): `:disabled`, which a disabled fieldset sets too, and
 * `:state(active)` with `:active`, since Space doesn't make a custom element `:active`.
 *
 * @remarks
 * A candidate for Adaptive UI's `Interactivity`, next to `disabledAttribute`.
 *
 * @public
 */
export const controlInteractivity: InteractivityDefinition = {
    interactive: ":not(:disabled)",
    disabled: ":disabled",
    active: ":is(:active, :state(active))",
};
