import { describe, expect, it } from 'vitest';
import { TngButtonToggleGroup } from './tng-button-toggle-group.component';
import {
  TngButtonToggle,
  toggleTngButtonToggleState,
} from './tng-button-toggle.component';

describe('tng-button-toggle component', () => {
  it('exports button toggle components', () => {
    expect(typeof TngButtonToggle).toBe('function');
    expect(typeof TngButtonToggleGroup).toBe('function');
  });

  it('toggles state', () => {
    expect(toggleTngButtonToggleState(true)).toBe(false);
    expect(toggleTngButtonToggleState(false)).toBe(true);
  });
});
