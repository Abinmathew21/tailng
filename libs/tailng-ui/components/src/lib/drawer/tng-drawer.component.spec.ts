import { describe, expect, it } from 'vitest';
import { TngDrawer } from './tng-drawer.component';

describe('tng-drawer component', () => {
  it('exports the drawer component', () => {
    expect(typeof TngDrawer).toBe('function');
  });
});
