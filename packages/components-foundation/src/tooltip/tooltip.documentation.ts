import { ContractPropertyKind, defineDocumentation, DocStatus } from "@adaptive-web/adaptive-ui";

/**
 * Typed component documentation for {@link TooltipElement}.
 *
 * @public
 */
export const tooltipDocumentation = defineDocumentation({
    id: "tooltip",
    definition:
        'A **Tooltip** is a short description of its anchor (`role="tooltip"`), shown as a manual popover in the top layer while the anchor is hovered or focused.',
    governance: {
        status: DocStatus.published,
        lastReviewed: "2026-11-17",
    },
    structure: {
        description: "The host is the popover; the default slot holds the description.",
        parts: {},
    },
    contract: {
        properties: [
            {
                id: "open",
                kind: ContractPropertyKind.boolean,
                description: "Whether the popover is shown.",
            },
            {
                id: "placement",
                kind: ContractPropertyKind.enum,
                description: "Where it is shown next to its anchor.",
                enumValues: [
                    { id: "above", description: "Above the anchor." },
                    { id: "aboveStart", description: "Above the anchor, aligned to the start." },
                    { id: "aboveEnd", description: "Above the anchor, aligned to the end." },
                    { id: "below", description: "Below the anchor." },
                    { id: "belowStart", description: "Below the anchor, aligned to the start." },
                    { id: "belowEnd", description: "Below the anchor, aligned to the end." },
                    { id: "before", description: "Before the anchor in the writing direction." },
                    { id: "beforeTop", description: "Before the anchor, toward the block-start edge." },
                    { id: "beforeBottom", description: "Before the anchor, toward the block-end edge." },
                    { id: "after", description: "After the anchor in the writing direction." },
                    { id: "afterTop", description: "After the anchor, toward the block-start edge." },
                    { id: "afterBottom", description: "After the anchor, toward the block-end edge." },
                ],
            },
            {
                id: "delay",
                kind: ContractPropertyKind.number,
                description:
                    "Milliseconds the pointer stays on the anchor before show, and leaves before hide. Focus shows and hides at once.",
            },
        ],
        slots: [
            {
                id: "default",
                description: "The tooltip text.",
            },
        ],
    },
});
