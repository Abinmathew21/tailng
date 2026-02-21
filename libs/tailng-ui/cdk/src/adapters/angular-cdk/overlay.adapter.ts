import { shouldUseAngularCdkFeature } from './adapter-config';
import type { TngAngularCdkAdapterConfig } from './adapter.types';
import {
  computeOverlayPosition,
  createOverlayBackdropController,
  createOverlayInteractionController,
  createOverlayLayerStack,
  createPortalManager,
  createScrollLockManager,
  type TngOverlayBackdropController,
  type TngOverlayBackdropControllerOptions,
  type TngOverlayInteractionController,
  type TngOverlayInteractionOptions,
  type TngOverlayLayerStack,
  type TngOverlayPositionOptions,
  type TngOverlayPositionResult,
  type TngPortalManager,
  type TngPortalManagerOptions,
  type TngScrollLockManager,
  type TngScrollLockOptions,
} from '../../overlay';

type TngOverlayAdapterOptions = Readonly<{
  adapterConfig?: TngAngularCdkAdapterConfig;
}>;

export type TngOverlayLayerStackAdapterOptions = TngOverlayAdapterOptions;

export type TngOverlayInteractionAdapterOptions = Readonly<
  TngOverlayAdapterOptions & {
    interaction: TngOverlayInteractionOptions;
  }
>;

export type TngOverlayPositionAdapterOptions = Readonly<
  TngOverlayAdapterOptions & {
    position: TngOverlayPositionOptions;
  }
>;

export type TngPortalAdapterOptions = Readonly<
  TngOverlayAdapterOptions & {
    portal?: TngPortalManagerOptions;
  }
>;

export type TngScrollLockAdapterOptions = Readonly<
  TngOverlayAdapterOptions & {
    scrollLock?: TngScrollLockOptions;
  }
>;

export type TngOverlayBackdropAdapterOptions = Readonly<
  TngOverlayAdapterOptions & {
    backdrop: TngOverlayBackdropControllerOptions;
  }
>;

export function createOverlayLayerStackAdapter(
  options: TngOverlayLayerStackAdapterOptions = {},
): TngOverlayLayerStack {
  const useAngularCdkPositioning = shouldUseAngularCdkFeature(
    options.adapterConfig,
    'overlay-positioning',
  );
  if (useAngularCdkPositioning) {
    // Phase 1 scaffold: Angular CDK overlay stack orchestration lands in Phase 2.
    return createOverlayLayerStack();
  }

  return createOverlayLayerStack();
}

export function createOverlayInteractionAdapter(
  options: TngOverlayInteractionAdapterOptions,
): TngOverlayInteractionController {
  const useAngularCdk = shouldUseAngularCdkFeature(
    options.adapterConfig,
    'overlay-outside-interaction',
  );
  if (useAngularCdk) {
    // Phase 1 scaffold: Angular CDK overlay interaction dispatch wiring lands in Phase 2.
    return createOverlayInteractionController(options.interaction);
  }

  return createOverlayInteractionController(options.interaction);
}

export function computeOverlayPositionAdapter(
  options: TngOverlayPositionAdapterOptions,
): TngOverlayPositionResult {
  const useAngularCdk = shouldUseAngularCdkFeature(options.adapterConfig, 'overlay-positioning');
  if (useAngularCdk) {
    // Phase 1 scaffold: Angular CDK connected positioning strategy wiring lands in Phase 2.
    return computeOverlayPosition(options.position);
  }

  return computeOverlayPosition(options.position);
}

export function createPortalAdapter(options: TngPortalAdapterOptions = {}): TngPortalManager {
  const useAngularCdk = shouldUseAngularCdkFeature(options.adapterConfig, 'overlay-portal');
  if (useAngularCdk) {
    // Phase 1 scaffold: Angular CDK Portal wiring lands in Phase 2.
    return createPortalManager(options.portal ?? {});
  }

  return createPortalManager(options.portal ?? {});
}

export function createScrollLockAdapter(
  options: TngScrollLockAdapterOptions = {},
): TngScrollLockManager {
  const useAngularCdk = shouldUseAngularCdkFeature(options.adapterConfig, 'overlay-scroll-lock');
  if (useAngularCdk) {
    // Phase 1 scaffold: Angular CDK block scroll strategy wiring lands in Phase 2.
    return createScrollLockManager(options.scrollLock ?? {});
  }

  return createScrollLockManager(options.scrollLock ?? {});
}

export function createOverlayBackdropAdapter(
  options: TngOverlayBackdropAdapterOptions,
): TngOverlayBackdropController {
  const useAngularCdk = shouldUseAngularCdkFeature(options.adapterConfig, 'overlay-backdrop');
  if (useAngularCdk) {
    // Phase 1 scaffold: Angular CDK backdrop wiring lands in Phase 2.
    return createOverlayBackdropController(options.backdrop);
  }

  return createOverlayBackdropController(options.backdrop);
}
