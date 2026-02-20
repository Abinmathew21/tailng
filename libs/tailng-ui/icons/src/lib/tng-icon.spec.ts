import { describe, expect, it } from 'vitest';
import { resolveTngIcon } from './tng-icon';

describe('resolveTngIcon', () => {
  it('resolves people emoji icon', () => {
    expect(resolveTngIcon('people')).toEqual({
      flagCode: null,
      kind: 'emoji',
      value: '👥',
    });
  });

  it('resolves country flag icon by prefix', () => {
    expect(resolveTngIcon('flag:in')).toEqual({
      flagCode: 'in',
      kind: 'flag',
      value: 'in',
    });
    expect(resolveTngIcon('flag-us')).toEqual({
      flagCode: 'us',
      kind: 'flag',
      value: 'us',
    });
  });

  it('returns unknown for unsupported names', () => {
    expect(resolveTngIcon('unknown-icon')).toEqual({
      flagCode: null,
      kind: 'unknown',
      value: null,
    });
    expect(resolveTngIcon('flag:usa')).toEqual({
      flagCode: null,
      kind: 'unknown',
      value: null,
    });
  });
});
