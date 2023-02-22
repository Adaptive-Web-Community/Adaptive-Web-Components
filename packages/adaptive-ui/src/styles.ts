/**
 * Recommended base styles for a component.
 * 
 * @remarks
 * Adds support for `[hidden]` custom elements.
 */
export const componentBaseStyles = /* css */`
    :host([hidden]) {
        display: none !important;
    }
`;
