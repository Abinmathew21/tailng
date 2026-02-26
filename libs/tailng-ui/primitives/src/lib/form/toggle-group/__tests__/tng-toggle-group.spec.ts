import { describe, expect, it } from 'vitest';
import { TngToggleGroup } from '../tng-toggle-group';

describe('tng-toggle-group primitive', () => {
  it('exports the toggle-group primitive', () => {
    expect(typeof TngToggleGroup).toBe('function');
  });
});
