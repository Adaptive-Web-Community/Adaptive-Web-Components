import { CSSDesignToken, DesignToken } from "@microsoft/fast-foundation";
import { DesignTokenMetadata, InteractiveTokenGroup, StyleProperty } from "@adaptive-web/adaptive-ui";

export type AdaptiveDesignToken = (DesignToken<any> | CSSDesignToken<any>) & DesignTokenMetadata;

export type AdaptiveDesignTokenOrGroup = (DesignToken<any> | CSSDesignToken<any> | InteractiveTokenGroup<any>) & DesignTokenMetadata;

export class DesignTokenRegistry<T extends { name: string } & DesignTokenMetadata> {
    private _entries: { [id: string]: T } = {};

    /**
     * Registers a new design token definition.
     * @param designToken - The design token definition to register.
     */
    public register(designToken: T): void {
        const { name } = designToken;

        if (this.isRegistered(name)) {
            throw new Error(
                `Design token ${name} has already been registered. You must unregister the design token before registering with that ID.`
            );
        } else {
            this._entries[name] = designToken;
        }
    }

    /**
     * Unregisters a design token definition.
     * @param name - The ID of the design token definition to unregister.
     */
    public unregister(name: string): void {
        delete this._entries[name];
    }

    /**
     * Gets a design token definition by ID.
     * @param name - The ID of the design token definition.
     */
    public get(name: string): T | null {
        if (this.isRegistered(name)) {
            return this._entries[name];
        }

        return null;
    }

    /**
     * Gets all entries in this registry.
     */
    public get entries(): T[] {
        return Object.values(this._entries);
    }

    /**
     * Determines if the design token definition has been registered.
     * @param name - The ID of the design token definition.
     */
    public isRegistered(name: string): boolean {
        return this._entries.hasOwnProperty(name);
    }

    /**
     * Returns all entries that apply to a given style property type
     * @param target - The style property type to return entries of
     */
    public find(target: StyleProperty): T[] {
        return Object.values(this._entries).filter(value => value.intendedFor?.includes(target));
    }
}
