export type OwnableDocsCategoryId =
  | 'getting-started'
  | 'form'
  | 'layout'
  | 'overlay'
  | 'navigation'
  | 'release'
  | 'tooling';

export type OwnableDocsItem = Readonly<{
  id: string;
  slug: string;
  title: string;
  description: string;
}>;

export type OwnableDocsGroup = Readonly<{
  id: OwnableDocsCategoryId;
  title: string;
  subtitle: string;
  items: readonly OwnableDocsItem[];
}>;

export type OwnableDocsRouteData = Readonly<{
  groupId: OwnableDocsCategoryId;
  groupTitle: string;
  groupSubtitle: string;
  item: OwnableDocsItem;
}>;

export const OWNABLE_GETTING_STARTED_GROUP: OwnableDocsGroup = {
  id: 'getting-started',
  title: 'Getting Started',
  subtitle: 'Ownable model, workflow, and first local install',
  items: [
    {
      id: 'overview',
      slug: 'overview',
      title: 'Overview',
      description: 'What ownable means in TailNG and when local source ownership is the right fit.',
    },
    {
      id: 'quick-start',
      slug: 'quick-start',
      title: 'Quick Start',
      description: 'List the surface, add a component, and edit the generated files locally.',
    },
  ],
};

export const OWNABLE_TOOLING_GROUP: OwnableDocsGroup = {
  id: 'tooling',
  title: 'Tooling',
  subtitle: 'CLI and registry contracts',
  items: [
    {
      id: 'cli',
      slug: 'cli',
      title: 'CLI',
      description: 'Commands, options, aliases, and user-facing behavior of the `tailng` CLI.',
    },
    {
      id: 'registry',
      slug: 'registry',
      title: 'Registry',
      description: 'The registry contract that defines generated files, install metadata, and names.',
    },
  ],
};

export const OWNABLE_FORM_GROUP: OwnableDocsGroup = {
  id: 'form',
  title: 'Form',
  subtitle: 'Installable form components',
  items: [
    {
      id: 'input',
      slug: 'input',
      title: 'Input',
      description:
        'Ownable input install with local wrapper source, import metadata, and generated file structure.',
    },
    {
      id: 'textarea',
      slug: 'textarea',
      title: 'Textarea',
      description:
        'Ownable textarea install with local wrapper source, import metadata, and generated file structure.',
    },
    {
      id: 'autocomplete',
      slug: 'autocomplete',
      title: 'Autocomplete',
      description:
        'Ownable autocomplete install with local wrapper source, option mapping defaults, and generated file structure.',
    },
    {
      id: 'switch',
      slug: 'switch',
      title: 'Switch',
      description:
        'Ownable switch install with local wrapper source, settings-focused markup, and generated file structure.',
    },
    {
      id: 'label',
      slug: 'label',
      title: 'Label',
      description:
        'Ownable label install with local wrapper source, semantic defaults, and generated file structure.',
    },
    {
      id: 'checkbox',
      slug: 'checkbox',
      title: 'Checkbox',
      description:
        'Ownable checkbox install with local wrapper source, form integration, and generated file structure.',
    },
    {
      id: 'toggle',
      slug: 'toggle',
      title: 'Toggle',
      description:
        'Ownable toggle install with local wrapper source, icon-slot ownership, and generated file structure.',
    },
    {
      id: 'switch',
      slug: 'switch',
      title: 'Switch',
      description:
        'Ownable switch install with local wrapper source, form integration, and generated file structure.',
    },
    {
      id: 'radio',
      slug: 'radio',
      title: 'Radio',
      description:
        'Ownable radio install with local wrapper source, group semantics, and generated file structure.',
    },
    {
      id: 'button-toggle',
      slug: 'button-toggle',
      title: 'Button Toggle',
      description:
        'Ownable button-toggle install with local group and item wrappers, toolbar semantics, and generated file structure.',
    },
    {
      id: 'chips',
      slug: 'chips',
      title: 'Chips',
      description:
        'Ownable chips install with local wrapper source, removable token markup, and generated file structure.',
    },
    {
      id: 'input-otp',
      slug: 'input-otp',
      title: 'Input OTP',
      description:
        'Ownable input-otp install with local wrapper source, verification-flow defaults, and generated file structure.',
    },
  ],
};

