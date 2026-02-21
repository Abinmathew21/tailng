import { shouldUseAngularCdkFeature } from './adapter-config';
import type { TngAngularCdkAdapterConfig } from './adapter.types';
import {
  createActiveDescendantController,
  createRovingFocusController,
  type TngActiveDescendantController,
  type TngActiveDescendantOptions,
  type TngRovingFocusController,
  type TngRovingFocusOptions,
} from '../../a11y';
import {
  createTypeaheadController,
  type TngTypeaheadController,
  type TngTypeaheadOptions,
} from '../../collections';

type TngKeyManagerAdapterOptions = Readonly<{
  adapterConfig?: TngAngularCdkAdapterConfig;
}>;

export type TngRovingFocusAdapterOptions = Readonly<
  TngKeyManagerAdapterOptions & {
    rovingFocus: TngRovingFocusOptions;
  }
>;

export type TngActiveDescendantAdapterOptions = Readonly<
  TngKeyManagerAdapterOptions & {
    activeDescendant: TngActiveDescendantOptions;
  }
>;

export type TngTypeaheadAdapterOptions = Readonly<
  TngKeyManagerAdapterOptions & {
    typeahead: TngTypeaheadOptions;
  }
>;

export function createRovingFocusAdapter(
  options: TngRovingFocusAdapterOptions,
): TngRovingFocusController {
  const useAngularCdk = shouldUseAngularCdkFeature(options.adapterConfig, 'roving-focus');

  if (useAngularCdk) {
    // Phase 1 scaffold: Angular CDK FocusKeyManager wiring lands in Phase 3.
    return createRovingFocusController(options.rovingFocus);
  }

  return createRovingFocusController(options.rovingFocus);
}

export function createActiveDescendantAdapter(
  options: TngActiveDescendantAdapterOptions,
): TngActiveDescendantController {
  const useAngularCdk = shouldUseAngularCdkFeature(options.adapterConfig, 'active-descendant');

  if (useAngularCdk) {
    // Phase 1 scaffold: Angular CDK ActiveDescendantKeyManager wiring lands in Phase 3.
    return createActiveDescendantController(options.activeDescendant);
  }

  return createActiveDescendantController(options.activeDescendant);
}

export function createTypeaheadAdapter(
  options: TngTypeaheadAdapterOptions,
): TngTypeaheadController {
  const useAngularCdk = shouldUseAngularCdkFeature(options.adapterConfig, 'typeahead');

  if (useAngularCdk) {
    // Phase 1 scaffold: Angular CDK ListKeyManager typeahead wiring lands in Phase 3.
    return createTypeaheadController(options.typeahead);
  }

  return createTypeaheadController(options.typeahead);
}
