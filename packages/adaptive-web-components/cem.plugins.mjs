import { getAllDeclarationsOfKind, getInheritanceTree } from "@custom-elements-manifest/analyzer/src/utils/manifest-helpers.js";

export function fastElementPlugin() {
    return {
        name: "FAST-ELEMENT",
        packageLinkPhase({ customElementsManifest, context }) {
            // Handle classes with indirect HTMLElement ancestor
            customElementsManifest?.modules?.forEach(_module => {
                _module?.declarations?.forEach(declaration => {
                    if (declaration?.kind === "class") {
                        if (declaration?.superclass?.name?.startsWith("FAST")) {
                            declaration.customElement = true;
                            // _module.path will be like "src/components/accordion/accordion.ts"
                            const baseName = _module.path.split("/")[2];
                            declaration.tagName = "adaptive-" + baseName;
                        }
                    }
                });
            });

            // Handle slots and parts inheritance
            // Copied and modified from packages/analyzer/src/features/post-processing/apply-inheritance.js
            const allManifests = [customElementsManifest, ...(context.thirdPartyCEMs || [])];
            const classLikes = [];

            allManifests.forEach((manifest) => {
                const classes = getAllDeclarationsOfKind(manifest, "class");
                const mixins = getAllDeclarationsOfKind(manifest, "mixin");
                classLikes.push(...[...classes, ...mixins]);
            });

            classLikes.forEach((customElement) => {
                const inheritanceChain = getInheritanceTree(allManifests, customElement.name);

                inheritanceChain?.forEach(klass => {
                    // ignore the current class itself
                    if (klass?.name === customElement.name) {
                        return;
                    }

                    ["cssProperties", "cssParts", "slots"].forEach(type => {
                        klass?.[type]?.forEach(currItem => {
                            const newItem = { ...currItem };

                            /**
                              * If an attr or member is already present in the base class, but we encounter it here,
                              * it means that the base has overridden that method from the super class
                              * So we either add the data to the overridden method, or we add it to the array as a new item
                              */
                            const existing = customElement?.[type]?.find(item => newItem.name === item.name);

                            if (existing) {
                                customElement[type] = customElement?.[type]?.map(item => item.name === existing.name
                                    ? {
                                        ...newItem,
                                        ...existing,
                                        ...{
                                            ...(newItem.type ? { type: newItem.type } : {}),
                                            ...(newItem.privacy ? { privacy: newItem.privacy } : {})
                                        }
                                    }
                                    : item);
                            } else {
                                customElement[type] = [...(customElement[type] || []), newItem];
                            }
                        });
                    });
                });
            });
        }
    }
}

export function fast() {
    return void 0;
}
