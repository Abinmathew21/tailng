import type { DocsSearchEntry } from '../../shared/search/docs-search-index.service';
import {
  CHARTS_COMPOSITION_GROUP,
  CHARTS_DOCS_GROUPS,
  CHARTS_GETTING_STARTED_GROUP,
} from './chart-docs.data';
import { CHART_SERIES_DOC_CONFIGS } from './series/chart-series-docs.data';

const CHART_DOC_SECTIONS = [
  { slug: 'overview', label: 'Overview' },
  { slug: 'api', label: 'API' },
  { slug: 'styling', label: 'Styling' },
  { slug: 'examples', label: 'Examples' },
] as const;

function buildChartTags(...parts: readonly string[]): readonly string[] {
  const unique = new Set<string>();

  for (const part of parts) {
    const normalized = part.trim().toLowerCase();
    if (normalized.length > 0) {
      unique.add(normalized);
    }
  }

  return Object.freeze([...unique]);
}

function buildGettingStartedEntries(): readonly DocsSearchEntry[] {
  return CHARTS_GETTING_STARTED_GROUP.items.map((item) =>
    Object.freeze({
      title: `Charts ${item.title}`,
      description: item.description,
      section: 'Charts / Getting Started',
      url: `/charts/${CHARTS_GETTING_STARTED_GROUP.id}/${item.slug}`,
      tags: buildChartTags('charts', 'getting-started', item.slug, item.id),
    }),
  );
}

function buildCompositionEntries(): readonly DocsSearchEntry[] {
  return CHARTS_COMPOSITION_GROUP.items.map((item) =>
    Object.freeze({
      title: `${item.title} Charts`,
      description: item.description,
      section: 'Charts / Composition',
      url: `/charts/${CHARTS_COMPOSITION_GROUP.id}/${item.slug}`,
      tags: buildChartTags('charts', 'composition', item.slug, item.id, 'headless'),
    }),
  );
}

function buildSeriesCatalogEntries(): readonly DocsSearchEntry[] {
  const entries: DocsSearchEntry[] = [];

  for (const config of CHART_SERIES_DOC_CONFIGS) {
    const sectionLabel = `Charts / ${config.categoryTitle}`;

    for (const section of CHART_DOC_SECTIONS) {
      entries.push(
        Object.freeze({
          title: `${config.title} ${section.label}`,
          description: config.description,
          section: sectionLabel,
          url: `/charts/${config.categoryId}/${config.slug}/${section.slug}`,
          tags: buildChartTags(
            'charts',
            config.categoryId,
            config.slug,
            config.seriesType,
            section.slug,
            config.legacyKind,
          ),
        }),
      );
    }
  }

  return Object.freeze(entries);
}

/** Search index entries for all chart docs routes (getting-started, catalog, composition). */
export function buildChartsSearchIndexEntries(): readonly DocsSearchEntry[] {
  return Object.freeze([
    ...buildGettingStartedEntries(),
    ...buildSeriesCatalogEntries(),
    ...buildCompositionEntries(),
  ]);
}

/** @internal Ensures chart docs groups stay aligned with the search index builder. */
export const CHARTS_SEARCH_INDEX_GROUP_COUNT = CHARTS_DOCS_GROUPS.length;
