import { expect, it } from 'vitest';
import { createSelectionModel } from './selection-model';

it('hydrates initial values', () => {
  const model = createSelectionModel<string>({
    initialSelected: ['alpha', 'beta'],
    mode: 'multiple',
  });

  expect(model.getSelected()).toEqual(['alpha', 'beta']);
  expect(model.isSelected('alpha')).toBe(true);
  expect(model.isSelected('gamma')).toBe(false);
});

it('keeps only one selected value in single mode', () => {
  const model = createSelectionModel<string>({ mode: 'single' });

  model.select('alpha');
  model.select('beta');
  expect(model.getSelected()).toEqual(['beta']);
});

it('supports multiple selected values in multiple mode', () => {
  const model = createSelectionModel<string>({ mode: 'multiple' });

  model.select('alpha');
  model.select('beta');
  expect(model.getSelected()).toEqual(['alpha', 'beta']);
});

it('does not duplicate repeated values in multiple mode', () => {
  const model = createSelectionModel<string>({ mode: 'multiple' });

  model.select('alpha');
  model.select('alpha');
  expect(model.getSelected()).toEqual(['alpha']);
});

it('toggles selected values off', () => {
  const model = createSelectionModel<string>({ mode: 'multiple' });

  model.select('alpha');
  expect(model.isSelected('alpha')).toBe(true);
  model.toggle('alpha');
  expect(model.isSelected('alpha')).toBe(false);
  expect(model.getSelected()).toEqual([]);
});

it('toggle in single mode clears existing selection first', () => {
  const model = createSelectionModel<string>({ mode: 'single' });

  model.select('alpha');
  model.toggle('beta');
  expect(model.getSelected()).toEqual(['beta']);
});

it('deselect and clear are safe no-op operations for missing values', () => {
  const model = createSelectionModel<string>({
    initialSelected: ['alpha'],
    mode: 'multiple',
  });

  model.deselect('missing');
  expect(model.getSelected()).toEqual(['alpha']);
  model.clear();
  model.clear();
  expect(model.getSelected()).toEqual([]);
});

it('tracks anchor from last selected value', () => {
  const model = createSelectionModel<string>({ mode: 'multiple' });

  expect(model.getAnchor()).toBeNull();
  model.select('alpha');
  expect(model.getAnchor()).toBe('alpha');
  model.select('beta');
  expect(model.getAnchor()).toBe('beta');
});

it('can set anchor explicitly without changing selection', () => {
  const model = createSelectionModel<string>({ mode: 'multiple' });

  model.select('alpha');
  model.setAnchor('beta');
  expect(model.getAnchor()).toBe('beta');
  expect(model.getSelected()).toEqual(['alpha']);
});

it('selectRange replaces selection in multiple mode by default', () => {
  const model = createSelectionModel<string>({
    initialSelected: ['zeta'],
    mode: 'multiple',
  });

  const selected = model.selectRange('beta', 'delta', {
    orderedValues: ['alpha', 'beta', 'charlie', 'delta', 'echo'],
  });

  expect(selected).toEqual(['beta', 'charlie', 'delta']);
  expect(model.getAnchor()).toBe('beta');
});

it('selectRange can append range in multiple mode', () => {
  const model = createSelectionModel<string>({
    initialSelected: ['alpha'],
    mode: 'multiple',
  });

  const selected = model.selectRange('charlie', 'delta', {
    orderedValues: ['alpha', 'beta', 'charlie', 'delta', 'echo'],
    rangeMode: 'append',
  });

  expect(selected).toEqual(['alpha', 'charlie', 'delta']);
});

it('selectRange handles reverse ranges', () => {
  const model = createSelectionModel<string>({ mode: 'multiple' });

  const selected = model.selectRange('delta', 'beta', {
    orderedValues: ['alpha', 'beta', 'charlie', 'delta', 'echo'],
  });

  expect(selected).toEqual(['beta', 'charlie', 'delta']);
});

it('selectRange is ignored when bounds are missing', () => {
  const model = createSelectionModel<string>({
    initialSelected: ['alpha'],
    mode: 'multiple',
  });

  expect(
    model.selectRange('alpha', 'missing', { orderedValues: ['alpha', 'beta'] }),
  ).toEqual(['alpha']);
});

it('selectRange in single mode selects only target value', () => {
  const model = createSelectionModel<string>({ mode: 'single' });

  model.selectRange('alpha', 'charlie', { orderedValues: ['alpha', 'beta', 'charlie'] });
  expect(model.getSelected()).toEqual(['charlie']);
});
