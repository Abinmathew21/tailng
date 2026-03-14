export type ComponentsDocsCategoryId =
  | 'getting-started'
  | 'form'
  | 'layout'
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
      id: 'stepper',
      slug: 'stepper',
      title: 'Stepper',
      description: 'Ordered multi-step workflow surfaces for guided completion flows.',
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
  ],
};

export const COMPONENTS_DOCS_GROUPS: readonly ComponentsDocsGroup[] = Object.freeze([
  COMPONENTS_GETTING_STARTED_GROUP,
  COMPONENTS_FORM_GROUP,
  COMPONENTS_LAYOUT_GROUP,
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
