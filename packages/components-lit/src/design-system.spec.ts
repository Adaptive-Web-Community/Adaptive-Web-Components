import { expect, test } from "vitest";
import { composeButton } from "./components/button/button.compose.js";
import { DesignSystem } from "./design-system.js";

test("the shadow root options of a composed element are its class's, with the ones of the options", () => {
    const ds = new DesignSystem("shadow-options");
    ds.defineComponents({ button: ds => composeButton(ds, { shadowRootOptions: { delegatesFocus: true } }) });

    const button = document.createElement("shadow-options-button");
    document.body.append(button);

    expect(button.shadowRoot?.mode).toBe("open");
    expect(button.shadowRoot?.delegatesFocus).toBe(true);
    button.remove();
});
