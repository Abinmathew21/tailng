import {
  type TngFocusScopeController,
  type TngFocusScopeOptions,
  type TngFocusScopeState,
} from './focus-scope.types';

export function createFocusScope(
  options: TngFocusScopeOptions = {},
): TngFocusScopeController {
  const restoreFocus = options.restoreFocus ?? true;
  let active = false;
  let lastFocusedId: string | null = null;

  const getState = (): TngFocusScopeState => ({
    active,
    lastFocusedId,
    restoreFocus,
  });

  const activate = (): void => {
    active = true;
  };

  const deactivate = (): void => {
    active = false;
  };

  const recordFocus = (id: string | null): void => {
    lastFocusedId = id;
  };

  return Object.freeze({ activate, deactivate, getState, recordFocus });
}
