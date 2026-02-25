import { describe, expect, it } from 'vitest';
import { TngToggleGroupComponent } from './tng-toggle-group.component';

describe('tng-toggle-group component', () => {
  it('exports the toggle-group component', () => {
    expect(typeof TngToggleGroupComponent).toBe('function');
  });
});
