import { describe, expect, it } from 'vitest';
import { TngSkeletonComponent, resolveTngSkeletonCssSize } from './tng-skeleton.component';

describe('tng-skeleton component', () => {
  it('exports skeleton component', () => {
    expect(typeof TngSkeletonComponent).toBe('function');
  });

  it('resolves css size values', () => {
    expect(resolveTngSkeletonCssSize('2rem', '1rem')).toBe('2rem');
    expect(resolveTngSkeletonCssSize('  ', '1rem')).toBe('1rem');
  });
});
