import type { TngChartData, TngChartOptionOverride } from '@tailng-ui/charts';
import type { ChartSeriesDocConfig } from '../chart-series-docs.data';
import {
  CHART_SERIES_PLAIN_LAYOUT_CSS,
  CHART_SERIES_TAILWIND_LAYOUT_CSS,
  createChartSeriesCodeTabs,
} from '../shared/chart-series-examples.util';

export type ChartUsageBindings = Readonly<Record<string, string>>;

const CARTESIAN_DEMO_ROWS = [
  { label: 'Jan', value: 42 },
  { label: 'Feb', value: 58 },
  { label: 'Mar', value: 64 },
  { label: 'Apr', value: 86 },
  { label: 'May', value: 72 },
  { label: 'Jun', value: 91 },
] as const;

const PIE_DEMO_ROWS = [
  { name: 'Core', value: 44 },
  { name: 'Pro', value: 31 },
  { name: 'Enterprise', value: 18 },
  { name: 'Add-ons', value: 12 },
] as const;

const FLOW_DEMO_ROWS = [
  { source: 'Landing', target: 'Signup', value: 120 },
  { source: 'Signup', target: 'Trial', value: 86 },
  { source: 'Trial', target: 'Paid', value: 54 },
] as const;

// Cartesian coordinate pairs for large-scale-lines (coordinateSystem: cartesian2d).
const CARTESIAN_LINES_DEMO_ROWS = [
  { source: [10, 20], target: [80, 70], value: 1 },
  { source: [30, 60], target: [90, 25], value: 1 },
  { source: [15, 75], target: [75, 40], value: 1 },
  { source: [50, 10], target: [60, 85], value: 1 },
  { source: [5, 45], target: [95, 55], value: 1 },
] as const;

// Geographic coordinate pairs (lat/lon) for geo-lines documentation examples.
// Note: geo-lines requires echarts.registerMap() to render – see the API reference.
const GEO_LINES_DEMO_ROWS = [
  { source: [116.46, 39.92], target: [121.48, 31.22], value: 1 },
  { source: [121.48, 31.22], target: [113.23, 23.16], value: 1 },
  { source: [116.46, 39.92], target: [108.95, 34.27], value: 1 },
  { source: [108.95, 34.27], target: [104.07, 30.67], value: 1 },
] as const;

export function parseChartUsageAttributes(usageAttributes: string): ChartUsageBindings {
  const bindings: Record<string, string> = {};
  const pattern = /(\w+)="([^"]*)"/g;

  for (const match of usageAttributes.matchAll(pattern)) {
    const key = match[1];
    const value = match[2];
    if (key !== undefined && value !== undefined) {
      bindings[key] = value;
    }
  }

  return bindings;
}

export function buildCatalogDemoData(config: ChartSeriesDocConfig): TngChartData {
  // Lines series uses coordinate-pair data, not the standard field-driven rows.
  if (config.seriesType === 'lines') {
    if (config.coordinateSystem === 'geo') {
      return GEO_LINES_DEMO_ROWS.map((row) => ({ ...row }));
    }
    return CARTESIAN_LINES_DEMO_ROWS.map((row) => ({ ...row }));
  }

  const bindings = parseChartUsageAttributes(config.usageAttributes);

  if (bindings['nameField'] !== undefined && bindings['valueField'] !== undefined) {
    return PIE_DEMO_ROWS.map((row) => ({ ...row }));
  }

  // sourceField / targetField bindings → node-link / flow data
  if (bindings['sourceField'] !== undefined && bindings['targetField'] !== undefined) {
    return FLOW_DEMO_ROWS.map((row) => ({ ...row }));
  }

  const xKey = bindings['xField'] ?? 'label';
  const yKey = bindings['yField'] ?? 'value';

  return CARTESIAN_DEMO_ROWS.map((row) => ({
    [xKey]: row.label,
    [yKey]: row.value,
  }));
}

function buildCatalogDemoDataCodeRows(config: ChartSeriesDocConfig): readonly string[] {
  return buildCatalogDemoData(config)
    .slice(0, 3)
    .map((row) => `  ${JSON.stringify(row)},`);
}

export function buildCatalogImportCode(config: ChartSeriesDocConfig): string {
  const data = buildCatalogDemoData(config);
  const sampleRows = data
    .slice(0, 4)
    .map((row) => `  ${JSON.stringify(row)},`)
    .join('\n');

  return [
    `import { ${config.importName}, type TngChartData } from '@tailng-ui/charts';`,
    '',
    'const data: TngChartData = [',
    sampleRows,
    '];',
  ].join('\n');
}

export function buildCatalogUsageCode(config: ChartSeriesDocConfig): string {
  const attrs = config.usageAttributes.length > 0 ? ` ${config.usageAttributes}` : '';

  return [
    '@Component({',
    `  imports: [${config.importName}],`,
    `  template: \`<${config.selector} [data]="data"${attrs} [height]="320" />\`,`,
    '})',
    `export class ${toExampleClassName(config)} {`,
    '  protected readonly data = data;',
    '}',
  ].join('\n');
}

