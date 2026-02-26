import { describe, expect, it } from 'vitest';
import { TngCombobox } from '../tng-combobox';

describe('tng-combobox primitive', () => {
  it('exports the combobox primitive', () => {
    expect(typeof TngCombobox).toBe('function');
  });
});
