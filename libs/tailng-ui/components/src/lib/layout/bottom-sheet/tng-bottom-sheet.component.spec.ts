import { describe, expect, it } from 'vitest';
import { TngBottomSheetComponent } from './tng-bottom-sheet.component';

describe('tng-bottom-sheet component', () => {
  it('exports the bottom-sheet component', () => {
    expect(typeof TngBottomSheetComponent).toBe('function');
  });
});
