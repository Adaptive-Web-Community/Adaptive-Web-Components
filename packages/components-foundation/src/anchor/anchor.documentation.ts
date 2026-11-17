import { ContractPropertyKind, defineDocumentation, DocStatus } from "@adaptive-web/adaptive-ui";
import { contentLabelledDocumentation } from "../utilities/content-labelled.documentation.js";

/**
 * Typed component documentation for {@link AnchorElement}.
 *
 * @public
 */
export const anchorDocumentation = defineDocumentation({
    id: "anchor",
    definition:
        "An **Anchor** is a link. Unlike most controls, it wraps a native `<a>` (`control` part), since browser link behavior can't be replicated on the host alone.",
    governance: {
        status: DocStatus.published,
        lastReviewed: "2026-11-17",
    },
    structure: {
        description: "The native link is the `control` part; default slot content is the label inside it.",
        interactive: true,
        indicatesFocus: true,
        parts: {
            control: {
                description: "The native `<a>`; receives focus and link styling.",
                interactive: true,
                indicatesFocus: true,
            },
            content: {
                description: "The default slot label between optional `start` and `end` slots.",
            },
        },
    },
    contract: {
        include: [contentLabelledDocumentation],
        properties: [
            {
                id: "download",
                kind: ContractPropertyKind.string,
                nullable: true,
                description: "Whether, and with what name, to download the URL instead of navigating.",
            },
            {
                id: "href",
                kind: ContractPropertyKind.string,
                nullable: true,
                description: "The URL. Without it, the element is a placeholder, not a link.",
            },
            {
                id: "hreflang",
                kind: ContractPropertyKind.string,
                nullable: true,
                description: "The language of the linked resource.",
            },
            {
                id: "ping",
                kind: ContractPropertyKind.string,
                nullable: true,
                description: "The URLs to notify when the link is followed.",
            },
            {
                id: "referrerPolicy",
                kind: ContractPropertyKind.string,
                nullable: true,
                description: "The referrer sent with the request.",
            },
            {
                id: "rel",
                kind: ContractPropertyKind.string,
                nullable: true,
                description: "The relationship of the linked resource.",
            },
            {
                id: "target",
                kind: ContractPropertyKind.string,
                nullable: true,
                description: "Where to show the linked resource.",
            },
            {
                id: "type",
                kind: ContractPropertyKind.string,
                nullable: true,
                description: "The media type of the linked resource.",
            },
        ],
        slots: [
            {
                id: "start",
                description: "Optional content before the label.",
            },
            {
                id: "end",
                description: "Optional content after the label.",
            },
        ],
    },
});
