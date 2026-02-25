import { describe, expect, it } from 'vitest';
import { toTngAvatarFallbackText, TngAvatarComponent } from './tng-avatar.component';

describe('tng-avatar component', () => {
  it('exports the public TngAvatarComponent symbol', () => {
    expect(typeof TngAvatarComponent).toBe('function');
  });

  it('builds fallback initials from names', () => {
    expect(toTngAvatarFallbackText('Taylor Ng')).toBe('TN');
    expect(toTngAvatarFallbackText('Tailng')).toBe('TA');
    expect(toTngAvatarFallbackText('')).toBe('?');
    expect(toTngAvatarFallbackText(undefined)).toBe('?');
  });
});
