import { expect, it } from 'vitest';
import { createRovingFocusController } from './roving-focus';

it('createRovingFocusController: starts with the first enabled item', () => {
  const controller = createRovingFocusController({
    disabledIds: ['a'],
    itemIds: ['a', 'b', 'c'],
  });

  expect(controller.getActiveId()).toBe('b');
});

it('createRovingFocusController: moves forward and backward through enabled ids', () => {
  const controller = createRovingFocusController({ itemIds: ['a', 'b', 'c'] });

  expect(controller.getActiveId()).toBe('a');
  expect(controller.moveNext()).toBe('b');
  expect(controller.movePrev()).toBe('a');
});

it('createRovingFocusController: loops when enabled', () => {
  const controller = createRovingFocusController({
    itemIds: ['a', 'b'],
    loop: true,
  });

  controller.end();
  expect(controller.moveNext()).toBe('a');
  expect(controller.movePrev()).toBe('b');
});

it('createRovingFocusController: does not wrap when loop is false', () => {
  const controller = createRovingFocusController({
    itemIds: ['a', 'b'],
    loop: false,
  });

  controller.end();
  expect(controller.moveNext()).toBe('b');

  controller.home();
  expect(controller.movePrev()).toBe('a');
});

it('createRovingFocusController: home and end move to first/last enabled item', () => {
  const controller = createRovingFocusController({
    disabledIds: ['b'],
    itemIds: ['a', 'b', 'c'],
  });

  expect(controller.end()).toBe('c');
  expect(controller.home()).toBe('a');
});

it('createRovingFocusController: setActiveId ignores unknown or disabled ids', () => {
  const controller = createRovingFocusController({
    disabledIds: ['b'],
    itemIds: ['a', 'b', 'c'],
  });

  expect(controller.setActiveId('c')).toBe('c');
  expect(controller.setActiveId('b')).toBe('c');
  expect(controller.setActiveId('unknown')).toBe('c');
});

it('createRovingFocusController: keeps null active state when explicitly set to null', () => {
  const controller = createRovingFocusController({ itemIds: ['a', 'b'] });

  controller.setActiveId(null);
  expect(controller.getActiveId()).toBeNull();
  expect(controller.moveNext()).toBeNull();
});

it('createRovingFocusController: handles empty enabled list safely', () => {
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

it('createRovingFocusController: recovers when initial id is not part of enabled items', () => {
  const controller = createRovingFocusController({
    initialActiveId: 'unknown',
    itemIds: ['a', 'b', 'c'],
  });

  expect(controller.getActiveId()).toBe('unknown');
  expect(controller.moveNext()).toBe('a');
});

it('createRovingFocusController: accepts orientation options without changing navigation', () => {
  const controller = createRovingFocusController({
    itemIds: ['a', 'b'],
    orientation: 'vertical',
  });

  expect(controller.moveNext()).toBe('b');
});
