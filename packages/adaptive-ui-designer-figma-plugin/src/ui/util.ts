import { sentenceCase } from "change-case";
import { DesignToken } from "@microsoft/fast-foundation";

export function designTokenTitle(token?: DesignToken<any>): string {
    if (token === undefined || token.name === undefined) {
        console.log(token);
        
        return "-";
    }

    // Handle legacy non-hierarchical format for `custom-recipes.ts`.
    const name = token.name.indexOf(".") > -1 ? token.name.split(".").slice(1).join("-") : token.name;

    const base = name.replace(/-/g, ' ').replace(/density_/, '');
    return sentenceCase(base);
}
