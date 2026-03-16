export type ComponentsDocsCategoryId =
  | 'getting-started'
  | 'form'
  | 'layout'
  | 'overlay'
  | 'feedback'
  | 'utility'
  | 'navigation';

export type ComponentsDocsItem = Readonly<{
  id: string;
  slug: string;
  title: string;
  description: string;
}>;

export type ComponentsDocsGroup = Readonly<{
  id: ComponentsDocsCategoryId;
  title: string;
  subtitle: string;
  items: readonly ComponentsDocsItem[];
}>;

export type ComponentsDocsRouteData = Readonly<{
  groupId: ComponentsDocsCategoryId;
  groupTitle: string;
  groupSubtitle: string;
  item: ComponentsDocsItem;
}>;

export const COMPONENTS_GETTING_STARTED_GROUP: ComponentsDocsGroup = {
  id: 'getting-started',
  title: 'Getting Started',
  subtitle: 'Installation and setup guides',
  items: [
    {
      id: 'quick-start',
      slug: 'quick-start',
      title: 'Quick Start',
      description: 'Fast path to scaffold and run your first TailNG component page.',
    },
    {
      id: 'installation',
      slug: 'installation',
      title: 'Installation',
      description: 'Package-level install matrix for TailNG Components and peer layers.',
    },
    {
      id: 'plain-css-setup',
      slug: 'plain-css-setup',
      title: 'Plain CSS Setup',
      description: 'Set up TailNG Components with semantic tokens using vanilla CSS.',
    },
    {
      id: 'tailwind-setup',
      slug: 'tailwind-setup',
      title: 'Tailwind Setup',
      description: 'Integrate TailNG Components with utility-first styling in Tailwind.',
    },
  ],
};

export const COMPONENTS_FORM_GROUP: ComponentsDocsGroup = {
  id: 'form',
  title: 'Form',
  subtitle: 'Input and selection components',
  items: [
    {
      id: 'input',
      slug: 'input',
      title: 'Input',
      description: 'Text input fields, adornments, validation messaging, and layout patterns.',
    },
    {
      id: 'textarea',
      slug: 'textarea',
      title: 'Textarea',
      description:
        'Multiline text input patterns with input-first primitives and styled textarea wrappers.',
    },
    {
      id: 'input-otp',
      slug: 'input-otp',
      title: 'Input OTP',
      description: 'Segmented one-time-password input with keyboard, paste, and form integration.',
    },
    {
      id: 'label',
      slug: 'label',
      title: 'Label',
      description: 'Accessible label semantics for explicit and wrapped control association.',
    },
    {
      id: 'checkbox',
      slug: 'checkbox',
      title: 'Checkbox',
      description: 'Binary and tri-state selection patterns with headless and styled usage.',
    },
    {
      id: 'toggle',
      slug: 'toggle',
      title: 'Toggle',
      description: 'Pressed button semantics for compact on/off actions and toolbar commands.',
    },
    {
      id: 'radio',
      slug: 'radio',
      title: 'Radio',
      description: 'Single-choice grouped selection with native semantics and keyboard behavior.',
    },
    {
      id: 'button-toggle',
      slug: 'button-toggle',
      title: 'Button Toggle',
      description: 'Single and multiple pressed-button groups for toolbars and view switches.',
    },
    {
      id: 'listbox',
      slug: 'listbox',
      title: 'ListBox',
      description: 'Listbox interaction patterns and keyboard behavior reference.',
    },
    {
      id: 'autocomplete',
      slug: 'autocomplete',
      title: 'AutoComplete',
      description: 'Single-value autocomplete patterns and filtering behavior.',
    },
    {
      id: 'multi-autocomplete',
      slug: 'multi-autocomplete',
      title: 'MultiAutocomplete',
      description: 'Chip-based autocomplete selection for multiple values.',
    },
    {
      id: 'selectbox',
      slug: 'selectbox',
      title: 'SelectBox',
      description: 'Single-choice select surfaces and trigger/content composition.',
    },
    {
      id: 'multiselect',
      slug: 'multiselect',
      title: 'MultiSelect',
      description: 'Multiple-selection dropdown behavior and state handling.',
    },
    {
      id: 'chips',
      slug: 'chips',
      title: 'Chips',
      description: 'Tokenized input and removable item chip usage patterns.',
    },
  ],
};

export const COMPONENTS_LAYOUT_GROUP: ComponentsDocsGroup = {
  id: 'layout',
  title: 'Layout',
  subtitle: 'Workflow and structural layout components',
  items: [
    {
      id: 'collapsible',
      slug: 'collapsible',
      title: 'Collapsible',
      description: 'Expandable disclosure regions with headless and styled integration paths.',
    },
    {
      id: 'accordion',
      slug: 'accordion',
      title: 'Accordion',
      description: 'Single and multi-expand panel groups with keyboard navigation and aria wiring.',
    },
    {
      id: 'stepper',
      slug: 'stepper',
      title: 'Stepper',
      description: 'Ordered multi-step workflow surfaces for guided completion flows.',
    },
    {
      id: 'card',
      slug: 'card',
      title: 'Card',
      description: 'Grouped content surfaces with optional media, actions, and footer composition.',
    },
    {
      id: 'separator',
      slug: 'separator',
      title: 'Separator',
      description: 'Horizontal and vertical dividers for visual or semantic content grouping.',
    },
  ],
};

