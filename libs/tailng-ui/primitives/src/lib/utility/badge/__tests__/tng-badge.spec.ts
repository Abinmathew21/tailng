import { describe, expect, it } from 'vitest';
import {
  coerceTngBadgeMax,
  coerceTngBadgePosition,
  coerceTngBadgeSize,
  coerceTngBadgeTone,
  coerceTngBadgeVariant,
  normalizeTngBadgeMax,
  resolveTngBadgeContent,
  resolveTngBadgePlacement,
  TngBadge,
  toTngBadgeCssLength,
} from '../tng-badge';

describe('tng-badge primitive', () => {
  it('exports the public TngBadge symbol', () => {
    expect(typeof TngBadge).toBe('function');
  });

  it('normalizes max values', () => {
    expect(normalizeTngBadgeMax(Number.NaN)).toBe(99);
    expect(normalizeTngBadgeMax(-2)).toBe(0);
    expect(normalizeTngBadgeMax(22.8)).toBe(23);
    expect(coerceTngBadgeMax('45')).toBe(45);
  });

  it('coerces badge enums and resolves placement', () => {
    expect(coerceTngBadgePosition('top-start')).toBe('top-start');
    expect(coerceTngBadgePosition('invalid')).toBe('top-end');
    expect(coerceTngBadgeSize('lg')).toBe('lg');
    expect(coerceTngBadgeSize('invalid')).toBe('md');
    expect(coerceTngBadgeTone('success')).toBe('success');
    expect(coerceTngBadgeTone('invalid')).toBe('danger');
    expect(coerceTngBadgeVariant('soft')).toBe('soft');
    expect(coerceTngBadgeVariant('invalid')).toBe('solid');

    expect(resolveTngBadgePlacement('top-end')).toEqual({
      bottom: null,
      left: null,
      right: '0',
      top: '0',
      transform: 'translate(50%, -50%)',
    });
  });

  it('resolves badge text and css lengths', () => {
    expect(resolveTngBadgeContent(101, 99, false)).toBe('99+');
    expect(resolveTngBadgeContent(9, 99, false)).toBe('9');
    expect(resolveTngBadgeContent('  ', 99, false)).toBe('');
    expect(resolveTngBadgeContent('new', 99, false)).toBe('new');
    expect(resolveTngBadgeContent('  new  ', 99, false)).toBe('  new  ');
    expect(resolveTngBadgeContent(12, 99, true)).toBe('');

    expect(toTngBadgeCssLength(8)).toBe('8px');
    expect(toTngBadgeCssLength('1.25rem')).toBe('1.25rem');
    expect(toTngBadgeCssLength('  ')).toBeNull();
    expect(toTngBadgeCssLength(Number.NaN)).toBeNull();
  });
});
