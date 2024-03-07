# Integration - React

Illustrates how to wrap the web components so they are easier to work with in React experiences.

## Key features

- Generate typed React wrappers for Adaptive Web Components
- Use wrapped components exactly like manually created React components
- Adjust Adaptive UI capabilities

## Notes about Adaptive UI

This sample abbreviates what you would probably want to do for a full custom design system. In that case, it would be
stronger to publish a package of the web components you want, composed directly with your styling updates. Then either
publish another package of the React wrappers for those components, or wrap them directly in your app.

In this optimization, there are some styling concerns we need to address before the components are defined. We're doing
this by separating that logic into `init.ts`.
