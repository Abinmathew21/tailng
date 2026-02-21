import {
  type TngOverlayDismissReason,
  type TngOverlayLayer,
  type TngOverlayLayerStack,
} from './layer-stack.types';

type TngRegisteredLayer = Readonly<{
  layer: TngOverlayLayer;
  order: number;
}>;

function compareLayers(left: TngRegisteredLayer, right: TngRegisteredLayer): number {
  const priorityDiff = (left.layer.priority ?? 0) - (right.layer.priority ?? 0);
  return priorityDiff === 0 ? left.order - right.order : priorityDiff;
}

function findLayerIndexById(layers: readonly TngRegisteredLayer[], id: string): number {
  return layers.findIndex((entry) => entry.layer.id === id);
}

class OverlayLayerStack implements TngOverlayLayerStack {
  private readonly layers: TngRegisteredLayer[] = [];
  private nextOrder = 0;

  public dismissById(id: string, reason: TngOverlayDismissReason): void {
    const layer = this.findLayerById(id);
    layer?.onDismiss(reason);
  }

  public dismissTop(reason: TngOverlayDismissReason): void {
    this.getTopLayer()?.onDismiss(reason);
  }

  public getLayerIds(): readonly string[] {
    return this.layers.map((entry) => entry.layer.id);
  }

  public getTopLayer(): TngOverlayLayer | null {
    const entry = this.layers[this.layers.length - 1];
    return entry?.layer ?? null;
  }

  public getTopModalLayer(): TngOverlayLayer | null {
    for (let index = this.layers.length - 1; index >= 0; index -= 1) {
      const entry = this.layers[index];
      if (entry?.layer.modal === true) {
        return entry.layer;
      }
    }

    return null;
  }

  public isTopLayer(id: string): boolean {
    return this.getTopLayer()?.id === id;
  }

  public register(layer: TngOverlayLayer): void {
    this.unregister(layer.id);
    this.nextOrder += 1;
    this.layers.push({ layer, order: this.nextOrder });
    this.layers.sort(compareLayers);
  }

  public resolveEscapeDismissTarget(): TngOverlayLayer | null {
    const topLayer = this.getTopLayer();
    if (topLayer === null || topLayer.dismissOnEscape === false) {
      return null;
    }

    return topLayer;
  }

  public resolveOutsidePointerDismissTarget(
    target: unknown,
    path: readonly unknown[],
  ): TngOverlayLayer | null {
    const topLayer = this.getTopLayer();
    if (topLayer === null) {
      return null;
    }

    if (topLayer.containsTarget?.(target, path) === true) {
      return null;
    }

    return topLayer.dismissOnOutsidePointer === false ? null : topLayer;
  }

  public unregister(id: string): void {
    const index = findLayerIndexById(this.layers, id);
    if (index >= 0) {
      this.layers.splice(index, 1);
    }
  }

  private findLayerById(id: string): TngOverlayLayer | null {
    const index = findLayerIndexById(this.layers, id);
    return index >= 0 ? (this.layers[index]?.layer ?? null) : null;
  }
}

export function createOverlayLayerStack(): TngOverlayLayerStack {
  return new OverlayLayerStack();
}
