import { describe, expect, it } from 'vitest';
import { TngTabs } from './tng-tabs.component';

describe('tng-tabs component', () => {
  it('exports the tabs component', () => {
    expect(typeof TngTabs).toBe('function');
  });
});
