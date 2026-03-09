/**
 * TailNG Input — minimal style contract
 *
 * Scope: primitives layer (tngInput directive + tngInputGroup component)
 * Styling must only rely on:
 *  - slot attributes:  data-slot="..."
 *  - state attributes: data-has-leading / data-has-trailing / data-disabled / data-invalid / data-readonly / data-focused
 *
 * No tag selectors. No DOM assumptions beyond slot names.
 */

export const tngInputSlots = {
  /** Host element of the group component (<tng-input-group> or [tngInputGroup]) */
  group: 'input-group',

  /** Slot applied by the tngInput directive on the native <input>/<textarea> */
  control: 'input',

  /** Wrappers rendered by group (only when the slot exists) */
  leadingWrap: 'input-group-leading',
  controlWrap: 'input-group-control',
  trailingWrap: 'input-group-trailing',

  /** Slot markers applied by directives on projected content */
  leading: 'input-leading',
  trailing: 'input-trailing',

  /**
   * Optional: if you ever reintroduce a styled wrapper component later.
   * Keep in contract so themes can share rules safely.
   */
  field: 'input-field',
} as const;

export type TngInputSlot = (typeof tngInputSlots)[keyof typeof tngInputSlots];

export const tngInputHostStates = {
  /** Presence: group has at least one leading slot marker projected */
  hasLeading: 'data-has-leading',

  /** Presence: group has at least one trailing slot marker projected */
  hasTrailing: 'data-has-trailing',

  /** Presence: derived from primary control disabled() */
  disabled: 'data-disabled',

  /** Presence: derived from primary control isInvalid() */
  invalid: 'data-invalid',

  /** Presence: derived from primary control readonly() */
  readonly: 'data-readonly',

  /** Presence: managed by group focusin/focusout tracking */
  focused: 'data-focused',
} as const;

/**
 * Optional wrapper-level tokens (only relevant if a wrapper exists).
 * Keeping them here helps future-proof theme packs.
 */
export const tngInputFieldTokens = {
  appearance: 'data-appearance', // "outline" | "solid" | "ghost"
  size: 'data-size', // "sm" | "md" | "lg"
  tone: 'data-tone', // "neutral" | "primary" | "success" | "danger"
  fullWidth: 'data-full-width', // presence
} as const;

/**
 * CSS custom properties the theme may define for Input.
 */
export const tngInputCssVars = {
  radius: '--tng-input-radius',
  minHeight: '--tng-input-min-height',
  paddingY: '--tng-input-py',
  paddingX: '--tng-input-px',

  leadingGap: '--tng-input-leading-gap',
  trailingGap: '--tng-input-trailing-gap',

  focusRing: '--tng-input-focus-ring', // allows override of focus ring strength
} as const;

/**
 * Semantic tokens referenced by the default theme CSS.
 */
export const tngInputSemanticTokens = {
  bg: '--tng-semantic-background-surface',
  fg: '--tng-semantic-foreground-primary',
  fgMuted: '--tng-semantic-foreground-muted',
  border: '--tng-semantic-border-strong',
  focus: '--tng-semantic-focus-ring',
  danger: '--tng-semantic-accent-danger',
} as const;