export const COMPONENTS_OVERLAY_GROUP: ComponentsDocsGroup = {
  id: 'overlay',
  title: 'Overlay',
  subtitle: 'Modal and floating layer surfaces',
  items: [
    {
      id: 'dialog',
      slug: 'dialog',
      title: 'Dialog',
      description: 'Modal panel with backdrop dismissal, focus trap, and close reason outputs.',
    },
    {
      id: 'popover',
      slug: 'popover',
      title: 'Popover',
      description: 'Anchored floating panel with trigger semantics and outside/Escape dismissal.',
    },
    {
      id: 'tooltip',
      slug: 'tooltip',
      title: 'Tooltip',
      description: 'Hover/focus helper text with trigger/content association and side placement hooks.',
    },
  ],
};

export const COMPONENTS_FEEDBACK_GROUP: ComponentsDocsGroup = {
  id: 'feedback',
  title: 'Feedback',
  subtitle: 'Status, empty, progress, and loading placeholder patterns',
  items: [
    {
      id: 'toast',
      slug: 'toast',
      title: 'Toast',
      description:
        'Stacked notification toasts with auto-dismiss timing, dismiss actions, and tone semantics.',
    },
    {
      id: 'empty',
      slug: 'empty',
      title: 'Empty',
      description: 'Empty-state layout with icon, title, description, and action composition.',
    },
    {
      id: 'progress-bar',
      slug: 'progress-bar',
      title: 'Progress Bar',
      description: 'Linear determinate and indeterminate loading states with aria semantics.',
    },
    {
      id: 'progress-spinner',
      slug: 'progress-spinner',
      title: 'Progress Spinner',
      description: 'Circular determinate and indeterminate loading states with aria semantics.',
    },
    {
      id: 'skeleton',
      slug: 'skeleton',
      title: 'Skeleton',
      description: 'Decorative placeholder blocks for loading layouts and content scaffolding.',
    },
  ],
};

export const COMPONENTS_UTILITY_GROUP: ComponentsDocsGroup = {
  id: 'utility',
  title: 'Utility',
  subtitle: 'General-purpose interface utilities',
  items: [
    {
      id: 'avatar',
      slug: 'avatar',
      title: 'Avatar',
      description: 'Identity surfaces with fallback handling, shape, and size variants.',
    },
    {
      id: 'badge',
      slug: 'badge',
      title: 'Badge',
      description: 'Count, dot, and placement badges for notifications and status overlays.',
    },
    {
      id: 'tag',
      slug: 'tag',
      title: 'Tag',
      description: 'Compact label chips with optional icon and removable close action.',
    },
    {
      id: 'codeblock',
      slug: 'codeblock',
      title: 'Codeblock',
      description: 'Code rendering, highlighting adapters, and line metadata.',
    },
    {
      id: 'copybutton',
      slug: 'copybutton',
      title: 'CopyButton',
      description: 'Clipboard actions, success/error states, and feedback hooks.',
    },
    {
      id: 'button',
      slug: 'button',
      title: 'Button',
      description: 'Press/action semantics, accessibility, and interaction states.',
    },
  ],
};

export const COMPONENTS_NAVIGATION_GROUP: ComponentsDocsGroup = {
  id: 'navigation',
  title: 'Navigation',
  subtitle: 'Menu surfaces and hierarchical actions',
  items: [
    {
      id: 'breadcrumb',
      slug: 'breadcrumb',
      title: 'Breadcrumb',
      description: 'Hierarchical path navigation with optional collapse and current-page semantics.',
    },
    {
      id: 'menubar',
      slug: 'menubar',
      title: 'Menubar',
      description: 'Top-level menubar patterns with owned menu integration.',
    },
    {
      id: 'menu',
      slug: 'menu',
      title: 'Menu',
      description: 'Contextual menu interactions, keyboard flow, and submenu behavior.',
    },
    {
      id: 'context-menu',
      slug: 'context-menu',
      title: 'Context Menu',
      description: 'Right-click and keyboard context actions anchored to element surfaces.',
    },
  ],
};

export const COMPONENTS_DOCS_GROUPS: readonly ComponentsDocsGroup[] = Object.freeze([
  COMPONENTS_GETTING_STARTED_GROUP,
  COMPONENTS_FORM_GROUP,
  COMPONENTS_LAYOUT_GROUP,
  COMPONENTS_OVERLAY_GROUP,
  COMPONENTS_FEEDBACK_GROUP,
  COMPONENTS_UTILITY_GROUP,
  COMPONENTS_NAVIGATION_GROUP,
]);

const defaultGroup = COMPONENTS_GETTING_STARTED_GROUP;
const defaultItem = defaultGroup.items[0];
if (defaultItem === undefined) {
  throw new Error('Components docs default item is missing.');
}

export const DEFAULT_COMPONENTS_DOCS_SEGMENT = `${defaultGroup.id}/${defaultItem.slug}`;

export function buildComponentsDocHref(
  groupId: ComponentsDocsCategoryId,
  itemSlug: string,
): string {
  return `/components/${groupId}/${itemSlug}`;
}

export function toComponentsDocsRouteData(
  group: ComponentsDocsGroup,
  item: ComponentsDocsItem,
): ComponentsDocsRouteData {
  return {
    groupId: group.id,
    groupTitle: group.title,
    groupSubtitle: group.subtitle,
    item,
  };
}
