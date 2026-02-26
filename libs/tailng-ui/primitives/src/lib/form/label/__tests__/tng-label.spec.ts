import { describe, expect, it } from 'vitest';
import { TngLabel } from '../tng-label';

describe('tng-label primitive', () => {
  it('exports label directive', () => {
    expect(typeof TngLabel).toBe('function');
  });
});
