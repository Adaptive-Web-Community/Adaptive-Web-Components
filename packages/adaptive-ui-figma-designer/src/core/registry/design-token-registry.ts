import type { DesignToken } from "@microsoft/fast-foundation";
import type { DesignTokenType } from "../model.js";

export enum FormControlId {
    text = "text",
    color = "color",
}

/**
 * Defines a generic design token
 */
export interface DesignTokenDefinition {
    /**
     * A title for organizing recipe sets
     */
    groupTitle: string;

    /**
     * The name of the design token
     */
    name: string;

    /**
     * Unique ID for the design token
     */
    id: string;

    /**
     * The type of design token
     */
    type: DesignTokenType;

    /**
     * The type of form control to edit this value. Following convention from fast-tooling.
     */
    formControlId?: string;

    /**
     * The underlying DesignToken for the plugin definition
     */
    token: DesignToken<any>;
}

export class DesignTokenRegistry {
    private entries: { [id: string]: DesignTokenDefinition } = {};

    /**
     * Register a new design token
     * @param designToken the design token to register
     */
    public register(designToken: DesignTokenDefinition): void {
        const { id } = designToken;

        if (this.isRegistered(id)) {
            throw new Error(
                `Design token ${id} has already been registered. You must unregister the design token before registering with that ID.`
            );
        } else {
            this.entries[id] = designToken;
        }
    }

    /**
     * Unregister a design token
     * @param id - the ID of the design token to unregister
     */
    public unregister(id: string): void {
        delete this.entries[id];
    }

    /**
     * Get a design token definition by ID
     * @param id the id of the design token
     */
    public get(id: string): DesignTokenDefinition | null {
        if (this.isRegistered(id)) {
            return this.entries[id];
        }

        return null;
    }

    /**
     * Determines if the design token has been registered
     * @param id - the id of the design token
     */
    public isRegistered(id: string): boolean {
        return this.entries.hasOwnProperty(id);
    }

    /**
     * Returns all entries of a given design token type
     * @param type the design token type to return entries of
     */
    public find(type: DesignTokenType): DesignTokenDefinition[] {
        return Object.values(this.entries).filter(value => value.type === type);
    }
}
