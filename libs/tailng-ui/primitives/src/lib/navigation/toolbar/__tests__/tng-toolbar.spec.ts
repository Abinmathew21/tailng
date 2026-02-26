import { describe, expect, it } from 'vitest';
import { TngToolbar } from '../tng-toolbar';

describe('tng-toolbar primitive', () => {
  it('exports the toolbar primitive', () => {
    expect(typeof TngToolbar).toBe('function');
  });
});
