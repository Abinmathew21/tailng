import {
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { TngMenu as TngMenuPrimitive } from '@tailng-ui/primitives';

const menuPanelIdPrefix = 'tng-menu-panel-';

let menuPanelIdSequence = 0;

function createMenuPanelId(): string {
  menuPanelIdSequence += 1;
  return `${menuPanelIdPrefix}${menuPanelIdSequence}`;
}

function resolveFirstEnabledMenuItem(
  panel: Readonly<HTMLUListElement> | undefined,
): HTMLElement | null {
  if (panel === undefined) {
    return null;
  }

  const items = Array.from(panel.querySelectorAll<HTMLElement>('[role="menuitem"]'));
  for (const item of items) {
    if (item.getAttribute('aria-disabled') !== 'true') {
      return item;
    }
  }

  return null;
}

@Component({
  selector: 'tng-menu',
  imports: [TngMenuPrimitive],
  templateUrl: './tng-menu.component.html',
  styleUrl: './tng-menu.component.css',
  exportAs: 'tngMenu',
})
export class TngMenuComponent {
  public readonly ariaLabel = input<string>('Menu');
  protected readonly open = signal(false);
  protected readonly panelId = createMenuPanelId();

  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly panelRef = viewChild<ElementRef<HTMLUListElement>>('panelRef');
  private readonly triggerElements = new Set<Readonly<HTMLElement>>();

  public closeMenu(): void {
    if (!this.open()) {
      return;
    }

    this.open.set(false);
  }

  public getPanelId(): string {
    return this.panelId;
  }

  public isOpen(): boolean {
    return this.open();
  }

  public openMenu(): void {
    if (this.open()) {
      return;
    }

    this.open.set(true);
    queueMicrotask((): void => {
      const panel = this.panelRef()?.nativeElement;
      const firstMenuItem = resolveFirstEnabledMenuItem(panel);
      if (firstMenuItem !== null) {
        firstMenuItem.focus();
        return;
      }

      panel?.focus();
    });
  }

  public registerTrigger(trigger: Readonly<HTMLElement>): void {
    this.triggerElements.add(trigger);
  }

  public toggleMenu(): void {
    if (this.open()) {
      this.closeMenu();
      return;
    }

    this.openMenu();
  }

  public unregisterTrigger(trigger: Readonly<HTMLElement>): void {
    this.triggerElements.delete(trigger);
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: unknown): void {
    if (!this.open()) {
      return;
    }

    if (!(event instanceof Event)) {
      return;
    }

    const target = event.target;
    if (!(target instanceof Node)) {
      return;
    }

    if (this.hostRef.nativeElement.contains(target)) {
      return;
    }

    for (const trigger of this.triggerElements) {
      if (trigger.contains(target)) {
        return;
      }
    }

    this.closeMenu();
  }

  @HostListener('document:keydown.escape')
  protected onEscapeKeydown(): void {
    this.closeMenu();
  }
}