export function buildCatalogTemplateMarkup(
  config: ChartSeriesDocConfig,
  options?: Readonly<{ optionOverride?: boolean; shellClass?: string }>,
): string {
  const attrs = config.usageAttributes.length > 0 ? ` ${config.usageAttributes}` : '';
  const overrideAttr = options?.optionOverride ? '\n    [optionOverride]="chartOptionOverride"' : '';
  const shell = options?.shellClass ? `<div class="${options.shellClass}">` : '';
  const shellClose = options?.shellClass ? '</div>' : '';

  return [
    shell,
    `  <${config.selector}`,
    '    [data]="data"',
    attrs,
    '    [height]="chartHeight"',
    `${overrideAttr}`,
    '  />',
    shellClose,
  ]
    .filter((line) => line.length > 0)
    .join('\n');
}

export function buildCatalogOverviewPlainCodeTabs(config: ChartSeriesDocConfig) {
  const className = toExampleClassName(config, 'OverviewPlain');

  return createChartSeriesCodeTabs({
    baseName: `overview-${config.slug}-plain`,
    tsCode: [
      "import { Component } from '@angular/core';",
      `import { ${config.importName}, type TngChartData } from '@tailng-ui/charts';`,
      '',
      'const data: TngChartData = [',
      ...buildCatalogDemoDataCodeRows(config),
      '];',
      '',
      '@Component({',
      `  imports: [${config.importName}],`,
      `  templateUrl: './${config.slug}-overview-plain.component.html',`,
      `  styleUrl: './${config.slug}-overview-plain.component.css',`,
      '})',
      `export class ${className} {`,
      '  protected readonly data = data;',
      '}',
    ].join('\n'),
    htmlCode: [
      '<div class="chart-series-overview-example-chart chart-series-overview-example-chart--plain">',
      buildCatalogTemplateMarkup(config),
      '</div>',
    ].join('\n'),
    cssCode: [
      '.chart-series-overview-example-chart--plain {',
      '  min-height: 20rem;',
      '  padding: 1rem;',
      '}',
      '',
    ].join('\n'),
  });
}

export function buildCatalogOverviewTailwindCodeTabs(config: ChartSeriesDocConfig) {
  const className = toExampleClassName(config, 'OverviewTailwind');

  return createChartSeriesCodeTabs({
    baseName: `overview-${config.slug}-tailwind`,
    tsCode: [
      "import { Component } from '@angular/core';",
      `import { ${config.importName}, type TngChartData } from '@tailng-ui/charts';`,
      '',
      'const data: TngChartData = [',
      ...buildCatalogDemoDataCodeRows(config),
      '];',
      '',
      '@Component({',
      `  imports: [${config.importName}],`,
      `  templateUrl: './${config.slug}-overview-tailwind.component.html',`,
      '})',
      `export class ${className} {`,
      '  protected readonly data = data;',
      '}',
    ].join('\n'),
    htmlCode: [
      '<div class="chart-shell">',
      buildCatalogTemplateMarkup(config),
      '</div>',
    ].join('\n'),
    cssCode: CHART_SERIES_TAILWIND_LAYOUT_CSS,
  });
}

export function buildCatalogExamplePresetCodeTabs(
  config: ChartSeriesDocConfig,
  variant: 'default' | 'themed' | 'override',
  style: 'plain' | 'tailwind',
) {
  const shellClass =
    variant === 'themed' && style === 'plain'
      ? 'chart-series-example-chart chart-series-example-chart--themed'
      : style === 'plain'
        ? 'chart-series-example-chart chart-series-example-chart--plain'
        : undefined;
  const useTailwindShell = style === 'tailwind' && variant !== 'themed';
  const className = toExampleClassName(config, `${variant}-${style}`);
  const optionOverride = variant === 'override';

  return createChartSeriesCodeTabs({
    baseName: `${config.slug}-${variant}-${style}`,
    tsCode: [
      "import { Component } from '@angular/core';",
      `import { ${config.importName}, type TngChartData } from '@tailng-ui/charts';`,
      '',
      'const data: TngChartData = [',
      ...buildCatalogDemoDataCodeRows(config),
      '];',
      '',
      '@Component({',
      `  imports: [${config.importName}],`,
      `  templateUrl: './${config.slug}-${variant}-${style}.component.html',`,
      style === 'plain' ? `  styleUrl: './${config.slug}-${variant}-${style}.component.css',` : '',
      '})',
      `export class ${className} {`,
      '  protected readonly data = data;',
      '}',
    ]
      .filter((line) => line.length > 0)
      .join('\n'),
    htmlCode: [
      '<div class="chart-series-example-preview">',
      useTailwindShell
        ? `<div class="chart-shell">${buildCatalogTemplateMarkup(config, { optionOverride })}</div>`
        : `<div class="${shellClass ?? 'chart-series-example-chart chart-series-example-chart--plain'}">${buildCatalogTemplateMarkup(config, { optionOverride })}</div>`,
      '</div>',
    ].join('\n'),
    cssCode: style === 'plain' ? CHART_SERIES_PLAIN_LAYOUT_CSS : CHART_SERIES_TAILWIND_LAYOUT_CSS,
  });
}

