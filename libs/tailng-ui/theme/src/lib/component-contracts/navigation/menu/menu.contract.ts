/**
 * TailNG Menu — minimal style contract
 *
 * Scope: primitive menu directives styled strictly through `data-slot`,
 * ARIA attributes, and the menu host state attributes emitted by the primitive.
 */

export const tngMenuSlots = {
  root: 'menu',
  trigger: 'menu-trigger',
  item: 'menu-item',
  separator: 'menu-separator',
  groupLabel: 'menu-group-label',
  backdrop: 'menu-backdrop',
} as const;

export type TngMenuSlot = (typeof tngMenuSlots)[keyof typeof tngMenuSlots];

export const tngMenuHostStates = {
  state: 'data-state',
  hidden: 'hidden',
} as const;

export const tngMenuItemStates = {
  disabled: 'aria-disabled',
  checked: 'aria-checked',
  expanded: 'aria-expanded',
  hasPopup: 'aria-haspopup',
} as const;

export const tngMenuCssVars = {
  radius: '--tng-menu-radius',
  padding: '--tng-menu-padding',
  itemPaddingY: '--tng-menu-item-py',
  itemPaddingX: '--tng-menu-item-px',
  shadow: '--tng-menu-shadow',
} as const;

export const tngMenuSemanticTokens = {
  bg: '--tng-semantic-background-base',
  surface: '--tng-semantic-background-surface',
  canvas: '--tng-semantic-background-canvas',
  fg: '--tng-semantic-foreground-primary',
  fgMuted: '--tng-semantic-foreground-secondary',
  border: '--tng-semantic-border-subtle',
  borderStrong: '--tng-semantic-border-strong',
  brand: '--tng-semantic-accent-brand',
  focus: '--tng-semantic-focus-ring',
} as const;
