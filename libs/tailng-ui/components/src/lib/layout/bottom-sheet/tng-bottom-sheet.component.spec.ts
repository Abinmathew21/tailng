import { describe, expect, it } from 'vitest';
import { TngBottomSheet } from './tng-bottom-sheet.component';

describe('tng-bottom-sheet component', () => {
  it('exports the bottom-sheet component', () => {
    expect(typeof TngBottomSheet).toBe('function');
  });
});
