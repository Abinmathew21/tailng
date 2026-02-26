import { describe, expect, it } from 'vitest';
import { TngGrid } from '../tng-grid';

describe('tng-grid primitive', () => {
  it('exports the grid primitive', () => {
    expect(typeof TngGrid).toBe('function');
  });
});
