/* eslint-disable max-len */
import { camelCase, kebabCase } from "change-case";
import {
    Interactivity,
    InteractivityDefinition,
} from "@adaptive-web/adaptive-ui";
import { AdditionalDataKeys, type PluginUINodeData } from "@adaptive-web/adaptive-ui-designer-core";

// A simple string for ignoring layers in the design tool
const ignoreLayerName = "(Figma)";

function makeClassName(value: string) {
    return `.${kebabCase(value)}`;
}

// TODO: All of these type definitions will be merged into the core AUI package, including simple interface and serialization support.

export type SerializableBooleanCondition = string;

export type SerializableStringCondition = Record<string, string>;

export type SerializableCondition = SerializableBooleanCondition | SerializableStringCondition;

export interface SerializableToken {
    target: string;
    tokenID: string;
}

export interface SerializableStyleRule {
    contextCondition?: string;
    part?: string;
    styles?: string[];
    tokens?: SerializableToken[];
}

export interface SerializableAnatomy {
    name: string;
    context: string;
    interactivity?: InteractivityDefinition;
    conditions: Record<string, SerializableCondition>;
    parts: Record<string, string>;
    styleRules: SerializableStyleRule[];
}

export abstract class Condition {
    constructor(
        public readonly name: string,
    ) { }

    toJSON(): any {
        return makeClassName(this.name);
    }
}

export class BooleanCondition extends Condition {
    toJSON(): SerializableBooleanCondition {
        return makeClassName(this.name);
    }
}

export class StringCondition extends Condition {
    constructor(
        name: string,
        public values: Array<string>,
    ) {
        super(name);
    }

    toJSON(): SerializableStringCondition {
        const values = this.values.reduce((prev, current) => {
            prev[current] = makeClassName(this.name + " " + current); // Add space so that there is a kebab between name and value
            return prev;
        }, {} as SerializableStringCondition);

        return values;
    }
}

export class Token {
    constructor(
        public target: string,
        public tokenID: string,
    ) { }

    toJSON(): SerializableToken {
        return {
            target: this.target,
            tokenID: this.tokenID,
        };
    }
}

export class StyleRule {
    contextCondition?: string;
    part: string = "";
    styles: Set<string> = new Set();
    tokens: Set<Token> = new Set();

    toJSON(): SerializableStyleRule {
        const contextCondition = typeof this.contextCondition === "string" ? "." + kebabCase(this.contextCondition) : undefined;
        return {
            contextCondition,
            part: this.part || "",
            styles: Array.from(this.styles),
            tokens: this.tokens.size === 0 ? undefined : Array.from(this.tokens).map(token => token.toJSON()),
        };
    }
}

export class Anatomy implements Anatomy {
    name: string = "";
    context: string = "";
    interactivity?: InteractivityDefinition;
    conditions: Map<string, Condition> = new Map();
    parts: Set<string> = new Set();
    styleRules: Set<StyleRule> = new Set();

    toJSON(): SerializableAnatomy {
        const conditions = Array.from(this.conditions.entries()).reduce((prev, next) => {
            prev[next[0]] = next[1].toJSON()
            return prev
        }, {} as SerializableAnatomy['conditions'])

        const parts = Array.from(this.parts.entries()).reduce((prev, current) => {
            prev[current[0]] = makeClassName(current[1]);
            return prev;
        }, {} as SerializableAnatomy['parts'])

        return {
            name: this.name,
            context: makeClassName(this.name),
            interactivity: this.interactivity,
            conditions,
            parts,
            styleRules: Array.from(this.styleRules).map(rule => rule.toJSON()),
        }
    }

    private constructor() {
        /* Privatize constructor */
    }

    public static create(): Anatomy {
        return new Anatomy();
    }

    public static fromPluginUINodeData(node: PluginUINodeData): Anatomy {
        return parseComponent(node);
    }
}

