import {
  type TngFocusScopeController,
  type TngFocusScopeOptions,
  type TngFocusScopeState,
} from './focus-scope.types';

const activeScopeStack: string[] = [];
let scopeIdSequence = 0;

function createScopeId(): string {
  scopeIdSequence += 1;
  return `tng-focus-scope-${scopeIdSequence}`;
}

function removeScopeFromStack(scopeId: string): void {
  const index = activeScopeStack.indexOf(scopeId);
  if (index >= 0) {
    activeScopeStack.splice(index, 1);
  }
}

function pushScopeToTop(scopeId: string): void {
  removeScopeFromStack(scopeId);
  activeScopeStack.push(scopeId);
}

function isTopMostScope(scopeId: string): boolean {
  const topScopeId = activeScopeStack[activeScopeStack.length - 1];
  return topScopeId === scopeId;
}

function normalizeMemberId(id: string): string | null {
  const normalizedId = id.trim();
  return normalizedId.length > 0 ? normalizedId : null;
}

function normalizeMemberIds(ids: readonly string[] | undefined): readonly string[] {
  const uniqueIds: string[] = [];
  const seenIds = new Set<string>();

  for (const id of ids ?? []) {
    const normalizedId = normalizeMemberId(id);
    if (normalizedId === null || seenIds.has(normalizedId)) {
      continue;
    }

    seenIds.add(normalizedId);
    uniqueIds.push(normalizedId);
  }

  return uniqueIds;
}

class FocusScopeController implements TngFocusScopeController {
  private active = false;
  private lastFocusedId: string | null = null;
  private readonly memberIds = new Set<string>();
  private readonly restoreFocus: boolean;
  private restoreFocusTargetId: string | null = null;
  private readonly scopeId: string;
  private readonly trapFocus: boolean;

  public constructor(options: TngFocusScopeOptions) {
    this.restoreFocus = options.restoreFocus ?? true;
    this.scopeId = createScopeId();
    this.trapFocus = options.trapFocus ?? false;

    for (const memberId of normalizeMemberIds(options.members)) {
      this.memberIds.add(memberId);
    }
  }

  public activate(restoreFocusTargetId?: string | null): void {
    this.active = true;
    if (restoreFocusTargetId !== undefined) {
      this.restoreFocusTargetId = restoreFocusTargetId;
    }

    pushScopeToTop(this.scopeId);
  }

  public deactivate(): string | null {
    if (!this.active) {
      return null;
    }

    this.active = false;
    removeScopeFromStack(this.scopeId);

    const restoreTarget = this.restoreFocus ? this.restoreFocusTargetId : null;
    this.restoreFocusTargetId = null;

    return restoreTarget;
  }

  public getState(): TngFocusScopeState {
    return Object.freeze({
      active: this.active,
      lastFocusedId: this.lastFocusedId,
      memberIds: this.getMemberIds(),
      restoreFocus: this.restoreFocus,
      restoreFocusTargetId: this.restoreFocusTargetId,
      trapActive: this.isTrapActive(),
      trapFocus: this.trapFocus,
    });
  }

  public isTrapActive(): boolean {
    return this.active && this.trapFocus && isTopMostScope(this.scopeId);
  }

  public recordFocus(id: string | null): void {
    if (id === null) {
      this.lastFocusedId = null;
      return;
    }

    const normalizedId = normalizeMemberId(id);
    if (normalizedId === null) {
      return;
    }

    if (this.memberIds.size === 0 || this.memberIds.has(normalizedId)) {
      this.lastFocusedId = normalizedId;
    }
  }

  public registerMember(id: string): void {
    const normalizedId = normalizeMemberId(id);
    if (normalizedId !== null) {
      this.memberIds.add(normalizedId);
    }
  }

  public resolveFocusCandidate(candidateId: string | null): string | null {
    if (!this.isTrapActive() || this.memberIds.size === 0) {
      return candidateId;
    }

    if (candidateId !== null && this.memberIds.has(candidateId)) {
      return candidateId;
    }

    return this.getFallbackFocusCandidate();
  }

  public unregisterMember(id: string): void {
    const normalizedId = normalizeMemberId(id);
    if (normalizedId === null) {
      return;
    }

    this.memberIds.delete(normalizedId);
    if (this.lastFocusedId === normalizedId) {
      this.lastFocusedId = null;
    }
  }

  private getFallbackFocusCandidate(): string | null {
    if (this.lastFocusedId !== null && this.memberIds.has(this.lastFocusedId)) {
      return this.lastFocusedId;
    }

    return this.getMemberIds()[0] ?? null;
  }

  private getMemberIds(): readonly string[] {
    return [...this.memberIds.values()];
  }
}

export function createFocusScope(
  options: TngFocusScopeOptions = {},
): TngFocusScopeController {
  return new FocusScopeController(options);
}
