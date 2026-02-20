import { describe, expect, it } from 'vitest';
import { TngAccordion } from './tng-accordion.component';

describe('tng-accordion component', () => {
  it('exports the accordion component', () => {
    expect(typeof TngAccordion).toBe('function');
  });
});
