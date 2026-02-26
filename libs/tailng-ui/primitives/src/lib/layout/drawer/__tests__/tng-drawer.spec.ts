import { describe, expect, it } from 'vitest';
import { TngDrawer } from '../tng-drawer';

describe('tng-drawer primitive', () => {
  it('exports the drawer primitive', () => {
    expect(typeof TngDrawer).toBe('function');
  });
});
