import { describe, expect, it } from 'vitest';
import { TngButtonToggleGroupComponent } from './tng-button-toggle-group.component';
import {
  TngButtonToggleComponent,
  toggleTngButtonToggleState,
} from './tng-button-toggle.component';

describe('tng-button-toggle component', () => {
  it('exports button toggle components', () => {
    expect(typeof TngButtonToggleComponent).toBe('function');
    expect(typeof TngButtonToggleGroupComponent).toBe('function');
  });

  it('toggles state', () => {
    expect(toggleTngButtonToggleState(true)).toBe(false);
    expect(toggleTngButtonToggleState(false)).toBe(true);
  });
});
