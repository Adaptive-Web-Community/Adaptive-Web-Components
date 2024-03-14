import { styled } from '@mui/system';
import { Button as BaseButton } from '@mui/base/Button';


// TODO: This is just showing a simple example. 
// We would likely use the useButton hook with the styles. 



export const Button = styled(BaseButton)(
    ({ theme }) => `
    cursor: pointer;
    border-top-left-radius: var(--corner-radius-control);
    border-top-right-radius: var(--corner-radius-control);
    border-bottom-right-radius: var(--corner-radius-control);
    border-bottom-left-radius: var(--corner-radius-control);
    padding-top: var(--density_control-vertical-padding);
    padding-right: var(--density_control-horizontal-padding);
    padding-bottom: var(--density_control-vertical-padding);
    padding-left: var(--density_control-horizontal-padding);
    gap: var(--density_control-horizontal-gap);
    font-family: var(--font-family);
    font-size: var(--type-ramp-base-font-size);
    line-height: var(--type-ramp-base-line-height);
    font-weight: var(--font-weight);
    font-variation-settings: var(--type-ramp-base-font-variations);
    background-color: var(--neutral-fill-subtle-rest);
    color: var(--neutral-stroke-strong-on-neutral-fill-subtle-rest);
    fill: currentcolor;
  
    border-top-width: var(--stroke-thickness);
    border-right-width: var(--stroke-thickness);
    border-bottom-width: var(--stroke-thickness);
    border-left-width: var(--stroke-thickness);
    border-style: solid;

    &[variant='normal'] {
        border-top-color: var(--neutral-stroke-subtle-rest);
        border-right-color: var(--neutral-stroke-subtle-rest);
        border-bottom-color: var(--neutral-stroke-subtle-rest);
        border-left-color: var(--neutral-stroke-subtle-rest);
      
        &:hover {
            background-color: var(--neutral-fill-subtle-hover);
            color: var(--neutral-stroke-strong-on-neutral-fill-subtle-hover);
            border-top-color: var(--neutral-stroke-subtle-hover);
            border-right-color: var(--neutral-stroke-subtle-hover);
            border-bottom-color: var(--neutral-stroke-subtle-hover);
            border-left-color: var(--neutral-stroke-subtle-hover);
        }
      
        &:active {
            background-color: var(--neutral-fill-subtle-active);
            color: var(--neutral-stroke-strong-on-neutral-fill-subtle-active);
            border-top-color: var(--neutral-stroke-subtle-active);
            border-right-color: var(--neutral-stroke-subtle-active);
            border-bottom-color: var(--neutral-stroke-subtle-active);
            border-left-color: var(--neutral-stroke-subtle-active);
        }
      
        &:focus-visible {
            background-color: var(--neutral-fill-subtle-focus);
            color: var(--neutral-stroke-strong-on-neutral-fill-subtle-focus);
            border-top-color: var(--neutral-stroke-subtle-focus);
            border-right-color: var(--neutral-stroke-subtle-focus);
            border-bottom-color: var(--neutral-stroke-subtle-focus);
            border-left-color: var(--neutral-stroke-subtle-focus);
        }
      
        &.base--disabled {
            cursor: not-allowed;
            background-color: var(--neutral-fill-subtle-disabled);
            color: var(--neutral-stroke-strong-on-neutral-fill-subtle-disabled);
            border-top-color: var(--neutral-stroke-subtle-disabled);
            border-right-color: var(--neutral-stroke-subtle-disabled);
            border-bottom-color: var(--neutral-stroke-subtle-disabled);
            border-left-color: var(--neutral-stroke-subtle-disabled);
        }
    }
  `,
);