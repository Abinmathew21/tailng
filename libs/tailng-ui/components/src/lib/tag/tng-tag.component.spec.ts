import { describe, expect, it } from 'vitest';
import { TngTag } from './tng-tag.component';

describe('tng-tag component', () => {
  it('exports the public TngTag symbol', () => {
    expect(typeof TngTag).toBe('function');
  });
});
