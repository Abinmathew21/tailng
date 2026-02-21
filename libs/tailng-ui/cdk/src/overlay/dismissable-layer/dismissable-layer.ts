import {
  type TngDismissReason,
  type TngDismissableLayer,
  type TngDismissableLayerController,
} from './dismissable-layer.types';
import { createOverlayLayerStack } from '../layer-stack/layer-stack';
import type { TngOverlayDismissReason } from '../layer-stack/layer-stack.types';

function toOverlayDismissReason(reason: TngDismissReason): TngOverlayDismissReason {
  return reason === 'escape' ? 'escape-key' : 'outside-pointer';
}

function toDismissReason(reason: TngOverlayDismissReason): TngDismissReason {
  if (reason === 'escape-key') {
    return 'escape';
  }

  return 'outside';
}

function toDismissableLayer(layer: TngDismissableLayer): Readonly<{
  id: string;
  onDismiss: (reason: TngOverlayDismissReason) => void;
  priority?: number;
}> {
  return {
    id: layer.id,
    onDismiss: (reason: TngOverlayDismissReason): void => {
      layer.onDismiss(toDismissReason(reason));
    },
    priority: layer.priority,
  };
}

export function createDismissableLayerController(): TngDismissableLayerController {
  const stack = createOverlayLayerStack();

  return Object.freeze({
    dismissTop: (reason: TngDismissReason): void => {
      stack.dismissTop(toOverlayDismissReason(reason));
    },
    getLayerIds: (): readonly string[] => stack.getLayerIds(),
    register: (layer: TngDismissableLayer): void => {
      stack.register(toDismissableLayer(layer));
    },
    unregister: (id: string): void => {
      stack.unregister(id);
    },
  });
}
