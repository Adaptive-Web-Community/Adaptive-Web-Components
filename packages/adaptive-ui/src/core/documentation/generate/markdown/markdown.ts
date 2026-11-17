import type { ChangelogEntry } from "../../changelog.js";
import {
    type Contract,
    type ContractProperty,
    type ContractSlot,
    resolveContract,
} from "../../contract.js";
import type { DisambiguationEntry } from "../../disambiguation.js";
import { labelOf } from "../../doc-common.js";
import type { Documentation } from "../../documentation.js";
import type { KnownIssue } from "../../known-issues.js";
import { type PartDefinition, type Structure, structureParts } from "../../structure.js";
import { typeScriptContractConvention } from "../typescript/contract.js";
import type { UsageRule } from "../../usage.js";
import { RuleStance } from "../../usage.js";

/**
 * Naming convention for paired documentation and generated Markdown modules.
 *
 * @public
 */
export const markdownConvention = {
    documentationExportName: typeScriptContractConvention.documentationExportName,
    moduleBasename: typeScriptContractConvention.moduleBasename,
    generatedFileName(moduleBasename: string): string {
        return `${moduleBasename}.generated.md`;
    },
} as const;

function heading(level: number, text: string): string {
    return `${"#".repeat(level)} ${text}\n\n`;
}

function list(items: readonly string[]): string {
    return items.map((item) => `- ${item}`).join("\n") + "\n\n";
}

function renderDisambiguation(entries: readonly DisambiguationEntry[]): string {
    let out = heading(2, "Related components");
    for (const entry of entries) {
        out += `- **${labelOf(entry)}** — ${entry.use}\n`;
    }
    return out + "\n";
}

function renderProperty(property: ContractProperty): string {
    const title = labelOf(property);
    let out = `### ${title}\n\n`;
    if (property.description) {
        out += `${property.description}\n\n`;
    }
    out += `Type: \`${property.kind}\`${property.nullable ? " or `null`" : ""}\n\n`;
    if (property.objectProperties?.length) {
        out += "| Field | Type | Description |\n| --- | --- | --- |\n";
        for (const field of property.objectProperties) {
            const label = labelOf(field);
            out += `| ${label} | \`${field.kind}\` | ${field.description ?? ""} |\n`;
        }
        out += "\n";
    }
    if (property.enumValues?.length) {
        out += "| Value | Description |\n| --- | --- |\n";
        for (const value of property.enumValues) {
            const label = labelOf(value);
            out += `| ${label} | ${value.description ?? ""} |\n`;
        }
        out += "\n";
    }
    return out;
}

function contractSlotName(slot: ContractSlot): string | undefined {
    return slot.id === "default" ? undefined : slot.id;
}

function renderSlot(slot: ContractSlot): string {
    const title = labelOf(slot);
    let out = `### ${title}\n\n`;
    const name = contractSlotName(slot);
    if (name) {
        out += `Slot name: \`${name}\`\n\n`;
    }
    if (slot.description) {
        out += `${slot.description}\n\n`;
    }
    return out;
}

function renderContract(contract: Contract): string {
    const { properties, slots } = resolveContract(contract);
    let out = "";
    if (properties.length > 0) {
        out += heading(2, "Properties");
        for (const property of properties) {
            out += renderProperty(property);
        }
    }
    if (slots.length > 0) {
        out += heading(2, "Slots");
        for (const slot of slots) {
            out += renderSlot(slot);
        }
    }
    return out;
}

function renderPart(id: string, part: PartDefinition, parent?: string): string {
    const title = labelOf({ id, label: part.label });
    let out = `### ${title}\n\n`;
    if (parent) {
        out += `Inside \`${parent}\`.\n\n`;
    }
    if (part.description) {
        out += `${part.description}\n\n`;
    }
    const traits = [
        ...(part.component ? [`Component: \`${labelOf(part.component)}\``] : []),
        ...(part.interactive ? ["Interactive: **yes**"] : []),
        ...(part.indicatesFocus ? ["Indicates focus: **yes**"] : []),
    ];
    if (traits.length > 0) {
        out += list(traits);
    }
    return out;
}

