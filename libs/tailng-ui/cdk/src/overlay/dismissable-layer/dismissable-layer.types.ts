import type { TngOverlayLayer } from '../layer-stack/layer-stack.types';

export type TngDismissReason = 'escape' | 'outside';

export type TngDismissableLayer = Readonly<{
  id: TngOverlayLayer['id'];
  onDismiss: (reason: TngDismissReason) => void;
  priority?: TngOverlayLayer['priority'];
}>;

export type TngDismissableLayerController = Readonly<{
  dismissTop: (reason: TngDismissReason) => void;
  getLayerIds: () => readonly string[];
  register: (layer: TngDismissableLayer) => void;
  unregister: (id: string) => void;
}>;
