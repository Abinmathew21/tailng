import { describe, expect, it } from 'vitest';
import { toTngAvatarFallbackText, TngAvatar } from './tng-avatar.component';

describe('tng-avatar component', () => {
  it('exports the public TngAvatar symbol', () => {
    expect(typeof TngAvatar).toBe('function');
  });

  it('builds fallback initials from names', () => {
    expect(toTngAvatarFallbackText('Taylor Ng')).toBe('TN');
    expect(toTngAvatarFallbackText('Tailng')).toBe('TA');
    expect(toTngAvatarFallbackText('')).toBe('?');
    expect(toTngAvatarFallbackText(undefined)).toBe('?');
  });
});
