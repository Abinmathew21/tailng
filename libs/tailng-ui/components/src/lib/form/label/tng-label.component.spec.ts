import { describe, expect, it } from 'vitest';
import { TngLabelComponent, resolveTngLabelForAttr } from './tng-label.component';

describe('tng-label component', () => {
  it('exports label component', () => {
    expect(typeof TngLabelComponent).toBe('function');
  });

  it('resolves for attribute value', () => {
    expect(resolveTngLabelForAttr('field-id')).toBe('field-id');
    expect(resolveTngLabelForAttr('   ')).toBeNull();
  });
});
