export type TngOverlayFocusLayerConfig = Readonly<{
  initialFocusId?: string | null;
  layerId: string;
  members?: () => readonly string[];
  restoreFocus?: boolean;
  trapFocus?: boolean;
}>;

export type TngOverlayFocusHandoffController = Readonly<{
  activateLayer: (layerId: string, restoreFocusTargetId?: string | null) => string | null;
  deactivateLayer: (layerId: string) => string | null;
  isTrapActive: (layerId: string) => boolean;
  recordFocus: (layerId: string, id: string | null) => void;
  registerLayer: (config: TngOverlayFocusLayerConfig) => void;
  resolveFocusCandidate: (layerId: string, candidateId: string | null) => string | null;
  unregisterLayer: (layerId: string) => void;
}>;
