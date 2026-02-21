import { describe, expect, it } from 'vitest';
import { TngBadge } from './tng-badge.component';

describe('tng-badge component directive', () => {
  it('exports the public TngBadge symbol', () => {
    expect(typeof TngBadge).toBe('function');
  });
});
