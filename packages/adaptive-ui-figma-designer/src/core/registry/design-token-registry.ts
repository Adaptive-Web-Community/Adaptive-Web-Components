import type { DesignToken, ValuesOf } from "@microsoft/fast-foundation";
import { StyleProperty } from "@adaptive-web/adaptive-ui";

export const FormControlId = {
    text: "text",
    color: "color",
} as const;

export type FormControlId = ValuesOf<typeof FormControlId>;

/**
 * Defines a generic design token.
 */
export interface DesignTokenDefinition {
    /**
     * Display title for organizing design token sets.
     */
    groupTitle?: string;

    /**
     * Display title of the design token.
     */
    title: string;

    /**
     * Unique ID for the design token.
     */
    id: string;

    /**
     * Target style properties for the design token.
     */
    intendedFor?: StyleProperty[];

    /**
     * Type of form control to edit this value. Following convention from fast-tooling.
     */
    formControlId?: FormControlId;

    /**
     * Underlying {@link DesignToken} for the plugin definition.
     */
    token: DesignToken<any>;
}

export class DesignTokenRegistry {
    private _entries: { [id: string]: DesignTokenDefinition } = {};

    /**
     * Registers a new design token definition.
     * @param designToken The design token definition to register.
     */
    public register(designToken: DesignTokenDefinition): void {
        const { id } = designToken;

        if (this.isRegistered(id)) {
            throw new Error(
                `Design token ${id} has already been registered. You must unregister the design token before registering with that ID.`
            );
        } else {
            this._entries[id] = designToken;
        }
    }

    /**
     * Unregisters a design token definition.
     * @param id The ID of the design token definition to unregister.
     */
    public unregister(id: string): void {
        delete this._entries[id];
    }

    /**
     * Gets a design token definition by ID.
     * @param id The ID of the design token definition.
     */
    public get(id: string): DesignTokenDefinition | null {
        if (this.isRegistered(id)) {
            return this._entries[id];
        }

        return null;
    }

    /**
     * Gets all entries in this registry.
     */
    public get entries(): DesignTokenDefinition[] {
        return Object.values(this._entries);
    }

    /**
     * Determines if the design token definition has been registered.
     * @param id The ID of the design token definition.
     */
    public isRegistered(id: string): boolean {
        return this._entries.hasOwnProperty(id);
    }

    /**
     * Returns all entries that apply to a given style property type
     * @param target the style property type to return entries of
     */
    public find(target: StyleProperty): DesignTokenDefinition[] {
        return Object.values(this._entries).filter(value => value.intendedFor?.includes(target));
    }
}
