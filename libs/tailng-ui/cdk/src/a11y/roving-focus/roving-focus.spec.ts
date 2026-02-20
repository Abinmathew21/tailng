import { describe, expect, it } from 'vitest';
import { createRovingFocusController } from './roving-focus';

describe('createRovingFocusController', () => {
  it('starts with the first enabled item', () => {
    const controller = createRovingFocusController({
      disabledIds: ['a'],
      itemIds: ['a', 'b', 'c'],
    });

    expect(controller.getActiveId()).toBe('b');
  });

  it('moves forward and backward through enabled ids', () => {
    const controller = createRovingFocusController({ itemIds: ['a', 'b', 'c'] });

    expect(controller.getActiveId()).toBe('a');
    expect(controller.moveNext()).toBe('b');
    expect(controller.movePrev()).toBe('a');
  });

  it('loops when enabled', () => {
    const controller = createRovingFocusController({
      itemIds: ['a', 'b'],
      loop: true,
    });

    controller.end();
    expect(controller.moveNext()).toBe('a');
    expect(controller.movePrev()).toBe('b');
  });

  it('does not wrap when loop is false', () => {
    const controller = createRovingFocusController({
      itemIds: ['a', 'b'],
      loop: false,
    });

    controller.end();
    expect(controller.moveNext()).toBe('b');

    controller.home();
    expect(controller.movePrev()).toBe('a');
  });

  it('home and end move to first/last enabled item', () => {
    const controller = createRovingFocusController({
      disabledIds: ['b'],
      itemIds: ['a', 'b', 'c'],
    });

    expect(controller.end()).toBe('c');
    expect(controller.home()).toBe('a');
  });

  it('setActiveId ignores unknown or disabled ids', () => {
    const controller = createRovingFocusController({
      disabledIds: ['b'],
      itemIds: ['a', 'b', 'c'],
    });

    expect(controller.setActiveId('c')).toBe('c');
    expect(controller.setActiveId('b')).toBe('c');
    expect(controller.setActiveId('unknown')).toBe('c');
  });

  it('keeps null active state when explicitly set to null', () => {
    const controller = createRovingFocusController({ itemIds: ['a', 'b'] });

    controller.setActiveId(null);
    expect(controller.getActiveId()).toBeNull();
    expect(controller.moveNext()).toBeNull();
  });

  it('handles empty enabled list safely', () => {
    const controller = createRovingFocusController({
      disabledIds: ['a'],
      itemIds: ['a'],
    });

    expect(controller.getActiveId()).toBeNull();
    expect(controller.home()).toBeNull();
    expect(controller.end()).toBeNull();
    expect(controller.moveNext()).toBeNull();
    expect(controller.movePrev()).toBeNull();
  });

  it('recovers when initial id is not part of enabled items', () => {
    const controller = createRovingFocusController({
      initialActiveId: 'unknown',
      itemIds: ['a', 'b', 'c'],
    });

    expect(controller.getActiveId()).toBe('unknown');
    expect(controller.moveNext()).toBe('a');
  });

  it('accepts orientation options without changing navigation semantics', () => {
    const controller = createRovingFocusController({
      itemIds: ['a', 'b'],
      orientation: 'vertical',
    });

    expect(controller.moveNext()).toBe('b');
  });
});
