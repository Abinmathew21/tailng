import { describe, expect, it } from 'vitest';
import { TngTreeComponent } from './tng-tree.component';

describe('tng-tree component', () => {
  it('exports the tree component', () => {
    expect(typeof TngTreeComponent).toBe('function');
  });
});
