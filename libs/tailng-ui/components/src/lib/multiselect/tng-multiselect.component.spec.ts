import { describe, expect, it } from 'vitest';
import { TngMultiselect } from './tng-multiselect.component';

describe('tng-multiselect component', () => {
  it('exports the multiselect component', () => {
    expect(typeof TngMultiselect).toBe('function');
  });
});
