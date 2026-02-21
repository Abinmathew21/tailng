import { describe, expect, it } from 'vitest';
import { TngTree } from './tng-tree.component';

describe('tng-tree component', () => {
  it('exports the tree component', () => {
    expect(typeof TngTree).toBe('function');
  });
});
