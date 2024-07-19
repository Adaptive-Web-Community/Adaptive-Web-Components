# Change Log - @adaptive-web/adaptive-ui

This log was last generated on Fri, 19 Jul 2024 17:39:45 GMT and should not be manually modified.

<!-- Start content -->

## 0.9.0

Fri, 19 Jul 2024 17:39:45 GMT

### Minor changes

- AUI: Update CLI from `tokens` to align with existing `properties` (47367562+bheston@users.noreply.github.com)

## 0.8.0

Mon, 15 Jul 2024 18:51:14 GMT

### Minor changes

- Merge CSS rules during CSS generation from JSON anatomy (nicholasrice@users.noreply.github.com)

## 0.7.0

Thu, 11 Jul 2024 17:06:10 GMT

### Minor changes

- AUI: Fix global style generation (47367562+bheston@users.noreply.github.com)

## 0.6.0

Tue, 09 Jul 2024 16:29:52 GMT

### Minor changes

- Improved Figma CLI (47367562+bheston@users.noreply.github.com)
- Adaptive UI: Migrated global disabled and focus style support from AWC to AUI (47367562+bheston@users.noreply.github.com)

### Patches

- Adaptive UI: Anatomy CLI fixes (47367562+bheston@users.noreply.github.com)

## 0.5.0

Mon, 24 Jun 2024 21:29:12 GMT

### Minor changes

- Adaptive UI: Improve color palette accuracy (47367562+bheston@users.noreply.github.com)

## 0.4.1

Mon, 10 Jun 2024 23:22:54 GMT

### Patches

- Add runtime dependencies as dependencies (nicholasrice@users.noreply.github.com)

## 0.4.0

Thu, 30 May 2024 17:37:24 GMT

### Minor changes

- AUI: Remove assumption on `part` selector (47367562+bheston@users.noreply.github.com)
- Adaptive UI: Fix module name (47367562+bheston@users.noreply.github.com)
- Adaptive UI: Updated token names to hierarchical format (47367562+bheston@users.noreply.github.com)
- Designer: Added anatomy code generation (47367562+bheston@users.noreply.github.com)
- Added a registry for Design Tokens (47367562+bheston@users.noreply.github.com)
- Adds stylesheet generation from JSON anatomy (nicholasrice@users.noreply.github.com)
- Adaptive UI: Add support for multi-value string anatomy conditions (47367562+bheston@users.noreply.github.com)

## 0.3.0

Fri, 26 Apr 2024 21:58:21 GMT

### Minor changes

- Added subtle inverse color recipes (47367562+bheston@users.noreply.github.com)
- Adaptive UI: Added styles build script (47367562+bheston@users.noreply.github.com)
- Adaptive UI: Added support for overriding interactive state selectors - Naming and type cleanup around interactive states (47367562+bheston@users.noreply.github.com)
- Added shadows to Designer plugin (47367562+bheston@users.noreply.github.com)

### Patches

- Adaptive UI : Cleaned up type definition for Style Rules (formerly Style Modules) (47367562+bheston@users.noreply.github.com)
- Adaptive UI: Fix circular palette reference (47367562+bheston@users.noreply.github.com)
- Expand styling capabilities to not assume `:host` container (47367562+bheston@users.noreply.github.com)
- Adaptive UI : Organized package structure (47367562+bheston@users.noreply.github.com)
- Added warning and success palettes and recipes Deprecated color recipe set aliases (47367562+bheston@users.noreply.github.com)
- Added info color palette (47367562+bheston@users.noreply.github.com)
- Updated density token settings (47367562+bheston@users.noreply.github.com)
- refactor compiler to add compile commands and allow paramaterized inputs (nicholasrice@users.noreply.github.com)
- Adaptive UI: Fix a sequence issue in the density helper (47367562+bheston@users.noreply.github.com)

## 0.2.2

Fri, 12 Jan 2024 00:16:08 GMT

### Patches

- Added density and component styling helpers (47367562+bheston@users.noreply.github.com)
- Updated elevation tokens to work with Adaptive Styles - Fixed an issue with objects converting to css values (47367562+bheston@users.noreply.github.com)
- Components: Migrate default icons to local svgs (47367562+bheston@users.noreply.github.com)
- Fixed border not getting set on fill styles (47367562+bheston@users.noreply.github.com)
- Adaptive UI: Update culori imports for tree shaking (47367562+bheston@users.noreply.github.com)
- Migrated from fast-colors to culori (47367562+bheston@users.noreply.github.com)
- Adaptive UI: Adjust color deltas (47367562+bheston@users.noreply.github.com)
- Added support for setting `fill` when `color` is set (47367562+bheston@users.noreply.github.com)
- Updated focus stroke recipes for more control (47367562+bheston@users.noreply.github.com)
- Updated color recipes to allow null interactive states (47367562+bheston@users.noreply.github.com)
- Added support for focus styling and css outline properties (47367562+bheston@users.noreply.github.com)

