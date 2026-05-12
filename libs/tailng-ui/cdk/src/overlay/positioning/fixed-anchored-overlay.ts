import { computeOverlayPosition } from './positioning';
import type {
  TngOverlayCollisionOptions,
  TngOverlayOffset,
  TngOverlayPlacement,
  TngOverlayRect,
} from './positioning.types';

type MaybeRect = Readonly<{
  height: number;
  left: number;
  top: number;
  width: number;
}>;

export type TngFixedAnchoredOverlayPositionOptions = Readonly<{
  anchor: HTMLElement;
  /**
   * Optional rect override. When provided, this rect is used for positioning
   * instead of `anchor.getBoundingClientRect()`. Useful when the visible
   * frame to align with does not match the DOM anchor element exactly (e.g.
   * positioning an overlay to span a form-field wrapper while still using the
   * inner control for vertical bounds).
   */
  anchorRect?: TngOverlayRect;
  collision: TngOverlayCollisionOptions;
  direction?: 'ltr' | 'rtl';
  offset: TngOverlayOffset;
  overlay: HTMLElement;
  placement: TngOverlayPlacement;
  viewportMargin: number;
  windowRef: Window;
}>;

export type TngFixedAnchoredOverlayPositionResult = Readonly<{
  availableHeight: number;
  inlineSize: number;
  maxInlineSize: number;
  side: 'bottom' | 'top';
}>;

function rectFromClientRect(rect: Readonly<DOMRect | ClientRect>): MaybeRect {
  return {
    height: rect.height,
    left: rect.left,
    top: rect.top,
    width: rect.width,
  };
}

function viewportRect(windowRef: Readonly<Window>): MaybeRect {
  return {
    height: windowRef.innerHeight || 768,
    left: 0,
    top: 0,
    width: windowRef.innerWidth || 1024,
  };
}

function getAvailableHeight(
  side: 'top' | 'bottom',
  rects: Readonly<{ anchor: MaybeRect; viewport: MaybeRect }>,
  options: Readonly<{ margin: number; offset: number }>,
): number {
  const { anchor, viewport } = rects;
  const anchorBottom = anchor.top + anchor.height;

  return side === 'top'
    ? Math.max(0, Math.floor(anchor.top - options.margin - options.offset))
    : Math.max(0, Math.floor(viewport.height - anchorBottom - options.margin - options.offset));
}

export function positionFixedAnchoredOverlay(
  options: Readonly<TngFixedAnchoredOverlayPositionOptions>,
): TngFixedAnchoredOverlayPositionResult {
  const anchorRect: MaybeRect = options.anchorRect ?? rectFromClientRect(options.anchor.getBoundingClientRect());
  const viewport = viewportRect(options.windowRef);
  const maxInlineSize = Math.max(0, viewport.width - options.viewportMargin * 2);
  const inlineSize = Math.max(0, Math.min(anchorRect.width, maxInlineSize));

  const { overlay } = options;
  overlay.style.width = `${inlineSize}px`;
  overlay.style.maxWidth = `${maxInlineSize}px`;
  overlay.style.maxHeight = '';

  const result = computeOverlayPosition({
    anchorRect,
    collision: options.collision,
    direction: options.direction ?? 'ltr',
    offset: options.offset,
    overlayRect: rectFromClientRect(overlay.getBoundingClientRect()),
    placement: options.placement,
    viewportRect: viewport,
  });

  overlay.style.left = `${result.x}px`;
  overlay.style.top = `${result.y}px`;

  const availableHeight = getAvailableHeight(
    result.side === 'top' ? 'top' : 'bottom',
    { anchor: anchorRect, viewport },
    { margin: options.viewportMargin, offset: options.offset.side ?? 0 },
  );

  if (availableHeight > 0) {
    overlay.style.maxHeight = `${availableHeight}px`;
  }

  return {
    availableHeight,
    inlineSize,
    maxInlineSize,
    side: result.side === 'top' ? 'top' : 'bottom',
  };
}