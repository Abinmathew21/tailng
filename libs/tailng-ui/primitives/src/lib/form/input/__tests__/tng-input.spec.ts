import { describe, expect, it } from 'vitest';
import { coerceTngInputNullableBoolean } from '../tng-input';

describe('tng-input primitive coercion', () => {
  it('coerces nullable boolean values consistently', () => {
    expect(coerceTngInputNullableBoolean(undefined)).toBeNull();
    expect(coerceTngInputNullableBoolean(null)).toBeNull();
    expect(coerceTngInputNullableBoolean('')).toBe(true);
    expect(coerceTngInputNullableBoolean('true')).toBe(true);
    expect(coerceTngInputNullableBoolean('false')).toBe(false);
    expect(coerceTngInputNullableBoolean('invalid')).toBeNull();
  });
});
