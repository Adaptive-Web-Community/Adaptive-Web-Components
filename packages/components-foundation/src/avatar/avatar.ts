import type { DefaultAria } from "../utilities/aria.js";

/**
 * The parts of an {@link AvatarElement}.
 *
 * @public
 */
export const AvatarParts = {
    /** The box of the media and the text. */
    backplate: "backplate",
} as const;

/**
 * An avatar: the picture, initials, or icon of a person or an entity. It is an image (`role="img"`), whose accessible name is
 * {@link AvatarElement.name}, so the content of its slots isn't read.
 *
 * @remarks
 * Slots: `media` for a picture, the default slot for text such as initials, and `badge` for a status badge.
 *
 * @public
 */
export interface AvatarElement extends HTMLElement {
    /**
     * The name of whom the avatar shows, which is its accessible name.
     *
     * @remarks
     * HTML attribute: `name`. An `aria-label` of the author overrides it.
     */
    name: string | null;
}

/**
 * The default ARIA of an avatar: the `img` role, named by its {@link AvatarElement.name}.
 *
 * @public
 */
export function avatarAria(avatar: AvatarElement): DefaultAria {
    return {
        role: "img",
        ariaLabel: avatar.name,
    };
}
