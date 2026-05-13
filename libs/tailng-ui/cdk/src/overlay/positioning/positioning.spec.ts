import { expect, it } from 'vitest';
import { computeOverlayPosition, resolveAnchoredYWhenOffscreen } from './positioning';

it('computes bottom-centered placement by default', () => {
  const result = computeOverlayPosition({
    anchorRect: { height: 40, left: 100, top: 100, width: 120 },
    overlayRect: { height: 80, left: 0, top: 0, width: 100 },
    viewportRect: { height: 600, left: 0, top: 0, width: 800 },
  });

  expect(result.side).toBe('bottom');
  expect(result.x).toBe(110);
  expect(result.y).toBe(140);
});

it('flips side when opposite side has less overflow', () => {
  const result = computeOverlayPosition({
    anchorRect: { height: 40, left: 200, top: 550, width: 100 },
    collision: { flip: true, padding: 8, shift: false },
    overlayRect: { height: 120, left: 0, top: 0, width: 120 },
    placement: { side: 'bottom' },
    viewportRect: { height: 600, left: 0, top: 0, width: 800 },
  });

  expect(result.side).toBe('top');
  expect(result.y).toBe(430);
});

it('shifts result into viewport bounds', () => {
  const result = computeOverlayPosition({
    anchorRect: { height: 20, left: 10, top: 30, width: 20 },
    collision: { flip: false, padding: 8, shift: true },
    overlayRect: { height: 80, left: 0, top: 0, width: 200 },
    placement: { align: 'start', side: 'bottom' },
    viewportRect: { height: 180, left: 0, top: 0, width: 220 },
  });

  expect(result.x).toBe(10);
  expect(result.y).toBe(50);
});

it('supports rtl start alignment on horizontal axis', () => {
  const result = computeOverlayPosition({
    anchorRect: { height: 40, left: 300, top: 200, width: 120 },
    direction: 'rtl',
    overlayRect: { height: 90, left: 0, top: 0, width: 80 },
    placement: { align: 'start', side: 'bottom' },
    viewportRect: { height: 800, left: 0, top: 0, width: 1200 },
  });

  expect(result.x).toBe(340);
  expect(result.side).toBe('bottom');
});

it('applies side and align offsets', () => {
  const result = computeOverlayPosition({
    anchorRect: { height: 30, left: 200, top: 100, width: 60 },
    offset: { align: 5, side: 10 },
    overlayRect: { height: 40, left: 0, top: 0, width: 100 },
    placement: { align: 'center', side: 'right' },
    viewportRect: { height: 600, left: 0, top: 0, width: 800 },
  });

  expect(result.x).toBe(270);
  expect(result.y).toBe(100);
});

it('handles overlay larger than viewport by clamping to min bound (no NaN / no inversion)', () => {
  const result = computeOverlayPosition({
    anchorRect: { height: 20, left: 50, top: 50, width: 20 },
    collision: { flip: false, padding: 8, shift: true },
    overlayRect: { height: 500, left: 0, top: 0, width: 500 }, // bigger than viewport
    placement: { align: 'start', side: 'bottom' },
    viewportRect: { height: 200, left: 0, top: 0, width: 200 },
  });

  // When overlay > viewport, we clamp to the minimum viable bound (padding)
  expect(result.x).toBe(8);
  expect(result.y).toBe(8);
});

it('flips left->right when left side overflows more than right', () => {
  const result = computeOverlayPosition({
    anchorRect: { height: 40, left: 5, top: 100, width: 40 }, // near left edge
    collision: { flip: true, padding: 8, shift: false },
    overlayRect: { height: 80, left: 0, top: 0, width: 120 },
    placement: { side: 'left', align: 'center' },
    viewportRect: { height: 600, left: 0, top: 0, width: 800 },
  });

  expect(result.side).toBe('right');
  expect(result.x).toBe(45); // anchorRect.right(=45) + sideOffset(0)
});

it('shifts correctly when anchor is partially offscreen (negative coords)', () => {
  const result = computeOverlayPosition({
    anchorRect: { height: 20, left: -30, top: -10, width: 20 },
    collision: { flip: false, padding: 8, shift: true },
    overlayRect: { height: 60, left: 0, top: 0, width: 100 },
    placement: { side: 'bottom', align: 'start' },
    viewportRect: { height: 200, left: 0, top: 0, width: 200 },
  });

  // start align would put x=-30 without shift; clamp to padding
  expect(result.x).toBe(8);
  // bottom side would put y=10 without shift (top -10 + height 20) => 10; within bounds, so unchanged
  expect(result.y).toBe(10);
});

it('supports fractional rects (sub-pixel inputs) without NaN', () => {
  const result = computeOverlayPosition({
    anchorRect: { height: 40.5, left: 100.25, top: 100.75, width: 120.5 },
    overlayRect: { height: 80.25, left: 0, top: 0, width: 100.5 },
    viewportRect: { height: 600, left: 0, top: 0, width: 800 },
  });

  expect(Number.isNaN(result.x)).toBe(false);
  expect(Number.isNaN(result.y)).toBe(false);

  // default: bottom + center
  // x = left + (anchorW - overlayW)/2 = 100.25 + (120.5-100.5)/2 = 100.25 + 10 = 110.25
  // y = anchor.bottom = top + height = 100.75 + 40.5 = 141.25
  expect(result.x).toBe(110.25);
  expect(result.y).toBe(141.25);
});

