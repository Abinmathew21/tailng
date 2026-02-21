import { expect, it, vi } from 'vitest';
import {
  createSelectionModelAdapter,
  type TngAngularCdkSelectionModelDelegates,
} from './selection-model.adapter';
import type { TngSelectionModel, TngSelectionModelOptions } from '../../collections';

function createSelectionOptions(): TngSelectionModelOptions<string> {
  return {
    initialSelected: ['alpha'],
    mode: 'multiple',
  };
}

function createSelectionMock(): TngSelectionModel<string> {
  return {
    clear: () => undefined,
    deselect: () => undefined,
    getAnchor: () => null,
    getSelected: () => [],
    isSelected: () => false,
    select: () => undefined,
    selectRange: () => [],
    setAnchor: () => undefined,
    toggle: () => undefined,
  };
}

it('uses selection-model delegate when prefer-angular-cdk mode is enabled', () => {
  const createSelection = vi.fn<
    (options: TngSelectionModelOptions<string>) => TngSelectionModel<string>
  >(() => createSelectionMock());
  const delegates: TngAngularCdkSelectionModelDelegates = {
    createSelectionModel: createSelection,
  };

  createSelectionModelAdapter({
    adapterConfig: { mode: 'prefer-angular-cdk' },
    angularCdk: delegates,
    selection: createSelectionOptions(),
  });

  expect(createSelection).toHaveBeenCalledOnce();
});

it('falls back to tailng selection model when delegate is missing', () => {
  const model = createSelectionModelAdapter({
    adapterConfig: { mode: 'prefer-angular-cdk' },
    selection: createSelectionOptions(),
  });

  expect(model.getSelected()).toEqual(['alpha']);
});

it('ignores selection delegate when enabledFeatures excludes selection-model', () => {
  const createSelection = vi.fn<
    (options: TngSelectionModelOptions<string>) => TngSelectionModel<string>
  >(() => createSelectionMock());

  const model = createSelectionModelAdapter({
    adapterConfig: {
      enabledFeatures: ['typeahead'],
      mode: 'prefer-angular-cdk',
    },
    angularCdk: { createSelectionModel: createSelection },
    selection: createSelectionOptions(),
  });

  expect(createSelection).not.toHaveBeenCalled();
  expect(model.getSelected()).toEqual(['alpha']);
});
