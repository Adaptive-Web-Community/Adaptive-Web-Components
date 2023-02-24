import { DesignToken } from "@microsoft/fast-foundation";
import { deserializeUINodes, PluginUISerializableNodeData, serializeUINodes } from "../core/serialization.js";
import { App } from "./app.js";

DesignToken.registerDefaultStyleTarget();

App;

window.onload = () => {
    const app: App = document.querySelector("designer-app") as App;

    app.addEventListener("dispatch", (e: Event) => {
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
