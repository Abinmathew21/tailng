import { computeOverlayPosition } from './positioning';
import type {
  TngOverlayCollisionOptions,
  TngOverlayOffset,
  TngOverlayPlacement,
} from './positioning.types';

type MaybeRect = Readonly<{
  height: number;
  left: number;
  top: number;
  width: number;
}>;

export type TngFixedAnchoredOverlayPositionOptions = Readonly<{
  anchor: HTMLElement;
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

function rectFromClientRect(rect: DOMRect | ClientRect): MaybeRect {
  return {
    height: rect.height,
    left: rect.left,
    top: rect.top,
    width: rect.width,
  };
}

function viewportRect(windowRef: Window): MaybeRect {
  return {
    height: windowRef.innerHeight || 768,
    left: 0,
    top: 0,
    width: windowRef.innerWidth || 1024,
  };
}

export function positionFixedAnchoredOverlay(
  options: TngFixedAnchoredOverlayPositionOptions,
): TngFixedAnchoredOverlayPositionResult {
  const anchorRect = rectFromClientRect(options.anchor.getBoundingClientRect());
  const viewport = viewportRect(options.windowRef);
  const maxInlineSize = Math.max(0, viewport.width - options.viewportMargin * 2);
  const inlineSize = Math.max(0, Math.min(anchorRect.width, maxInlineSize));

  options.overlay.style.width = `${inlineSize}px`;
  options.overlay.style.maxWidth = `${maxInlineSize}px`;
  options.overlay.style.maxHeight = '';

  const overlayRect = rectFromClientRect(options.overlay.getBoundingClientRect());
  const result = computeOverlayPosition({
    anchorRect,
    collision: options.collision,
    direction: options.direction ?? 'ltr',
    offset: options.offset,
    overlayRect,
    placement: options.placement,
    viewportRect: viewport,
  });

  options.overlay.style.left = `${result.x}px`;
  options.overlay.style.top = `${result.y}px`;
  const sideOffset = options.offset.side ?? 0;

  const anchorBottom = anchorRect.top + anchorRect.height;
  const availableHeight =
    result.side === 'top'
      ? Math.max(0, Math.floor(anchorRect.top - options.viewportMargin - sideOffset))
      : Math.max(
          0,
          Math.floor(viewport.height - anchorBottom - options.viewportMargin - sideOffset),
        );

  if (availableHeight > 0) {
    options.overlay.style.maxHeight = `${availableHeight}px`;
  }

  return {
    availableHeight,
    inlineSize,
    maxInlineSize,
    side: result.side === 'top' ? 'top' : 'bottom',
  };
}
