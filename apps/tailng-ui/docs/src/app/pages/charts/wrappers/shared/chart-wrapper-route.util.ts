import type { ChartWrapperSlug } from './chart-wrapper-docs.config';
import { resolveChartWrapperDocConfig } from './chart-wrapper-docs.config';

export function resolveChartWrapperSlugFromUrl(rawUrl: string): ChartWrapperSlug | null {
  const path = normalizeDocsUrl(rawUrl);
  const segments = path.split('/').filter((segment) => segment.length > 0);
  if (segments.length < 3 || segments[0] !== 'charts' || segments[1] !== 'wrappers') {
    return null;
  }

  const slug = segments[2];
  const config = slug ? resolveChartWrapperDocConfig(slug) : null;
  return config?.slug ?? null;
}

function normalizeDocsUrl(rawUrl: string): string {
  const queryIndex = rawUrl.indexOf('?');
  const hashIndex = rawUrl.indexOf('#');
  let endIndex = rawUrl.length;

  if (queryIndex >= 0) {
    endIndex = Math.min(endIndex, queryIndex);
  }

  if (hashIndex >= 0) {
    endIndex = Math.min(endIndex, hashIndex);
  }

  const normalized = rawUrl.slice(0, endIndex);
  if (normalized.length > 1 && normalized.endsWith('/')) {
    return normalized.slice(0, -1);
  }

  return normalized;
}
