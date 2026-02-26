import { describe, expect, it } from 'vitest';
import { TngAvatar, TngAvatarFallback, TngAvatarImage } from '../tng-avatar';

describe('tng-avatar primitives', () => {
  it('exports all public avatar directives', () => {
    expect(typeof TngAvatar).toBe('function');
    expect(typeof TngAvatarImage).toBe('function');
    expect(typeof TngAvatarFallback).toBe('function');
  });
});
