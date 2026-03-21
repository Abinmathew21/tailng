import { expect, it } from 'vitest';
import {
  moveGridCell,
  resolveGridNavigationKeyAction,
  resolveNavigableGridCell,
} from './grid-navigation';

it('resolves exit action for tab without preventing default', () => {
  const action = resolveGridNavigationKeyAction({ key: 'Tab' });
  expect(action).toEqual({
    preventDefault: false,
    type: 'exit',
  });
});

it('maps vertical arrow keys to row movement', () => {
  expect(resolveGridNavigationKeyAction({ key: 'ArrowUp' })?.type).toBe('move-up');
  expect(resolveGridNavigationKeyAction({ key: 'ArrowDown' })?.type).toBe('move-down');
});

it('maps horizontal arrow keys with ltr direction by default', () => {
  expect(resolveGridNavigationKeyAction({ key: 'ArrowLeft' })?.type).toBe('move-left');
  expect(resolveGridNavigationKeyAction({ key: 'ArrowRight' })?.type).toBe('move-right');
});

it('maps horizontal arrow keys with rtl direction', () => {
  const left = resolveGridNavigationKeyAction({ key: 'ArrowLeft' }, { direction: 'rtl' });
  const right = resolveGridNavigationKeyAction({ key: 'ArrowRight' }, { direction: 'rtl' });

  expect(left?.type).toBe('move-right');
  expect(right?.type).toBe('move-left');
});

it('maps home/end to row and grid boundaries', () => {
  expect(resolveGridNavigationKeyAction({ key: 'Home' })?.type).toBe('move-row-start');
  expect(resolveGridNavigationKeyAction({ key: 'End' })?.type).toBe('move-row-end');
  expect(resolveGridNavigationKeyAction({ ctrlKey: true, key: 'Home' })?.type).toBe(
    'move-grid-start',
  );
  expect(resolveGridNavigationKeyAction({ ctrlKey: true, key: 'End' })?.type).toBe(
    'move-grid-end',
  );
});

it('maps enter and space to activate', () => {
  expect(resolveGridNavigationKeyAction({ key: 'Enter' })?.type).toBe('activate');
  expect(resolveGridNavigationKeyAction({ key: ' ' })?.type).toBe('activate');
});

it('ignores disallowed modifiers', () => {
  expect(resolveGridNavigationKeyAction({ altKey: true, key: 'ArrowDown' })).toBeNull();
  expect(resolveGridNavigationKeyAction({ metaKey: true, key: 'ArrowDown' })).toBeNull();
  expect(resolveGridNavigationKeyAction({ ctrlKey: true, key: 'ArrowDown' })).toBeNull();
});

it('moves grid cells within bounds', () => {
  const start = { col: 1, row: 1 } as const;
  const bounds = { colCount: 3, rowCount: 3 } as const;

  expect(moveGridCell(start, 'move-up', bounds)).toEqual({ col: 1, row: 0 });
  expect(moveGridCell(start, 'move-down', bounds)).toEqual({ col: 1, row: 2 });
  expect(moveGridCell(start, 'move-left', bounds)).toEqual({ col: 0, row: 1 });
  expect(moveGridCell(start, 'move-right', bounds)).toEqual({ col: 2, row: 1 });
});

it('clamps movement and handles row/grid boundary actions', () => {
  const bounds = { colCount: 3, rowCount: 2 } as const;

  expect(moveGridCell({ col: 0, row: 0 }, 'move-left', bounds)).toEqual({ col: 0, row: 0 });
  expect(moveGridCell({ col: 2, row: 1 }, 'move-right', bounds)).toEqual({ col: 2, row: 1 });
  expect(moveGridCell({ col: 1, row: 1 }, 'move-row-start', bounds)).toEqual({ col: 0, row: 1 });
  expect(moveGridCell({ col: 1, row: 1 }, 'move-row-end', bounds)).toEqual({ col: 2, row: 1 });
  expect(moveGridCell({ col: 1, row: 1 }, 'move-grid-start', bounds)).toEqual({ col: 0, row: 0 });
  expect(moveGridCell({ col: 1, row: 1 }, 'move-grid-end', bounds)).toEqual({ col: 2, row: 1 });
});

it('resolves sparse navigable cells while skipping disabled entries', () => {
  const resolved = resolveNavigableGridCell(
    { col: 0, row: 0 },
    'move-right',
    {
      bounds: { colCount: 4, rowCount: 3 },
      cells: [
        { col: 0, row: 0 },
        { col: 1, disabled: true, row: 0 },
        { col: 3, row: 0 },
      ],
    },
  );

  expect(resolved).toEqual({ col: 3, row: 0 });
});

it('resolves vertical movement only across registered cells in the same column', () => {
  const resolved = resolveNavigableGridCell(
    { col: 2, row: 0 },
    'move-down',
    {
      bounds: { colCount: 4, rowCount: 4 },
      cells: [
        { col: 2, row: 0 },
        { col: 1, row: 1 },
        { col: 2, row: 3 },
      ],
    },
  );

  expect(resolved).toEqual({ col: 2, row: 3 });
});

it('wraps within row and column navigation when configured', () => {
  expect(
    resolveNavigableGridCell(
      { col: 3, row: 0 },
      'move-right',
      {
        bounds: { colCount: 4, rowCount: 2 },
        cells: [
          { col: 0, row: 0 },
          { col: 3, row: 0 },
        ],
        wrap: true,
      },
    ),
  ).toEqual({ col: 0, row: 0 });

  expect(
    resolveNavigableGridCell(
      { col: 1, row: 2 },
      'move-up',
      {
        bounds: { colCount: 3, rowCount: 3 },
        cells: [
          { col: 1, row: 0 },
          { col: 1, row: 2 },
        ],
        wrap: true,
      },
    ),
  ).toEqual({ col: 1, row: 0 });
});

it('returns the first and last enabled registered cells for grid boundary actions', () => {
  const options = {
    bounds: { colCount: 5, rowCount: 4 },
    cells: [
      { col: 2, row: 0 },
      { col: 3, disabled: true, row: 1 },
      { col: 1, row: 1 },
      { col: 4, row: 3 },
    ],
  } as const;

  expect(resolveNavigableGridCell({ col: 0, row: 0 }, 'move-grid-start', options)).toEqual({
    col: 2,
    row: 0,
  });
  expect(resolveNavigableGridCell({ col: 0, row: 0 }, 'move-grid-end', options)).toEqual({
    col: 4,
    row: 3,
  });
});
