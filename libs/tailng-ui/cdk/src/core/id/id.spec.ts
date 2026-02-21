import { describe, expect, it } from 'vitest';
import { createTngIdFactory } from './id';

describe('createTngIdFactory', () => {
  it('creates incrementing ids', () => {
    const createId = createTngIdFactory('item');

    expect(createId()).toBe('item-1');
    expect(createId()).toBe('item-2');
  });
});
