import { AdaptiveDesignSystem } from '@adaptive-web/adaptive-web-components';
import { buttonDefinition } from "@adaptive-web/adaptive-web-components/button";
import { dividerDefinition } from "@adaptive-web/adaptive-web-components/divider";
import { switchDefinition } from "@adaptive-web/adaptive-web-components/switch";
import { tabDefinition } from "@adaptive-web/adaptive-web-components/tab";
import { tabPanelDefinition } from "@adaptive-web/adaptive-web-components/tab-panel";
import { tabsDefinition } from "@adaptive-web/adaptive-web-components/tabs";
import { DesignToken } from "@microsoft/fast-foundation";
import { mapReplacer, mapReviver, PluginUIState  } from '@adaptive-web/adaptive-ui-designer-core';
import type { PluginMessage} from "../core/messages.js";
import { App } from "./app.js";

AdaptiveDesignSystem.defineComponents({
    buttonDefinition,
    dividerDefinition,
    switchDefinition,
    tabDefinition,
    tabPanelDefinition,
    tabsDefinition,
});

DesignToken.registerDefaultStyleTarget();

App;

interface CustomEventMap {
    "dispatch": CustomEvent<PluginMessage>;
}

declare global {
    interface HTMLElement {
        addEventListener<K extends keyof CustomEventMap>(
            type: K,
            listener: (this: Document, ev: CustomEventMap[K]) => void
        ): void;
        dispatchEvent<K extends keyof CustomEventMap>(
            ev: CustomEventMap[K]
        ): void;
    }
}

window.onload = () => {
    const app: App = document.querySelector("designer-app") as unknown as App;

    // Send a message from the UI to the Controller 
    app.addEventListener("dispatch", (e: CustomEvent<PluginMessage>): void => {
        const json = JSON.stringify(e.detail, mapReplacer);
        // Goes to ../figma/main.ts figma.ui.onmessage
        parent.postMessage({
            pluginMessage: json,
        }, "*");
    });

    // Update UI from Controller's message
    // Comes from ../figma/controller.ts figma.ui.postMessage
    window.onmessage = (e: MessageEvent): void => {
        const json = e.data.pluginMessage;
        const message: PluginUIState = JSON.parse(json, mapReviver);
        app.selectedNodes = message.selectedNodes;
    };
};
