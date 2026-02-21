import { describe, expect, it } from 'vitest';
import { TngSeparator } from './tng-separator';

describe('tng-separator primitive', () => {
  it('exports the public TngSeparator symbol', () => {
    expect(typeof TngSeparator).toBe('function');
  });
});
