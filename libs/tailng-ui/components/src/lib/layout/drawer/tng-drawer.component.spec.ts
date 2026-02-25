import { describe, expect, it } from 'vitest';
import { TngDrawerComponent } from './tng-drawer.component';

describe('tng-drawer component', () => {
  it('exports the drawer component', () => {
    expect(typeof TngDrawerComponent).toBe('function');
  });
});
