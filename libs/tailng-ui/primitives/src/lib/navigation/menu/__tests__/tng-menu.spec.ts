import { describe, expect, it } from 'vitest';
import { TngMenu } from '../tng-menu';

describe('tng-menu primitive', () => {
  it('exports the menu primitive', () => {
    expect(typeof TngMenu).toBe('function');
  });
});
