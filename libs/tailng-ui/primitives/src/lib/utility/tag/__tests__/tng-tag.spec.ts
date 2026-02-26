import { describe, expect, it } from 'vitest';
import { TngTag } from '../tng-tag';

describe('tng-tag primitive', () => {
  it('exports the public TngTag symbol', () => {
    expect(typeof TngTag).toBe('function');
  });
});
