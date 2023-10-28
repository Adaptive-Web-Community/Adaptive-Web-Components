import { AdaptiveDesignSystem } from '@adaptive-web/adaptive-web-components';
import { buttonDefinition } from "@adaptive-web/adaptive-web-components/button";
import { dividerDefinition } from "@adaptive-web/adaptive-web-components/divider";
import { tabDefinition } from "@adaptive-web/adaptive-web-components/tab";
import { tabPanelDefinition } from "@adaptive-web/adaptive-web-components/tab-panel";
import { tabsDefinition } from "@adaptive-web/adaptive-web-components/tabs";
import { DesignToken } from "@microsoft/fast-foundation";
import { deserializeUINodes, SerializableUIState } from "../core/serialization.js";
import { App } from "./app.js";
import { PluginMessage } from '../core/model.js';

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
    app.addEventListener("dispatch", (e: CustomEvent<PluginMessage>): void => {
        // Goes to ../figma/main.ts figma.ui.onmessage
        parent.postMessage({
            pluginMessage: e.detail
        }, "*");
    });

    // Update UI from Controller's message
    // Comes from ../figma/controller.ts figma.ui.postMessage
    window.onmessage = (e: MessageEvent): void => {
        const message: SerializableUIState = e.data.pluginMessage;
        const nodes = message.selectedNodes;
        const deserializedNodes = deserializeUINodes(nodes);
        app.selectedNodes = deserializedNodes;
    };
};
