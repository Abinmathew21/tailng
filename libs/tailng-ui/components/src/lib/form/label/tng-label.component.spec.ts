import { describe, expect, it } from 'vitest';
import { TngLabel, resolveTngLabelForAttr } from './tng-label.component';

describe('tng-label component', () => {
  it('exports label component', () => {
    expect(typeof TngLabel).toBe('function');
  });

  it('resolves for attribute value', () => {
    expect(resolveTngLabelForAttr('field-id')).toBe('field-id');
    expect(resolveTngLabelForAttr('   ')).toBeNull();
  });
});
