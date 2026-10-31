/**
 * The parameters of a story with a disabled control, whose text has no contrast requirement (WCAG 1.4.3, an inactive component).
 *
 * @remarks
 * axe takes an element for disabled only by a `disabled` attribute on a native control or an `aria-disabled` attribute, and not a
 * custom element that is disabled (https://github.com/dequelabs/axe-core/issues/5510), so its color-contrast rule is off for the story.
 */
export const disabledControlParameters = {
    a11y: {
        config: {
            rules: [{ id: "color-contrast", enabled: false }],
        },
    },
};
