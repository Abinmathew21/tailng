import { describe, expect, it } from 'vitest';
import {
  normalizeTngToastDuration,
  normalizeTngToastMaxVisible,
  resolveTngToastNextSlice,
  shouldDismissTngToastForKey,
  TngToast,
} from './tng-toast.component';

describe('tng-toast component', () => {
  it('exports the toast component', () => {
    expect(typeof TngToast).toBe('function');
  });

  it('normalizes duration values', () => {
    expect(normalizeTngToastDuration(-10, 4000)).toBe(4000);
    expect(normalizeTngToastDuration(Number.NaN, 4000)).toBe(4000);
    expect(normalizeTngToastDuration(0, 4000)).toBe(0);
    expect(normalizeTngToastDuration(2500, 4000)).toBe(2500);
  });

  it('normalizes max visible values', () => {
    expect(normalizeTngToastMaxVisible(0)).toBe(1);
    expect(normalizeTngToastMaxVisible(Number.NaN)).toBe(1);
    expect(normalizeTngToastMaxVisible(3.8)).toBe(3);
  });

  it('keeps only the latest values based on max visible', () => {
    expect(resolveTngToastNextSlice([1, 2], 4)).toEqual([1, 2]);
    expect(resolveTngToastNextSlice([1, 2, 3, 4], 2)).toEqual([3, 4]);
  });

  it('dismisses on escape key only', () => {
    expect(shouldDismissTngToastForKey('Escape')).toBe(true);
    expect(shouldDismissTngToastForKey('Enter')).toBe(false);
  });
});
