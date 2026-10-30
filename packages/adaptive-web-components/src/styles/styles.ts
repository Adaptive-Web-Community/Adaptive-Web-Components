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
 * The declarations that hide an element visually and keep it in the accessibility tree, for a label hidden by `hide-label`, which still names
 * its element.
 *
 * @public
 */
export const visuallyHidden = /* css */`
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
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