function parseComponent(node: PluginUINodeData): Anatomy {
    if (!node) {
        throw new Error("Parameter `node` must be provided");
    }
    if (!(node.type === "COMPONENT_SET" || node.type === "COMPONENT" || node.type === "INSTANCE")) {
        throw new Error("Parameter `node` must have `type` = 'COMPONENT_SET', 'COMPONENT', or 'INSTANCE'");
    }
    const componentName = node.additionalData.get(AdditionalDataKeys.codeGenName);
    if (!componentName) {
        throw new Error("Parameter `node` must provide `additionalData` value for `codeGenName`");
    }

    const anatomy: Anatomy = Anatomy.create();
    anatomy.name = componentName;

    if (node.type === "COMPONENT_SET") {
        if (node.children.length === 1) {
            // Unlikely case
            walkNode(node.children[0], componentName, "", anatomy);
        } else {
            // Parse the component names into property and value sets
            const properties = new Map<string, Array<string>>();

            node.children.forEach((child) => {
                const propValues = child.name.split(",");
                propValues.forEach((propValue) => {
                    const [prop, value] = propValue.trim().split("=");
                    const values = properties.get(prop) || [];
                    if (values.indexOf(value) === -1) {
                        values.push(value);
                        properties.set(prop, values);
                    }
                });
            });

            // TODO look for other interactivity models
            if (properties.has("Disabled")) {
                anatomy.interactivity = Interactivity.disabledClass;
            }

            // Convert properties into anatomy conditions
            // TODO: Validate known properties like "State" and "Disabled". Ignore for now.
            properties.forEach((values, property) => {
                if (property !== "State" && property !== "Disabled") {
                    if (values.length === 2 &&
                        values.filter((value) => value.toLowerCase() === "true" || value.toLowerCase() === "false").length === 2) {
                        // boolean property, add once
                        anatomy.conditions.set(property, new BooleanCondition(property));
                    } else {
                        // string property, add all
                        anatomy.conditions.set(property, new StringCondition(property, values));
                    }
                }
            });

            // Handler for a single Component within a Set
            const nodeHandler = (name: string, property: string): void => {
                const found = node.children.find(node => node.name.toLowerCase() === name.toLowerCase());
                if (!found) {
                    // console.warn(`Expected component ${name}, property ${property}, not found`);
                } else {
                    // console.log("  found node", name);
                    walkNode(found, componentName, property, anatomy);
                }
            };

            // The first child is the default (no conditions)            
            const defaultName = node.children[0].name;

            // Process the component node for each condition
            // Note that the current model treats conditions as additive, so condition A and condition B will be
            // separate selectors which might both apply (in sequence)

            // Handle string conditions first so each value is accounted for and forms the base for further variants
            let foundString = false;
            anatomy.conditions.forEach((condition, property) => {
                if (condition instanceof StringCondition) {
                    foundString = true;
                    // The first value is in the defaultName:
                    const replaceProperty = `${property}=${condition.values[0]}`;
                    condition.values.forEach(value => {
                        const name = defaultName.replace(replaceProperty, `${property}=${value}`);
                        nodeHandler(name, camelCase(`${property} ${value}`));
                    });
                }
            });

            // If there were no string conditions, process the first component as the default "baseline"
            if (!foundString) {
                walkNode(node.children[0], componentName, "", anatomy);
            }

            // Handle boolean condition "true" values
            anatomy.conditions.forEach((condition, property) => {
                if (condition instanceof BooleanCondition) {
                    // Assume false is the default condition, find the `true` component
                    const name = defaultName.replace(`${property}=false`, `${property}=true`);
                    nodeHandler(name, property);
                }
            });
        }
    } else {
        walkNode(node, componentName, "", anatomy);
    }

    return anatomy;
}

function cleanNodeName(nodeName: string): string {
    // Remove non-ascii characters
    return nodeName.replace(/[^\x20-\x7F]/g, "").trim();
}

function walkNode(node: PluginUINodeData, componentName: string, condition: string, anatomy: Anatomy): void {
    const nodeName = cleanNodeName(node.name);

    if (nodeName === "Focus indicator") {
        // Ignore for now
        return;
    }

    if (!node.name.endsWith(ignoreLayerName)) {
        // TODO, not only frames, but what?
        if (node.type === "FRAME" && nodeName !== componentName) {
            anatomy.parts.add(node.name);
        }

        const styleRule = new StyleRule();

        if (condition) {
            styleRule.contextCondition = condition;
        }

        node.appliedStyleModules.forEach(style => {
            const styleVariableName = style;
            styleRule.styles.add(styleVariableName);
        });

        node.appliedDesignTokens.forEach((token, target) => {
            const tokenRef = token.tokenID;
            styleRule.tokens.add(new Token(target, tokenRef));
        });

        if (nodeName !== componentName) {
            styleRule.part = nodeName;
        }

        if (styleRule.styles.size > 0 || styleRule.tokens.size > 0) {
            if (nodeName !== componentName) {
                anatomy.parts.add(node.name)
            }
            anatomy.styleRules.add(styleRule);
        }
    }

    node.children.forEach((child) => {
        walkNode(child, componentName, condition, anatomy);
    });
}
