import { describe, expect, it } from 'vitest';
import { TngAutocomplete } from '../tng-autocomplete';

describe('tng-autocomplete primitive', () => {
  it('exports the autocomplete primitive', () => {
    expect(typeof TngAutocomplete).toBe('function');
  });
});
