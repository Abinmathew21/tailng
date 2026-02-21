import { describe, expect, it } from 'vitest';
import { TngSelect } from './tng-select';

describe('tng-select primitive', () => {
  it('exports the select primitive', () => {
    expect(typeof TngSelect).toBe('function');
  });
});
