import { AdaptiveDesignSystem } from "@adaptive-web/components-fast";
import { buttonDefinition } from "@adaptive-web/components-fast/button";
import { dividerDefinition } from "@adaptive-web/components-fast/divider";
import { switchDefinition } from "@adaptive-web/components-fast/switch";
import { tabDefinition } from "@adaptive-web/components-fast/tab";
import { tablistDefinition } from "@adaptive-web/components-fast/tablist";
import { tabPanelDefinition } from "@adaptive-web/components-fast/tab-panel";
import { treeItemDefinition } from "@adaptive-web/components-fast/tree-item";
import { treeViewDefinition } from "@adaptive-web/components-fast/tree-view";
import type { PluginUIState } from '@adaptive-web/adaptive-ui-designer-core';
import type { PluginMessage} from "../core/messages.js";
import { App } from "./app.js";
import { library } from "./tokens/library.js";

// Defines the element, which is only a type for the compiler.
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
        ): boolean;
    }
}

// The app is defined when it is imported, and the messages are listened for before the components of the design system are, which is asynchronous.
const app: App = document.querySelector("designer-app") as unknown as App;

// Send a message from the UI to the Controller
app.addEventListener("dispatch", (e: CustomEvent<PluginMessage>): void => {
    // Goes to ../figma/main.ts figma.ui.onmessage. A message is plain data, which is passed as it is.
    parent.postMessage({
        pluginMessage: e.detail,
    }, "*");
});

// Update UI from Controller's message
// Comes from ../figma/controller.ts figma.ui.postMessage
window.onmessage = (e: MessageEvent): void => {
    const message: PluginUIState | undefined = e.data.pluginMessage;
    if (message) {
        app.selectedNodes = message.selectedNodes;
    }
};

AdaptiveDesignSystem.configure({ library });
AdaptiveDesignSystem.adoptTokenStyles();
await AdaptiveDesignSystem.defineComponents({
    buttonDefinition,
    dividerDefinition,
    switchDefinition,
    tabDefinition,
    tablistDefinition,
    tabPanelDefinition,
    treeItemDefinition,
    treeViewDefinition,
});
