import { css, ElementStyles } from "@microsoft/fast-element";
import { heightNumber } from "../../styles/index.js";
import { tokens, tokenVar } from "../../styles/tokens.js";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        position: relative;
        display: block;
        contain: layout style;
        cursor: pointer;
    }

    .control {
        position: relative;
        display: flex;
        align-items: center;
        white-space: nowrap;
    }

    :host(:state(nested)) .control {
        padding-inline-start: calc(8px + var(--expand-collapse-button-size) + var(--tree-item-nested-width, 0px));
    }
    
    .expand-collapse-button {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        position: absolute;
        transform: translateX(calc(-100% - 4px));
    }

    slot[name="expand-collapse-icon"] * {
        transition: transform 0.1s linear;
        transform-origin: center;
        transform: rotate(0deg);
        pointer-events: none;
    }

    .content {
        flex-grow: 1;
    }

    ::slotted([slot="start"]),
    ::slotted([slot="end"]) {
        display: flex;
    }
    
    .items {
        --tree-item-nested-width-slotted: calc(16px + var(--tree-item-nested-width, 0px));
    }

    .items[hidden],
    .expand-collapse-button[hidden] {
        display: none;
    }

    :host([expanded]) slot[name="expand-collapse-icon"] * {
        transform: rotate(45deg);
    }

    ::slotted(adaptive-tree-item) {
        --tree-item-nested-width: var(--tree-item-nested-width-slotted, 0px);
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        --expand-collapse-button-size: calc((12 + 6 + 6) * 1px);
    }

    .expand-collapse-button {
        width: var(--expand-collapse-button-size);
        height: var(--expand-collapse-button-size);
        padding: 4px;
    }

    :host([selected]) .control {
        background: ${tokenVar(tokens.color.neutral.fill.subtle)};
    }

    :host([selected])::after {
        content: "";
        display: block;
        position: absolute;
        top: calc((${heightNumber} / 4) * 1px);
        left: ${tokenVar(tokens.shape.strokeThickness.focus)};
        width: 3px;
        height: calc((${heightNumber} / 2) * 1px);
        border-radius: ${tokenVar(tokens.shape.cornerRadius.default)};
        background: ${tokenVar(tokens.color.highlight.stroke.readable)};
    }
`;
