import type { TngEchartsModule, TngEchartsModuleLoader } from './chart.types';

const runtimeModuleCandidates = Object.freeze(['echarts', 'echarts/core'] as const);

function hasInitMethod(candidate: unknown): candidate is Pick<TngEchartsModule, 'init'> {
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

async function loadDynamicModule(moduleName: string): Promise<unknown> {
  return import(/* @vite-ignore */ moduleName);
}

export function resolveTngEchartsModule(candidate: unknown): TngEchartsModule | null {
  const resolved = resolveModuleCandidate(candidate);
  return hasInitMethod(resolved) ? resolved : null;
}

export async function loadTngEchartsRuntime(
  customLoader: TngEchartsModuleLoader | null = null,
): Promise<TngEchartsModule> {
  if (customLoader !== null) {
    const loadedFromCustom = resolveTngEchartsModule(await customLoader());
    if (loadedFromCustom !== null) {
      return loadedFromCustom;
    }
    throw new Error('Custom ECharts loader returned an invalid module.');
  }

  for (const moduleName of runtimeModuleCandidates) {
    try {
      const imported = await loadDynamicModule(moduleName);
      const runtime = resolveTngEchartsModule(imported);
      if (runtime !== null) {
        return runtime;
      }
    } catch {
      continue;
    }
  }

  throw new Error(
    'Unable to load ECharts runtime. Install "echarts" or provide a custom loader.',
  );
}