function renderStructure(structure: Structure): string {
    let out = heading(2, "Structure");
    const traits = [
        ...(structure.interactive ? ["Interactive: **yes**"] : []),
        ...(structure.indicatesFocus ? ["Indicates focus: **yes**"] : []),
    ];
    if (structure.description || traits.length > 0) {
        out += heading(3, "Context");
        if (structure.description) {
            out += `${structure.description}\n\n`;
        }
        if (traits.length > 0) {
            out += list(traits);
        }
    }
    const parts = structureParts(structure);
    if (parts.length > 0) {
        out += heading(3, "Parts");
        for (const { id, part, parent } of parts) {
            out += renderPart(id, part, parent);
        }
    }
    return out;
}

function stanceLabel(rule: UsageRule): string {
    switch (rule.stance) {
        case RuleStance.do:
            return "Do";
        case RuleStance.dont:
            return "Don't";
        case RuleStance.caution:
            return "Caution";
        default:
            return rule.stance;
    }
}

function renderUsageRules(rules: readonly UsageRule[]): string {
    let out = heading(2, "Usage");
    for (const rule of rules) {
        const label = stanceLabel(rule);
        const severity = rule.severity.toUpperCase();
        out += `#### ${label} (${severity})\n\n`;
        out += `${rule.text}\n\n`;
        if (rule.reason) {
            out += `${rule.reason}\n\n`;
        }
        if (rule.exceptions) {
            out += `> ${rule.exceptions}\n\n`;
        }
    }
    return out;
}

function renderKnownIssues(issues: readonly KnownIssue[]): string {
    let out = heading(2, "Known issues");
    for (const issue of issues) {
        out += `### ${labelOf(issue)}\n\n${issue.summary}\n\n`;
        if (issue.workaround) {
            out += `**Workaround:** ${issue.workaround}\n\n`;
        }
        if (issue.plannedFix) {
            out += `**Planned fix:** ${issue.plannedFix}\n\n`;
        }
    }
    return out;
}

function renderChangelog(entries: readonly ChangelogEntry[]): string {
    let out = heading(2, "Documentation changelog");
    for (const entry of entries) {
        out += `- **${entry.date}** (${entry.changeKind}) — ${entry.summary} _${entry.author}_\n`;
    }
    return out + "\n";
}

/**
 * Renders {@link Documentation} as Markdown for Storybook docs pages, MCP `docs-show`, and similar consumers.
 *
 * @public
 */
export function renderMarkdown(documentation: Documentation): string {
    let md = heading(1, labelOf(documentation));

    if (documentation.definition) {
        md += `${documentation.definition}\n\n`;
    }
    if (documentation.remarks) {
        md += `${documentation.remarks.trim()}\n\n`;
    }
    if (documentation.disambiguation?.length) {
        md += renderDisambiguation(documentation.disambiguation);
    }
    if (documentation.capabilities?.summary || documentation.capabilities?.items?.length) {
        md += heading(2, "Capabilities");
        if (documentation.capabilities.summary) {
            md += `${documentation.capabilities.summary}\n\n`;
        }
        if (documentation.capabilities.items?.length) {
            for (const item of documentation.capabilities.items) {
                md += `- **${labelOf(item)}** — ${item.description}\n`;
            }
            md += "\n";
        }
    }
    if (documentation.usage?.rules?.length) {
        md += renderUsageRules(documentation.usage.rules);
    }
    if (documentation.accessibility) {
        md += heading(2, "Accessibility");
        if (documentation.accessibility.summary) {
            md += `${documentation.accessibility.summary}\n\n`;
        }
        if (documentation.accessibility.responsibilities?.length) {
            md += heading(3, "Product responsibilities");
            md += list(documentation.accessibility.responsibilities);
        }
    }
    if (documentation.structure) {
        md += renderStructure(documentation.structure);
    }
    if (documentation.contract) {
        md += renderContract(documentation.contract);
    }
    if (documentation.knownIssues?.length) {
        md += renderKnownIssues(documentation.knownIssues);
    }
    if (documentation.changelog?.length) {
        md += renderChangelog(documentation.changelog);
    }
    return md.trimEnd() + "\n";
}
