/**
 * TailNG Menubar — minimal style contract
 *
 * Scope: primitive menubar directives styled strictly through `data-slot`
 * and ARIA/state attributes emitted by the primitive.
 */

export const tngMenubarSlots = {
  root: 'menubar',
  item: 'menubar-item',
} as const;

export type TngMenubarSlot = (typeof tngMenubarSlots)[keyof typeof tngMenubarSlots];

export const tngMenubarHostStates = {
  orientation: 'aria-orientation',
} as const;

export const tngMenubarItemStates = {
  disabled: 'aria-disabled',
  expanded: 'aria-expanded',
  hasPopup: 'aria-haspopup',
} as const;

export const tngMenubarCssVars = {
  radius: '--tng-menubar-radius',
  padding: '--tng-menubar-padding',
  itemPaddingX: '--tng-menubar-item-px',
} as const;

export const tngMenubarSemanticTokens = {
  surface: '--tng-semantic-background-surface',
  canvas: '--tng-semantic-background-canvas',
  fg: '--tng-semantic-foreground-primary',
  fgMuted: '--tng-semantic-foreground-secondary',
  border: '--tng-semantic-border-subtle',
  borderStrong: '--tng-semantic-border-strong',
  brand: '--tng-semantic-accent-brand',
  focus: '--tng-semantic-focus-ring',
} as const;
