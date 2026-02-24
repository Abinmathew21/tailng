import {
  type TngOverlayAlign,
  type TngOverlayDirection,
  type TngOverlayPositionOptions,
  type TngOverlayPositionResult,
  type TngOverlayRect,
  type TngOverlaySide,
} from './positioning.types';

type TngPosition = Readonly<{
  x: number;
  y: number;
}>;

type TngNormalizedRect = Readonly<{
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
}>;

type TngPlacementContext = Readonly<{
  align: TngOverlayAlign;
  alignOffset: number;
  anchorRect: TngNormalizedRect;
  collisionPadding: number;
  direction: TngOverlayDirection;
  overlayRect: TngNormalizedRect;
  shouldFlip: boolean;
  shouldShift: boolean;
  side: TngOverlaySide;
  sideOffset: number;
  viewportRect: TngNormalizedRect;
}>;

type TngPlacementResolution = Readonly<{
  align: TngOverlayAlign;
  side: TngOverlaySide;
}>;

type TngOffsetResolution = Readonly<{
  alignOffset: number;
  sideOffset: number;
}>;

type TngCollisionResolution = Readonly<{
  collisionPadding: number;
  shouldFlip: boolean;
  shouldShift: boolean;
}>;

function normalizeRect(rect: TngOverlayRect): TngNormalizedRect {
  return {
    bottom: rect.top + rect.height,
    height: rect.height,
    left: rect.left,
    right: rect.left + rect.width,
    top: rect.top,
    width: rect.width,
  };
}

function oppositeSide(side: TngOverlaySide): TngOverlaySide {
  if (side === 'top') {
    return 'bottom';
  }

  if (side === 'bottom') {
    return 'top';
  }

  return side === 'left' ? 'right' : 'left';
}

function resolveAlignedX(context: TngPlacementContext): number {
  if (context.align === 'start') {
    return context.direction === 'rtl'
      ? context.anchorRect.right - context.overlayRect.width
      : context.anchorRect.left;
  }

  if (context.align === 'end') {
    return context.direction === 'rtl'
      ? context.anchorRect.left
      : context.anchorRect.right - context.overlayRect.width;
  }

  return context.anchorRect.left + (context.anchorRect.width - context.overlayRect.width) / 2;
}

function resolveAlignedY(context: TngPlacementContext): number {
  if (context.align === 'start') {
    return context.anchorRect.top;
  }

  if (context.align === 'end') {
    return context.anchorRect.bottom - context.overlayRect.height;
  }

  return context.anchorRect.top + (context.anchorRect.height - context.overlayRect.height) / 2;
}

function computeSidePosition(
  context: TngPlacementContext,
  side: TngOverlaySide,
): TngPosition {
  if (side === 'top') {
    return {
      x: resolveAlignedX(context) + context.alignOffset,
      y: context.anchorRect.top - context.overlayRect.height - context.sideOffset,
    };
  }

  if (side === 'bottom') {
    return {
      x: resolveAlignedX(context) + context.alignOffset,
      y: context.anchorRect.bottom + context.sideOffset,
    };
  }

  if (side === 'left') {
    return {
      x: context.anchorRect.left - context.overlayRect.width - context.sideOffset,
      y: resolveAlignedY(context) + context.alignOffset,
    };
  }

  return {
    x: context.anchorRect.right + context.sideOffset,
    y: resolveAlignedY(context) + context.alignOffset,
  };
}

function measureOverflow(
  context: TngPlacementContext,
  side: TngOverlaySide,
  position: TngPosition,
): number {
  if (side === 'top') {
    return Math.max(0, context.viewportRect.top + context.collisionPadding - position.y);
  }

  if (side === 'bottom') {
    return Math.max(
      0,
      position.y + context.overlayRect.height - (context.viewportRect.bottom - context.collisionPadding),
    );
  }

  if (side === 'left') {
    return Math.max(0, context.viewportRect.left + context.collisionPadding - position.x);
  }

  return Math.max(
    0,
    position.x + context.overlayRect.width - (context.viewportRect.right - context.collisionPadding),
  );
}

function resolveSide(context: TngPlacementContext): TngOverlaySide {
  if (!context.shouldFlip) {
    return context.side;
  }

  const primaryPosition = computeSidePosition(context, context.side);
  const alternateSide = oppositeSide(context.side);
  const alternatePosition = computeSidePosition(context, alternateSide);
  const primaryOverflow = measureOverflow(context, context.side, primaryPosition);
  const alternateOverflow = measureOverflow(context, alternateSide, alternatePosition);

  return alternateOverflow < primaryOverflow ? alternateSide : context.side;
}

function clamp(value: number, min: number, max: number): number {
  // important: overlay bigger than available space
  if (max < min) return min; 
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function shiftPosition(context: TngPlacementContext, position: TngPosition): TngPosition {
  return {
    x: clamp(
      position.x,
      context.viewportRect.left + context.collisionPadding,
      context.viewportRect.right - context.collisionPadding - context.overlayRect.width,
    ),
    y: clamp(
      position.y,
      context.viewportRect.top + context.collisionPadding,
      context.viewportRect.bottom - context.collisionPadding - context.overlayRect.height,
    ),
  };
}

function resolvePlacement(options: TngOverlayPositionOptions): TngPlacementResolution {
  return {
    align: options.placement?.align ?? 'center',
    side: options.placement?.side ?? 'bottom',
  };
}

function resolveOffsets(options: TngOverlayPositionOptions): TngOffsetResolution {
  return {
    alignOffset: options.offset?.align ?? 0,
    sideOffset: options.offset?.side ?? 0,
  };
}

function resolveCollision(options: TngOverlayPositionOptions): TngCollisionResolution {
  return {
    collisionPadding: options.collision?.padding ?? 8,
    shouldFlip: options.collision?.flip ?? true,
    shouldShift: options.collision?.shift ?? true,
  };
}

function createPlacementContext(options: TngOverlayPositionOptions): TngPlacementContext {
  const placement = resolvePlacement(options);
  const offsets = resolveOffsets(options);
  const collision = resolveCollision(options);

  return {
    align: placement.align,
    alignOffset: offsets.alignOffset,
    anchorRect: normalizeRect(options.anchorRect),
    collisionPadding: collision.collisionPadding,
    direction: options.direction ?? 'ltr',
    overlayRect: normalizeRect(options.overlayRect),
    shouldFlip: collision.shouldFlip,
    shouldShift: collision.shouldShift,
    side: placement.side,
    sideOffset: offsets.sideOffset,
    viewportRect: normalizeRect(options.viewportRect),
  };
}

export function computeOverlayPosition(
  options: TngOverlayPositionOptions,
): TngOverlayPositionResult {
  const context = createPlacementContext(options);
  const side = resolveSide(context);
  const basePosition = computeSidePosition(context, side);
  const position = context.shouldShift ? shiftPosition(context, basePosition) : basePosition;

  return {
    align: context.align,
    side,
    x: position.x,
    y: position.y,
  };
}
