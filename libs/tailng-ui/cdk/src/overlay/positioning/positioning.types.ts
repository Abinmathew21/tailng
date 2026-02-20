export type TngOverlayAlign = 'center' | 'end' | 'start';

export type TngOverlayDirection = 'ltr' | 'rtl';

export type TngOverlaySide = 'bottom' | 'left' | 'right' | 'top';

export type TngOverlayRect = Readonly<{
  height: number;
  left: number;
  top: number;
  width: number;
}>;

export type TngOverlayPlacement = Readonly<{
  align?: TngOverlayAlign;
  side?: TngOverlaySide;
}>;

export type TngOverlayOffset = Readonly<{
  align?: number;
  side?: number;
}>;

export type TngOverlayCollisionOptions = Readonly<{
  flip?: boolean;
  padding?: number;
  shift?: boolean;
}>;

export type TngOverlayPositionOptions = Readonly<{
  anchorRect: TngOverlayRect;
  collision?: TngOverlayCollisionOptions;
  direction?: TngOverlayDirection;
  offset?: TngOverlayOffset;
  overlayRect: TngOverlayRect;
  placement?: TngOverlayPlacement;
  viewportRect: TngOverlayRect;
}>;

export type TngOverlayPositionResult = Readonly<{
  align: TngOverlayAlign;
  side: TngOverlaySide;
  x: number;
  y: number;
}>;
