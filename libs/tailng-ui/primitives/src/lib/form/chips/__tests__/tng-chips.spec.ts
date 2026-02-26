import { describe, expect, it } from 'vitest';
import { TngChips } from '../tng-chips';

describe('tng-chips primitive', () => {
  it('exports the chips primitive', () => {
    expect(typeof TngChips).toBe('function');
  });
});
