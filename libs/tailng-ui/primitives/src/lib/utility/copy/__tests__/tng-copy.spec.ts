import { describe, expect, it } from 'vitest';
import {
  defaultTngCopyIgnoreSelectors,
  normalizeTngCopyIgnoreSelectors,
  resolveTngCopyPayload,
  TngCopy,
} from '../tng-copy';

describe('tng-copy primitive', () => {
  it('exports the public TngCopy symbol', () => {
    expect(typeof TngCopy).toBe('function');
  });

  it('normalizes ignore selectors input', () => {
    expect(normalizeTngCopyIgnoreSelectors(undefined)).toEqual(defaultTngCopyIgnoreSelectors);
    expect(normalizeTngCopyIgnoreSelectors(' .line-no, [data-copy-ignore], .line-no ')).toEqual([
      '.line-no',
      '[data-copy-ignore]',
    ]);
    expect(
      normalizeTngCopyIgnoreSelectors(['.line-no', ' [data-copy-ignore] ', '.line-no', '']),
    ).toEqual(['.line-no', '[data-copy-ignore]']);
  });

  it('prefers direct text over source text for payload resolution', () => {
    expect(resolveTngCopyPayload('pnpm add @tailng-ui/components', 'fallback')).toBe(
      'pnpm add @tailng-ui/components',
    );
    expect(resolveTngCopyPayload('   ', 'from source')).toBeNull();
    expect(resolveTngCopyPayload(undefined, 'from source')).toBe('from source');
    expect(resolveTngCopyPayload(undefined, '   ')).toBeNull();
  });
});
