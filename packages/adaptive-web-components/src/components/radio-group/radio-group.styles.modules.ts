import {
    StyleModules, Styles,
} from "@adaptive-web/adaptive-ui";
import { densityControl } from "@adaptive-web/adaptive-ui/reference";
import { RadioGroupAnatomy } from "./radio-group.template.js";

/**
 * Visual styles composed by modules.
 * 
 * @public
 */
export const styleModules: StyleModules = [
    [
        {
        },
        Styles.fromProperties({
            gap: densityControl.verticalGap,
        })
    ],
    [
        {
            part: RadioGroupAnatomy.parts.positioningRegion,
        },
        Styles.fromProperties({
            gap: densityControl.verticalGap,
        }),
    ]
];
