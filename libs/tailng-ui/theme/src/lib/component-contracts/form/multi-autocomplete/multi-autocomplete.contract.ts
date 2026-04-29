/**
 * TailNG Multi Autocomplete — minimal style contract
 *
 * Scope: primitive multi-autocomplete styled strictly through `data-slot`
 * and host/option state attributes.
 */

export const tngMultiAutocompleteSlots = {
  root: 'multi-autocomplete',
  trigger: 'multi-autocomplete-trigger',
  chip: 'multi-autocomplete-chip',
  content: 'multi-autocomplete-content',
  overlay: 'multi-autocomplete-overlay',
  listbox: 'multi-autocomplete-listbox',
  option: 'multi-autocomplete-option',
  empty: 'multi-autocomplete-empty',
} as const;

export type TngMultiAutocompleteSlot =
  (typeof tngMultiAutocompleteSlots)[keyof typeof tngMultiAutocompleteSlots];

export const tngMultiAutocompleteHostStates = {
  state: 'data-state',
  disabled: 'data-disabled',
  loading: 'data-loading',
  invalid: 'data-invalid',
} as const;

export const tngMultiAutocompleteOptionStates = {
  active: 'data-active',
  selected: 'data-selected',
  disabled: 'data-disabled',
} as const;

export const tngMultiAutocompleteCssVars = {
  radius: '--tng-multi-autocomplete-radius',
  padding: '--tng-multi-autocomplete-padding',
  triggerPaddingY: '--tng-multi-autocomplete-trigger-py',
  triggerPaddingX: '--tng-multi-autocomplete-trigger-px',
  chipPaddingY: '--tng-multi-autocomplete-chip-py',
  chipPaddingX: '--tng-multi-autocomplete-chip-px',
  optionPaddingY: '--tng-multi-autocomplete-option-py',
  optionPaddingX: '--tng-multi-autocomplete-option-px',
  zOverlay: '--tng-multi-autocomplete-z-overlay',
  overlayZIndex: '--tng-multi-autocomplete-overlay-z-index',
} as const;

export const tngMultiAutocompleteSemanticTokens = {
  bg: '--tng-semantic-background-base',
  surface: '--tng-semantic-background-surface',
  canvas: '--tng-semantic-background-canvas',
  fg: '--tng-semantic-foreground-primary',
  fgMuted: '--tng-semantic-foreground-secondary',
  border: '--tng-semantic-border-subtle',
  brand: '--tng-semantic-accent-brand',
  danger: '--tng-semantic-accent-danger',
  focus: '--tng-semantic-focus-ring',
} as const;
