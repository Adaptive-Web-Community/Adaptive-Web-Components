import { ContractPropertyKind, defineDocumentation, DocStatus } from "@adaptive-web/adaptive-ui";

/**
 * Typed component documentation for {@link DialogElement}.
 *
 * @public
 */
export const dialogDocumentation = defineDocumentation({
    id: "dialog",
    definition:
        "A **Dialog** wraps a native `<dialog>` (`control` part) for modal and non-modal presentation, backdrop, focus, and Escape.",
    governance: {
        status: DocStatus.published,
        lastReviewed: "2026-11-17",
    },
    structure: {
        description: "The host wraps a native dialog in the shadow root; content is in the default slot.",
        parts: {
            control: {
                description: "The native `<dialog>`, with role, top layer, backdrop, and focus.",
            },
        },
    },
    contract: {
        properties: [
            {
                id: "open",
                kind: ContractPropertyKind.boolean,
                description: "Whether it is open.",
            },
            {
                id: "modal",
                kind: ContractPropertyKind.boolean,
                description: "Whether it is open as modal, with backdrop and inert page content.",
            },
            {
                id: "closedBy",
                kind: ContractPropertyKind.enum,
                description: "What closes it besides its own controls, as the native `closedby` attribute has it.",
                enumValues: [
                    { id: "any", description: "A click outside (backdrop) and Escape." },
                    { id: "closeRequest", description: "Escape only." },
                    { id: "none", description: "Only its own controls or code." },
                ],
            },
            {
                id: "returnValue",
                kind: ContractPropertyKind.string,
                description: "The value it closed with, as `close(returnValue)` gave it.",
            },
        ],
        slots: [
            {
                id: "default",
                description: "Dialog content. An element with `autofocus` takes focus when it opens.",
            },
        ],
    },
});
