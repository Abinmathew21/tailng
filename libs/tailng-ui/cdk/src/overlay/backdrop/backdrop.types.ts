import type {
  TngPortalManager,
  TngPortalNode,
  TngPortalTarget,
} from '../portal/portal.types';

export type TngOverlayBackdropDismissReason = 'backdrop-pointer' | 'programmatic';

export type TngOverlayBackdropDefinition = Readonly<{
  backdropId: string;
  dismissOnPointerDown?: boolean;
  node: TngPortalNode;
  onDismiss?: (reason: TngOverlayBackdropDismissReason) => void;
  priority?: number;
  target?: TngPortalTarget;
}>;

export type TngOverlayBackdropControllerOptions = Readonly<{
  portal: TngPortalManager;
}>;

export type TngOverlayBackdropController = Readonly<{
  clear: () => void;
  dismissTop: (reason: TngOverlayBackdropDismissReason) => void;
  getBackdropIds: () => readonly string[];
  getTopBackdropId: () => string | null;
  handlePointerDown: (backdropId: string) => boolean;
  hide: (backdropId: string) => void;
  isShown: (backdropId: string) => boolean;
  show: (definition: TngOverlayBackdropDefinition) => boolean;
}>;
