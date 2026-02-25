import { describe, expect, it } from 'vitest';
import { TngBadgeComponent } from './tng-badge.component';

describe('tng-badge component directive', () => {
  it('exports the public TngBadgeComponent symbol', () => {
    expect(typeof TngBadgeComponent).toBe('function');
  });
});
