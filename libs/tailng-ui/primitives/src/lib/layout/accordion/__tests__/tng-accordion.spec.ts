import { describe, expect, it } from 'vitest';
import { TngAccordion } from '../tng-accordion';

describe('tng-accordion primitive', () => {
  it('exports the accordion primitive', () => {
    expect(typeof TngAccordion).toBe('function');
  });
});
