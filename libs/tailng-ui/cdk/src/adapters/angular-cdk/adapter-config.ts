import type {
  TngAngularCdkAdapterConfig,
  TngAngularCdkFeature,
  TngResolvedAngularCdkAdapterConfig,
} from './adapter.types';

const defaultAdapterMode = 'fallback-tailng';

const defaultEnabledFeatures: readonly TngAngularCdkFeature[] = Object.freeze([
  'active-descendant',
  'overlay-backdrop',
  'overlay-outside-interaction',
  'overlay-portal',
  'overlay-positioning',
  'overlay-scroll-lock',
  'roving-focus',
  'selection-model',
  'typeahead',
]);

function normalizeEnabledFeatures(
  features: readonly TngAngularCdkFeature[] | undefined,
): readonly TngAngularCdkFeature[] {
  const uniqueFeatures = new Set<TngAngularCdkFeature>();
  for (const feature of features ?? defaultEnabledFeatures) {
    uniqueFeatures.add(feature);
  }

  return Object.freeze([...uniqueFeatures.values()]);
}

export function resolveAngularCdkAdapterConfig(
  config: TngAngularCdkAdapterConfig = {},
): TngResolvedAngularCdkAdapterConfig {
  return Object.freeze({
    enabledFeatures: normalizeEnabledFeatures(config.enabledFeatures),
    mode: config.mode ?? defaultAdapterMode,
  });
}

export function shouldUseAngularCdkFeature(
  config: TngAngularCdkAdapterConfig | undefined,
  feature: TngAngularCdkFeature,
): boolean {
  const resolvedConfig = resolveAngularCdkAdapterConfig(config);
  return (
    resolvedConfig.mode === 'prefer-angular-cdk' && resolvedConfig.enabledFeatures.includes(feature)
  );
}
