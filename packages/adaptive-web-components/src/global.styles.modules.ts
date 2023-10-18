import { ComponentAnatomy, StyleModules, StyleModuleTarget, Styles } from "@adaptive-web/adaptive-ui";
import { disabledStyles } from "@adaptive-web/adaptive-ui/reference";

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

    return styles;
};
