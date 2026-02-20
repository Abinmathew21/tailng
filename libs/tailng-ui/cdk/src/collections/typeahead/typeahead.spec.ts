import { expect, it } from 'vitest';
import { createTypeaheadController } from './typeahead';

it('matches item by typed prefix', () => {
  const controller = createTypeaheadController({
    items: [
      { id: 'alpha', text: 'Alpha' },
      { id: 'beta', text: 'Beta' },
    ],
  });

  expect(controller.handleKey('a').activeId).toBe('alpha');
});

it('matches case-insensitively', () => {
  const controller = createTypeaheadController({
    items: [
      { id: 'alpha', text: 'Alpha' },
      { id: 'beta', text: 'Beta' },
    ],
  });

  expect(controller.handleKey('B').activeId).toBe('beta');
});

it('buffers keys within timeout window', () => {
  const controller = createTypeaheadController({
    bufferResetMs: 50,
    items: [
      { id: 'alpha', text: 'Alpha' },
      { id: 'alpine', text: 'Alpine' },
      { id: 'beta', text: 'Beta' },
    ],
  });

  controller.handleKey('a', 100);
  const state = controller.handleKey('l', 120);
  expect(state.buffer).toBe('al');
  expect(state.activeId).toBe('alpha');
});

it('resets buffer after timeout', () => {
  const controller = createTypeaheadController({
    bufferResetMs: 10,
    items: [
      { id: 'alpha', text: 'Alpha' },
      { id: 'beta', text: 'Beta' },
    ],
  });

  controller.handleKey('a', 1);
  const state = controller.handleKey('b', 100);
  expect(state.buffer).toBe('b');
  expect(state.activeId).toBe('beta');
});

it('does not reset buffer at exact timeout boundary', () => {
  const controller = createTypeaheadController({
    bufferResetMs: 10,
    items: [
      { id: 'ab', text: 'Ab' },
      { id: 'beta', text: 'Beta' },
    ],
  });

  controller.handleKey('a', 100);
  const state = controller.handleKey('b', 110);
  expect(state.buffer).toBe('ab');
  expect(state.activeId).toBe('ab');
});

it('skips disabled matches and picks the next enabled item', () => {
  const controller = createTypeaheadController({
    items: [
      { disabled: true, id: 'alpha-disabled', text: 'Alpha' },
      { id: 'alpha-enabled', text: 'Alpha Prime' },
    ],
  });

  expect(controller.handleKey('a').activeId).toBe('alpha-enabled');
});

it('keeps current active id when there is no prefix match', () => {
  const controller = createTypeaheadController({
    initialActiveId: 'beta',
    items: [
      { id: 'alpha', text: 'Alpha' },
      { id: 'beta', text: 'Beta' },
    ],
  });

  const state = controller.handleKey('z', 1);
  expect(state.activeId).toBe('beta');
});

it('reset clears the typed buffer', () => {
  const controller = createTypeaheadController({
    items: [{ id: 'alpha', text: 'Alpha' }],
  });

  controller.handleKey('a', 100);
  controller.reset();
  expect(controller.getState().buffer).toBe('');
});

it('cycles from current active item for repeated single-character search', () => {
  const controller = createTypeaheadController({
    initialActiveId: 'alpha',
    items: [
      { id: 'alpha', text: 'Alpha' },
      { id: 'alpine', text: 'Alpine' },
      { id: 'amber', text: 'Amber' },
    ],
  });

  expect(controller.handleKey('a', 10).activeId).toBe('alpine');
  expect(controller.handleKey('a', 20).activeId).toBe('amber');
});

it('supports non-loop matching from active item', () => {
  const controller = createTypeaheadController({
    initialActiveId: 'alpine',
    items: [
      { id: 'alpha', text: 'Alpha' },
      { id: 'alpine', text: 'Alpine' },
    ],
    loop: false,
  });

  expect(controller.handleKey('a', 10).activeId).toBe('alpine');
});

it('supports start-based match strategy', () => {
  const controller = createTypeaheadController({
    initialActiveId: 'alpine',
    items: [
      { id: 'alpha', text: 'Alpha' },
      { id: 'alpine', text: 'Alpine' },
    ],
    matchStrategy: 'start',
  });

  expect(controller.handleKey('a', 10).activeId).toBe('alpha');
});

it('ignores non-printable keys', () => {
  const controller = createTypeaheadController({
    initialActiveId: 'alpha',
    items: [{ id: 'alpha', text: 'Alpha' }],
  });

  const state = controller.handleKey('ArrowDown', 1);
  expect(state.activeId).toBe('alpha');
  expect(state.buffer).toBe('');
});

it('supports setting active id explicitly', () => {
  const controller = createTypeaheadController({
    items: [
      { id: 'alpha', text: 'Alpha' },
      { disabled: true, id: 'beta', text: 'Beta' },
    ],
  });

  expect(controller.setActiveId('alpha')).toBe('alpha');
  expect(controller.setActiveId('beta')).toBe('alpha');
});

it('supports runtime item updates and clears invalid active id', () => {
  const controller = createTypeaheadController({
    initialActiveId: 'alpha',
    items: [{ id: 'alpha', text: 'Alpha' }],
  });

  controller.setItems([{ id: 'beta', text: 'Beta' }]);
  expect(controller.getState().activeId).toBeNull();
});
