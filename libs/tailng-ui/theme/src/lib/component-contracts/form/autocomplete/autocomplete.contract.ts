// libs/tailng-ui/theme/src/lib/component-contracts/form/autocomplete/autocomplete.contract.ts

/**
 * TailNG Autocomplete — minimal style contract
 *
 * Scope: component-layer <tng-autocomplete> that renders primitives with `data-slot`.
 * Styling must only rely on:
 *  - slot attributes:  data-slot="..."
 *  - state attributes: data-state / data-disabled / data-loading / data-invalid
 *  - option state attrs: data-active / data-selected / data-disabled
 *
 * No tag selectors. No DOM assumptions beyond slot names.
 */

export const tngAutocompleteSlots = {
  root: 'autocomplete',
  trigger: 'autocomplete-trigger',
  triggerContainer: 'autocomplete-trigger-container',
  icon: 'autocomplete-icon',
  content: 'autocomplete-content',
  overlay: 'autocomplete-overlay',
  listbox: 'autocomplete-listbox',
  option: 'autocomplete-option',
  empty: 'autocomplete-empty',
} as const;

export type TngAutocompleteSlot = (typeof tngAutocompleteSlots)[keyof typeof tngAutocompleteSlots];

export const tngAutocompleteHostStates = {
  state: 'data-state', // "open" | "closed"
  disabled: 'data-disabled', // presence
  loading: 'data-loading', // presence
  invalid: 'data-invalid', // presence
} as const;

export const tngAutocompleteOptionStates = {
  active: 'data-active', // presence
  selected: 'data-selected', // presence
  disabled: 'data-disabled', // presence (option-level)
} as const;

/**
 * CSS custom properties the theme may define for Autocomplete.
 */
export const tngAutocompleteCssVars = {
  radius: '--tng-autocomplete-radius',
  triggerPaddingY: '--tng-autocomplete-trigger-py',
  triggerPaddingX: '--tng-autocomplete-trigger-px',
  optionPaddingY: '--tng-autocomplete-option-py',
  optionPaddingX: '--tng-autocomplete-option-px',
  /**
   * Overlay min-width: overlay should be at least trigger width.
   * Set by overlay primitive at runtime.
   */
  triggerWidth: '--tng-autocomplete-trigger-width',
} as const;

/**
 * Semantic tokens referenced by the default theme CSS.
 */
export const tngAutocompleteSemanticTokens = {
  bg: '--tng-semantic-background-surface',
  surface: '--tng-semantic-background-surface',
  canvas: '--tng-semantic-background-canvas',
  fg: '--tng-semantic-foreground-primary',
  fgMuted: '--tng-semantic-foreground-secondary',
  border: '--tng-semantic-border-subtle',
  brand: '--tng-semantic-accent-brand',
  danger: '--tng-semantic-accent-danger',
} as const;
