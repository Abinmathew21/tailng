import { describe, expect, it } from 'vitest';
import { TngGridComponent } from './tng-grid.component';

describe('tng-grid component', () => {
  it('exports the grid component', () => {
    expect(typeof TngGridComponent).toBe('function');
  });
});
