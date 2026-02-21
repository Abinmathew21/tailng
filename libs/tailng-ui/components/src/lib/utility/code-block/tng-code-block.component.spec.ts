import { describe, expect, it } from 'vitest';
import {
  coerceTngCodeBlockCopyResetDuration,
  coerceTngCodeBlockHighlightMode,
  normalizeTngCodeBlockCode,
  TngCodeBlock,
  toTngCodeBlockLineNumbers,
} from './tng-code-block.component';

describe('tng-code-block component', () => {
  it('exports the public TngCodeBlock symbol', () => {
    expect(typeof TngCodeBlock).toBe('function');
  });

  it('normalizes code and line numbers', () => {
    expect(normalizeTngCodeBlockCode('line1\r\nline2\rline3')).toBe('line1\nline2\nline3');
    expect(normalizeTngCodeBlockCode(null)).toBe('');

    expect(toTngCodeBlockLineNumbers('')).toEqual([1]);
    expect(toTngCodeBlockLineNumbers('a\nb\n')).toEqual([1, 2, 3]);
  });

  it('coerces highlight mode and copy reset duration', () => {
    expect(coerceTngCodeBlockHighlightMode('auto')).toBe('auto');
    expect(coerceTngCodeBlockHighlightMode('on')).toBe('on');
    expect(coerceTngCodeBlockHighlightMode('unknown')).toBe('auto');

    expect(coerceTngCodeBlockCopyResetDuration(Number.NaN)).toBe(1500);
    expect(coerceTngCodeBlockCopyResetDuration(-10)).toBe(0);
    expect(coerceTngCodeBlockCopyResetDuration('900')).toBe(900);
  });
});
