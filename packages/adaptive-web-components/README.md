# Adaptive Web Components

> Note this is an alpha release. The components are functional and performant and safe to use. They are however based on the beta release of FAST Element.

> While we are committed to following semver for this project, it's important to note that while we move through alpha and beta, minor version numbers can and will most likely include breaking changes until we hit 1.0.0. After 1.0.0, we will be aligned with semver2.0.

We currently recommend consuming them with as few adjustments as possible because many common issues will be made much easier, including building your own customized design system.

Please see the [Next Steps](#next-steps) for upcoming work.

## What

This project is based on [FAST](https://www.fast.design) and implements the first comprehensive web component library built as [Web Components](https://www.webcomponents.org/introduction) for enterprise web software utilizing the power of [Adaptive User Interfaces](../adaptive-ui/).

## Why

Stop reinventing the wheel, and cut your engineering costs by up to 75%! Simply consume these Web Components, configure your own brand and design system, and start building immediately. 

* Optimized for performance
* Optimized for scale
* Optimized for accessibility
* Build on the latest Open Web Standards
* Build on architectural best practices
* Build on framework-less TypeScript foundation
* Built for Design-to-Code principles

## How

Add the components:

```shell
npm install "@adaptive-web/adaptive-web-components"
```

Import and use everything:
```ts
import AWC from "@adaptive-web/adaptive-web-components"
AWC.withPrefix("super").defineAllComponents();
```

Import the specific components you want to use:

```ts
import "@adaptive-web/adaptive-web-components/button/define";
```

Author html with imported components:

```html
<adaptive-button>Click Me</adaptive-button>
```

See the [examples](../..examples/) for more details.

## Next Steps

- Component styling will evolve with the capabilities of [Adaptive UI](../adaptive-ui/#next-steps). Default component styles are currently split between `templateStyles` and `aestheticStyles`. The aesthetic styles will migrate to a modular styling approach that will be configurable using the Design Tokens Community Group working format standards.
- Universal support for an `appearance` attribute on all components, allowing for extreme flexibility in creating and styling the variations you need.
- Evolving the component definition model for enhanced customization.
