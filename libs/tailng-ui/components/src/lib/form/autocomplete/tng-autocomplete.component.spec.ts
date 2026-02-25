import { describe, expect, it } from 'vitest';
import { TngAutocompleteComponent } from './tng-autocomplete.component';

describe('tng-autocomplete component', () => {
  it('exports the autocomplete component', () => {
    expect(typeof TngAutocompleteComponent).toBe('function');
  });
});
