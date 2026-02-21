import { describe, expect, it } from 'vitest';
import { TngGrid } from './tng-grid.component';

describe('tng-grid component', () => {
  it('exports the grid component', () => {
    expect(typeof TngGrid).toBe('function');
  });
});
