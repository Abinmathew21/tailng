/**
 * TailNG Input — primitive style contract
 *
 * Scope: primitives layer (`tngInput` directive + `tngInputGroup` component)
 * Public wrapper components such as `<tng-input-field>` and `<tng-input>`
 * should theme the shell by setting these CSS custom properties instead of
 * restyling the primitive slots directly.
 *
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
 * CSS custom properties the theme may define for Input.
 */
export const tngInputCssVars = {
  bg: '--tng-input-bg',
  border: '--tng-input-border',
  invalidBorder: '--tng-input-invalid-border',
  fg: '--tng-input-fg',

  radius: '--tng-input-radius',
  minHeight: '--tng-input-min-height',
  paddingY: '--tng-input-py',
  paddingX: '--tng-input-px',

  gap: '--tng-input-gap',

  focusRing: '--tng-input-focus-ring',
  fontSize: '--tng-input-font-size',
  fontWeight: '--tng-input-font-weight',
  lineHeight: '--tng-input-line-height',
  placeholder: '--tng-input-placeholder',
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
