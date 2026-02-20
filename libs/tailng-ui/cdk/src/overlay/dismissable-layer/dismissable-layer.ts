import {
  type TngDismissReason,
  type TngDismissableLayer,
  type TngDismissableLayerController,
} from './dismissable-layer.types';

function compareByPriority(
  left: TngDismissableLayer,
  right: TngDismissableLayer,
): number {
  return (left.priority ?? 0) - (right.priority ?? 0);
}

export function createDismissableLayerController(): TngDismissableLayerController {
  const layers: TngDismissableLayer[] = [];

  const register = (layer: TngDismissableLayer): void => {
    layers.push(layer);
    layers.sort(compareByPriority);
  };

  const unregister = (id: string): void => {
    const index = layers.findIndex((layer) => layer.id === id);
    if (index >= 0) {
      layers.splice(index, 1);
    }
  };

  const dismissTop = (reason: TngDismissReason): void => {
    const topLayer = layers.at(-1);
    if (topLayer !== undefined) {
      topLayer.onDismiss(reason);
    }
  };

  const getLayerIds = (): readonly string[] => layers.map((layer) => layer.id);

  return Object.freeze({ dismissTop, getLayerIds, register, unregister });
}
