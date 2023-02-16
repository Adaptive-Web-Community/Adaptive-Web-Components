import co from "@cobalt-ui/core";
import type { ParseResult } from "@cobalt-ui/core";
import { isAlias, kebabinate } from "@cobalt-ui/utils";
import type { ElementStyles } from "@microsoft/fast-element";
import { CSSDesignToken, DesignToken } from "@microsoft/fast-foundation";
import { attribute } from "../modules/attribute.js";
import { StyleModuleEvaluateParameters } from "../modules/types.js";

export const DesignTokens: Map<string, CSSDesignToken<any>> = new Map();
export const ModuleStyles: Map<string, ElementStyles[]> = new Map();

function aliasToTokenId(alias: string): string {
    if (alias.startsWith("{") && alias.endsWith("}")) {
        alias = alias.substring(1, alias.length - 1);
    }
    return kebabinate(alias);
}

function createDesignToken(tokenId: string, tokenValue: any) {
    const dt = DesignToken.create(tokenId).withDefault(tokenValue);
    // console.log("Creating DesignToken", tokenId, tokenValue);
    DesignTokens.set(tokenId, dt);
}

function isCondition(selector: string): boolean {
    return /[:[(]/.test(selector);
}

function addModule(component: string, module: ElementStyles) {
    const modules = ModuleStyles.get(component) || [];
    modules.push(module);
    ModuleStyles.set(component, modules);
}

const stylesKey = "_styles";

export const parse = (designTokens: any): void => {
    const result: ParseResult = co.parse(designTokens);

    // console.log("Token parsing result", result);
    result.result.tokens.forEach((token) => {
        if (!token.id.startsWith(stylesKey)) {
            // Create a DesignToken for flattened standard tokens.
            const tokenId = kebabinate(token.id);
            createDesignToken(tokenId, token.$value);

            // Use `mode` feature for interactive states.
            if (token.$extensions && token.$extensions.mode) {
                for (const [k, v] of Object.entries(token.$extensions.mode || {})) {
                    createDesignToken(`${tokenId}-${k.toLowerCase()}`, v);
                }
            }
        } else {
            // Apply modular styles. Examples:
            //   component.attribute => badge.border-radius
            //   component.part.attribute => badge.content.color
            //   component.part.[condition].attribute => badge.content.[disabled].color
            //   component.[condition].attribute => badge.[circular].border-radius
            //   component.[condition].part.attribute => badge.[appearance=accent].content.color
            //   component.[condition].part.[condition].attribute => horizontal-scroll.[fit=wide].scroll-next.[disabled].opacity
            const [/* stylesKey */, component, ...selectors] = token.id.split(".");
            if (selectors.length > 0) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const attr = selectors.pop()!;

                const params: StyleModuleEvaluateParameters = {};
                const first = selectors.shift();
                if (first) {
                    if (isCondition(first)) {
                        params.hostCondition = first;
                        params.part = selectors.shift();
                    } else {
                        params.part = first;
                    }
                    params.partCondition = selectors.shift();
                }

                // console.log("Modular style selector", token.id.replace(stylesKey, ""), "=>", component, params, attr);

                const tokenValue = isAlias(token._original.$value)
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    ? DesignTokens.get(aliasToTokenId(token._original.$value as string))!
                    : (token.$value as string);
                // const tokenValueDesc = isAlias(token._original.$value)
                //    ? "DT: " + aliasToTokenId(token._original.$value as string)
                //    : token.$value as string;
                // console.log("Adding module", component, tokenValueDesc);
                const module = attribute(attr, tokenValue)(params);

                addModule(component, module);
            }
        }
    });
}
