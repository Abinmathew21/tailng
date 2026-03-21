import { describe, expect, it } from 'vitest';
import { TngGrid, TngGridCell, TngGridRow } from '../tng-grid';

describe('tng-grid primitive', () => {
  it('exports the grid primitives', () => {
    expect(typeof TngGrid).toBe('function');
    expect(typeof TngGridRow).toBe('function');
    expect(typeof TngGridCell).toBe('function');
  });
});
