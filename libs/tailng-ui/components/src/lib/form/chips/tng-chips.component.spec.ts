import { describe, expect, it } from 'vitest';
import { TngChipsComponent } from './tng-chips.component';

describe('tng-chips component', () => {
  it('exports the chips component', () => {
    expect(typeof TngChipsComponent).toBe('function');
  });
});
