import { type InteractiveState, libraryTokenProperties } from "@adaptive-web/adaptive-ui";
import { createReferenceLibrary, type ReferenceLibraryTokens } from "@adaptive-web/adaptive-ui/reference";
import { type Library, pathOf, refs } from "design-token-library";

/**
 * The tokens and the treatments that the styles of the components refer to, as refs of a library of the shape of the reference library.
 *
 * @internal
 */
export const tokens = refs<ReferenceLibraryTokens>();

// The custom properties of the tokens. They are named by the path of a token, the same in any library of the shape of the reference
// library, which is the library of a design system.
const properties = libraryTokenProperties(createReferenceLibrary(), { context: tokens.color.context });

/**
 * Writes the custom property of a token, for styles written as CSS, like `${tokenVar(tokens.shape.strokeThickness.focus)}`.
 *
 * @remarks
 * A style rule refers to a token by its ref, and the design system renders it. This is for the CSS of a template, which has values that a
 * rule can't have, like `calc()` of a token.
 *
 * @param token - The ref of the token
 * @param state - The state of an interactive token, its rest if it isn't given
 * @returns `var(--<property>)`, or `var(--<property>-<state>)` for a state other than the rest
 * @throws An error for a state that the value of the token doesn't have
 *
 * @internal
 */
export function tokenVar(token: Library.Ref<unknown, never>, state?: InteractiveState): string {
    const { property, states } = properties(pathOf(token));
    if (state === undefined || state === "rest") {
        return `var(${property})`;
    }
    if (!states?.includes(state)) {
        throw new Error(`${pathOf(token).join(".")} has no ${state} state`);
    }
    return `var(${property}-${state})`;
}
