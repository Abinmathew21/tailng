export type OwnableDocsCategoryId = 'getting-started' | 'form' | 'release' | 'tooling';

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
      id: 'checkbox',
      slug: 'checkbox',
      title: 'Checkbox',
      description:
        'Ownable checkbox install with local wrapper source, form integration, and generated file structure.',
    },
    {
      id: 'radio',
      slug: 'radio',
      title: 'Radio',
      description:
        'Ownable radio install with local wrapper source, group semantics, and generated file structure.',
    },
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
