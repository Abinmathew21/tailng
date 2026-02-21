import { describe, expect, it } from 'vitest';
import { TngSelect } from './tng-select.component';

describe('tng-select component', () => {
  it('exports the select component', () => {
    expect(typeof TngSelect).toBe('function');
  });
});
