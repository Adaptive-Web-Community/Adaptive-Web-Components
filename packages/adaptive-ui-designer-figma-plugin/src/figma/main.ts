import { mapReviver } from "@adaptive-web/adaptive-ui-designer-core";
import type { PluginMessage } from "../core/messages.js";
import { FigmaController } from "./controller.js";

const controller = new FigmaController();

figma.showUI(__html__, {
    height: 600,
    width: 356,
});

/**
 * Displays a notification when running a function that takes some time.
 * @param callback The function to call
 */
function notifyProcessing(callback: () => void) {
    const notify = figma.notify("Processing design tokens", { timeout: Infinity });

    setTimeout(() => {
        try {
            callback();
        } catch (e) {
            console.error(e);
            figma.notify((e as Error).message, { error: true });
        }

        notify.cancel();
    }, 0);
}

/**
 * Handle selection changing in Figma.
 */
function handleSelection() {
    const nodes: readonly BaseNode[] = figma.currentPage.selection.length
        ? figma.currentPage.selection
        : Object.freeze([figma.currentPage]);

    notifyProcessing(async () =>
        await controller.setSelectedNodes(nodes.map((node: BaseNode): string => node.id))
    );
}

let lastSelectionTimeout: number = Number.NaN;

/**
 * Avoid extra processing when the selection is still changing.
 */
function debounceSelection() {
    if (!Number.isNaN(lastSelectionTimeout)) {
        clearTimeout(lastSelectionTimeout);
    }

    lastSelectionTimeout = setTimeout(() => {
        lastSelectionTimeout = Number.NaN;
        handleSelection();
    }, 1000);
}

figma.on("selectionchange", debounceSelection);

// Comes from ../ui/index.ts parent.postMessage
figma.ui.onmessage = (json: string): void => {
    const message: PluginMessage = JSON.parse(json, mapReviver);
    notifyProcessing(() => {
        controller.handleMessage(message);
    });
};

handleSelection();
