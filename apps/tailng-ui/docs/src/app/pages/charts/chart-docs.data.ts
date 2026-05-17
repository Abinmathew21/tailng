import { CHARTS_SERIES_DOCS_GROUPS } from './series/chart-series-docs.data';

export type ChartsDocsCategoryId = string;

export type ChartsDocsItem = Readonly<{
  id: string;
  slug: string;
  title: string;
  description: string;
}>;

export type ChartsDocsGroup = Readonly<{
  id: ChartsDocsCategoryId;
  title: string;
  subtitle: string;
  items: readonly ChartsDocsItem[];
}>;

export type ChartsDocsRouteData = Readonly<{
  groupId: ChartsDocsCategoryId;
  groupTitle: string;
  groupSubtitle: string;
  item: ChartsDocsItem;
}>;

export const CHARTS_GETTING_STARTED_GROUP: ChartsDocsGroup = {
  id: 'getting-started',
  title: 'Getting Started',
  subtitle: 'Installation and package overview',
  items: [
    {
      id: 'overview',
      slug: 'overview',
      title: 'Overview',
      description:
        'TailNG-owned chart wrappers, theme-aware rendering, and an isolated Apache ECharts runtime.',
    },
    {
      id: 'installation',
      slug: 'installation',
      title: 'Installation',
      description: 'Install @tailng-ui/charts with the ECharts peer dependency.',
    },
  ],
};

export const CHARTS_COMPOSITION_GROUP: ChartsDocsGroup = {
  id: 'composition',
  title: 'Composition',
  subtitle: 'Semi-headless chart surfaces and layout control',
  items: [
    {
      id: 'semi-headless',
      slug: 'semi-headless',
      title: 'Semi-headless',
      description:
        'Compose chart root, surface, and legend while reusing TailNG chart state and renderer isolation.',
    },
  ],
};

export const CHARTS_DOCS_GROUPS: readonly ChartsDocsGroup[] = Object.freeze([
  CHARTS_GETTING_STARTED_GROUP,
  ...CHARTS_SERIES_DOCS_GROUPS,
  CHARTS_COMPOSITION_GROUP,
]);

const defaultGroup = CHARTS_GETTING_STARTED_GROUP;
const defaultItem = defaultGroup.items[0];
if (defaultItem === undefined) {
  throw new Error('Charts docs default item is missing.');
}

export const DEFAULT_CHARTS_DOCS_SEGMENT = `${defaultGroup.id}/${defaultItem.slug}`;

export function buildChartsDocHref(groupId: ChartsDocsCategoryId, itemSlug: string): string {
  return `/charts/${groupId}/${itemSlug}`;
}

export function toChartsDocsRouteData(
  group: ChartsDocsGroup,
  item: ChartsDocsItem,
): ChartsDocsRouteData {
  return {
    groupId: group.id,
    groupTitle: group.title,
    groupSubtitle: group.subtitle,
    item,
  };
}
