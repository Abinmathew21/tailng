import { describe, expect, it } from 'vitest';
import {
  resolveListNavigationKeyAction,
  defaultListNavigationResolvers,
} from './list-navigation';

type TestListNavEvent = Readonly<{
  key: string;
  shiftKey?: boolean;
  ctrlKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
}>;

type ListNavAction = ReturnType<typeof resolveListNavigationKeyAction>;

type ListNavResolver = Readonly<(
  event: TestListNavEvent,
) => ListNavAction>;

describe('additional list-navigation scenarios', runAdditionalListNavigationScenarios);

function runAdditionalListNavigationScenarios(): void {
  runOrientationScenarios();
  runRangeSelectionScenarios();
  runSelectionKeyScenarios();
  runResolverScenarios();
  runMetaScenarios();
}

function runOrientationScenarios(): void {
  it('supports orientation both', () => {
    const down = resolveListNavigationKeyAction({ key: 'ArrowDown' }, { orientation: 'both' });
    const right = resolveListNavigationKeyAction({ key: 'ArrowRight' }, { orientation: 'both' });

    expect(down?.type).toBe('move-next');
    expect(right?.type).toBe('move-next');
  });

  it('ignores horizontal arrows when orientation is vertical', () => {
    const action = resolveListNavigationKeyAction({ key: 'ArrowRight' }, { orientation: 'vertical' });
    expect(action).toBeNull();
  });

  it('ignores vertical arrows when orientation is horizontal', () => {
    const action = resolveListNavigationKeyAction({ key: 'ArrowDown' }, { orientation: 'horizontal' });
    expect(action).toBeNull();
  });
}

function runRangeSelectionScenarios(): void {
  it('extends selection with shift+Home and shift+End in multi-select', () => {
    const home = resolveListNavigationKeyAction({ key: 'Home', shiftKey: true }, { multiSelect: true });
    const end = resolveListNavigationKeyAction({ key: 'End', shiftKey: true }, { multiSelect: true });

    expect(home?.extendSelection).toBe(true);
    expect(end?.extendSelection).toBe(true);
  });

  it('does not extend selection when shift used in single-select mode', () => {
    const action = resolveListNavigationKeyAction({ key: 'ArrowDown', shiftKey: true }, { multiSelect: false });
    expect(action?.extendSelection).toBe(false);
  });

  it('does not select-all without multiSelect enabled', () => {
    const action = resolveListNavigationKeyAction({ ctrlKey: true, key: 'a' }, { multiSelect: false });
    expect(action).toBeNull();
  });

  it('is case insensitive for ctrl+A', () => {
    const action = resolveListNavigationKeyAction({ ctrlKey: true, key: 'A' }, { multiSelect: true });
    expect(action?.type).toBe('select-all');
  });

  it('does not block ctrl+A when other modifiers exist', () => {
    const action = resolveListNavigationKeyAction(
      { ctrlKey: true, altKey: true, key: 'a' },
      { multiSelect: true },
    );

    expect(action).toBeNull();
  });
}

function runSelectionKeyScenarios(): void {
  it('supports legacy Spacebar key value', () => {
    const action = resolveListNavigationKeyAction({ key: 'Spacebar' }, { multiSelect: true });
    expect(action?.type).toBe('toggle-active');
  });

  it('Enter toggles selection in multi-select (like Space)', () => {
    const action = resolveListNavigationKeyAction({ key: 'Enter' }, { multiSelect: true });
    expect(action?.type).toBe('toggle-active');
  });

  it('ignores unsupported keys', () => {
    const action = resolveListNavigationKeyAction({ key: 'Escape' });
    expect(action).toBeNull();
  });

  it('defaults behavior to listbox when not provided', () => {
    const action = resolveListNavigationKeyAction({ key: 'Enter' });
    expect(action?.type).toBe('select-active');
  });
}

function runResolverScenarios(): void {
  it('supports injected custom resolver (high priority)', () => {
    const escapeResolver: ListNavResolver = (event: TestListNavEvent): ListNavAction => {
      if (event.key === 'Escape') {
        return {
          type: 'exit',
          preventDefault: true,
          extendSelection: false,
        } as const;
      }
      return null;
    };

    const action = resolveListNavigationKeyAction(
      { key: 'Escape' },
      {},
      [escapeResolver, ...defaultListNavigationResolvers],
    );

    expect(action?.type).toBe('exit');
    expect(action?.preventDefault).toBe(true);
  });

  it('custom resolver can be appended (lower priority)', () => {
    const resolver: ListNavResolver = (): ListNavAction =>
      ({
        type: 'move-first',
        preventDefault: true,
        extendSelection: false,
      } as const);

    const action = resolveListNavigationKeyAction(
      { key: 'ArrowDown' },
      {},
      [...defaultListNavigationResolvers, resolver],
    );

    expect(action?.type).toBe('move-next');
  });
}

function runMetaScenarios(): void {
  it('supports Command+A (metaKey) for select-all in multi-select', () => {
    const action = resolveListNavigationKeyAction({ metaKey: true, key: 'a' }, { multiSelect: true });
    expect(action?.type).toBe('select-all');
  });

  it('is case insensitive for Command+A (metaKey)', () => {
    const action = resolveListNavigationKeyAction({ metaKey: true, key: 'A' }, { multiSelect: true });
    expect(action?.type).toBe('select-all');
  });

  it('does not allow unrelated metaKey shortcuts', () => {
    const action = resolveListNavigationKeyAction({ metaKey: true, key: 'ArrowDown' }, { multiSelect: true });
    expect(action).toBeNull();
  });
}