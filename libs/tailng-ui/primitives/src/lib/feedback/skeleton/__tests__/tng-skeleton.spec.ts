import { describe, expect, it } from 'vitest';
import {
  TngSkeleton,
  resolveTngSkeletonDataAnimated,
  resolveTngSkeletonDataRounded,
} from '../tng-skeleton';

describe('tng-skeleton primitive', () => {
  it('exports skeleton directive', () => {
    expect(typeof TngSkeleton).toBe('function');
  });

  it('resolves skeleton data attributes', () => {
    expect(resolveTngSkeletonDataAnimated(true)).toBe('true');
    expect(resolveTngSkeletonDataAnimated(false)).toBe('false');
    expect(resolveTngSkeletonDataRounded(true)).toBe('true');
    expect(resolveTngSkeletonDataRounded(false)).toBe('false');
  });
});
