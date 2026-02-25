import { describe, expect, it } from 'vitest';
import { TngMultiSelectComponent } from './tng-multiselect.component';

describe('tng-multiselect component', () => {
  it('exports the multiselect component', () => {
    expect(typeof TngMultiSelectComponent).toBe('function');
  });
});
