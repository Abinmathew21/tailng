import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
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

const metricMetaByKind: Readonly<Record<TngMetricKind, TngMetricMeta>> = Object.freeze({
  gdp: {
    color: '#eab308',
    label: 'GDP',
    unit: 'USD trillion',
  },
  landArea: {
    color: '#10b981',
    label: 'Land Area',
    unit: 'thousand sq km',
  },
  population: {
    color: '#06b6d4',
    label: 'Population',
    unit: 'millions',
  },
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

function createCountryMetricsChartInput(metricKind: TngMetricKind): TngCountryMetricsChartInput {
  const metricMeta = metricMetaByKind[metricKind];
  const seriesData = createMetricSeriesData(metricKind, countryMetrics);
  const countryLabels = countryMetrics.map((row) => row.country);

  return {
    categories: countryLabels,
    chartTitle: `${metricMeta.label} by Country`,
    series: [
      {
        color: metricMeta.color,
        name: metricMeta.label,
        values: seriesData,
      },
    ],
    unitLabel: metricMeta.unit,
    xAxisLabelRotation: 28,
    yAxisLabel: metricMeta.label,
  };
}

@Component({
  selector: 'app-country-metrics-chart-playground-page',
  imports: [RouterLink, TngBarChart, TngLineChart],
  templateUrl: './country-metrics-chart-playground-page.component.html',
  styleUrl: './country-metrics-chart-playground-page.component.css',
})
export class CountryMetricsChartPlaygroundPageComponent {
  protected readonly chartKinds = chartKinds;
  protected readonly countries = countryMetrics;
  protected readonly metricKinds = metricKinds;

  protected readonly selectedChartKind = signal<TngBarChartKind>('bar');
  protected readonly selectedMetricKind = signal<TngMetricKind>('population');
  protected readonly runtimeErrorMessage = signal<string | null>(null);

  protected readonly activeMetricMeta = computed<TngMetricMeta>(() => {
    return metricMetaByKind[this.selectedMetricKind()];
  });

  protected readonly chartInput = computed<TngCountryMetricsChartInput>(() => {
    return createCountryMetricsChartInput(this.selectedMetricKind());
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
