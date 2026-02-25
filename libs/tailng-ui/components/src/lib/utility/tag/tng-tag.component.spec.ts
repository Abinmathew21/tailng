import { describe, expect, it } from 'vitest';
import { TngTagComponent } from './tng-tag.component';

describe('tng-tag component', () => {
  it('exports the public TngTag symbol', () => {
    expect(typeof TngTagComponent).toBe('function');
  });
});
