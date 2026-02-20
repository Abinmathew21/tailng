import { describe, expect, it } from 'vitest';
import { TngChips } from './tng-chips.component';

describe('tng-chips component', () => {
  it('exports the chips component', () => {
    expect(typeof TngChips).toBe('function');
  });
});
