import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import {
  TngBarChart,
  type TngBarChartInput,
  type TngBarChartKind,
  TngLineChart,
  type TngLineChartInput,
} from '@tailng-ui/charts';

type TngMetricKind = 'gdp' | 'landArea' | 'population';

type TngCountryMetrics = Readonly<{
  country: string;
  gdpTrillionUsd: number;
  landAreaThousandSqKm: number;
  populationMillions: number;
}>;

type TngMetricMeta = Readonly<{
  color: string;
  label: string;
  unit: string;
}>;

type TngCountryMetricsChartInput = TngBarChartInput & TngLineChartInput;

const countryMetrics = Object.freeze([
  {
    country: 'India',
    gdpTrillionUsd: 3.94,
    landAreaThousandSqKm: 2973.2,
    populationMillions: 1428.6,
  },
  {
    country: 'China',
    gdpTrillionUsd: 18.56,
    landAreaThousandSqKm: 9388.2,
    populationMillions: 1410.7,
  },
  {
    country: 'United States',
    gdpTrillionUsd: 27.72,
    landAreaThousandSqKm: 9147.4,
    populationMillions: 339.7,
  },
  {
    country: 'Indonesia',
    gdpTrillionUsd: 1.39,
    landAreaThousandSqKm: 1811.6,
    populationMillions: 281.6,
  },
  {
    country: 'Pakistan',
    gdpTrillionUsd: 0.37,
    landAreaThousandSqKm: 770.9,
    populationMillions: 251.3,
  },
  {
    country: 'Nigeria',
    gdpTrillionUsd: 0.36,
    landAreaThousandSqKm: 910.8,
    populationMillions: 232.7,
  },
  {
    country: 'Brazil',
    gdpTrillionUsd: 2.17,
    landAreaThousandSqKm: 8358.1,
    populationMillions: 203.1,
  },
  {
    country: 'Bangladesh',
    gdpTrillionUsd: 0.46,
    landAreaThousandSqKm: 130.2,
    populationMillions: 173.6,
  },
  {
    country: 'Russia',
    gdpTrillionUsd: 2.02,
    landAreaThousandSqKm: 16376.9,
    populationMillions: 144.0,
  },
  {
    country: 'Mexico',
    gdpTrillionUsd: 1.81,
    landAreaThousandSqKm: 1943.9,
    populationMillions: 129.9,
  },
] as const satisfies readonly TngCountryMetrics[]);

const metricKinds = Object.freeze(['population', 'landArea', 'gdp'] as const);
const chartKinds = Object.freeze(['bar', 'line'] as const);

/** Colors resolved from theme tokens at runtime for chart (canvas requires computed values) */
const CHART_TOKEN_KEYS: Readonly<Record<TngMetricKind, string>> = Object.freeze({
  gdp: '--tng-semantic-border-strong',
  landArea: '--tng-semantic-accent-success',
  population: '--tng-semantic-accent-brand',
});

const metricMetaByKind: Readonly<Record<TngMetricKind, { label: string; unit: string }>> =
  Object.freeze({
    gdp: { label: 'GDP', unit: 'USD trillion' },
    landArea: { label: 'Land Area', unit: 'thousand sq km' },
    population: { label: 'Population', unit: 'millions' },
  });

function createMetricSeriesData(
  metricKind: TngMetricKind,
  rows: readonly TngCountryMetrics[],
): readonly number[] {
  if (metricKind === 'population') {
    return rows.map((row) => row.populationMillions);
  }

  if (metricKind === 'landArea') {
    return rows.map((row) => row.landAreaThousandSqKm);
  }

  return rows.map((row) => row.gdpTrillionUsd);
}

function resolveTokenColor(doc: Document, tokenKey: string): string {
  const el = doc.createElement('div');
  el.style.color = `var(${tokenKey})`;
  doc.body.appendChild(el);
  const value = getComputedStyle(el).color;
  doc.body.removeChild(el);
  return value || 'rgb(100, 116, 139)';
}

@Component({
  selector: 'app-country-metrics-chart-playground-page',
  imports: [TngBarChart, TngLineChart],
  templateUrl: './country-metrics-chart-playground-page.component.html',
  styleUrl: './country-metrics-chart-playground-page.component.css',
})
export class CountryMetricsChartPlaygroundPageComponent {
  private readonly doc = inject(DOCUMENT);

  protected readonly chartKinds = chartKinds;
  protected readonly countries = countryMetrics;
  protected readonly metricKinds = metricKinds;

  protected readonly selectedChartKind = signal<TngBarChartKind>('bar');
  protected readonly selectedMetricKind = signal<TngMetricKind>('population');
  protected readonly runtimeErrorMessage = signal<string | null>(null);

  protected readonly activeMetricMeta = computed<TngMetricMeta>(() => {
    const kind = this.selectedMetricKind();
    const meta = metricMetaByKind[kind];
    const color = resolveTokenColor(this.doc, CHART_TOKEN_KEYS[kind]);
    return { ...meta, color };
  });

  protected readonly chartInput = computed<TngCountryMetricsChartInput>(() => {
    const kind = this.selectedMetricKind();
    const meta = this.activeMetricMeta();
    const seriesData = createMetricSeriesData(kind, countryMetrics);
    const countryLabels = countryMetrics.map((row) => row.country);
    return {
      categories: countryLabels,
      chartTitle: `${meta.label} by Country`,
      series: [{ color: meta.color, name: meta.label, values: seriesData }],
      unitLabel: meta.unit,
      xAxisLabelRotation: 28,
      yAxisLabel: meta.label,
    };
  });

  protected onChartKindSelect(chartKind: TngBarChartKind): void {
    this.selectedChartKind.set(chartKind);
  }

  protected onMetricSelect(metricKind: TngMetricKind): void {
    this.selectedMetricKind.set(metricKind);
  }

  protected onRuntimeError(message: string): void {
    this.runtimeErrorMessage.set(message);
  }
}
