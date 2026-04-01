import type { DocsSectionRailItem } from '../section-rail/docs-section-rail.component';

export type DocsComponentTopLevelSectionId = 'overview' | 'api' | 'styling' | 'examples' | 'ownable-install';

export const docsComponentOutlineItemsBySlug: Readonly<Record<string, Partial<Record<DocsComponentTopLevelSectionId, readonly DocsSectionRailItem[]>>>> = {
  'accordion': {
    'overview': [
      { id: 'imports', label: 'Imports' },
      { id: 'faq-variants', label: 'FAQ variants' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    'api': [
      { id: 'primitive-composition', label: 'Primitive composition' },
      { id: 'wrapper-composition', label: 'Wrapper composition' },
      { id: 'outputs', label: 'Outputs' },
    ],
    'styling': [
      { id: 'state-hooks', label: 'State hooks' },
      { id: 'css-starter', label: 'CSS starter' },
    ],
    'examples': [
      { id: 'single-mode-faq', label: 'Single-mode FAQ' },
      { id: 'multiple-mode-settings', label: 'Multiple mode settings' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  'autocomplete': {
    'overview': [
      { id: 'imports', label: 'Imports' },
      { id: 'country-filter-variants', label: 'Country filter variants' },
      { id: 'behavior-baseline', label: 'Behavior baseline' },
    ],
    'api': [
      { id: 'tngautocomplete-parts-primitive', label: 'tngAutocomplete + parts (primitive)' },
      { id: 'tng-autocomplete-styled-component', label: 'tng-autocomplete (styled component)' },
    ],
    'styling': [
      { id: 'css-contract-table', label: 'CSS contract table' },
      { id: 'example-style-contract', label: 'Example style contract' },
    ],
    'examples': [
      { id: 'playground-parity-demo', label: 'Playground parity demo' },
      { id: 'country-filter-variants', label: 'Country filter variants' },
      { id: 'repository-search-variants', label: 'Repository search variants' },
      { id: 'state-presentation', label: 'State presentation' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  'avatar': {
    'overview': [
      { id: 'imports', label: 'Imports' },
      { id: 'usage-patterns', label: 'Usage patterns' },
      { id: 'style-variants', label: 'Style variants' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    'api': [
      { id: 'component-inputs', label: 'Component inputs' },
      { id: 'headless-primitives', label: 'Headless primitives' },
    ],
    'styling': [
      { id: 'state-and-variant-hooks', label: 'State and variant hooks' },
      { id: 'common-selectors', label: 'Common selectors' },
      { id: 'example-contract-overrides', label: 'Example contract overrides' },
    ],
    'examples': [
      { id: 'example-1-team-roster', label: 'Example 1: Team roster' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  'badge': {
    'overview': [
      { id: 'imports', label: 'Imports' },
      { id: 'usage-patterns', label: 'Usage patterns' },
      { id: 'style-variants', label: 'Style variants' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    'api': [
      { id: 'directive-inputs', label: 'Directive inputs' },
      { id: 'outputs-and-methods', label: 'Outputs and methods' },
    ],
    'styling': [
      { id: 'state-and-variant-hooks', label: 'State and variant hooks' },
      { id: 'class-hooks', label: 'Class hooks' },
      { id: 'example-contract-overrides', label: 'Example contract overrides' },
    ],
    'examples': [
      { id: 'example-1-notification-counts-and-caps', label: 'Example 1: Notification counts and caps' },
      { id: 'example-2-placement-and-host-sizing', label: 'Example 2: Placement and host sizing' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  'breadcrumb': {
    'overview': [
      { id: 'imports', label: 'Imports' },
      { id: 'style-variants', label: 'Style variants' },
      { id: 'keyboard-and-accessibility-baseline', label: 'Keyboard and accessibility baseline' },
    ],
    'api': [
      { id: 'wrapper-apis', label: 'Wrapper APIs' },
      { id: 'primitive-directives', label: 'Primitive directives' },
      { id: 'data-attributes-from-wrapper-items', label: 'Data attributes from wrapper items' },
    ],
    'styling': [
      { id: 'primitive-slot-selectors', label: 'Primitive slot selectors' },
      { id: 'wrapper-state-hooks', label: 'Wrapper state hooks' },
      { id: 'practical-guidance', label: 'Practical guidance' },
    ],
    'examples': [
      { id: 'collapsed-long-path', label: 'Collapsed long path' },
      { id: 'current-link-and-disabled-segments', label: 'Current-link and disabled segments' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  'button': {
    'overview': [
      { id: 'imports', label: 'Imports' },
      { id: 'usage-patterns', label: 'Usage patterns' },
      { id: 'style-variants', label: 'Style variants' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    'api': [
      { id: 'wrapper-inputs-and-lt-tng-button-and-gt', label: 'Wrapper inputs (&lt;tng-button&gt;)' },
      { id: 'primitive-inputs-tngpress', label: 'Primitive inputs (tngPress)' },
      { id: 'behavior-notes', label: 'Behavior notes' },
    ],
    'styling': [
      { id: 'wrapper-state-hooks', label: 'Wrapper state hooks' },
      { id: 'primitive-host-behavior', label: 'Primitive host behavior' },
      { id: 'contract-css-snippet', label: 'Contract CSS snippet' },
    ],
    'examples': [
      { id: 'example-1-action-row', label: 'Example 1: Action row' },
      { id: 'example-2-menu-trigger-semantics', label: 'Example 2: Menu trigger semantics' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  'button-toggle': {
    'overview': [
      { id: 'imports', label: 'Imports' },
      { id: 'usage-patterns', label: 'Usage patterns' },
      { id: 'style-variants', label: 'Style variants' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    'api': [
      { id: 'primitive-contract', label: 'Primitive contract' },
      { id: 'component-group-api', label: 'tng-button-toggle-group' },
      { id: 'component-item-api', label: 'tng-button-toggle' },
    ],
    'styling': [
      { id: 'css-contract-table', label: 'CSS contract table' },
      { id: 'user-scenario-style-examples', label: 'User scenario style examples' },
    ],
    'examples': [
      { id: 'single-select-alignment-controls', label: 'Single-select alignment controls' },
      { id: 'multiple-select-text-style-toolbar', label: 'Multiple-select text-style toolbar' },
    ],
  },
  'card': {
    'overview': [
      { id: 'imports', label: 'Imports' },
      { id: 'release-status', label: 'Release status' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    'api': [
      { id: 'tngcard-and-slot-directives-primitives', label: 'tngCard and slot directives (primitives)' },
      { id: 'tng-card-wrappers-components', label: 'tng-card wrappers (components)' },
    ],
    'styling': [
      { id: 'state-and-slot-hooks', label: 'State and slot hooks' },
      { id: 'css-starter', label: 'CSS starter' },
    ],
    'examples': [
      { id: 'ava-mathews', label: 'Ava Mathews' },
      { id: 'billing-reminder', label: 'Billing reminder' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  'checkbox': {
    'overview': [
      { id: 'imports', label: 'Imports' },
      { id: 'usage-patterns', label: 'Usage patterns' },
      { id: 'style-variants', label: 'Style variants' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    'api': [
      { id: 'tngcheckbox-directive', label: 'tngCheckbox (directive)' },
      { id: 'tng-checkbox-styled-component', label: 'tng-checkbox (styled component)' },
    ],
    'styling': [
      { id: 'css-contract-table', label: 'CSS contract table' },
      { id: 'user-scenario-style-examples', label: 'User scenario style examples' },
    ],
    'examples': [
      { id: 'consent-and-readonly-policy', label: 'Consent and readonly policy' },
      { id: 'tri-state-select-all', label: 'Tri-state select-all' },
      { id: 'validation-emphasis', label: 'Validation emphasis' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  'chips': {
    'overview': [
      { id: 'imports', label: 'Imports' },
      { id: 'removable-chip-list-variants', label: 'Removable chip list variants' },
      { id: 'disabled-chip-variants', label: 'Disabled chip variants' },
    ],
    'api': [
      { id: 'root-tngchips', label: 'Root (`tngChips`)' },
      { id: 'item-tngchip', label: 'Item (`tngChip`)' },
      { id: 'remove-control-tngchipremove', label: 'Remove control (`tngChipRemove`)' },
    ],
    'styling': [
      { id: 'state-hooks', label: 'State hooks' },
      { id: 'plain-css-example', label: 'Plain CSS example' },
    ],
    'examples': [
      { id: 'removable-chip-list-variants', label: 'Removable chip list variants' },
      { id: 'disabled-chip-variants', label: 'Disabled chip variants' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  'codeblock': {
    'overview': [
      { id: 'imports', label: 'Imports' },
      { id: 'live-preview-variants', label: 'Live preview variants' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    'api': [
      { id: 'tngcodeblock-primitive-parts', label: 'tngCodeBlock primitive parts' },
      { id: 'tng-code-block-component-inputs', label: 'tng-code-block component inputs' },
    ],
    'styling': [
      { id: 'slot-contract-table', label: 'Slot contract table' },
      { id: 'state-attributes', label: 'State attributes' },
      { id: 'example-style-contract', label: 'Example style contract' },
    ],
    'examples': [
      { id: 'style-layer-examples', label: 'Style-layer examples' },
      { id: 'shiki-adapter-rendering', label: 'Shiki adapter rendering' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  'collapsible': {
    'overview': [
      { id: 'imports', label: 'Imports' },
      { id: 'progress-indicator-variants', label: 'Progress indicator variants' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    'api': [
      { id: 'tngcollapsible-directive', label: 'tngCollapsible (directive)' },
      { id: 'tng-collapsible-component', label: 'tng-collapsible (component)' },
    ],
    'styling': [
      { id: 'state-hooks', label: 'State hooks' },
      { id: 'css-starter', label: 'CSS starter' },
    ],
    'examples': [
      { id: 'checkout-progression-variants', label: 'Checkout progression variants' },
      { id: 'release-pipeline-variants', label: 'Release pipeline variants' },
      { id: 'error-surface-variants', label: 'Error surface variants' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  'context-menu': {
    'overview': [
      { id: 'imports', label: 'Imports' },
      { id: 'usage-patterns', label: 'Usage patterns' },
      { id: 'style-variants', label: 'Style variants' },
      { id: 'keyboard-baseline', label: 'Keyboard baseline' },
    ],
    'api': [
      { id: 'wrapper-apis', label: 'Wrapper APIs' },
      { id: 'primitive-directives', label: 'Primitive directives' },
      { id: 'keyboard-contract-high-level', label: 'Keyboard contract (high level)' },
    ],
    'styling': [
      { id: 'css-contract-table', label: 'CSS contract table' },
      { id: 'example-style-contract', label: 'Example style contract' },
    ],
    'examples': [
      { id: 'operational-context-actions', label: 'Operational context actions' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  'copybutton': {
    'overview': [
      { id: 'imports', label: 'Imports' },
      { id: 'usage-patterns', label: 'Usage patterns' },
      { id: 'style-variants', label: 'Style variants' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    'api': [
      { id: 'component-inputs', label: 'Component inputs' },
      { id: 'component-outputs', label: 'Component outputs' },
      { id: 'primitive-passthrough-events', label: 'Primitive passthrough events' },
    ],
    'styling': [
      { id: 'state-and-variant-hooks', label: 'State and variant hooks' },
      { id: 'slot-selectors', label: 'Slot selectors' },
      { id: 'example-contract-overrides', label: 'Example contract overrides' },
    ],
    'examples': [
      { id: 'example-1-quick-copy-command', label: 'Example 1: Quick copy command' },
      { id: 'example-2-copy-from-target-element', label: 'Example 2: Copy from target element' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  'datepicker': {
    'overview': [
      { id: 'simple-sample', label: 'Simple sample' },
      { id: 'imports', label: 'Imports' },
      { id: 'quick-start', label: 'Quick start' },
      { id: 'headless-orchestration', label: 'Headless orchestration' },
      { id: 'behavior-baseline', label: 'Behavior baseline' },
    ],
    'api': [
      { id: 'tng-datepicker-component', label: 'tng-datepicker (component)' },
      { id: 'createdatepickercontroller-headless', label: 'createDatepickerController(...) (headless)' },
    ],
    'styling': [
      { id: 'slot-selectors', label: 'Slot selectors' },
      { id: 'state-hooks', label: 'State hooks' },
      { id: 'common-custom-properties', label: 'Common custom properties' },
      { id: 'compact-override-example', label: 'Compact override example' },
    ],
    'examples': [
      { id: 'default-wrapper', label: 'Default wrapper' },
      { id: 'custom-format', label: 'Custom format' },
      { id: 'bounded-range', label: 'Bounded range' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  'dialog': {
    'overview': [
      { id: 'imports', label: 'Imports' },
      { id: 'usage-patterns', label: 'Usage patterns' },
      { id: 'ship-this-release', label: 'Ship this release?' },
      { id: 'keyboard-baseline', label: 'Keyboard baseline' },
    ],
    'api': [
      { id: 'wrapper-apis', label: 'Wrapper APIs' },
      { id: 'primitive-directives', label: 'Primitive directives' },
      { id: 'keyboard-contract-high-level', label: 'Keyboard contract (high level)' },
    ],
    'styling': [
      { id: 'core-data-attributes', label: 'Core data attributes' },
      { id: 'reference-css', label: 'Reference CSS' },
    ],
    'examples': [
      { id: 'delete-release-branch', label: 'Delete release branch?' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  'drawer': {
    'overview': [
      { id: 'imports', label: 'Imports' },
      { id: 'drawer-variants', label: 'Drawer variants' },
      { id: 'keyboard-interaction', label: 'Keyboard interaction' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    'api': [],
    'styling': [
      { id: 'primitive-data-hooks', label: 'Primitive data hooks' },
      { id: 'component-css-classes', label: 'Component CSS classes' },
      { id: 'starter-css', label: 'Starter CSS' },
    ],
    'examples': [
      { id: 'side-navigation', label: 'Side navigation' },
      { id: 'end-details-panel', label: 'End details panel' },
      { id: 'push-mode', label: 'Push mode' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  'empty': {
    'overview': [
      { id: 'imports', label: 'Imports' },
      { id: 'no-invoices-yet', label: 'No invoices yet' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    'api': [
      { id: 'tngempty-and-part-directives', label: 'tngEmpty and part directives' },
      { id: 'tng-empty-wrappers', label: 'tng-empty wrappers' },
    ],
    'styling': [
      { id: 'slot-hooks', label: 'Slot hooks' },
    ],
    'examples': [
      { id: 'no-search-results', label: 'No search results' },
      { id: 'welcome-to-workspace-setup', label: 'Welcome to workspace setup' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  'input': {
    'overview': [
      { id: 'what-you-get', label: 'What you get' },
      { id: 'simple-examples', label: 'Simple examples' },
      { id: 'installation', label: 'Installation' },
      { id: 'basic-usage', label: 'Basic usage' },
      { id: 'structure', label: 'Structure' },
      { id: 'accessibility-guidance', label: 'Accessibility guidance' },
      { id: 'validation-patterns', label: 'Validation patterns' },
      { id: 'examples', label: 'Examples' },
      { id: 'common-pitfalls', label: 'Common pitfalls' },
      { id: 'testing-notes', label: 'Testing notes' },
    ],
    'api': [
      { id: 'tng-input-component', label: '&lt;tng-input&gt;' },
      { id: 'tng-form-field', label: '&lt;tng-form-field&gt;' },
      { id: 'tng-input-directive', label: 'tngInput (directive)' },
      { id: 'slot-directives', label: 'Slot directives' },
    ],
    'styling': [
      { id: 'css-contracts', label: 'CSS contracts' },
      { id: 'shell-state-hooks', label: 'Shell state hooks' },
      { id: 'theme-contract-tokens', label: 'Theme contract tokens' },
      { id: 'user-scenario-style-examples', label: 'User scenario style examples' },
      { id: 'different-styling-pattern-examples', label: 'Different styling pattern examples' },
    ],
    'examples': [
      { id: 'basic-text-field', label: 'Basic text field' },
      { id: 'type-variants', label: 'Type variants' },
      { id: 'validation-feedback', label: 'Validation feedback' },
      { id: 'readonly-and-disabled-states', label: 'Readonly and disabled states' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  'form-field': {
    'overview': [
      { id: 'what-form-field-does', label: 'What form field does' },
      { id: 'simple-examples', label: 'Simple examples' },
      { id: 'installation', label: 'Installation' },
      { id: 'basic-composition', label: 'Basic composition' },
      { id: 'relationship-to-input-component', label: 'Relationship to input component' },
      { id: 'accessibility-guidance', label: 'Accessibility guidance' },
    ],
    'api': [
      { id: 'tng-form-field-component', label: '&lt;tng-form-field&gt;' },
      { id: 'projected-control-contract', label: 'Projected control contract' },
      { id: 'slot-directives', label: 'Slot directives' },
    ],
    'styling': [
      { id: 'css-contracts', label: 'CSS contracts' },
      { id: 'shell-state-hooks', label: 'Shell state hooks' },
      { id: 'user-scenario-style-examples', label: 'User scenario style examples' },
      { id: 'different-styling-pattern-examples', label: 'Different styling pattern examples' },
    ],
    'examples': [
      { id: 'global-search-field', label: 'Global search field' },
      { id: 'workspace-slug-field', label: 'Workspace slug field' },
      { id: 'clear-action-field', label: 'Clear action field' },
    ],
  },
  'input-otp': {
    'overview': [
      { id: 'imports', label: 'Imports' },
      { id: 'verification-code-variants', label: 'Verification code variants' },
      { id: 'behavior-baseline', label: 'Behavior baseline' },
    ],
    'api': [
      { id: 'tnginputotp-primitive', label: 'tngInputOtp primitive' },
      { id: 'and-lt-tng-input-otp-and-gt-wrapper', label: '&lt;tng-input-otp&gt; wrapper' },
      { id: 'angular-forms-integration', label: 'Angular forms integration' },
    ],
    'styling': [
      { id: 'recommended-hooks', label: 'Recommended hooks' },
    ],
    'examples': [
      { id: 'verification-otp-patterns', label: 'Verification OTP patterns' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  'label': {
    'overview': [
      { id: 'imports', label: 'Imports' },
      { id: 'label-variants', label: 'Label variants' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    'api': [
      { id: 'primitive-label-tnglabel', label: 'Primitive: label[tngLabel]' },
      { id: 'component-and-lt-tng-label-and-gt', label: 'Component: &lt;tng-label&gt;' },
      { id: 'state-attributes', label: 'State attributes' },
    ],
    'styling': [
      { id: 'state-hooks', label: 'State hooks' },
      { id: 'suggested-css-baseline', label: 'Suggested CSS baseline' },
    ],
    'examples': [
      { id: 'association-patterns', label: 'Association patterns' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  'listbox': {
    'overview': [
      { id: 'imports', label: 'Imports' },
      { id: 'usage-baseline', label: 'Usage baseline' },
      { id: 'listbox-variants', label: 'Listbox variants' },
      { id: 'behavior-baseline', label: 'Behavior baseline' },
    ],
    'api': [
      { id: 'tnglistbox-tngoption', label: 'tngListbox + tngOption' },
      { id: 'wrapper-status', label: 'Wrapper status' },
    ],
    'styling': [
      { id: 'css-contract-table', label: 'CSS contract table' },
      { id: 'example-style-contract', label: 'Example style contract' },
    ],
    'examples': [
      { id: 'priority-list-variants', label: 'Priority list variants' },
      { id: 'dual-listbox-keyboard-handoff', label: 'Dual listbox keyboard handoff' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  'menu': {
    'overview': [
      { id: 'imports', label: 'Imports' },
      { id: 'usage-patterns', label: 'Usage patterns' },
      { id: 'style-variants', label: 'Style variants' },
      { id: 'keyboard-baseline', label: 'Keyboard baseline' },
    ],
    'api': [
      { id: 'wrapper-apis', label: 'Wrapper APIs' },
      { id: 'primitive-directives', label: 'Primitive directives' },
      { id: 'keyboard-contract-high-level', label: 'Keyboard contract (high level)' },
    ],
    'styling': [
      { id: 'css-contract-table', label: 'CSS contract table' },
      { id: 'example-style-contract', label: 'Example style contract' },
    ],
    'examples': [
      { id: 'action-menu-variants', label: 'Action menu variants' },
      { id: 'cascaded-submenu-example', label: 'Cascaded submenu example' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  'menubar': {
    'overview': [
      { id: 'imports', label: 'Imports' },
      { id: 'usage-patterns', label: 'Usage patterns' },
      { id: 'style-variants', label: 'Style variants' },
      { id: 'keyboard-baseline', label: 'Keyboard baseline' },
    ],
    'api': [
      { id: 'wrapper-apis', label: 'Wrapper APIs' },
      { id: 'primitive-directives', label: 'Primitive directives' },
      { id: 'keyboard-contract-high-level', label: 'Keyboard contract (high level)' },
    ],
    'styling': [
      { id: 'css-contract-table', label: 'CSS contract table' },
      { id: 'example-style-contract', label: 'Example style contract' },
    ],
    'examples': [
      { id: 'workspace-command-bar', label: 'Workspace command bar' },
      { id: 'cascaded-submenu-chain', label: 'Cascaded submenu chain' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  'multi-autocomplete': {
    'overview': [
      { id: 'imports', label: 'Imports' },
      { id: 'country-tags-variants', label: 'Country tags variants' },
      { id: 'behavior-baseline', label: 'Behavior baseline' },
    ],
    'api': [
      { id: 'tngmultiautocomplete-parts-primitive', label: 'tngMultiAutocomplete + parts (primitive)' },
      { id: 'tng-multi-autocomplete-styled-component', label: 'tng-multi-autocomplete (styled component)' },
    ],
    'styling': [
      { id: 'css-contract-table', label: 'CSS contract table' },
      { id: 'example-style-contract', label: 'Example style contract' },
    ],
    'examples': [
      { id: 'country-tags-variants', label: 'Country tags variants' },
      { id: 'state-variants', label: 'State variants' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  'multiselect': {
    'overview': [
      { id: 'imports', label: 'Imports' },
      { id: 'planet-multi-select-variants', label: 'Planet multi-select variants' },
      { id: 'behavior-baseline', label: 'Behavior baseline' },
    ],
    'api': [
      { id: 'tngmultiselect-parts-primitive', label: 'tngMultiSelect + parts (primitive)' },
      { id: 'tng-multiselect-styled-component', label: 'tng-multiselect (styled component)' },
    ],
    'styling': [
      { id: 'css-contract-table', label: 'CSS contract table' },
      { id: 'example-style-contract', label: 'Example style contract' },
    ],
    'examples': [
      { id: 'status-multiselect-variants', label: 'Status multiselect variants' },
      { id: 'dual-multiselect-keyboard-handoff', label: 'Dual multiselect keyboard handoff' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  'popover': {
    'overview': [
      { id: 'imports', label: 'Imports' },
      { id: 'usage-patterns', label: 'Usage patterns' },
      { id: 'style-variants', label: 'Style variants' },
      { id: 'keyboard-baseline', label: 'Keyboard baseline' },
    ],
    'api': [
      { id: 'wrapper-component-and-lt-tng-popover-and-gt', label: 'Wrapper component: &lt;tng-popover&gt;' },
      { id: 'primitive-directives', label: 'Primitive directives' },
      { id: 'keyboard-contract-high-level', label: 'Keyboard contract (high level)' },
    ],
    'styling': [
      { id: 'core-data-attributes', label: 'Core data attributes' },
      { id: 'reference-css', label: 'Reference CSS' },
    ],
    'examples': [
      { id: 'delete-release-branch', label: 'Delete release branch?' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  'progress-bar': {
    'overview': [
      { id: 'imports', label: 'Imports' },
      { id: 'progress-variants', label: 'Progress variants' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    'api': [
      { id: 'tngprogressbar-and-tngprogressbarindicator', label: 'tngProgressBar and tngProgressBarIndicator' },
      { id: 'tng-progress-bar-wrapper', label: 'tng-progress-bar wrapper' },
    ],
    'styling': [
      { id: 'slot-hooks', label: 'Slot hooks' },
    ],
    'examples': [
      { id: 'upload-and-quality-metrics', label: 'Upload and quality metrics' },
      { id: 'loading-and-rollout-state', label: 'Loading and rollout state' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  'progress-spinner': {
    'overview': [
      { id: 'imports', label: 'Imports' },
      { id: 'spinner-variants', label: 'Spinner variants' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    'api': [
      { id: 'tngprogressspinner-primitive', label: 'tngProgressSpinner primitive' },
      { id: 'tng-progress-spinner-wrapper', label: 'tng-progress-spinner wrapper' },
    ],
    'styling': [
      { id: 'slot-and-class-hooks', label: 'Slot and class hooks' },
    ],
    'examples': [
      { id: 'sync-and-quality-metrics', label: 'Sync and quality metrics' },
      { id: 'loading-and-rollout-state', label: 'Loading and rollout state' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  'radio': {
    'overview': [
      { id: 'imports', label: 'Imports' },
      { id: 'usage-patterns', label: 'Usage patterns' },
      { id: 'style-variants', label: 'Style variants' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    'api': [
      { id: 'tngradio-directive', label: 'tngRadio (directive)' },
      { id: 'tng-radio-styled-component', label: 'tng-radio (styled component)' },
    ],
    'styling': [
      { id: 'css-contract-table', label: 'CSS contract table' },
      { id: 'user-scenario-style-examples', label: 'User scenario style examples' },
    ],
    'examples': [
      { id: 'billing-plan-selection', label: 'Billing plan selection' },
      { id: 'readonly-and-invalid-review', label: 'Readonly and invalid review' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  'selectbox': {
    'overview': [
      { id: 'imports', label: 'Imports' },
      { id: 'planet-select-variants', label: 'Planet select variants' },
      { id: 'behavior-baseline', label: 'Behavior baseline' },
    ],
    'api': [
      { id: 'primitive-directives', label: 'Primitive directives' },
      { id: 'styled-wrapper-and-lt-tng-select-and-gt', label: 'Styled wrapper &lt;tng-select&gt;' },
    ],
    'styling': [
      { id: 'css-contract-table', label: 'CSS contract table' },
      { id: 'example-style-contract', label: 'Example style contract' },
    ],
    'examples': [
      { id: 'status-select-variants', label: 'Status select variants' },
      { id: 'dual-select-keyboard-handoff', label: 'Dual select keyboard handoff' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  'separator': {
    'overview': [
      { id: 'imports', label: 'Imports' },
      { id: 'separator-variants', label: 'Separator variants' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    'api': [
      { id: 'tngseparator-directive', label: 'tngSeparator (directive)' },
      { id: 'tng-separator-component', label: 'tng-separator (component)' },
    ],
    'styling': [
      { id: 'state-hooks', label: 'State hooks' },
      { id: 'css-starter', label: 'CSS starter' },
    ],
    'examples': [
      { id: 'toolbar-grouping', label: 'Toolbar grouping' },
      { id: 'list-grouping', label: 'List grouping' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  'skeleton': {
    'overview': [
      { id: 'imports', label: 'Imports' },
      { id: 'placeholder-variants', label: 'Placeholder variants' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    'api': [
      { id: 'tngskeleton-primitive', label: 'tngSkeleton primitive' },
      { id: 'tng-skeleton-wrapper', label: 'tng-skeleton wrapper' },
    ],
    'styling': [
      { id: 'slot-and-state-hooks', label: 'Slot and state hooks' },
    ],
    'examples': [
      { id: 'text-content-placeholder', label: 'Text content placeholder' },
      { id: 'card-media-placeholder', label: 'Card/media placeholder' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  'stepper': {
    'overview': [
      { id: 'imports', label: 'Imports' },
      { id: 'progress-indicator-variants', label: 'Progress indicator variants' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    'api': [
      { id: 'tngstepper-directive', label: 'tngStepper (directive)' },
      { id: 'tng-stepper-component', label: 'tng-stepper (component)' },
    ],
    'styling': [
      { id: 'state-hooks', label: 'State hooks' },
      { id: 'css-starter', label: 'CSS starter' },
    ],
    'examples': [
      { id: 'checkout-progression-variants', label: 'Checkout progression variants' },
      { id: 'release-pipeline-variants', label: 'Release pipeline variants' },
      { id: 'error-surface-variants', label: 'Error surface variants' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  'switch': {
    'overview': [
      { id: 'imports', label: 'Imports' },
      { id: 'usage-patterns', label: 'Usage patterns' },
      { id: 'switch-variants', label: 'Switch variants' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    'api': [
      { id: 'tngswitch-directive', label: 'tngSwitch (directive)' },
      { id: 'tng-switch-styled-component', label: 'tng-switch (styled component)' },
    ],
    'styling': [
      { id: 'css-contract-table', label: 'CSS contract table' },
      { id: 'styling-examples', label: 'Styling examples' },
    ],
    'examples': [
      { id: 'settings-panel', label: 'Settings panel' },
      { id: 'disabled-state', label: 'Disabled state' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  'tag': {
    'overview': [
      { id: 'imports', label: 'Imports' },
      { id: 'usage-patterns', label: 'Usage patterns' },
      { id: 'style-variants', label: 'Style variants' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    'api': [
      { id: 'primitive-tngtag-inputs-and-output', label: 'Primitive: tngTag inputs and output' },
      { id: 'primitive-tngtagclose', label: 'Primitive: tngTagClose' },
      { id: 'component-and-lt-tng-tag-and-gt', label: 'Component: &lt;tng-tag&gt;' },
    ],
    'styling': [
      { id: 'slot-and-state-hooks', label: 'Slot and state hooks' },
      { id: 'wrapper-data-hooks', label: 'Wrapper data hooks' },
      { id: 'example-contract-overrides', label: 'Example contract overrides' },
    ],
    'examples': [
      { id: 'example-1-removable-filter-chips', label: 'Example 1: Removable filter chips' },
      { id: 'example-2-status-tags', label: 'Example 2: Status tags' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  'textarea': {
    'overview': [
      { id: 'imports', label: 'Imports' },
      { id: 'textarea-variants', label: 'Textarea variants' },
      { id: 'behavior-baseline', label: 'Behavior baseline' },
    ],
    'api': [
      { id: 'primitive-textarea-tnginput', label: 'Primitive: textarea[tngInput]' },
      { id: 'component-and-lt-tng-textarea-and-gt', label: 'Component: &lt;tng-textarea&gt;' },
      { id: 'compatibility-alias', label: 'Compatibility alias' },
    ],
    'styling': [
      { id: 'state-hooks', label: 'State hooks' },
      { id: 'suggested-css-baseline', label: 'Suggested CSS baseline' },
    ],
    'examples': [
      { id: 'incident-summary-composer', label: 'Incident summary composer' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  'toast': {
    'overview': [
      { id: 'imports', label: 'Imports' },
      { id: 'style-variants', label: 'Style variants' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    'api': [
      { id: 'tngtoastviewport-tngtoastitem-primitives', label: 'tngToastViewport + tngToastItem primitives' },
      { id: 'and-lt-tng-toast-and-gt-wrapper', label: '&lt;tng-toast&gt; wrapper' },
    ],
    'styling': [
      { id: 'slot-and-state-hooks', label: 'Slot and state hooks' },
    ],
    'examples': [
      { id: 'activity-stream-notifications', label: 'Activity stream notifications' },
      { id: 'escalation-notifications', label: 'Escalation notifications' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  'toggle': {
    'overview': [
      { id: 'imports', label: 'Imports' },
      { id: 'usage-patterns', label: 'Usage patterns' },
      { id: 'style-variants', label: 'Style variants' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    'api': [
      { id: 'tngtoggle-directive', label: 'tngToggle (directive)' },
      { id: 'tng-toggle-styled-component', label: 'tng-toggle (styled component)' },
    ],
    'styling': [
      { id: 'css-contract-table', label: 'CSS contract table' },
      { id: 'user-scenario-style-examples', label: 'User scenario style examples' },
    ],
    'examples': [
      { id: 'professional-scenarios', label: 'Professional scenarios' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  'tooltip': {
    'overview': [
      { id: 'imports', label: 'Imports' },
      { id: 'usage-patterns', label: 'Usage patterns' },
      { id: 'style-variants', label: 'Style variants' },
      { id: 'keyboard-baseline', label: 'Keyboard baseline' },
    ],
    'api': [
      { id: 'wrapper-component-and-lt-tng-tooltip-and-gt', label: 'Wrapper component: &lt;tng-tooltip&gt;' },
      { id: 'primitive-directives', label: 'Primitive directives' },
      { id: 'keyboard-and-focus-baseline', label: 'Keyboard and focus baseline' },
    ],
    'styling': [
      { id: 'core-data-attributes', label: 'Core data attributes' },
      { id: 'reference-css', label: 'Reference CSS' },
    ],
    'examples': [
      { id: 'action-hint-workflow', label: 'Action hint workflow' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
  'tree': {
    'overview': [
      { id: 'imports', label: 'Imports' },
      { id: 'file-tree-variants', label: 'File tree variants' },
      { id: 'keyboard-navigation', label: 'Keyboard navigation' },
      { id: 'accessibility-baseline', label: 'Accessibility baseline' },
    ],
    'api': [
      { id: 'tngtree-directive', label: 'tngTree (directive)' },
      { id: 'tngtreeitem-directive', label: 'tngTreeItem (directive)' },
      { id: 'tngtreegroup-directive', label: 'tngTreeGroup (directive)' },
      { id: 'tngtreeindicator-directive', label: 'tngTreeIndicator (directive)' },
      { id: 'tng-tree-component', label: 'tng-tree (component)' },
    ],
    'styling': [
      { id: 'primitive-data-hooks', label: 'Primitive data hooks' },
      { id: 'primitive-css-starter', label: 'Primitive CSS starter' },
      { id: 'component-css-classes', label: 'Component CSS classes' },
      { id: 'component-css-starter', label: 'Component CSS starter' },
    ],
    'examples': [
      { id: 'file-browser', label: 'File browser' },
      { id: 'settings-panel', label: 'Settings panel' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import in your feature module/component' },
    ],
  },
};

export function getDocsComponentSectionOutlineItems(
  componentSlug: string,
  section: DocsComponentTopLevelSectionId,
): readonly DocsSectionRailItem[] {
  return docsComponentOutlineItemsBySlug[componentSlug]?.[section] ?? [];
}

export function getDocsComponentSectionOutlineTitle(section: DocsComponentTopLevelSectionId): string {
  switch (section) {
    case 'api':
      return 'API content';
    case 'styling':
      return 'Styling content';
    case 'examples':
      return 'Examples content';
    case 'ownable-install':
      return 'Install content';
    case 'overview':
    default:
      return 'Overview content';
  }
}

export function getDocsComponentSectionOutlineAriaLabel(
  componentTitle: string,
  section: DocsComponentTopLevelSectionId,
): string {
  return `${componentTitle} ${section} section navigation`;
}
