import { expect, it } from 'vitest';
import { computeOverlayPosition } from './positioning';

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
