import { ContractPropertyKind, defineDocumentation, DocStatus } from "@adaptive-web/adaptive-ui";

/**
 * Typed component documentation for {@link SkeletonElement}.
 *
 * @public
 */
export const skeletonDocumentation = defineDocumentation({
    id: "skeleton",
    definition:
        "A **Skeleton** is the shape of content that is loading, in its place. It is hidden from assistive technology (`aria-hidden`).",
    governance: {
        status: DocStatus.published,
        lastReviewed: "2026-11-17",
    },
    structure: {
        description: "Optional `shimmer` and `pattern` parts render from contract flags.",
        parts: {
            shimmer: {
                description: "The moving highlight when `shimmer` is set.",
            },
            pattern: {
                description: "An image of the content shape when `pattern` is set.",
            },
        },
    },
    contract: {
        properties: [
            {
                id: "shape",
                kind: ContractPropertyKind.enum,
                description: "The skeleton shape. The default is `rect`.",
                enumValues: [
                    { id: "rect", description: "A rectangle." },
                    { id: "circle", description: "A circle." },
                ],
            },
            {
                id: "shimmer",
                kind: ContractPropertyKind.boolean,
                description: "Whether a highlight moves across the skeleton.",
            },
            {
                id: "pattern",
                kind: ContractPropertyKind.string,
                nullable: true,
                description: "The URL of an image of the content's shape.",
            },
        ],
        slots: [
            {
                id: "default",
                description: "Optional custom shape content such as SVG.",
            },
        ],
    },
});
