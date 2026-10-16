/**
 * An interactive element's states.
 *
 * @public
 */
export enum InteractiveState {
    /**
     * The rest state.
     */
    rest = "rest",

    /**
     * The hover state.
     */
    hover = "hover",

    /**
     * The active state.
     */
    active = "active",

    /**
     * The focus state.
     */
    focus = "focus",

    /**
     * The disabled state.
     */
    disabled = "disabled",
}

/**
 * Values for an interactive element's states.
 *
 * @public
 */
export type InteractiveValues<T> = {
    [key in InteractiveState]: T;
}
