import { describe, expect, it } from 'vitest';
import { TngSeparator } from './tng-separator.component';

describe('tng-separator component', () => {
  it('exports the public TngSeparator symbol', () => {
    expect(typeof TngSeparator).toBe('function');
  });
});
