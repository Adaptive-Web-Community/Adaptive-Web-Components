import {
    StyleModules,
    Styles,
} from "@adaptive-web/adaptive-ui";
import { densityControl } from "@adaptive-web/adaptive-ui/reference";
import { HorizontalScrollAnatomy } from "./horizontal-scroll.template.js";

/**
 * Visual styles composed by modules.
 * 
 * @public
 */
export const styleModules: StyleModules = [
    [
        {
            part: HorizontalScrollAnatomy.parts.content
        },
        Styles.fromProperties({
            gap: densityControl.horizontalGap,
        })
    ],
];
