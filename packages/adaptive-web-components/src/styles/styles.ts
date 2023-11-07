/**
 * Recommended base styles for a component.
 * 
 * @public
 * @remarks
 * Adds support for `[hidden]` custom elements.
 */
export const componentBaseStyles = /* css */`
    :host([hidden]) {
        display: none !important;
    }

    :host {
        box-sizing: border-box;
    }

    *, *:before, *:after {
        box-sizing: inherit;
    }
`;

/**
 * Styles for default svg icons.
 * 
 * @public
 * @remarks
 * Temporary rule to be migrated to style modules structure.
 */
export const svgIconStyles = /* css */`
    .stroked {
        stroke: currentcolor;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 1px;
    }
`;
