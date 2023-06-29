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
