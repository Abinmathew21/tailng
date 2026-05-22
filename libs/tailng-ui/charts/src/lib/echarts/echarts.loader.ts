import type { TngChartRuntime, TngChartRuntimeLoader } from '../core/chart.types';

type TngRuntimeModuleLoader = () => Promise<unknown>;

type TngEchartsModuleSets = Readonly<{
  charts: Readonly<Record<string, unknown>>;
  components: Readonly<Record<string, unknown>>;
  features: Readonly<Record<string, unknown>>;
  renderers: Readonly<Record<string, unknown>>;
  runtime: TngChartRuntime;
}>;

let hasRegisteredTngChartModules = false;

function pickTngEchartsModule(module: unknown, key: string): unknown {
  if (typeof module !== 'object' || module === null) {
    return null;
  }

  const candidate = (module as Readonly<Record<string, unknown>>)[key];
  return candidate ?? null;
}

function compactTngEchartsModules(modules: readonly unknown[]): readonly unknown[] {
  return modules.filter((module) => module !== null && module !== undefined);
}

function createTngEchartsChartModules(charts: Readonly<Record<string, unknown>>): readonly unknown[] {
  return [
    charts['LineChart'],
    charts['BarChart'],
    charts['BoxplotChart'],
    charts['CandlestickChart'],
    pickTngEchartsModule(charts, 'ChordChart'),
    charts['CustomChart'],
    charts['EffectScatterChart'],
    charts['FunnelChart'],
    charts['GaugeChart'],
    charts['GraphChart'],
    charts['PieChart'],
    charts['ParallelChart'],
    charts['PictorialBarChart'],
    charts['RadarChart'],
    charts['SankeyChart'],
    charts['ScatterChart'],
    charts['HeatmapChart'],
    charts['LinesChart'],
    charts['MapChart'],
    charts['SunburstChart'],
    charts['ThemeRiverChart'],
    charts['TreeChart'],
    charts['TreemapChart'],
  ];
}

function createTngEchartsComponentModules(
  components: Readonly<Record<string, unknown>>,
): readonly unknown[] {
  return [
    components['AriaComponent'],
    components['AxisPointerComponent'],
    components['BrushComponent'],
    components['CalendarComponent'],
    components['DataZoomComponent'],
    components['DataZoomInsideComponent'],
    components['DataZoomSliderComponent'],
    components['GeoComponent'],
    components['GraphicComponent'],
    components['GridComponent'],
    components['GridSimpleComponent'],
    components['TooltipComponent'],
    components['LegendComponent'],
    components['LegendPlainComponent'],
    components['LegendScrollComponent'],
    components['DatasetComponent'],
    components['TransformComponent'],
    components['MarkAreaComponent'],
    components['MarkLineComponent'],
    components['MarkPointComponent'],
    pickTngEchartsModule(components, 'MatrixComponent'),
    components['ParallelComponent'],
    components['PolarComponent'],
    components['RadarComponent'],
    components['SingleAxisComponent'],
    components['VisualMapComponent'],
    components['VisualMapContinuousComponent'],
    components['VisualMapPiecewiseComponent'],
    components['TitleComponent'],
    components['ToolboxComponent'],
  ];
}

function createTngEchartsFeatureModules(
  features: Readonly<Record<string, unknown>>,
  renderers: Readonly<Record<string, unknown>>,
): readonly unknown[] {
  return [
    features['LabelLayout'],
    features['UniversalTransition'],
    renderers['CanvasRenderer'],
    renderers['SVGRenderer'],
  ];
}

function registerTngEchartsModules(moduleSets: TngEchartsModuleSets): void {
  if (hasRegisteredTngChartModules) {
    return;
  }

  moduleSets.runtime.use?.(
    compactTngEchartsModules([
      ...createTngEchartsChartModules(moduleSets.charts),
      ...createTngEchartsComponentModules(moduleSets.components),
      ...createTngEchartsFeatureModules(moduleSets.features, moduleSets.renderers),
    ]),
  );
  hasRegisteredTngChartModules = true;
}

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

  registerTngEchartsModules({ charts, components, features, renderers, runtime });

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
