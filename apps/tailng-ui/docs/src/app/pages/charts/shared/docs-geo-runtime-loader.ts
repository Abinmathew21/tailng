import {
  loadTngEchartsRuntime,
  type TngChartRuntime,
  type TngChartRuntimeLoader,
} from '@tailng-ui/charts';

export const DOCS_GEO_MAP_NAME = 'tailng-demo-world';
export const DOCS_GEO_MAP_DATA = [
  { name: 'Northwest', value: 84 },
  { name: 'Northeast', value: 62 },
  { name: 'Southwest', value: 48 },
  { name: 'Southeast', value: 71 },
  { name: 'Central', value: 56 },
] as const;

type TngChartRuntimeWithMaps = TngChartRuntime & Readonly<{
  registerMap?: (name: string, geoJson: unknown) => void;
}>;

let docsGeoRuntimePromise: Promise<TngChartRuntime> | null = null;

export const loadDocsGeoRuntime: TngChartRuntimeLoader = async () => {
  docsGeoRuntimePromise ??= loadDocsGeoRuntimeOnce();
  return docsGeoRuntimePromise;
};

async function loadDocsGeoRuntimeOnce(): Promise<TngChartRuntime> {
  const runtime = await loadTngEchartsRuntime() as TngChartRuntimeWithMaps;

  if (runtime.registerMap === undefined) {
    throw new Error('The ECharts runtime does not expose registerMap().');
  }

  const response = await fetch('assets/charts/maps/tailng-demo-world.geojson');
  const geoJson = await response.json() as unknown;
  runtime.registerMap(DOCS_GEO_MAP_NAME, geoJson);

  return runtime;
}
