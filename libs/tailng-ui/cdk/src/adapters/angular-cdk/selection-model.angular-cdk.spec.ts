import { expect, it } from 'vitest';
import { createAngularCdkSelectionModelDelegates } from './selection-model.angular-cdk';
import { createSelectionModel, type TngSelectionModel } from '../../collections';

type TngSelectionSnapshot = Readonly<{
  anchor: string | null;
  selected: readonly string[];
}>;

function getSnapshot(model: TngSelectionModel<string>): TngSelectionSnapshot {
  return {
    anchor: model.getAnchor(),
    selected: [...model.getSelected()],
  };
}

function runSelectionScenario(model: TngSelectionModel<string>): readonly TngSelectionSnapshot[] {
  const snapshots: TngSelectionSnapshot[] = [];
  snapshots.push(getSnapshot(model));
  model.select('b');
  snapshots.push(getSnapshot(model));
  model.toggle('c');
  snapshots.push(getSnapshot(model));
  model.selectRange('a', 'c', {
    orderedValues: ['a', 'b', 'c', 'd'],
    rangeMode: 'append',
  });
  snapshots.push(getSnapshot(model));
  model.selectRange('b', 'd', {
    orderedValues: ['a', 'b', 'c', 'd'],
    rangeMode: 'replace',
  });
  snapshots.push(getSnapshot(model));
  model.deselect('c');
  snapshots.push(getSnapshot(model));
  model.clear();
  snapshots.push(getSnapshot(model));
  return snapshots;
}

it('matches selection-model behavior parity with tailng model', () => {
  const delegates = createAngularCdkSelectionModelDelegates();
  const createModel = delegates.createSelectionModel;
  if (createModel === undefined) {
    throw new Error('Expected selection-model delegate factory.');
  }

  const legacy = createSelectionModel<string>({
    initialAnchor: 'a',
    initialSelected: ['a'],
    mode: 'multiple',
  });
  const migrated = createModel({
    initialAnchor: 'a',
    initialSelected: ['a'],
    mode: 'multiple',
  });

  expect(runSelectionScenario(migrated)).toEqual(runSelectionScenario(legacy));
});

it('matches single-selection behavior parity with tailng model', () => {
  const delegates = createAngularCdkSelectionModelDelegates();
  const createModel = delegates.createSelectionModel;
  if (createModel === undefined) {
    throw new Error('Expected selection-model delegate factory.');
  }

  const legacy = createSelectionModel<string>({
    initialSelected: ['a', 'b'],
    mode: 'single',
  });
  const migrated = createModel({
    initialSelected: ['a', 'b'],
    mode: 'single',
  });

  legacy.select('c');
  migrated.select('c');
  legacy.toggle('c');
  migrated.toggle('c');

  expect(getSnapshot(migrated)).toEqual(getSnapshot(legacy));
});
