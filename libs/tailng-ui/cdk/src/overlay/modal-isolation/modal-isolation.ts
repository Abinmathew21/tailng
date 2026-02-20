import {
  type TngModalIsolationDocument,
  type TngModalIsolationElement,
  type TngModalIsolationManager,
  type TngModalIsolationManagerOptions,
} from './modal-isolation.types';

type TngModalEntry = Readonly<{
  element: TngModalIsolationElement;
  order: number;
}>;

type TngElementAttributesSnapshot = Readonly<{
  ariaHidden: string | null;
  inert: string | null;
}>;

function snapshotElementAttributes(
  element: Readonly<TngModalIsolationElement>,
): TngElementAttributesSnapshot {
  return {
    ariaHidden: element.getAttribute('aria-hidden'),
    inert: element.getAttribute('inert'),
  };
}

function restoreElementAttributes(
  element: Readonly<TngModalIsolationElement>,
  snapshot: TngElementAttributesSnapshot,
): void {
  if (snapshot.ariaHidden === null) {
    element.removeAttribute('aria-hidden');
  } else {
    element.setAttribute('aria-hidden', snapshot.ariaHidden);
  }

  if (snapshot.inert === null) {
    element.removeAttribute('inert');
  } else {
    element.setAttribute('inert', snapshot.inert);
  }
}

function isPartOfModalTree(
  element: Readonly<TngModalIsolationElement>,
  modalElement: Readonly<TngModalIsolationElement>,
): boolean {
  if (element === modalElement) {
    return true;
  }

  return element.contains?.(modalElement) ?? false;
}

class ModalIsolationManager implements TngModalIsolationManager {
  private readonly documentRef: TngModalIsolationDocument | null;
  private readonly activeModals = new Map<string, TngModalEntry>();
  private readonly isolatedElements = new Map<
    TngModalIsolationElement,
    TngElementAttributesSnapshot
  >();
  private nextOrder = 0;

  public constructor(options: TngModalIsolationManagerOptions) {
    this.documentRef = options.documentRef ?? null;
  }

  public activate(modalId: string, modalElement: Readonly<TngModalIsolationElement>): void {
    this.nextOrder += 1;
    this.activeModals.set(modalId, { element: modalElement, order: this.nextOrder });
    this.recomputeIsolation();
  }

  public clear(): void {
    this.activeModals.clear();
    this.restoreIsolatedElements();
  }

  public deactivate(modalId: string): void {
    if (!this.activeModals.has(modalId)) {
      return;
    }

    this.activeModals.delete(modalId);
    this.recomputeIsolation();
  }

  public getActiveModalIds(): readonly string[] {
    return [...this.activeModals.entries()]
      .sort(compareModalEntriesByOrder)
      .map(toModalEntryId);
  }

  private applyIsolation(entry: TngModalEntry): void {
    if (this.documentRef === null) {
      return;
    }

    for (const sibling of this.documentRef.body.children) {
      if (isPartOfModalTree(sibling, entry.element)) {
        continue;
      }

      this.isolateElement(sibling);
    }
  }

  private getTopModalEntry(): TngModalEntry | null {
    let topEntry: TngModalEntry | null = null;
    for (const entry of this.activeModals.values()) {
      if (topEntry === null || entry.order > topEntry.order) {
        topEntry = entry;
      }
    }

    return topEntry;
  }

  private isolateElement(element: TngModalIsolationElement): void {
    this.isolatedElements.set(element, snapshotElementAttributes(element));
    element.setAttribute('aria-hidden', 'true');
    element.setAttribute('inert', '');
  }

  private recomputeIsolation(): void {
    this.restoreIsolatedElements();

    const topEntry = this.getTopModalEntry();
    if (topEntry !== null) {
      this.applyIsolation(topEntry);
    }
  }

  private restoreIsolatedElements(): void {
    for (const [element, snapshot] of this.isolatedElements.entries()) {
      restoreElementAttributes(element, snapshot);
    }

    this.isolatedElements.clear();
  }
}

function compareModalEntriesByOrder(
  left: readonly [string, TngModalEntry],
  right: readonly [string, TngModalEntry],
): number {
  return left[1].order - right[1].order;
}

function toModalEntryId(entry: readonly [string, TngModalEntry]): string {
  return entry[0];
}

export function createModalIsolationManager(
  options: TngModalIsolationManagerOptions = {},
): TngModalIsolationManager {
  return new ModalIsolationManager(options);
}
