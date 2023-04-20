# Design Tokens

This directory defines a specific set of design tokens that are generally useful for building components and experiences. Token values can be updated to reflect your visual design.

We've found you can get a long way with these foundational tokens. If you have a design that necessitates more control, you can easily create your own tokens and sets. Extending the foundation will speed your adoption.

These predefined tokens exist both because they are a good foundation, as well as they have already been published and are in use by consuming design systems. This package is evolving to provide more control in defining your complete token needs.

## Color

Color has specific requirements for accessibility. This color token model is designed to provide the flexibility you need in crafting your visual design, while ensuring that design will always meet contrast requirements. This includes bonuses like automatic support for dark mode and increased contrast preferences.

Most color tokens come as an interactive set for rest, hover, active, and focus states.

### Usage behavior

Color tokens are named for semantic use cases:

#### Safety

A special use case that can be thought of as a placeholder for increased contrast scenarios. Primarily intended for a stroke that's transparent until someone prefers increased contrast.

#### Stealth

Has no color at rest, typically a subtle color on hover or active.

Has no accessibility configuration relative to its context.

#### Subtle

Has a subtle color at rest, typically with a slight increase or decrease on hover or active.

Has no accessibility configuration relative to its context.

#### Discernible

Considered to be discernible from a contrast perspective. Intended for use as a component bounding outline or for large text.

Meets accessibility requirements for 3:1 contrast relative to its context in AA mode. Increases to 4.5:1 in AAA mode.

#### Readable

Considered to be readable from a contrast perspective. Safe for use on small text. With a low saturation palette (neutral) this will read as "hint" or "placeholder" text.

Meets accessibility requirements for 4.5:1 contrast relative to its context in AA mode. Increases to 7:1 in AAA mode.

#### Strong

Considered to be readable from a contrast perspective. Intended for use on small or body text, having more contrast than "Readable", and tends to appear as "black".

### Application

Color tokens based on the above usage behaviors are split by intended application:

#### Fill

Fills are intended to cover large areas. Because of the large coverage area, it takes less of a change for hover or active state to notice.

#### Stroke

Strokes are intended for lines, icons, or text. Because of the smaller coverage area, it takes more of a change for hover or active states to notice.

### Availability

The combinations of recipes currently implemented:

|                    | Safety | Stealth | Subtle | Discernible (3:1) | Readable (4.5:1) | Strong |
| ------------------ | ------ | ------- | ------ | ----------------- | ---------------- | ------ |
| Neutral fill       | -      | ✓       | ✓      | ✓                | ✓                | -      |
| Neutral stroke     | ✓      | ✓       | ✓      | ✓                | ✓                | ✓      |
| Accent fill        | -      | ✓       | ✓      | ✓                 | ✓                | -      |
| Accent stroke      | ✓      | ✓       | ✓      | ✓                 | ✓                | ✓      |

✓ = implemented

\- = not applicable
