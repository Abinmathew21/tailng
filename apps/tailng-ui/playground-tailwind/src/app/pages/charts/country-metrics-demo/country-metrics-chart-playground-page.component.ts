import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TngChart, type TngChartOption } from '@tailng-ui/charts';

type TngChartKind = 'bar' | 'line';
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

function createCountryMetricsChartOption(
  metricKind: TngMetricKind,
  chartKind: TngChartKind,
): TngChartOption {
  const metricMeta = metricMetaByKind[metricKind];
  const seriesData = createMetricSeriesData(metricKind, countryMetrics);
  const countryLabels = countryMetrics.map((row) => row.country);

  return {
    animationDuration: 320,
    grid: {
      bottom: 80,
      left: 72,
      right: 24,
      top: 28,
    },
    legend: {
      data: [metricMeta.label],
      textStyle: {
        color: '#cbd5e1',
      },
    },
    tooltip: {
      trigger: 'axis',
      valueFormatter: (value: number): string => `${value.toLocaleString()} ${metricMeta.unit}`,
    },
    xAxis: {
      axisLabel: {
        color: '#cbd5e1',
        interval: 0,
        rotate: 28,
      },
      axisLine: {
        lineStyle: {
          color: '#334155',
        },
      },
      data: countryLabels,
      type: 'category',
    },
    yAxis: {
      axisLabel: {
        color: '#cbd5e1',
      },
      name: `${metricMeta.label} (${metricMeta.unit})`,
      nameTextStyle: {
        color: '#94a3b8',
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(148, 163, 184, 0.25)',
        },
      },
      type: 'value',
    },
    series: [
      {
        areaStyle: chartKind === 'line' ? { color: metricMeta.color, opacity: 0.12 } : undefined,
        barMaxWidth: chartKind === 'bar' ? 44 : undefined,
        itemStyle: {
          borderRadius: chartKind === 'bar' ? [6, 6, 0, 0] : undefined,
          color: metricMeta.color,
        },
        lineStyle: chartKind === 'line' ? { color: metricMeta.color, width: 3 } : undefined,
        name: metricMeta.label,
        smooth: chartKind === 'line',
        symbol: chartKind === 'line' ? 'circle' : undefined,
        symbolSize: chartKind === 'line' ? 8 : undefined,
        type: chartKind,
        data: seriesData,
      },
    ],
  };
}

@Component({
  selector: 'app-country-metrics-chart-playground-page',
  imports: [RouterLink, TngChart],
  templateUrl: './country-metrics-chart-playground-page.component.html',
  styleUrl: './country-metrics-chart-playground-page.component.css',
})
export class CountryMetricsChartPlaygroundPageComponent {
  protected readonly chartKinds = chartKinds;
  protected readonly countries = countryMetrics;
  protected readonly metricKinds = metricKinds;

  protected readonly selectedChartKind = signal<TngChartKind>('bar');
  protected readonly selectedMetricKind = signal<TngMetricKind>('population');
  protected readonly runtimeErrorMessage = signal<string | null>(null);

  protected readonly activeMetricMeta = computed<TngMetricMeta>(() => {
    return metricMetaByKind[this.selectedMetricKind()];
  });

  protected readonly chartOption = computed<TngChartOption>(() => {
    return createCountryMetricsChartOption(this.selectedMetricKind(), this.selectedChartKind());
  });

  protected onChartKindSelect(chartKind: TngChartKind): void {
    this.selectedChartKind.set(chartKind);
  }

  protected onMetricSelect(metricKind: TngMetricKind): void {
    this.selectedMetricKind.set(metricKind);
  }

  protected onRuntimeError(message: string): void {
    this.runtimeErrorMessage.set(message);
  }
}
