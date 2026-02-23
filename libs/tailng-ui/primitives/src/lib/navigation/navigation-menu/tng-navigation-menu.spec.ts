import { describe, expect, it } from 'vitest';
import { TngNavigationMenu } from './tng-navigation-menu';

describe('tng-navigation-menu primitive', () => {
  it('exports the navigation-menu primitive', () => {
    expect(typeof TngNavigationMenu).toBe('function');
  });
});
