import { ContractPropertyKind, defineDocumentation, DocStatus } from "@adaptive-web/adaptive-ui";

/**
 * Typed component documentation for {@link AvatarElement}.
 *
 * @public
 */
export const avatarDocumentation = defineDocumentation({
    id: "avatar",
    definition:
        'An **Avatar** shows the picture, initials, or icon of a person or entity (`role="img"`), named by `name` or author ARIA.',
    governance: {
        status: DocStatus.published,
        lastReviewed: "2026-11-17",
    },
    structure: {
        description: "The `backplate` part contains media and default slot text.",
        parts: {
            backplate: {
                description: "The box of the media and text.",
            },
        },
    },
    contract: {
        properties: [
            {
                id: "name",
                kind: ContractPropertyKind.string,
                nullable: true,
                description: "The accessible name for whom the avatar represents. An author `aria-label` overrides it.",
            },
        ],
        slots: [
            {
                id: "media",
                description: "A picture of the person or entity.",
            },
            {
                id: "default",
                description: "Text such as initials when there is no picture.",
            },
            {
                id: "badge",
                description: "A status badge on the avatar.",
            },
        ],
    },
});
