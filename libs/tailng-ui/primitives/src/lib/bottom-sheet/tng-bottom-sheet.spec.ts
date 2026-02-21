import { describe, expect, it } from 'vitest';
import { TngBottomSheet } from './tng-bottom-sheet';

describe('tng-bottom-sheet primitive', () => {
  it('exports the bottom-sheet primitive', () => {
    expect(typeof TngBottomSheet).toBe('function');
  });
});
