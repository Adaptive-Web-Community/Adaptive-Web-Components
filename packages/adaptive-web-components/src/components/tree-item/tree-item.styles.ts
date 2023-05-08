import {
    accentForegroundRest,
    controlCornerRadius,
    designUnit,
    focusStrokeOuter,
    focusStrokeWidth,
    neutralFillStealthRecipe,
    neutralFillSubtleRecipe,
    neutralFillSubtleRest,
    Swatch,
} from "@adaptive-web/adaptive-ui";
import { css, ElementStyles } from "@microsoft/fast-element";
import { DesignToken, DesignTokenResolver } from "@microsoft/fast-foundation";
import { heightNumber } from "../../styles/index.js";

const expandCollapseHover = DesignToken.create<Swatch>("tree-item-expand-collapse-hover").withDefault(
    (resolve: DesignTokenResolver) => {
        const recipe = resolve(neutralFillStealthRecipe);
        return recipe.evaluate(resolve, recipe.evaluate(resolve).hover).hover;
    }
);

const selectedExpandCollapseHover = DesignToken.create<Swatch>("tree-item-expand-collapse-selected-hover").withDefault(
    (resolve: DesignTokenResolver) => {
        const baseRecipe = resolve(neutralFillSubtleRecipe);
        const buttonRecipe = resolve(neutralFillStealthRecipe);
        return buttonRecipe.evaluate(resolve, baseRecipe.evaluate(resolve).rest).hover;
    }
);

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        position: relative;
        display: block;
        contain: content;
        cursor: pointer;
    }

    .control {
        position: relative;
        display: flex;
        align-items: center;
        white-space: nowrap;
    }

    :host([nested]) .control {
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

    ::slotted([slot="start"]),
    ::slotted([slot="end"]) {
        display: flex;
    }
    
    .items {
        display: none;
        --tree-item-nested-width-slotted: calc(16px + var(--tree-item-nested-width, 0px));
    }

    :host([expanded]) slot[name="expand-collapse-icon"] * {
        transform: rotate(45deg);
    }

    :host([expanded]) > .items {
        display: block;
    }

    ::slotted(adaptive-tree-item) {
        --tree-item-nested-width: var(--tree-item-nested-width-slotted, 0px);
    }

    :host(:focus-visible) {
        outline: none;
    }

    :host([disabled]) .control {
        cursor: not-allowed;
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

    .control {
        box-sizing: border-box;
        height: calc((${heightNumber} + 1) * 1px);
        padding: 0 calc(${designUnit} * 2px + 8px);
        fill: currentcolor;
    }

    :host(:focus-visible) .control {
        outline: calc(${focusStrokeWidth} * 1px) solid ${focusStrokeOuter};
        outline-offset: calc(${focusStrokeWidth} * -1px);
    }

    .expand-collapse-button {
        box-sizing: border-box;
        width: var(--expand-collapse-button-size);
        height: var(--expand-collapse-button-size);
        padding: 6px;
    }

    .expand-collapse-button:hover {
        background: ${expandCollapseHover};
    }

    :host([selected]) .control {
        background: ${neutralFillSubtleRest};
    }

    :host([selected]) .expand-collapse-button:hover {
        background: ${selectedExpandCollapseHover};
    }

    :host([selected])::after {
        content: "";
        display: block;
        position: absolute;
        top: calc((${heightNumber} / 4) * 1px);
        left: calc(${focusStrokeWidth} * 1px);
        width: 3px;
        height: calc((${heightNumber} / 2) * 1px);
        border-radius: calc(${controlCornerRadius} * 1px);
        background: ${accentForegroundRest};
    }

    :host([disabled]) .control {
        opacity: 0.3;
    }
`;
