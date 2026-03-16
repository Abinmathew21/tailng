export type TngOverlayOpenCloseDelayControllerOptions = Readonly<{
  onStateChange: (nextOpen: boolean) => void;
}>;

export type TngOverlayOpenCloseDelayController = Readonly<{
  cancelAll: () => void;
  cancelClose: () => void;
  cancelOpen: () => void;
  destroy: () => void;
  requestClose: (delayMs: number) => void;
  requestOpen: (delayMs: number) => void;
}>;
