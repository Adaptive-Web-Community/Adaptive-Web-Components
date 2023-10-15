import { StyleModules } from "@adaptive-web/adaptive-ui";
import { disabledStyles } from "@adaptive-web/adaptive-ui/reference";

/**
 * Global visual styles.
 * 
 * @public
 */
export const globalStyleModules: StyleModules = [
    [
        {
            hostCondition: "[disabled]",
            part: "*",
        },
        disabledStyles,
    ],
];
