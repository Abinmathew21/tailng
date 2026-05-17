import type { TngChartRuntime, TngChartRuntimeLoader } from '../core/chart.types';

type TngRuntimeModuleLoader = () => Promise<unknown>;

let hasRegisteredTngChartModules = false;

async function loadTngEchartsCoreRuntime(): Promise<unknown> {
  const [core, charts, components, features, renderers] = await Promise.all([
    import('echarts/core'),
    import('echarts/charts'),
    import('echarts/components'),
    import('echarts/features'),
    import('echarts/renderers'),
  ]);

  const runtime = resolveTngEchartsModule(core);
  if (runtime === null) {
    return core;
  }

  if (!hasRegisteredTngChartModules) {
    runtime.use?.([
      charts.LineChart,
      charts.BarChart,
      charts.PieChart,
      charts.ScatterChart,
      charts.HeatmapChart,
      components.GridComponent,
      components.TooltipComponent,
      components.LegendComponent,
      components.DatasetComponent,
      components.TransformComponent,
      components.VisualMapComponent,
      components.TitleComponent,
      features.LabelLayout,
      features.UniversalTransition,
      renderers.CanvasRenderer,
      renderers.SVGRenderer,
    ]);
    hasRegisteredTngChartModules = true;
  }

  return runtime;
}

const runtimeModuleLoaders: readonly TngRuntimeModuleLoader[] = Object.freeze([
  loadTngEchartsCoreRuntime,
]);

function hasInitMethod(candidate: unknown): candidate is Pick<TngChartRuntime, 'init'> {
  if (typeof candidate !== 'object' || candidate === null) {
    return false;
  }

  const withInit = candidate as Readonly<{ init?: unknown }>;
  return typeof withInit.init === 'function';
}

function resolveModuleCandidate(candidate: unknown): unknown {
  if (typeof candidate !== 'object' || candidate === null) {
    return candidate;
  }

  const maybeDefault = candidate as Readonly<{ default?: unknown }>;
  return maybeDefault.default ?? candidate;
}

export function resolveTngEchartsModule(candidate: unknown): TngChartRuntime | null {
  const resolved = resolveModuleCandidate(candidate);
  return hasInitMethod(resolved) ? resolved : null;
}

export async function loadTngEchartsRuntime(
  customLoader: TngChartRuntimeLoader | null = null,
): Promise<TngChartRuntime> {
  if (customLoader !== null) {
    const loadedFromCustom = resolveTngEchartsModule(await customLoader());
    if (loadedFromCustom !== null) {
      return loadedFromCustom;
    }
    throw new Error('Custom ECharts loader returned an invalid module.');
  }

  for (const loadModule of runtimeModuleLoaders) {
    try {
      const imported = await loadModule();
      const runtime = resolveTngEchartsModule(imported);
      if (runtime !== null) {
        return runtime;
      }
    } catch {
      continue;
    }
  }

  throw new Error(
    'Unable to load ECharts runtime. Install "echarts", run install, or provide a custom loader.',
  );
}
