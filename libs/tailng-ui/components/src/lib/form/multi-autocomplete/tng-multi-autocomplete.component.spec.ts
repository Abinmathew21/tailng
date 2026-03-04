import '@angular/compiler';
import { describe, expect, it } from 'vitest';

import { TngMultiAutocompleteComponent } from './tng-multi-autocomplete.component';

describe('tng-multi-autocomplete component', () => {
  it('exports the multi autocomplete component', () => {
    expect(typeof TngMultiAutocompleteComponent).toBe('function');
  });
});
