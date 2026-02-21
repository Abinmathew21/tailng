import { describe, expect, it } from 'vitest';
import { TngCombobox } from './tng-combobox.component';

describe('tng-combobox component', () => {
  it('exports the combobox component', () => {
    expect(typeof TngCombobox).toBe('function');
  });
});
