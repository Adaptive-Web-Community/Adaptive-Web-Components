/* eslint-disable max-len */
import { kebabCase } from "change-case";
import {
    FocusDefinition,
    Interactivity,
    InteractivityDefinition,
    SerializableAnatomy,
    SerializableBooleanCondition,
    SerializableStringCondition,
    SerializableStyleRule,
} from "@adaptive-web/adaptive-ui";
import { AdditionalDataKeys, type PluginUINodeData } from "@adaptive-web/adaptive-ui-designer-core";

// A simple string for ignoring layers in the design tool
const ignoreLayerName = "(Figma)";

function makeClassName(value: string) {
    return `.${kebabCase(value)}`;
}

// TODO: All of these type definitions will be merged into the core AUI package, including simple interface and serialization support.

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

export class StyleRule {
    contextCondition?: Record<string, string | boolean>;
    part?: string;
    styles: Set<string> = new Set();
    properties: Map<string, string> = new Map();

    toJSON(): SerializableStyleRule {
        const properties = this.properties.size === 0 ? undefined : Array.from(this.properties.entries()).reduce((prev, next) => {
            prev[next[0]] = next[1];
            return prev;
        }, {} as Record<string, string>);

        return {
            contextCondition: this.contextCondition,
            part: this.part,
            styles: this.styles.size === 0 ? undefined : Array.from(this.styles),
            properties,
        };
    }
}

export class Anatomy {
    name: string = "";
    context: string = "";
    conditions: Map<string, Condition> = new Map();
    parts: Set<string> = new Set();
    interactivity?: InteractivityDefinition;
    focus?: FocusDefinition<any>;
    styleRules: Set<StyleRule> = new Set();

    toJSON(): SerializableAnatomy {
        const conditions = Array.from(this.conditions.entries()).reduce((prev, next) => {
            prev[next[0]] = next[1].toJSON();
            return prev;
        }, {} as SerializableAnatomy["conditions"]);

        const parts = Array.from(this.parts.entries()).reduce((prev, current) => {
            prev[current[0]] = makeClassName(current[1]);
            return prev;
        }, {} as SerializableAnatomy["parts"]);

        return {
            name: this.name,
            context: makeClassName(this.name),
            conditions,
            parts,
            interactivity: this.interactivity,
            focus: this.focus,
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
            walkNode(node.children[0], componentName, undefined, anatomy);
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
            const nodeHandler = (name: string, property: string, value: string | boolean): void => {
                const found = node.children.find(node => node.name.toLowerCase() === name.toLowerCase());
                if (!found) {
                    console.warn(`Expected component ${name}, property ${property}, not found`);
                } else {
                    // console.log("Handling node", {nodeName: name, condition: [property, value]});
                    walkNode(found, componentName, { [property]: value }, anatomy);
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
                        nodeHandler(name, property, value);
                    });
                }
            });

            // If there were no string conditions, process the first component as the default "baseline"
            if (!foundString) {
                walkNode(node.children[0], componentName, undefined, anatomy);
            }

            // Handle boolean condition "true" values
            anatomy.conditions.forEach((condition, property) => {
                if (condition instanceof BooleanCondition) {
                    // Assume false is the default condition, find the `true` component
                    const name = defaultName.replace(`${property}=false`, `${property}=true`);
                    nodeHandler(name, property, true);
                }
            });
        }
    } else {
        walkNode(node, componentName, undefined, anatomy);
    }

    return anatomy;
}

function isContextNode(node: PluginUINodeData, componentName: string): boolean {
    // Remove non-ascii characters (we tried a convention of decorating template node names)
    const nodeName = node.name.replace(/[^\x20-\x7F]/g, "").trim();
    return node.type === "COMPONENT" || componentName.toLowerCase().indexOf(nodeName.toLowerCase()) !== -1;
}

function walkNode(node: PluginUINodeData, componentName: string, condition: Record<string, string | boolean> | undefined, anatomy: Anatomy): void {
    if (node.name === "Focus indicator") {
        // Ignore for now
        return;
    }

    const isContext = isContextNode(node, componentName);

    if (node.type === "INSTANCE" && !(node.config.inline === true || isContext)) {
        // TODO: This is too simplified, but it addresses many nested component issues for now.
        return;
    }

    if (!node.name.endsWith(ignoreLayerName)) {
        // TODO, not only frames, but what?
        if (node.type === "FRAME" && !isContext) {
            anatomy.parts.add(node.name);
        }

        if (node.appliedStyleModules.length > 0 || node.appliedDesignTokens.size > 0) {
            const styleRule = new StyleRule();

            if (condition) {
                styleRule.contextCondition = condition;
            }
    
            node.appliedStyleModules.forEach(style => {
                styleRule.styles.add(style);
            });

            node.appliedDesignTokens.forEach((token, target) => {
                const tokenRef = token.tokenID;
                styleRule.properties.set(target, tokenRef);
            });

            if (!isContext) {
                anatomy.parts.add(node.name)
                styleRule.part = node.name;
            }

            anatomy.styleRules.add(styleRule);
        }
    }

    node.children.forEach((child) => {
        walkNode(child, componentName, condition, anatomy);
    });
}
