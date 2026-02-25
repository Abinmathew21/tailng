import { describe, expect, it } from 'vitest';
import { TngMultiselectComponent } from './tng-multiselect.component';

describe('tng-multiselect component', () => {
  it('exports the multiselect component', () => {
    expect(typeof TngMultiselectComponent).toBe('function');
  });
});
