import { shouldUseAngularCdkFeature } from './adapter-config';
import type { TngAngularCdkAdapterConfig } from './adapter.types';
import {
  createSelectionModel,
  type TngSelectionModel,
  type TngSelectionModelOptions,
} from '../../collections';

export type TngSelectionModelAdapterOptions<TValue> = Readonly<{
  adapterConfig?: TngAngularCdkAdapterConfig;
  selection: TngSelectionModelOptions<TValue>;
}>;

export function createSelectionModelAdapter<TValue>(
  options: TngSelectionModelAdapterOptions<TValue>,
): TngSelectionModel<TValue> {
  const useAngularCdk = shouldUseAngularCdkFeature(options.adapterConfig, 'selection-model');

  if (useAngularCdk) {
    // Phase 1 scaffold: Angular CDK SelectionModel wiring lands in Phase 3.
    return createSelectionModel(options.selection);
  }

  return createSelectionModel(options.selection);
}
