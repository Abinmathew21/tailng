import { describe, expect, it } from 'vitest';
import { TngAutocomplete } from './tng-autocomplete.component';

describe('tng-autocomplete component', () => {
  it('exports the autocomplete component', () => {
    expect(typeof TngAutocomplete).toBe('function');
  });
});
