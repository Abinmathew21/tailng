import { describe, expect, it } from 'vitest';
import { TngToggleGroup } from './tng-toggle-group.component';

describe('tng-toggle-group component', () => {
  it('exports the toggle-group component', () => {
    expect(typeof TngToggleGroup).toBe('function');
  });
});
