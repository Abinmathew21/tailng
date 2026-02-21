import { expect, it, vi } from 'vitest';
import {
  createActiveDescendantAdapter,
  createRovingFocusAdapter,
  createTypeaheadAdapter,
  type TngAngularCdkKeyManagerDelegates,
} from './key-manager.adapter';
import type {
  TngActiveDescendantController,
  TngActiveDescendantOptions,
  TngRovingFocusController,
  TngRovingFocusOptions,
} from '../../a11y';
import type { TngTypeaheadController, TngTypeaheadOptions } from '../../collections';

function createRovingFocusOptions(): TngRovingFocusOptions {
  return { itemIds: ['a', 'b', 'c'] };
}

function createActiveDescendantOptions(): TngActiveDescendantOptions {
  return { hostId: 'listbox-1', itemIds: ['a', 'b', 'c'] };
}

function createTypeaheadOptions(): TngTypeaheadOptions {
  return {
    items: [
      { id: 'a', text: 'Alpha' },
      { id: 'b', text: 'Beta' },
      { id: 'c', text: 'Gamma' },
    ],
  };
}

function createRovingFocusMock(): TngRovingFocusController {
  return {
    clear: () => undefined,
    end: () => null,
    getActiveId: () => null,
    home: () => null,
    moveNext: () => null,
    movePrev: () => null,
    setActiveId: () => null,
    setDisabledIds: () => undefined,
    setItemIds: () => undefined,
  };
}

function createActiveDescendantMock(): TngActiveDescendantController {
  return {
    clear: () => undefined,
    getActiveId: () => null,
    getHostAttributes: () => Object.freeze({ id: 'listbox-1' }),
    moveNext: () => null,
    movePrev: () => null,
    setActiveId: () => null,
    setDisabledIds: () => undefined,
    setItemIds: () => undefined,
  };
}

function createTypeaheadMock(): TngTypeaheadController {
  return {
    getState: () => ({ activeId: null, buffer: '' }),
    handleKey: () => ({ activeId: null, buffer: '' }),
    reset: () => undefined,
    setActiveId: () => null,
    setItems: () => undefined,
  };
}

it('uses key-manager delegates when prefer-angular-cdk mode is enabled', () => {
  const createRoving = vi.fn<(options: TngRovingFocusOptions) => TngRovingFocusController>(() =>
    createRovingFocusMock(),
  );
  const createActive = vi.fn<
    (options: TngActiveDescendantOptions) => TngActiveDescendantController
  >(() => createActiveDescendantMock());
  const createTypeahead = vi.fn<(options: TngTypeaheadOptions) => TngTypeaheadController>(() =>
    createTypeaheadMock(),
  );
  const delegates: TngAngularCdkKeyManagerDelegates = {
    createActiveDescendantController: createActive,
    createRovingFocusController: createRoving,
    createTypeaheadController: createTypeahead,
  };

  createRovingFocusAdapter({
    adapterConfig: { mode: 'prefer-angular-cdk' },
    angularCdk: delegates,
    rovingFocus: createRovingFocusOptions(),
  });
  createActiveDescendantAdapter({
    activeDescendant: createActiveDescendantOptions(),
    adapterConfig: { mode: 'prefer-angular-cdk' },
    angularCdk: delegates,
  });
  createTypeaheadAdapter({
    adapterConfig: { mode: 'prefer-angular-cdk' },
    angularCdk: delegates,
    typeahead: createTypeaheadOptions(),
  });

  expect(createRoving).toHaveBeenCalledOnce();
  expect(createActive).toHaveBeenCalledOnce();
  expect(createTypeahead).toHaveBeenCalledOnce();
});

it('falls back to tailng controllers when delegates are missing', () => {
  const roving = createRovingFocusAdapter({
    adapterConfig: { mode: 'prefer-angular-cdk' },
    rovingFocus: createRovingFocusOptions(),
  });
  const active = createActiveDescendantAdapter({
    activeDescendant: createActiveDescendantOptions(),
    adapterConfig: { mode: 'prefer-angular-cdk' },
  });
  const typeahead = createTypeaheadAdapter({
    adapterConfig: { mode: 'prefer-angular-cdk' },
    typeahead: createTypeaheadOptions(),
  });

  expect(roving.getActiveId()).toBe('a');
  expect(active.getActiveId()).toBeNull();
  expect(typeahead.getState().activeId).toBeNull();
});

it('ignores delegates when enabledFeatures excludes a key-manager feature', () => {
  const createRoving = vi.fn<(options: TngRovingFocusOptions) => TngRovingFocusController>(() =>
    createRovingFocusMock(),
  );

  const roving = createRovingFocusAdapter({
    adapterConfig: {
      enabledFeatures: ['typeahead'],
      mode: 'prefer-angular-cdk',
    },
    angularCdk: { createRovingFocusController: createRoving },
    rovingFocus: createRovingFocusOptions(),
  });

  expect(createRoving).not.toHaveBeenCalled();
  expect(roving.getActiveId()).toBe('a');
});

it('uses tailng controllers when adapter mode is fallback-tailng even with delegates', () => {
  const createRoving = vi.fn<(options: TngRovingFocusOptions) => TngRovingFocusController>(() =>
    createRovingFocusMock(),
  );
  const createActive = vi.fn<
    (options: TngActiveDescendantOptions) => TngActiveDescendantController
  >(() => createActiveDescendantMock());
  const createTypeahead = vi.fn<(options: TngTypeaheadOptions) => TngTypeaheadController>(() =>
    createTypeaheadMock(),
  );

  const delegates: TngAngularCdkKeyManagerDelegates = {
    createActiveDescendantController: createActive,
    createRovingFocusController: createRoving,
    createTypeaheadController: createTypeahead,
  };

  const roving = createRovingFocusAdapter({
    adapterConfig: { mode: 'fallback-tailng' },
    angularCdk: delegates,
    rovingFocus: createRovingFocusOptions(),
  });
  const active = createActiveDescendantAdapter({
    activeDescendant: createActiveDescendantOptions(),
    adapterConfig: { mode: 'fallback-tailng' },
    angularCdk: delegates,
  });
  const typeahead = createTypeaheadAdapter({
    adapterConfig: { mode: 'fallback-tailng' },
    angularCdk: delegates,
    typeahead: createTypeaheadOptions(),
  });

  expect(createRoving).not.toHaveBeenCalled();
  expect(createActive).not.toHaveBeenCalled();
  expect(createTypeahead).not.toHaveBeenCalled();
  expect(roving.getActiveId()).toBe('a');
  expect(active.getActiveId()).toBeNull();
  expect(typeahead.getState().activeId).toBeNull();
});
