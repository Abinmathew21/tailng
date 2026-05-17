export type ChartsDocsCategoryId = 'getting-started' | 'wrappers' | 'composition';

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

export const CHARTS_WRAPPERS_GROUP: ChartsDocsGroup = {
  id: 'wrappers',
  title: 'Chart Wrappers',
  subtitle: 'Field-driven chart components for common visualizations',
  items: [
    {
      id: 'line-chart',
      slug: 'line-chart',
      title: 'Line Chart',
      description: 'Trend charts over categories or time buckets.',
    },
    {
      id: 'bar-chart',
      slug: 'bar-chart',
      title: 'Bar Chart',
      description: 'Category comparison, stacked bars, and horizontal bars.',
    },
    {
      id: 'area-chart',
      slug: 'area-chart',
      title: 'Area Chart',
      description: 'Filled line charts and cumulative trends.',
    },
    {
      id: 'pie-chart',
      slug: 'pie-chart',
      title: 'Pie Chart',
      description: 'Part-to-whole breakdowns with optional donut mode.',
    },
    {
      id: 'scatter-chart',
      slug: 'scatter-chart',
      title: 'Scatter Chart',
      description: 'Correlation, distribution, and bubble-like plots.',
    },
    {
      id: 'heatmap-chart',
      slug: 'heatmap-chart',
      title: 'Heatmap Chart',
      description: 'Matrix intensity views with a visual map.',
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
  CHARTS_WRAPPERS_GROUP,
  CHARTS_COMPOSITION_GROUP,
]);

const defaultGroup = CHARTS_GETTING_STARTED_GROUP;
const defaultItem = defaultGroup.items[0];
if (defaultItem === undefined) {
  throw new Error('Charts docs default item is missing.');
}

export const DEFAULT_CHARTS_DOCS_SEGMENT = `${defaultGroup.id}/${defaultItem.slug}`;

export function buildChartsDocHref(
  groupId: ChartsDocsCategoryId,
  itemSlug: string,
): string {
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
