import { describe, expect, it } from 'vitest';
import { TngComboboxComponent } from './tng-combobox.component';

describe('tng-combobox component', () => {
  it('exports the combobox component', () => {
    expect(typeof TngComboboxComponent).toBe('function');
  });
});
