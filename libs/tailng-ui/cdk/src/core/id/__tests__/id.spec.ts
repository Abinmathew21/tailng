import { describe, expect, it } from 'vitest';
import { createTngIdFactory, createTngId } from '../id';

describe('createTngIdFactory', () => {
  it('creates incrementing ids', () => {
    const createId = createTngIdFactory('item');

    expect(createId()).toBe('item-1');
    expect(createId()).toBe('item-2');
    expect(createId()).toBe('item-3');
  });

  it('creates independent counters per factory', () => {
    const factoryA = createTngIdFactory('a');
    const factoryB = createTngIdFactory('b');

    expect(factoryA()).toBe('a-1');
    expect(factoryA()).toBe('a-2');

    expect(factoryB()).toBe('b-1');
    expect(factoryB()).toBe('b-2');
  });

  it('supports scoped ids', () => {
    const factory = createTngIdFactory('option', 'listbox-1');

    expect(factory()).toBe('option-listbox-1-1');
    expect(factory()).toBe('option-listbox-1-2');
  });

  it('scoped factories are independent', () => {
    const factoryA = createTngIdFactory('option', 'scope-a');
    const factoryB = createTngIdFactory('option', 'scope-b');

    expect(factoryA()).toBe('option-scope-a-1');
    expect(factoryB()).toBe('option-scope-b-1');
  });

  it('normalizes whitespace in prefix', () => {
    const factory = createTngIdFactory('  my item  ');

    expect(factory()).toBe('my-item-1');
  });

  it('normalizes whitespace in scope', () => {
    const factory = createTngIdFactory('item', '  my scope  ');

    expect(factory()).toBe('item-my-scope-1');
  });

  it('removes duplicate hyphens', () => {
    const factory = createTngIdFactory('item--name', 'scope--value');

    expect(factory()).toBe('item-name-scope-value-1');
  });

  it('removes trailing hyphens', () => {
    const factory = createTngIdFactory('item-', 'scope-');

    expect(factory()).toBe('item-scope-1');
  });

  it('createTngId returns single id', () => {
    const id = createTngId('dialog');

    expect(id).toBe('dialog-1');
  });

  it('createTngId supports scope', () => {
    const id = createTngId('option', 'listbox-2');

    expect(id).toBe('option-listbox-2-1');
  });

  it('does not share state between factories with same prefix', () => {
    const factoryA = createTngIdFactory('item');
    const factoryB = createTngIdFactory('item');

    expect(factoryA()).toBe('item-1');
    expect(factoryB()).toBe('item-1'); // separate counters
  });

  it('handles empty scope gracefully', () => {
    const factory = createTngIdFactory('item', '');

    expect(factory()).toBe('item-1');
  });
});