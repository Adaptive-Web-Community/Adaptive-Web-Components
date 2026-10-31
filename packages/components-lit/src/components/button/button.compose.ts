import { buttonComposition } from "@adaptive-web/components-foundation";
import type { ComposeOptions, DesignSystem, ElementDefinition } from "../../design-system.js";
import { Button } from "./button.js";
import { template } from "./button.template.js";

/**
 * @public
 */
export function composeButton(ds: DesignSystem, options?: ComposeOptions<Button>): ElementDefinition<typeof Button> {
    return ds.compose(Button, buttonComposition, template, options);
}
