import { FASTHorizontalScroll, HorizontalScrollView } from "@microsoft/fast-foundation";
import { actionsStyles } from "./horizontal-scroll.styles.js";

export class AdaptiveHorizontalScroll extends FASTHorizontalScroll {
    public connectedCallback(): void {
        super.connectedCallback();

        if (this.view !== "mobile") {
            this.$fastController.addStyles(actionsStyles);
        }
    }

    protected viewChanged(prev?: HorizontalScrollView, next?: HorizontalScrollView): void {
        if (next === HorizontalScrollView.default) {
            this.$fastController.addStyles(actionsStyles);
        } else {
            this.$fastController.removeStyles(actionsStyles);
        }
    }
}
