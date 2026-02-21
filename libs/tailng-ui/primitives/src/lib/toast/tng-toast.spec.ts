import { describe, expect, it } from 'vitest';
import {
  resolveTngToastAriaLive,
  resolveTngToastDataState,
  resolveTngToastHidden,
  resolveTngToastRole,
  TngToastItem,
  TngToastViewport,
} from './tng-toast';

describe('tng-toast primitive', () => {
  it('exports toast primitives', () => {
    expect(typeof TngToastViewport).toBe('function');
    expect(typeof TngToastItem).toBe('function');
  });

  it('maps tone to aria role and live politeness', () => {
    expect(resolveTngToastRole('neutral')).toBe('status');
    expect(resolveTngToastRole('success')).toBe('status');
    expect(resolveTngToastRole('warning')).toBe('alert');
    expect(resolveTngToastRole('danger')).toBe('alert');
    expect(resolveTngToastAriaLive('neutral')).toBe('polite');
    expect(resolveTngToastAriaLive('danger')).toBe('assertive');
  });

  it('maps open state to visibility attributes', () => {
    expect(resolveTngToastDataState(true)).toBe('open');
    expect(resolveTngToastDataState(false)).toBe('closed');
    expect(resolveTngToastHidden(true)).toBeNull();
    expect(resolveTngToastHidden(false)).toBe('');
  });
});
