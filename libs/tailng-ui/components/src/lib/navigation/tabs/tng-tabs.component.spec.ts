import { describe, expect, it } from 'vitest';
import { TngTabsComponent } from './tng-tabs.component';

describe('tng-tabs component', () => {
  it('exports the tabs component', () => {
    expect(typeof TngTabsComponent).toBe('function');
  });
});
