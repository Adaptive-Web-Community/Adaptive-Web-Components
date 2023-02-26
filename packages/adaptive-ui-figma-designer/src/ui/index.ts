import { AdaptiveDesignSystem } from '@adaptive-web/adaptive-web-components';
import { buttonDefinition } from "@adaptive-web/adaptive-web-components/button";
import { dividerDefinition } from "@adaptive-web/adaptive-web-components/divider";
import { tabDefinition } from "@adaptive-web/adaptive-web-components/tab";
import { tabPanelDefinition } from "@adaptive-web/adaptive-web-components/tab-panel";
import { tabsDefinition } from "@adaptive-web/adaptive-web-components/tabs";
import { DesignToken } from "@microsoft/fast-foundation";
import { deserializeUINodes, PluginUISerializableNodeData, serializeUINodes } from "../core/serialization.js";
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
        parent.postMessage({
            pluginMessage: serializeUINodes((e as CustomEvent).detail)
        }, "*");
    });

    // Update UI from Controller's message
    window.onmessage = (e: MessageEvent): void => {
        const nodes = e.data.pluginMessage.selectedNodes as Array<PluginUISerializableNodeData>;
        const deserializedNodes = deserializeUINodes(nodes);
        app.selectedNodes = deserializedNodes;
    };
};
