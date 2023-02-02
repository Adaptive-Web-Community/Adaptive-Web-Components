import { css } from "@microsoft/fast-element";
import { designUnit } from '@adaptive-web/adaptive-ui';
import type { ElementStyles } from "@microsoft/fast-element";
import { PropertyStyleSheetBehavior } from '@microsoft/fast-foundation';

export const stackVerticalStyles: ElementStyles = css`
    :host([orientation=vertical]) {
        flex-direction: column;
    }

    :host([orientation=vertical]) ::slotted(*) {
        width: fit-content;
    }

    :host([orientation=vertical][horizontal-align=start]) {
        align-items: flex-start;
    }

    :host([orientation=vertical][horizontal-align=center]) {
        align-items: center;
    }

    :host([orientation=vertical][horizontal-align=end]) {
        align-items: flex-end;
    }

    :host([orientation=vertical][horizontal-align=stretch]) {
        align-items: stretch;
    }

    :host([orientation=vertical][vertical-align=start]) {
        justify-content: flex-start;
    }

    :host([orientation=vertical][vertical-align=center]) {
        justify-content: center;
    }

    :host([orientation=vertical][vertical-align=end]) {
        justify-content: flex-end;
    }

    :host([orientation=vertical][vertical-align=stretch]) {
        justify-content: stretch;
    }
`;

export const stackHorizontalStyles: ElementStyles = css`
    :host([orientation=horizontal]) {
        flex-direction: row;
    }

    :host([orientation=horizontal][horizontal-align=start]) {
        justify-content: flex-start;
    }

    :host([orientation=horizontal][horizontal-align=center]) {
        justify-content: center;
    }

    :host([orientation=horizontal][horizontal-align=end]) {
        justify-content: flex-end;
    }

    :host([orientation=horizontal][horizontal-align=stretch]) {
        justify-content: stretch;
    }

    :host([orientation=horizontal][vertical-align=start]) {
        align-items: flex-start;
    }

    :host([orientation=horizontal][vertical-align=center]) {
        align-items: center;
    }

    :host([orientation=horizontal][vertical-align=end]) {
        align-items: flex-end;
    }

    :host([orientation=horizontal][vertical-align=stretch]) {
        align-items: stretch;
    }
`;

export const templateStyles: ElementStyles = css`
    :host {
        display: flex;
        gap: calc(var(--spacing, ${designUnit}) * 1px);
    }

    :host([wrap]) {
        flex-wrap: wrap;
    }
`.withBehaviors(
    new PropertyStyleSheetBehavior(
        "direction",
        "rtl",
        css``
    )
)

export const styles: ElementStyles = css`
    ${templateStyles}
    ${stackVerticalStyles}
    ${stackHorizontalStyles}
`;