export function buildCatalogOptionOverride(config: ChartSeriesDocConfig): TngChartOptionOverride {
  if (config.seriesType === 'pie') {
    return (option) => ({
      ...option,
      series: (option['series'] as unknown[] | undefined)?.map((series) => ({
        ...(series as Record<string, unknown>),
        label: { show: true, formatter: '{b}: {d}%' },
      })),
    });
  }

  if (config.seriesType === 'bar') {
    return (option) => ({
      ...option,
      series: (option['series'] as unknown[] | undefined)?.map((series) => ({
        ...(series as Record<string, unknown>),
        itemStyle: { borderRadius: [6, 6, 0, 0] },
      })),
    });
  }

  return (option) => ({
    ...option,
    series: (option['series'] as unknown[] | undefined)?.map((series) => ({
      ...(series as Record<string, unknown>),
      lineStyle: { width: 3 },
      symbolSize: 8,
    })),
  });
}

/**
 * Returns an automatic option override for charts that require
 * `echarts.registerMap()` to render. Used by ChartSeriesCatalogChartComponent
 * so every render site (overview, examples, etc.) shows something meaningful
 * without needing a registered map.
 */
/**
 * Resolves the option override passed to catalog chart previews.
 * Geo presets need the docs fallback first (no registered map); example
 * overrides (line width, bar radius, etc.) run on that drawable option.
 */
export function resolveCatalogChartOptionOverride(
  config: ChartSeriesDocConfig,
  external?: TngChartOptionOverride,
): TngChartOptionOverride | undefined {
  const geoFallback = buildCatalogGeoFallbackOverride(config);
  if (external === undefined) {
    return geoFallback;
  }
  if (geoFallback === undefined) {
    return external;
  }
  return (option) => external(geoFallback(option));
}

export function buildCatalogGeoFallbackOverride(
  config: ChartSeriesDocConfig,
): TngChartOptionOverride | undefined {
  if (config.coordinateSystem !== 'geo') {
    return undefined;
  }

  if (config.seriesType === 'lines') {
    // Animated connection lines on a hidden cartesian grid.
    return (_option) => ({
      grid: { top: 20, right: 20, bottom: 20, left: 20 },
      tooltip: { show: false },
      xAxis: { type: 'value', min: 0, max: 150, show: false },
      yAxis: { type: 'value', min: 0, max: 90, show: false },
      series: [{
        type: 'lines',
        coordinateSystem: 'cartesian2d',
        data: [
          { coords: [[20, 65], [130, 30]] },
          { coords: [[50, 20], [110, 72]] },
          { coords: [[10, 45], [140, 55]] },
          { coords: [[40, 75], [100, 15]] },
          { coords: [[5, 35], [125, 60]] },
        ],
        effect: { show: true, symbol: 'arrow', symbolSize: 6, period: 6 },
        lineStyle: { width: 1.5, opacity: 0.7, curveness: 0.2 },
      }],
    });
  }

  // Generic geo fallback: blank canvas with a placeholder message.
  return (_option) => ({
    title: {
      text: 'Map registration required',
      subtext: 'Call echarts.registerMap() to render geo charts',
      left: 'center',
      top: 'middle',
      textStyle: { fontSize: 14 },
      subtextStyle: { fontSize: 11 },
    },
    series: [],
  });
}

export const CATALOG_THEMED_CHART_STYLE: Readonly<Record<string, string>> = {
  '--tng-chart-series-1': 'var(--tng-semantic-accent-brand)',
  '--tng-chart-series-2': 'var(--tng-semantic-accent-info)',
  '--tng-chart-axis-label': 'var(--tng-semantic-foreground-secondary)',
  '--tng-chart-grid-line':
    'color-mix(in srgb, var(--tng-semantic-border-subtle) 72%, transparent)',
  '--tng-chart-muted': 'var(--tng-semantic-foreground-secondary)',
};

export function supportsCatalogLiveChart(config: ChartSeriesDocConfig): boolean {
  // Geo charts require echarts.registerMap() before they can render.
  // Hide the live demo until a map is registered in the app.
  if (config.coordinateSystem === 'geo') {
    return false;
  }
  return config.fieldInputs.includes('data');
}

function toExampleClassName(config: ChartSeriesDocConfig, suffix = 'Example'): string {
  const base = config.slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

  return `${base}${suffix}`;
}
