import type { TngAngularCdkAdapterConfig } from '../../adapters/angular-cdk/adapter.types';
import {
  createOverlayInteractionAdapter,
  createOverlayLayerStackAdapter,
  createScrollLockAdapter,
  type TngAngularCdkOverlayDelegates,
} from '../../adapters/angular-cdk/overlay.adapter';
import type {
  TngOverlayDismissReason,
  TngOverlayLayer,
  TngOverlayLayerStack,
} from '../layer-stack/layer-stack.types';
import { createOverlayInteractionDocument } from '../outside-interaction/outside-interaction';
import type {
  TngOverlayInteractionController,
  TngOverlayInteractionDocument,
  TngOverlayInteractionDomDocument,
  TngOverlayKeyboardEvent,
  TngOverlayPointerEvent,
} from '../outside-interaction/outside-interaction.types';
import type {
  TngScrollLockManager,
  TngScrollLockOptions,
} from '../scroll-lock/scroll-lock.types';

type TngOverlayAdapterRuntimeOptions = Readonly<{
  adapterConfig?: TngAngularCdkAdapterConfig;
  angularCdk?: TngAngularCdkOverlayDelegates;
}>;

export type TngOverlayRuntimeOptions = Readonly<
  TngOverlayAdapterRuntimeOptions & {
    documentRef?: TngOverlayInteractionDomDocument | null;
  }
>;

export type TngOverlayRuntime = Readonly<{
  clearLayers: () => void;
  dispatchKeydown: (event: TngOverlayKeyboardEvent) => void;
  dispatchPointerDown: (event: TngOverlayPointerEvent) => void;
  dismissById: (id: string, reason: TngOverlayDismissReason) => void;
  getLayerIds: () => readonly string[];
  isTopLayer: (id: string) => boolean;
  registerLayer: (layer: TngOverlayLayer) => void;
  unregisterLayer: (id: string) => void;
}>;

function toInteractionDocument(
  documentRef: TngOverlayInteractionDomDocument | null | undefined,
): TngOverlayInteractionDocument | null {
  if (documentRef === null || documentRef === undefined) {
    return null;
  }

  return createOverlayInteractionDocument(documentRef);
}

class OverlayRuntime implements TngOverlayRuntime {
  private readonly interaction: TngOverlayInteractionController;
  private readonly layerStack: TngOverlayLayerStack;
  private readonly registeredLayerIds = new Set<string>();

  public constructor(private readonly options: TngOverlayRuntimeOptions) {
    this.layerStack = createOverlayLayerStackAdapter({
      adapterConfig: options.adapterConfig,
      angularCdk: options.angularCdk,
    });
    this.interaction = createOverlayInteractionAdapter({
      adapterConfig: options.adapterConfig,
      angularCdk: options.angularCdk,
      interaction: {
        documentRef: toInteractionDocument(options.documentRef),
        layerStack: this.layerStack,
      },
    });
  }

  public clearLayers(): void {
    for (const id of this.getLayerIds()) {
      this.unregisterLayer(id);
    }
  }

  public dispatchKeydown(event: TngOverlayKeyboardEvent): void {
    this.interaction.handleKeydown(event);
  }

  public dispatchPointerDown(event: TngOverlayPointerEvent): void {
    this.interaction.handlePointerDown(event);
  }

  public dismissById(id: string, reason: TngOverlayDismissReason): void {
    this.layerStack.dismissById(id, reason);
  }

  public getLayerIds(): readonly string[] {
    return this.layerStack.getLayerIds();
  }

  public isTopLayer(id: string): boolean {
    return this.layerStack.isTopLayer(id);
  }

  public registerLayer(layer: TngOverlayLayer): void {
    const hasLayer = this.registeredLayerIds.has(layer.id);
    this.layerStack.register(layer);
    if (!hasLayer) {
      this.registeredLayerIds.add(layer.id);
      this.startInteractionIfNeeded();
    }
  }

  public unregisterLayer(id: string): void {
    if (!this.registeredLayerIds.has(id)) {
      return;
    }

    this.layerStack.unregister(id);
    this.registeredLayerIds.delete(id);
    this.stopInteractionIfPossible();
  }

  private startInteractionIfNeeded(): void {
    if (this.registeredLayerIds.size === 1) {
      this.interaction.start();
    }
  }

  private stopInteractionIfPossible(): void {
    if (this.registeredLayerIds.size === 0) {
      this.interaction.stop();
    }
  }
}

export function createOverlayRuntime(options: TngOverlayRuntimeOptions = {}): TngOverlayRuntime {
  return new OverlayRuntime(options);
}

export function createOverlayScrollLockManager(
  options: Readonly<TngScrollLockOptions> = {},
  runtimeOptions: TngOverlayAdapterRuntimeOptions = {},
): TngScrollLockManager {
  return createScrollLockAdapter({
    adapterConfig: runtimeOptions.adapterConfig,
    angularCdk: runtimeOptions.angularCdk,
    scrollLock: options,
  });
}
