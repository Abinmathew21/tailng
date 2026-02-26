import { describe, expect, it } from 'vitest';
import { TngTabs } from '../tng-tabs';

describe('tng-tabs primitive', () => {
  it('exports the tabs primitive', () => {
    expect(typeof TngTabs).toBe('function');
  });
});
