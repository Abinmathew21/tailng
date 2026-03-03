export type TngPlaygroundCategory =
  | 'navigation'
  | 'form'
  | 'layout'
  | 'overlay'
  | 'feedback'
  | 'utility'
  | 'other';

export type TngPlaygroundItem = Readonly<{
  path: string;
  title: string;
  description: string;
  category: TngPlaygroundCategory;
}>;

export type TngCategoryGroup = Readonly<{
  category: TngPlaygroundCategory;
  label: string;
  items: readonly TngPlaygroundItem[];
}>;

export const ALL_PLAYGROUND_ITEMS: readonly TngPlaygroundItem[] = Object.freeze([
  { path: '/theme', title: 'Theme', description: 'Switch presets/modes and inspect semantic tokens.', category: 'other' },
  { path: '/button', title: 'Button', description: 'Test primitive behavior and owned component styles.', category: 'utility' },
  { path: '/copy', title: 'Copy', description: 'Copy payloads from direct text or DOM sources.', category: 'utility' },
  { path: '/code-block', title: 'Code Block', description: 'Adapter-ready syntax highlighting.', category: 'utility' },
  { path: '/accordion', title: 'Accordion', description: 'Expand/collapse panels.', category: 'layout' },
  { path: '/collapsible', title: 'Collapsible', description: 'Single disclosure panel.', category: 'layout' },
  { path: '/menu', title: 'Menu', description: 'Keyboard navigation for menuitem actions.', category: 'navigation' },
  { path: '/dropdown-menu', title: 'Dropdown Menu', description: 'Triggered menu panel.', category: 'navigation' },
  { path: '/avatar', title: 'Avatar', description: 'User identity display.', category: 'utility' },
  { path: '/card', title: 'Card', description: 'Validate card primitives.', category: 'layout' },
  { path: '/tag', title: 'Tag', description: 'Compact status/count labels.', category: 'utility' },
  { path: '/badge', title: 'Badge', description: 'Notification indicator.', category: 'utility' },
  { path: '/separator', title: 'Separator', description: 'Horizontal and vertical dividers.', category: 'layout' },
  { path: '/empty', title: 'Empty', description: 'Empty-state layout.', category: 'feedback' },
  { path: '/progress-bar', title: 'Progress Bar', description: 'Linear progress indicators.', category: 'feedback' },
  { path: '/progress-spinner', title: 'Progress Spinner', description: 'Circular loader.', category: 'feedback' },
  { path: '/skeleton', title: 'Skeleton', description: 'Loading placeholder blocks.', category: 'feedback' },
  { path: '/input', title: 'Input', description: 'Input primitive and wrapper.', category: 'form' },
  { path: '/label', title: 'Label', description: 'Accessible form labels.', category: 'form' },
  { path: '/input-otp', title: 'Input OTP', description: 'Segmented OTP entry.', category: 'form' },
  { path: '/radio', title: 'Radio', description: 'Grouped single-select behavior.', category: 'form' },
  { path: '/checkbox', title: 'Checkbox', description: 'Checked/unchecked/mixed tri-state.', category: 'form' },
  { path: '/textarea', title: 'Textarea', description: 'Multiline text input.', category: 'form' },
  { path: '/icons', title: 'Icon', description: 'Icon library with Lucide integration.', category: 'utility' },
  { path: '/charts-country-metrics', title: 'Charts', description: 'Country metrics with bar/line chart.', category: 'other' },
  { path: '/listbox', title: 'ListBox', description: 'CDK keyboard and multi-select.', category: 'form' },
  { path: '/dialog', title: 'Dialog', description: 'Backdrop, focus-trap.', category: 'overlay' },
  { path: '/popover', title: 'Popover', description: 'Trigger semantics and dismissal.', category: 'overlay' },
  { path: '/tooltip', title: 'Tooltip', description: 'Hover/focus helper text.', category: 'overlay' },
  { path: '/toast', title: 'Toast', description: 'Notification system.', category: 'feedback' },
  { path: '/context-menu', title: 'Context Menu', description: 'Context-triggered actions.', category: 'navigation' },
  { path: '/menubar', title: 'Menubar', description: 'Horizontal menu surface.', category: 'navigation' },
  { path: '/navigation-menu', title: 'Navigation Menu', description: 'Structured navigation list.', category: 'navigation' },
  { path: '/breadcrumb', title: 'Breadcrumb', description: 'Hierarchical navigation trail.', category: 'navigation' },
  { path: '/toolbar', title: 'Toolbar', description: 'Action controls grouping.', category: 'navigation' },
  { path: '/tabs', title: 'Tabs', description: 'Tabbed container surface.', category: 'navigation' },
  { path: '/stepper', title: 'Stepper', description: 'Multi-step flow surface.', category: 'layout' },
  { path: '/toggle-group', title: 'Toggle Group', description: 'Grouped toggle controls.', category: 'form' },
  { path: '/button-toggle', title: 'Button Toggle', description: 'Toggleable button options.', category: 'form' },
  { path: '/switch', title: 'Switch', description: 'Two-state on/off control.', category: 'form' },
  { path: '/toggle', title: 'Toggle', description: 'Icon-style pressed button.', category: 'form' },
  { path: '/slider', title: 'Slider', description: 'Range-based input.', category: 'form' },
  { path: '/chips', title: 'Chips', description: 'Compact item set.', category: 'form' },
  { path: '/combobox', title: 'Combobox', description: 'Text input with options popup.', category: 'form' },
  { path: '/select', title: 'Select', description: 'Single-choice dropdown.', category: 'form' },
  { path: '/autocomplete', title: 'Autocomplete', description: 'Dynamic suggestion list.', category: 'form' },
  {
    path: '/multi-autocomplete',
    title: 'Multi Autocomplete',
    description: 'Chips input with multi-select suggestions.',
    category: 'form',
  },
  { path: '/multiselect', title: 'Multiselect', description: 'Multiple-choice listbox.', category: 'form' },
  { path: '/grid', title: 'Grid', description: 'Keyboard-navigable grid.', category: 'layout' },
  { path: '/tree', title: 'Tree', description: 'Hierarchical expandable list.', category: 'layout' },
  { path: '/drawer', title: 'Drawer', description: 'Slide-in overlay panel.', category: 'layout' },
  { path: '/bottom-sheet', title: 'Bottom Sheet', description: 'Partial-height overlay sheet.', category: 'layout' },
]);

export const CATEGORY_LABELS: Readonly<Record<TngPlaygroundCategory, string>> = {
  navigation: 'Navigation',
  form: 'Form',
  layout: 'Layout',
  overlay: 'Overlay',
  feedback: 'Feedback',
  utility: 'Utility',
  other: 'Other',
};

export const CATEGORY_ORDER: readonly TngPlaygroundCategory[] = [
  'navigation',
  'form',
  'layout',
  'overlay',
  'feedback',
  'utility',
  'other',
];