## 0.2.1

Tue, 17 Oct 2023 16:10:46 GMT

### Patches

- Designer - Fix the fill color evaluation (47367562+bheston@users.noreply.github.com)
- Added `destructive` color palette and recipes (47367562+bheston@users.noreply.github.com)
- Rename "font" styles to "text" (47367562+bheston@users.noreply.github.com)
- Fix corner radius style not applying (47367562+bheston@users.noreply.github.com)
- Adaptive UI - Updated color palette based on okhsl (47367562+bheston@users.noreply.github.com)
- Add a few styles and tokens to Adaptive UI reference (47367562+bheston@users.noreply.github.com)
- update fast dependencies (32497422+KingOfTac@users.noreply.github.com)
- Adaptive UI: Consolidate css selectors (47367562+bheston@users.noreply.github.com)
- Adaptive UI - Improve density support (47367562+bheston@users.noreply.github.com)
- Added support for setting font weight and italic style (47367562+bheston@users.noreply.github.com)
- Renamed "destructive" palette to "critical" (47367562+bheston@users.noreply.github.com)
- Added support for `disabled` state colors - Added deltas to base semantic recipes - Added a disabled palette to enable neutral disabled states - Added support for global styles - Added disabled cursor to global styles (47367562+bheston@users.noreply.github.com)
- Adjusted adaptive density styles (47367562+bheston@users.noreply.github.com)
- Swapped default setting for transparent output from delta rules, added square density modifier, and update outline modules to include fillColor (47367562+bheston@users.noreply.github.com)

## 0.2.0

Sat, 01 Jul 2023 03:28:44 GMT

### Minor changes

- fixed modules exported from wrong path (nbrown414@outlook.com)
- Export color token and style helpers (47367562+bheston@users.noreply.github.com)
- Update compound properties (padding, border, etc.) (47367562+bheston@users.noreply.github.com)
- Update styles to normalize to `border-box` sizing (47367562+bheston@users.noreply.github.com)
- move type ramp tokens to reference path (32497422+KingOfTac@users.noreply.github.com)
- Added `migration` export for deprecated design tokens (47367562+bheston@users.noreply.github.com)
- Add highlight palette and recipes (47367562+bheston@users.noreply.github.com)
- Improved typing and metadata on color recipes (47367562+bheston@users.noreply.github.com)
- Adaptive UI: Formalized `Recipe` structure to enable better composition (47367562+bheston@users.noreply.github.com)
- Adaptive UI: Token helpers cleanup (47367562+bheston@users.noreply.github.com)
- Designer: add style module support (47367562+bheston@users.noreply.github.com)

## 0.1.0

Sat, 03 Jun 2023 04:25:41 GMT

### Minor changes

- Migrated interactive color styles to style modules (47367562+bheston@users.noreply.github.com)
- Migration and update to Adaptive UI for the Figma plugin (47367562+bheston@users.noreply.github.com)
- Migrate density related styles to style modules (47367562+bheston@users.noreply.github.com)
- Package color tokens as sets and style modules, add style module rendering to ElementStyles (47367562+bheston@users.noreply.github.com)
- Update to latest FAST (47367562+bheston@users.noreply.github.com)
- Bridge token structure between Adaptive UI and DT community group (47367562+bheston@users.noreply.github.com)
- Update Adaptive UI code sequence (organization only) (47367562+bheston@users.noreply.github.com)
- Renamed `perceivable` colors to `discernible` (47367562+bheston@users.noreply.github.com)
- Updated more color tokens and modules - Renamed remaining "foreground" tokens - Added support for derived foreground recipes over a background - Minor recipe tweaks (47367562+bheston@users.noreply.github.com)
- Migrated type ramp to style modules (47367562+bheston@users.noreply.github.com)
- Clean up style module definition (47367562+bheston@users.noreply.github.com)
- Finish semantic color recipe system and foundation style modules (47367562+bheston@users.noreply.github.com)
- Designer token model update - Aligned plugin to new model where a token might have multiple uses - Aligned token registration - Cleanup of some component handling logic - More comments (47367562+bheston@users.noreply.github.com)
- Update Styles to typed StylesProperty key (47367562+bheston@users.noreply.github.com)

### Patches

- Fix API docs (47367562+bheston@users.noreply.github.com)
- Restructure color recipe design token definition (47367562+bheston@users.noreply.github.com)

## 0.0.3

Wed, 15 Mar 2023 23:46:48 GMT

### Patches

- Fix black or white foreground recipe Minor Adaptive UI Explorer fixes (47367562+bheston@users.noreply.github.com)
