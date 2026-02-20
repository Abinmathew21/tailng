import { describe, expect, it } from 'vitest';
import { createSelectionModel } from './selection-model';

describe('createSelectionModel', () => {
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
});
