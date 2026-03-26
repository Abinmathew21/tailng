import { tngInputCssVars, tngInputHostStates, tngInputSlots } from '../input/input.contract';

/**
 * TailNG Form Field — public shell style contract
 *
 * Scope: component layer (`<tng-form-field>` and wrappers such as `<tng-input>`)
 * The form-field contract composes the primitive input slots/states and exposes
 * the host-level appearance variants that map onto the primitive CSS vars.
 */

export const tngFormFieldSlots = {
  root: 'form-field-wrapper',
  group: tngInputSlots.group,
  control: tngInputSlots.control,
  leadingWrap: tngInputSlots.leadingWrap,
  controlWrap: tngInputSlots.controlWrap,
  trailingWrap: tngInputSlots.trailingWrap,
  leading: tngInputSlots.leading,
  trailing: tngInputSlots.trailing,
} as const;

export type TngFormFieldSlot = (typeof tngFormFieldSlots)[keyof typeof tngFormFieldSlots];

export const tngFormFieldHostAttrs = {
  appearance: 'data-appearance',
  size: 'data-size',
  tone: 'data-tone',
  fullWidth: 'data-full-width',
} as const;

export const tngFormFieldStates = {
  disabled: tngInputHostStates.disabled,
  invalid: tngInputHostStates.invalid,
  readonly: tngInputHostStates.readonly,
  focused: tngInputHostStates.focused,
  hasLeading: tngInputHostStates.hasLeading,
  hasTrailing: tngInputHostStates.hasTrailing,
} as const;

/**
 * Form-field variants are expressed by assigning the primitive input vars.
 */
export const tngFormFieldCssVars = {
  bg: tngInputCssVars.bg,
  border: tngInputCssVars.border,
  fg: tngInputCssVars.fg,
  radius: tngInputCssVars.radius,
  minHeight: tngInputCssVars.minHeight,
  paddingY: tngInputCssVars.paddingY,
  paddingX: tngInputCssVars.paddingX,
  gap: tngInputCssVars.gap,
  focusRing: tngInputCssVars.focusRing,
} as const;

export const tngFormFieldSemanticTokens = {
  surface: '--tng-semantic-background-surface',
  surfaceMuted: '--tng-semantic-background-muted',
  fg: '--tng-semantic-foreground-primary',
  border: '--tng-semantic-border-strong',
  focus: '--tng-semantic-focus-ring',
  brand: '--tng-semantic-accent-brand',
  success: '--tng-semantic-accent-success',
  danger: '--tng-semantic-accent-danger',
} as const;
