/**
 * TailNG Form Field — label/control/message wrapper contract.
 *
 * Scope: component layer (`<tng-form-field>`, `tngHint`, and `tngError`).
 */

export const tngFormFieldSlots = {
  root: 'form-field',
  label: 'form-field-label',
  controlRow: 'form-field-control-row',
  control: 'form-field-control',
  messages: 'form-field-messages',
  hint: 'form-field-hint',
  error: 'form-field-error',
  requiredMarker: 'form-field-required-marker',
  prefix: 'form-field-prefix',
  suffix: 'form-field-suffix',
} as const;

export type TngFormFieldSlot = (typeof tngFormFieldSlots)[keyof typeof tngFormFieldSlots];

export const tngFormFieldHostAttrs = {
  labelPosition: 'data-label-position',
  size: 'data-size',
} as const;

export const tngFormFieldStates = {
  focused: 'data-focused',
  disabled: 'data-disabled',
  invalid: 'data-invalid',
  required: 'data-required',
} as const;

export const tngFormFieldCssVars = {
  gap: '--tng-form-field-gap',
  leftGap: '--tng-form-field-left-gap',
  leftLabelWidth: '--tng-form-field-left-label-width',
  fg: '--tng-form-field-fg',
  frameBg: '--tng-form-field-frame-bg',
  frameBorder: '--tng-form-field-frame-border',
  frameFocusBorder: '--tng-form-field-frame-focus-border',
  frameFocusRing: '--tng-form-field-frame-focus-ring',
  frameInvalidBorder: '--tng-form-field-frame-invalid-border',
  frameMinHeight: '--tng-form-field-frame-min-height',
  framePx: '--tng-form-field-frame-px',
  framePy: '--tng-form-field-frame-py',
  frameRadius: '--tng-form-field-frame-radius',
  labelFg: '--tng-form-field-label-fg',
  labelFontSize: '--tng-form-field-label-font-size',
  labelFontWeight: '--tng-form-field-label-font-weight',
  outlineLabelInset: '--tng-form-field-outline-label-inset',
  outlineLabelPx: '--tng-form-field-outline-label-px',
  adornmentFg: '--tng-form-field-adornment-fg',
  adornmentFontSize: '--tng-form-field-adornment-font-size',
  adornmentGap: '--tng-form-field-adornment-gap',
  messageGap: '--tng-form-field-message-gap',
  messageFg: '--tng-form-field-message-fg',
  messageFontSize: '--tng-form-field-message-font-size',
  messageMinHeight: '--tng-form-field-message-min-height',
  requiredMarkerFg: '--tng-form-field-required-marker-fg',
} as const;
