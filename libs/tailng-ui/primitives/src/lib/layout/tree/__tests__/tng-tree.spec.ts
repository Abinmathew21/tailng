import { describe, expect, it } from 'vitest';
import { TngTree } from '../tng-tree';

describe('tng-tree primitive', () => {
  it('exports the tree primitive', () => {
    expect(typeof TngTree).toBe('function');
  });
});
