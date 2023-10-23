import { CSSDesignToken } from "@microsoft/fast-foundation";
import {
    ComponentAnatomy,
    InteractiveSet,
    StyleModules,
    StyleModuleTarget,
    StyleProperties,
    Styles,
    StyleValue
} from "@adaptive-web/adaptive-ui";
import { disabledStyles, focusIndicatorStyles } from "@adaptive-web/adaptive-ui/reference";

/**
 * Converts `Styles` to focus-only state. This allows styles to be constructed as usual, using interactive sets
 * or simple values, but convert the styles specifically to focus state to the necessary structure.
 *
 * @param styles - The input `Styles` to convert to focus-only styles.
 * @returns Converted `Styles`.
 */
const convertToFocusState = (styles: Styles) => {
    const props: StyleProperties = {};
    styles.effectiveProperties.forEach((value, target) => {
        let focusValue: StyleValue | null;
        if (typeof value === "string" || value instanceof CSSDesignToken) {
            focusValue = value;
        } else if (value && typeof (value as any).createCSS === "function") {
            focusValue = value;
        } else {
            focusValue = (value as InteractiveSet<any>).focus;
        }

        if (focusValue) {
            props[target] = {
                rest: undefined,
                hover: undefined,
                active: undefined,
                focus: focusValue,
                disabled: undefined,
            };
        }
    });
    return Styles.fromProperties(props);
};

/**
 * Focus-only state of the customized focus indicator styles.
 */
const focusStateStyles = convertToFocusState(focusIndicatorStyles);

/**
 * Styles to remove browser default styling.
 */
const focusResetStyles = convertToFocusState(Styles.fromProperties({
    outlineStyle: "none",
}));

/**
 * Global visual styles.
 * 
 * @public
 */
export const globalStyleModules = (anatomy?: ComponentAnatomy<any, any>): StyleModules => {
    const styles = new Array<[StyleModuleTarget, Styles]>();

    // If this component can be disabled, apply the style to all children.
    if (anatomy?.interactivity?.disabledSelector !== undefined) {
        styles.push(
            [
                {
                    hostCondition: anatomy.interactivity.disabledSelector,
                    part: "*",
                },
                disabledStyles,
            ]
        );
    }

    // If this component can get focus, apply the focus indicator styles.
    if (anatomy?.focus) {
        if (anatomy.focus?.resetTarget) {
            styles.push(
                [
                    anatomy.focus?.resetTarget,
                    focusResetStyles,
                ],
            );
        }

        // Set intentional focus styles
        styles.push(
            [
                anatomy.focus.focusTarget,
                focusStateStyles,
            ]
        );
    }

    return styles;
};
