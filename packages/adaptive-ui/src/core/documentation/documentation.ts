import type { AccessibilitySection } from "./accessibility.js";
import type { CapabilitiesSection } from "./capabilities.js";
import type { ChangelogSection } from "./changelog.js";
import type { ContractSection } from "./contract.js";
import type { DisambiguationSection } from "./disambiguation.js";
import type { GovernanceSection } from "./governance.js";
import type { IdentitySection } from "./identity.js";
import type { KnownIssuesSection } from "./known-issues.js";
import type { StructureSection } from "./structure.js";
import type { UsageSection } from "./usage.js";

/**
 * Adaptive Web reference documentation profile: required {@link IdentitySection} and optional first-party sections.
 *
 * @remarks
 * Each section type accepts a generic for extended slice values; defaults are the reference shapes. Consumers may define
 * their own intersections of section types. APIs constrain inputs with minimum reference types they need, not this full profile.
 *
 * @public
 */
export type Documentation =
    IdentitySection &
    GovernanceSection &
    DisambiguationSection &
    StructureSection &
    ContractSection &
    AccessibilitySection &
    CapabilitiesSection &
    UsageSection &
    KnownIssuesSection &
    ChangelogSection;
/**
 * Defines a documentation record, keeping the literal ids and kinds that bindings are typed from.
 *
 * @remarks
 * A plain annotation or `satisfies` widens the `id` of a contract property to `string`, so a binding's condition selectors couldn't be
 * checked against it. The literals are kept here, so {@link PlatformBindingFor} gives autocomplete and type-checking for the conditions, the
 * values of an enumerated one, and the parts.
 *
 * @param documentation - The documentation record
 * @returns The same record, with its literal types
 *
 * @public
 */
export function defineDocumentation<const T extends Documentation>(documentation: T): T {
    return documentation;
}
