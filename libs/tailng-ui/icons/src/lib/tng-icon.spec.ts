import { describe, expect, it } from 'vitest';
import { resolveTngIcon } from './tng-icon';

describe('resolveTngIcon', () => {
  it('resolves icon references for non-flag icons', () => {
    expect(resolveTngIcon('people')).toEqual({
      flagCode: null,
      iconRef: 'people',
      kind: 'icon',
    });
  });

  it('resolves country flag icon by prefix', () => {
    expect(resolveTngIcon('flag:in')).toEqual({
      flagCode: 'in',
      iconRef: null,
      kind: 'flag',
    });
    expect(resolveTngIcon('flag-us')).toEqual({
      flagCode: 'us',
      iconRef: null,
      kind: 'flag',
    });
  });

  it('returns unknown for malformed or empty icon references', () => {
    expect(resolveTngIcon('')).toEqual({
      flagCode: null,
      iconRef: null,
      kind: 'unknown',
    });
    expect(resolveTngIcon('flag:usa')).toEqual({
      flagCode: null,
      iconRef: null,
      kind: 'unknown',
    });
  });
});