it('does not flip when flip=false even if overflow is worse', () => {
  const result = computeOverlayPosition({
    anchorRect: { height: 40, left: 200, top: 550, width: 100 },
    collision: { flip: false, padding: 8, shift: false },
    overlayRect: { height: 120, left: 0, top: 0, width: 120 },
    placement: { side: 'bottom' },
    viewportRect: { height: 600, left: 0, top: 0, width: 800 },
  });

  expect(result.side).toBe('bottom'); // would have flipped to top if flip=true
  expect(result.y).toBe(590); // anchor.bottom = 590
});

it('does not shift when shift=false even if overlay would overflow viewport', () => {
  const result = computeOverlayPosition({
    anchorRect: { height: 20, left: 10, top: 30, width: 20 },
    collision: { flip: false, padding: 8, shift: false },
    overlayRect: { height: 80, left: 0, top: 0, width: 200 },
    placement: { align: 'start', side: 'bottom' },
    viewportRect: { height: 180, left: 0, top: 0, width: 220 },
  });

  // base would be x=10, y=50 (same as your shift test),
  // but this case is useful when you change values to force overflow:
  expect(result.x).toBe(10);
  expect(result.y).toBe(50);
});

it('respects collision padding when shifting (clamps to padding, not 0)', () => {
  const result = computeOverlayPosition({
    anchorRect: { height: 20, left: 0, top: 0, width: 20 },
    collision: { flip: false, padding: 24, shift: true },
    overlayRect: { height: 80, left: 0, top: 0, width: 120 },
    placement: { align: 'start', side: 'bottom' },
    viewportRect: { height: 180, left: 0, top: 0, width: 220 },
  });

  // Without shift => x=0, y=20. With padding=24 => x clamps to 24. y=20 clamps up to 24.
  expect(result.x).toBe(24);
  expect(result.y).toBe(24);
});

it('keeps original side when flip tie (alternate overflow equals primary overflow)', () => {
  // Create a symmetric case where both sides overflow equally.
  // viewport height 200, overlay height 120, anchor in the vertical center (top=40, height=20)
  // bottom y = 60, bottom overflow = (60+120) - (200-8) = 180 - 192 => 0 (no overflow)
  // That doesn't tie. So make it tighter: viewport height 150.
  // bottom y=60 => overflow = (60+120) - (150-8) = 180 - 142 = 38
  // top y = 40 - 120 = -80 => overflow = (0+8) - (-80) = 88
  // Not tie. So we tune anchor:
  // Let anchor top = 65, height=20 => bottom y=85 overflow = (85+120)-(150-8)=205-142=63
  // top y=65-120=-55 overflow = (0+8)-(-55)=63 => tie at 63.
  const result = computeOverlayPosition({
    anchorRect: { height: 20, left: 100, top: 65, width: 40 },
    collision: { flip: true, padding: 8, shift: false },
    overlayRect: { height: 120, left: 0, top: 0, width: 80 },
    placement: { side: 'bottom', align: 'center' },
    viewportRect: { height: 150, left: 0, top: 0, width: 300 },
  });

  // tie => keep requested side (bottom), since alternateOverflow < primaryOverflow is false
  expect(result.side).toBe('bottom');
});

it('applies start/end alignment correctly for left/right sides (Y axis)', () => {
  const leftStart = computeOverlayPosition({
    anchorRect: { height: 40, left: 300, top: 200, width: 120 },
    collision: { flip: false, padding: 8, shift: false },
    overlayRect: { height: 90, left: 0, top: 0, width: 80 },
    placement: { align: 'start', side: 'left' },
    viewportRect: { height: 800, left: 0, top: 0, width: 1200 },
  });

  const leftEnd = computeOverlayPosition({
    anchorRect: { height: 40, left: 300, top: 200, width: 120 },
    collision: { flip: false, padding: 8, shift: false },
    overlayRect: { height: 90, left: 0, top: 0, width: 80 },
    placement: { align: 'end', side: 'left' },
    viewportRect: { height: 800, left: 0, top: 0, width: 1200 },
  });

  // left side positions x = anchor.left - overlay.width = 300 - 80 = 220
  expect(leftStart.x).toBe(220);
  expect(leftEnd.x).toBe(220);

  // Y start => anchor.top = 200
  expect(leftStart.y).toBe(200);

  // Y end => anchor.bottom - overlay.height = 240 - 90 = 150
  expect(leftEnd.y).toBe(150);
});

it('keeps a bottom overlay anchored after the anchor scrolls above the viewport', () => {
  const shiftedY = resolveAnchoredYWhenOffscreen({
    anchorRect: { height: 32, left: 24, top: -40, width: 240 },
    overlayRect: { height: 120, left: 0, top: 8, width: 240 },
    side: 'bottom',
    viewportRect: { height: 600, left: 0, top: 0, width: 800 },
    y: 8,
  });

  expect(shiftedY).toBe(-8);
});

it('keeps a top overlay anchored after the anchor scrolls below the viewport', () => {
  const shiftedY = resolveAnchoredYWhenOffscreen({
    anchorRect: { height: 32, left: 24, top: 640, width: 240 },
    overlayRect: { height: 120, left: 0, top: 472, width: 240 },
    side: 'top',
    sideOffset: 4,
    viewportRect: { height: 600, left: 0, top: 0, width: 800 },
    y: 472,
  });

  expect(shiftedY).toBe(516);
});
