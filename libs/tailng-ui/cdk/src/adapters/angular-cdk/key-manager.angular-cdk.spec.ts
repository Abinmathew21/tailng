import { expect, it } from 'vitest';
import { createAngularCdkKeyManagerDelegates } from './key-manager.angular-cdk';
import {
  createActiveDescendantController,
  createRovingFocusController,
  type TngActiveDescendantController,
  type TngRovingFocusController,
} from '../../a11y';
import { createTypeaheadController, type TngTypeaheadController } from '../../collections';

type TngTypeaheadSnapshot = Readonly<{
  activeId: string | null;
  buffer: string;
}>;

function runRovingScenario(controller: TngRovingFocusController): readonly (string | null)[] {
  const results: (string | null)[] = [];
  results.push(controller.getActiveId());
  results.push(controller.moveNext());
  results.push(controller.moveNext());
  results.push(controller.movePrev());
  controller.setDisabledIds(['a', 'b']);
  results.push(controller.getActiveId());
  controller.setItemIds(['c', 'd', 'e']);
  results.push(controller.getActiveId());
  results.push(controller.home());
  results.push(controller.end());
  controller.clear();
  results.push(controller.getActiveId());
  return results;
}

function runActiveScenario(controller: TngActiveDescendantController): readonly (string | null)[] {
  const results: (string | null)[] = [];
  results.push(controller.getActiveId());
  results.push(controller.moveNext());
  results.push(controller.moveNext());
  results.push(controller.movePrev());
  controller.setDisabledIds(['a', 'b']);
  results.push(controller.getActiveId());
  controller.setItemIds(['c', 'd', 'e']);
  results.push(controller.getActiveId());
  results.push(controller.moveNext());
  controller.clear();
  results.push(controller.getActiveId());
  return results;
}

function runTypeaheadScenario(controller: TngTypeaheadController): readonly TngTypeaheadSnapshot[] {
  const results: TngTypeaheadSnapshot[] = [];
  results.push(controller.getState());
  results.push(controller.handleKey('a', 10));
  results.push(controller.handleKey('l', 20));
  results.push(controller.handleKey('p', 30));
  results.push(controller.handleKey('g', 1000));
  controller.setItems([
    { id: 'beta', text: 'Beta' },
    { disabled: true, id: 'gamma', text: 'Gamma' },
  ]);
  results.push(controller.getState());
  results.push(controller.handleKey('b', 1100));
  controller.reset();
  results.push(controller.getState());
  return results;
}

it('matches roving-focus behavior parity with tailng controller', () => {
  const delegates = createAngularCdkKeyManagerDelegates();
  const createController = delegates.createRovingFocusController;
  if (createController === undefined) {
    throw new Error('Expected roving-focus delegate factory.');
  }

  const legacy = createRovingFocusController({
    disabledIds: ['x'],
    initialActiveId: 'a',
    itemIds: ['a', 'b', 'c'],
    loop: true,
  });
  const migrated = createController({
    disabledIds: ['x'],
    initialActiveId: 'a',
    itemIds: ['a', 'b', 'c'],
    loop: true,
  });

  expect(runRovingScenario(migrated)).toEqual(runRovingScenario(legacy));
});

it('matches active-descendant behavior parity with tailng controller', () => {
  const delegates = createAngularCdkKeyManagerDelegates();
  const createController = delegates.createActiveDescendantController;
  if (createController === undefined) {
    throw new Error('Expected active-descendant delegate factory.');
  }

  const legacy = createActiveDescendantController({
    hostId: 'listbox-1',
    initialActiveId: 'a',
    itemIds: ['a', 'b', 'c'],
    loop: true,
  });
  const migrated = createController({
    hostId: 'listbox-1',
    initialActiveId: 'a',
    itemIds: ['a', 'b', 'c'],
    loop: true,
  });

  expect(runActiveScenario(migrated)).toEqual(runActiveScenario(legacy));
  expect(migrated.getHostAttributes()).toEqual(legacy.getHostAttributes());
});

it('matches typeahead behavior parity with tailng controller', () => {
  const delegates = createAngularCdkKeyManagerDelegates();
  const createController = delegates.createTypeaheadController;
  if (createController === undefined) {
    throw new Error('Expected typeahead delegate factory.');
  }

  const legacy = createTypeaheadController({
    bufferResetMs: 500,
    initialActiveId: 'alpha',
    items: [
      { id: 'alpha', text: 'Alpha' },
      { id: 'beta', text: 'Beta' },
      { id: 'gamma', text: 'Gamma' },
    ],
    loop: true,
    matchStrategy: 'active',
  });
  const migrated = createController({
    bufferResetMs: 500,
    initialActiveId: 'alpha',
    items: [
      { id: 'alpha', text: 'Alpha' },
      { id: 'beta', text: 'Beta' },
      { id: 'gamma', text: 'Gamma' },
    ],
    loop: true,
    matchStrategy: 'active',
  });

  expect(runTypeaheadScenario(migrated)).toEqual(runTypeaheadScenario(legacy));
});
