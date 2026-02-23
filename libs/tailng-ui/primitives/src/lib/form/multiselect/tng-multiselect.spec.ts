import { describe, expect, it } from 'vitest';
import { TngMultiselect } from './tng-multiselect';

describe('tng-multiselect primitive', () => {
  it('exports the multiselect primitive', () => {
    expect(typeof TngMultiselect).toBe('function');
  });
});
