import { attr } from "@microsoft/fast-element";
import { AdaptiveButton } from "@adaptive-web/adaptive-web-components";

/**
 * Custom Button class override.
 * This only exists to show the most formal way to add an attribute to a class.
 * Simple attributes can also be passed in to the `compose` call.
 */
export class CustomButton extends AdaptiveButton {
    @attr
    public purpose: string | null = null;
}
