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
