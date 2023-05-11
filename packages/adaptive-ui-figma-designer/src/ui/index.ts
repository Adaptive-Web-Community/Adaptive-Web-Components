import { AdaptiveDesignSystem } from '@adaptive-web/adaptive-web-components';
import { buttonDefinition } from "@adaptive-web/adaptive-web-components/button";
import { dividerDefinition } from "@adaptive-web/adaptive-web-components/divider";
import { tabDefinition } from "@adaptive-web/adaptive-web-components/tab";
import { tabPanelDefinition } from "@adaptive-web/adaptive-web-components/tab-panel";
import { tabsDefinition } from "@adaptive-web/adaptive-web-components/tabs";
import { DesignToken } from "@microsoft/fast-foundation";
import { deserializeUINodes, SerializableUIState, serializeUINodes } from "../core/serialization.js";
import { App } from "./app.js";

AdaptiveDesignSystem.defineComponents({
    buttonDefinition,
    dividerDefinition,
    tabDefinition,
    tabPanelDefinition,
    tabsDefinition,
});

DesignToken.registerDefaultStyleTarget();

App;

window.onload = () => {
    const app: App = document.querySelector("designer-app") as App;

    // Send a message from the UI to the Controller 
    app.addEventListener("dispatch", (e: Event): void => {
        const message: SerializableUIState = {
            selectedNodes: serializeUINodes((e as CustomEvent).detail)
        }
        parent.postMessage({
            pluginMessage: message
        }, "*");
    });

    // Update UI from Controller's message
    window.onmessage = (e: MessageEvent): void => {
        const message: SerializableUIState = e.data.pluginMessage;
        const nodes = message.selectedNodes;
        const deserializedNodes = deserializeUINodes(nodes);
        app.selectedNodes = deserializedNodes;
    };
};
