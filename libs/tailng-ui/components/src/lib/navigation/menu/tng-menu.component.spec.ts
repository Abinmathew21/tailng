import { describe, expect, it } from 'vitest';
import { TngMenu } from './tng-menu.component';

describe('tng-menu component', () => {
  it('exports the menu component', () => {
    expect(typeof TngMenu).toBe('function');
  });
});
