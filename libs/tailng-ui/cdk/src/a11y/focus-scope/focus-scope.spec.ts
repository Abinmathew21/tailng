import { describe, expect, it } from 'vitest';
import { createFocusScope } from './focus-scope';

describe('createFocusScope', () => {
  it('defaults restoreFocus to true and trapFocus to false', () => {
    const scope = createFocusScope();
    const state = scope.getState();

    expect(state.restoreFocus).toBe(true);
    expect(state.trapFocus).toBe(false);
    expect(state.trapActive).toBe(false);
  });

  it('supports restoreFocus and trapFocus overrides', () => {
    const scope = createFocusScope({
      restoreFocus: false,
      trapFocus: true,
    });
    const state = scope.getState();

    expect(state.restoreFocus).toBe(false);
    expect(state.trapFocus).toBe(true);
  });

  it('activates and deactivates with restore target handling', () => {
    const scope = createFocusScope();

    scope.activate('trigger-1');
    expect(scope.getState().active).toBe(true);
    expect(scope.getState().restoreFocusTargetId).toBe('trigger-1');
    expect(scope.deactivate()).toBe('trigger-1');

    expect(scope.getState().active).toBe(false);
    expect(scope.getState().restoreFocusTargetId).toBeNull();
  });

  it('returns null when deactivating an inactive scope', () => {
    const scope = createFocusScope();
    expect(scope.deactivate()).toBeNull();
  });

  it('ignores restore target when restoreFocus is disabled', () => {
    const scope = createFocusScope({ restoreFocus: false });

    scope.activate('trigger-1');
    expect(scope.deactivate()).toBeNull();
  });

  it('records focus with and without member restrictions', () => {
    const unrestrictedScope = createFocusScope();
    unrestrictedScope.recordFocus('field-1');
    expect(unrestrictedScope.getState().lastFocusedId).toBe('field-1');

    const restrictedScope = createFocusScope({ members: ['field-1'] });
    restrictedScope.recordFocus('outside');
    expect(restrictedScope.getState().lastFocusedId).toBeNull();

    restrictedScope.recordFocus('field-1');
    expect(restrictedScope.getState().lastFocusedId).toBe('field-1');
  });

  it('registers and unregisters members with normalized ids', () => {
    const scope = createFocusScope();

    scope.registerMember(' field-1 ');
    scope.registerMember('field-1');
    scope.registerMember('field-2');
    expect(scope.getState().memberIds).toEqual(['field-1', 'field-2']);

    scope.unregisterMember('field-2');
    expect(scope.getState().memberIds).toEqual(['field-1']);
  });

  it('resolves focus candidates when trap is active', () => {
    const scope = createFocusScope({
      members: ['field-1', 'field-2'],
      trapFocus: true,
    });

    scope.activate();
    scope.recordFocus('field-2');

    expect(scope.resolveFocusCandidate('field-1')).toBe('field-1');
    expect(scope.resolveFocusCandidate('outside')).toBe('field-2');

    scope.unregisterMember('field-2');
    expect(scope.resolveFocusCandidate('outside')).toBe('field-1');

    scope.unregisterMember('field-1');
    expect(scope.resolveFocusCandidate('outside')).toBeNull();
    expect(scope.deactivate()).toBeNull();
  });

  it('does not constrain focus when trap is inactive or has no members', () => {
    const inactiveScope = createFocusScope({
      members: ['field-1'],
      trapFocus: true,
    });
    expect(inactiveScope.resolveFocusCandidate('outside')).toBe('outside');

    const noMembersScope = createFocusScope({ trapFocus: true });
    noMembersScope.activate();
    expect(noMembersScope.resolveFocusCandidate('outside')).toBe('outside');
    expect(noMembersScope.deactivate()).toBeNull();
  });

  it('allows only top-most nested scope to trap focus', () => {
    const parentScope = createFocusScope({
      members: ['parent-field'],
      trapFocus: true,
    });
    const childScope = createFocusScope({
      members: ['child-field'],
      trapFocus: true,
    });

    parentScope.activate('root-trigger');
    expect(parentScope.isTrapActive()).toBe(true);

    childScope.activate('parent-field');
    expect(parentScope.isTrapActive()).toBe(false);
    expect(childScope.isTrapActive()).toBe(true);
    expect(parentScope.resolveFocusCandidate('outside')).toBe('outside');
    expect(childScope.resolveFocusCandidate('outside')).toBe('child-field');

    expect(childScope.deactivate()).toBe('parent-field');
    expect(parentScope.isTrapActive()).toBe(true);
    expect(parentScope.deactivate()).toBe('root-trigger');
  });

  it('re-activating a parent scope brings it back to top-most', () => {
    const parentScope = createFocusScope({
      members: ['parent-field'],
      trapFocus: true,
    });
    const childScope = createFocusScope({
      members: ['child-field'],
      trapFocus: true,
    });

    parentScope.activate();
    childScope.activate();
    expect(childScope.isTrapActive()).toBe(true);

    parentScope.activate();
    expect(parentScope.isTrapActive()).toBe(true);
    expect(childScope.isTrapActive()).toBe(false);

    expect(parentScope.deactivate()).toBeNull();
    expect(childScope.isTrapActive()).toBe(true);
    expect(childScope.deactivate()).toBeNull();
  });
});
