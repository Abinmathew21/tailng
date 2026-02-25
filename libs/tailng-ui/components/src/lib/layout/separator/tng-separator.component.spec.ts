import { describe, expect, it } from 'vitest';
import { TngSeparatorComponent } from './tng-separator.component';

describe('tng-separator component', () => {
  it('exports the public TngSeparator symbol', () => {
    expect(typeof TngSeparatorComponent).toBe('function');
  });
});