export const OWNABLE_LAYOUT_GROUP: OwnableDocsGroup = {
  id: 'layout',
  title: 'Layout',
  subtitle: 'Installable layout wrappers with local source ownership',
  items: [
    {
      id: 'card',
      slug: 'card',
      title: 'Card',
      description:
        'Ownable card install with local wrapper source, content shell markup, and generated file structure.',
    },
    {
      id: 'separator',
      slug: 'separator',
      title: 'Separator',
      description:
        'Ownable separator install with local wrapper source, divider styling, and generated file structure.',
    },
    {
      id: 'collapsible',
      slug: 'collapsible',
      title: 'Collapsible',
      description:
        'Ownable collapsible install with local wrapper source, disclosure markup, and generated file structure.',
    },
    {
      id: 'accordion',
      slug: 'accordion',
      title: 'Accordion',
      description:
        'Ownable accordion install with local wrapper source, section markup, and generated file structure.',
    },
    {
      id: 'stepper',
      slug: 'stepper',
      title: 'Stepper',
      description:
        'Ownable stepper install with local wrapper source, progress markup, and generated file structure.',
    },
  ],
};

export const OWNABLE_OVERLAY_GROUP: OwnableDocsGroup = {
  id: 'overlay',
  title: 'Overlay',
  subtitle: 'Installable overlay wrappers with local source ownership',
  items: [
    {
      id: 'dialog',
      slug: 'dialog',
      title: 'Dialog',
      description:
        'Ownable dialog install with local wrapper source, modal behavior helpers, and generated file structure.',
    },
    {
      id: 'popover',
      slug: 'popover',
      title: 'Popover',
      description:
        'Ownable popover install with local wrapper source, anchored panel behavior, and generated file structure.',
    },
  ],
};

export const OWNABLE_NAVIGATION_GROUP: OwnableDocsGroup = {
  id: 'navigation',
  title: 'Navigation',
  subtitle: 'Installable navigation components',
  items: [
    {
      id: 'breadcrumb',
      slug: 'breadcrumb',
      title: 'Breadcrumb',
      description:
        'Ownable breadcrumb install with local wrapper source, collapsed trail defaults, and generated file structure.',
    },
    {
      id: 'context-menu',
      slug: 'context-menu',
      title: 'Context Menu',
      description:
        'Ownable context-menu install with local wrapper source, trigger semantics, and generated file structure.',
    },
    {
      id: 'menubar',
      slug: 'menubar',
      title: 'Menubar',
      description:
        'Ownable menubar install with local wrapper source, command-strip markup, and generated file structure.',
    },
    {
      id: 'tree',
      slug: 'tree',
      title: 'Tree',
      description:
        'Ownable tree install with local wrapper source, hierarchical row presentation, and generated file structure.',
    },
  ],
};

export const OWNABLE_RELEASE_GROUP: OwnableDocsGroup = {
  id: 'release',
  title: 'Release',
  subtitle: 'Publishing and workflow structure for the ownable surface',
  items: [
    {
      id: 'workflow',
      slug: 'workflow',
      title: 'Release Workflow',
      description:
        'How registry and CLI releases are validated, packed, smoke-tested, and published.',
    },
  ],
};

export const OWNABLE_DOCS_GROUPS: readonly OwnableDocsGroup[] = Object.freeze([
  OWNABLE_GETTING_STARTED_GROUP,
  OWNABLE_FORM_GROUP,
  OWNABLE_LAYOUT_GROUP,
  OWNABLE_OVERLAY_GROUP,
  OWNABLE_NAVIGATION_GROUP,
  OWNABLE_TOOLING_GROUP,
  OWNABLE_RELEASE_GROUP,
]);

const defaultGroup = OWNABLE_GETTING_STARTED_GROUP;
const defaultItem = defaultGroup.items[0];
if (defaultItem === undefined) {
  throw new Error('Ownable docs default item is missing.');
}

export const DEFAULT_OWNABLE_DOCS_SEGMENT = `${defaultGroup.id}/${defaultItem.slug}`;

export function buildOwnableDocHref(groupId: OwnableDocsCategoryId, itemSlug: string): string {
  return `/ownable/${groupId}/${itemSlug}`;
}

export function toOwnableDocsRouteData(
  group: OwnableDocsGroup,
  item: OwnableDocsItem,
): OwnableDocsRouteData {
  return {
    groupId: group.id,
    groupTitle: group.title,
    groupSubtitle: group.subtitle,
    item,
  };
}
