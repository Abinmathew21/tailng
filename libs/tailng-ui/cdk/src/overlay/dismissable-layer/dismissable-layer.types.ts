export type TngDismissReason = 'escape' | 'outside';

export type TngDismissableLayer = Readonly<{
  id: string;
  onDismiss: (reason: TngDismissReason) => void;
  priority?: number;
}>;

export type TngDismissableLayerController = Readonly<{
  dismissTop: (reason: TngDismissReason) => void;
  getLayerIds: () => readonly string[];
  register: (layer: TngDismissableLayer) => void;
  unregister: (id: string) => void;
}>;
