/* eslint-disable */
// This file is generated from src/avatar/avatar.documentation.ts by @adaptive-web/adaptive-ui. Do not edit directly.

/**
 * Part names of Avatar for templates (`part` and class). Keys are structure ids; values are kebab-case DOM names. Style rules target the keys via anatomy—not these strings.
 *
 * @public
 */
export const AvatarParts = {
    /** The box of the media and text. */
    backplate: "backplate",
} as const;

/**
 * Slot names of Avatar.
 *
 * @public
 */
export const AvatarSlots = {
    /** A picture of the person or entity. */
    media: "media",

    /** Text such as initials when there is no picture. */
    default: "",

    /** A status badge on the avatar. */
    badge: "badge",
} as const;

/**
 * An **Avatar** shows the picture, initials, or icon of a person or entity (`role="img"`), named by `name` or author ARIA.
 *
 * @public
 */
export interface AvatarContract {
    /**
     * The accessible name for whom the avatar represents. An author `aria-label` overrides it.
     */
    name: string | null;
}
