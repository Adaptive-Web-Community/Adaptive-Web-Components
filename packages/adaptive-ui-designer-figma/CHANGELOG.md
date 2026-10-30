# Change Log - @adaptive-web/adaptive-ui-designer-figma

## 1.0.0-beta.0

### Major Changes

-   [#344](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/pull/344) [`711ccb5`](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/commit/711ccb5734d5ee8b6af30425f519e1a17887b358) Thanks [@bheston](https://github.com/bheston)! - Move the Figma compiler to the 1.0 beta of Adaptive UI: the anatomy of a component is the `SerializableAnatomy` of Adaptive UI, its rules name their treatments in `treatments`, the names a node stores are written by their current name, and the data of a node is read as the designer core's records. See the [migration guide](./MIGRATION.md).

### Patch Changes

-   Updated dependencies [[`d8a2b6d`](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/commit/d8a2b6dc33fcbf70947dafbc106d590011e31137), [`c8ed3cf`](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/commit/c8ed3cf07b7fb256d7538de91b3d114a5f49b751)]:
    -   @adaptive-web/adaptive-ui-designer-core@1.0.0-beta.0
    -   @adaptive-web/adaptive-ui@1.0.0-beta.2

## 0.6.1

### Patch Changes

-   [#318](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/pull/318) [`dea75f4`](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/commit/dea75f443e22330abb653ff6ddda64953e80e013) Thanks [@bheston](https://github.com/bheston)! - Remove deprecated public APIs, the `adaptive-ui/migration` export, the `Swatch` class (use `Color`), and per-state color token aliases. Internal packages now use `ColorSet` properties, `controlListDensityStyles`, `densityControlList`, and `Color.toString()`.

-   Updated dependencies [[`dea75f4`](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/commit/dea75f443e22330abb653ff6ddda64953e80e013)]:
    -   @adaptive-web/adaptive-ui@0.14.0
    -   @adaptive-web/adaptive-ui-designer-core@0.6.2

## 0.6.0

### Minor Changes

-   [#290](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/pull/290) [`5bf0946`](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/commit/5bf094691838b8433a9c8b4554505f91ea5fa90f) Thanks [@bheston](https://github.com/bheston)! - Figma Designer: Update CLI to allow PAT in env var

### Patch Changes

-   [#307](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/pull/307) [`0255d8f`](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/commit/0255d8fbf3972c21c3b60271832cbe702c9e75a4) Thanks [@bheston](https://github.com/bheston)! - Figma: Added support for slot layers

-   [#283](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/pull/283) [`46beeb4`](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/commit/46beeb4d472267085dd1f3f0d9a08421f28ef03c) Thanks [@bheston](https://github.com/bheston)! - Fix plugin data storage

-   [#295](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/pull/295) [`f9ce9bc`](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/commit/f9ce9bc9f7d5e77add44035e983e67b127238f6d) Thanks [@bheston](https://github.com/bheston)! - Added `components` CLI option and fixed processing issues

-   Updated dependencies [[`4a6c306`](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/commit/4a6c3068371d619c3a2d3322d920811c6ca87f27), [`0255d8f`](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/commit/0255d8fbf3972c21c3b60271832cbe702c9e75a4), [`7d6fd23`](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/commit/7d6fd2335a0438dd63e24dd8c75f8ed0636dd623), [`b294ebf`](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/commit/b294ebf6c702db82f05698469b988e8709cd53f3), [`46beeb4`](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/commit/46beeb4d472267085dd1f3f0d9a08421f28ef03c), [`74a20e7`](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/commit/74a20e7387059f3ee8a43675bad70807fe92a046), [`b74a178`](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/commit/b74a178a0aaccb37fe53c89f64bec1820dd0ef0c), [`eaf8997`](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/commit/eaf89972b3215946bc42e44468e84906fd32e92d), [`6cabf9e`](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/commit/6cabf9e7a87d5f14c191a0c213951bd7eba1757d)]:
    -   @adaptive-web/adaptive-ui@0.13.2
    -   @adaptive-web/adaptive-ui-designer-core@0.6.1

## 0.5.3

### Patch Changes

-   [#278](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/pull/278) [`069752e`](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/commit/069752e6d68d33233c23a8483e170cc757d752c5) Thanks [@bheston](https://github.com/bheston)! - Fix string comparison casing issues

-   [#278](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/pull/278) [`069752e`](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/commit/069752e6d68d33233c23a8483e170cc757d752c5) Thanks [@bheston](https://github.com/bheston)! - Improve tracking of applied plugin data

-   [#278](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/pull/278) [`069752e`](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/commit/069752e6d68d33233c23a8483e170cc757d752c5) Thanks [@bheston](https://github.com/bheston)! - Put back code gen support for anatomy definition

-   Updated dependencies [[`069752e`](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/commit/069752e6d68d33233c23a8483e170cc757d752c5), [`069752e`](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/commit/069752e6d68d33233c23a8483e170cc757d752c5), [`069752e`](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/commit/069752e6d68d33233c23a8483e170cc757d752c5), [`069752e`](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/commit/069752e6d68d33233c23a8483e170cc757d752c5), [`069752e`](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/commit/069752e6d68d33233c23a8483e170cc757d752c5), [`069752e`](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/commit/069752e6d68d33233c23a8483e170cc757d752c5), [`069752e`](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/commit/069752e6d68d33233c23a8483e170cc757d752c5), [`069752e`](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/commit/069752e6d68d33233c23a8483e170cc757d752c5), [`069752e`](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/commit/069752e6d68d33233c23a8483e170cc757d752c5), [`069752e`](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/commit/069752e6d68d33233c23a8483e170cc757d752c5), [`069752e`](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/commit/069752e6d68d33233c23a8483e170cc757d752c5), [`069752e`](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/commit/069752e6d68d33233c23a8483e170cc757d752c5), [`069752e`](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/commit/069752e6d68d33233c23a8483e170cc757d752c5), [`069752e`](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/commit/069752e6d68d33233c23a8483e170cc757d752c5), [`069752e`](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/commit/069752e6d68d33233c23a8483e170cc757d752c5), [`069752e`](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/commit/069752e6d68d33233c23a8483e170cc757d752c5), [`069752e`](https://github.com/Adaptive-Web-Community/Adaptive-Web-Components/commit/069752e6d68d33233c23a8483e170cc757d752c5)]:
    -   @adaptive-web/adaptive-ui@0.13.0
    -   @adaptive-web/adaptive-ui-designer-core@0.6.0

This log was last generated on Fri, 31 Jan 2025 15:36:53 GMT and should not be manually modified.

<!-- Start content -->

## 0.5.2

Fri, 31 Jan 2025 15:36:53 GMT

### Patches

-   Bump @adaptive-web/adaptive-ui to v0.12.0
-   Bump @adaptive-web/adaptive-ui-designer-core to v0.5.0

## 0.5.1

Fri, 01 Nov 2024 01:04:24 GMT

### Patches

-   Bump @adaptive-web/adaptive-ui to v0.11.0
-   Bump @adaptive-web/adaptive-ui-designer-core to v0.4.1

## 0.5.0

Fri, 25 Oct 2024 03:02:05 GMT

### Minor changes

-   Designer: Support Figma async page loading model (47367562+bheston@users.noreply.github.com)
-   Bump @adaptive-web/adaptive-ui to v0.10.0
-   Bump @adaptive-web/adaptive-ui-designer-core to v0.4.0

### Patches

-   Add support for margin properties (47367562+bheston@users.noreply.github.com)

## 0.4.1

Thu, 25 Jul 2024 17:29:23 GMT

### Patches

-   Bump @adaptive-web/adaptive-ui to v0.9.1
-   Bump @adaptive-web/adaptive-ui-designer-core to v0.3.1

## 0.4.0

Fri, 19 Jul 2024 17:39:45 GMT

### Minor changes

-   AUI: Update CLI from `tokens` to align with existing `properties` (47367562+bheston@users.noreply.github.com)
-   Designer: Added ability to mark a node `inline` for styling (47367562+bheston@users.noreply.github.com)
-   Bump @adaptive-web/adaptive-ui to v0.9.0
-   Bump @adaptive-web/adaptive-ui-designer-core to v0.3.0

## 0.3.1

Mon, 15 Jul 2024 18:51:14 GMT

### Patches

-   Bump @adaptive-web/adaptive-ui to v0.8.0
-   Bump @adaptive-web/adaptive-ui-designer-core to v0.2.3

## 0.3.0

Thu, 11 Jul 2024 17:06:10 GMT

### Minor changes

-   AUI: Fix global style generation (47367562+bheston@users.noreply.github.com)
-   Bump @adaptive-web/adaptive-ui to v0.7.0
-   Bump @adaptive-web/adaptive-ui-designer-core to v0.2.2

## 0.2.0

Tue, 09 Jul 2024 16:29:52 GMT

### Minor changes

-   Improved Figma CLI (47367562+bheston@users.noreply.github.com)
-   Bump @adaptive-web/adaptive-ui to v0.6.0
-   Bump @adaptive-web/adaptive-ui-designer-core to v0.2.1

### Patches

-   Adaptive UI: Anatomy CLI fixes (47367562+bheston@users.noreply.github.com)

## 0.1.2

Mon, 24 Jun 2024 21:29:12 GMT

### Patches

-   Bump @adaptive-web/adaptive-ui to v0.5.0
-   Bump @adaptive-web/adaptive-ui-designer-core to v0.2.0

## 0.1.1

Mon, 10 Jun 2024 23:22:54 GMT

### Patches

-   remove logging of PAT (nicholasrice@users.noreply.github.com)
-   Bump @adaptive-web/adaptive-ui to v0.4.1
-   Bump @adaptive-web/adaptive-ui-designer-core to v0.1.1

## 0.1.0

Thu, 30 May 2024 17:37:24 GMT

### Minor changes

-   Initial package creation (nicholasrice@users.noreply.github.com)
-   Fix plugin: - Relocate messaging interfaces back to the plugin - Mark new dependencies sideEffects to allow tree shaking (47367562+bheston@users.noreply.github.com)
-   Bump @adaptive-web/adaptive-ui to v0.4.0
-   Bump @adaptive-web/adaptive-ui-designer-core to v0.1.0

### Patches

-   Fixing a few CLI runtime issues (47367562+bheston@users.noreply.github.com)
