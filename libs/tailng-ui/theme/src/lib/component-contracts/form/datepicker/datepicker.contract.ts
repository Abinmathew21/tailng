/**
 * TailNG Datepicker — headless style contract
 *
 * Scope: headless controller + primitive attribute maps rendered in app markup.
 * Styling must rely on:
 *  - slot attributes: data-slot="..."
 *  - host states: data-open / data-disabled / data-view
 *  - item states: data-active / data-selected / data-focus-visible / data-disabled
 *  - day states: data-in-month / data-in-range / data-range-start / data-range-end
 *
 * No tag selectors. No DOM assumptions beyond slot names.
 */

export const tngDatepickerSlots = {
  root: 'datepicker',
  field: 'datepicker-field',
  inputShell: 'datepicker-input-shell',
  input: 'datepicker-input',
  trigger: 'datepicker-trigger',
  overlay: 'datepicker-overlay',
  header: 'datepicker-header',
  navButton: 'datepicker-nav-button',
  periodButton: 'datepicker-period-button',
  viewSwitcher: 'datepicker-view-switcher',
  viewChip: 'datepicker-view-chip',
  weekdays: 'datepicker-weekdays',
  weekday: 'datepicker-weekday',
  grid: 'datepicker-grid',
  cell: 'datepicker-cell',
  month: 'datepicker-month',
  year: 'datepicker-year',
  footer: 'datepicker-footer',
  action: 'datepicker-action',
} as const;

export type TngDatepickerSlot = (typeof tngDatepickerSlots)[keyof typeof tngDatepickerSlots];

export const tngDatepickerHostStates = {
  open: 'data-open',
  disabled: 'data-disabled',
  view: 'data-view',
  invalid: 'data-invalid',
} as const;

export const tngDatepickerItemStates = {
  active: 'data-active',
  selected: 'data-selected',
  focusVisible: 'data-focus-visible',
  disabled: 'data-disabled',
} as const;

export const tngDatepickerDayStates = {
  inMonth: 'data-in-month',
  inRange: 'data-in-range',
  rangeStart: 'data-range-start',
  rangeEnd: 'data-range-end',
  hidden: 'data-hidden',
} as const;

export const tngDatepickerCssVars = {
  radius: '--tng-datepicker-radius',
  fieldHeight: '--tng-datepicker-field-height',
  overlayGap: '--tng-datepicker-overlay-gap',
  dayCellSize: '--tng-datepicker-day-cell-size',
  pickerCellSize: '--tng-datepicker-picker-cell-size',
  inlineGap: '--tng-datepicker-inline-gap',
  overlayPadding: '--tng-datepicker-overlay-padding',
} as const;

export const tngDatepickerSemanticTokens = {
  bg: '--tng-semantic-background-base',
  surface: '--tng-semantic-background-surface',
  canvas: '--tng-semantic-background-canvas',
  fg: '--tng-semantic-foreground-primary',
  fgMuted: '--tng-semantic-foreground-secondary',
  border: '--tng-semantic-border-subtle',
  borderStrong: '--tng-semantic-border-strong',
  brand: '--tng-semantic-accent-brand',
  danger: '--tng-semantic-accent-danger',
  focusRing: '--tng-semantic-focus-ring',
} as const;
