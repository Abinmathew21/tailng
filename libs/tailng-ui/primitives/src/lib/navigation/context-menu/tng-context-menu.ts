import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  inject,
  input,
} from '@angular/core';
import { createTngIdFactory } from '@tailng-ui/cdk';

import { TngMenu } from '../menu/tng-menu';

type TngContextMenuAnchorType = 'pointer' | 'element' | null;

export type TngContextMenuPointerAnchor = Readonly<{
  x: number;
  y: number;
}>;

const createContextMenuTriggerId = createTngIdFactory('tng-context-menu-trigger');

@Directive({
  selector: '[tngContextMenu]',
  exportAs: 'tngContextMenu',
  standalone: true,
})
export class TngContextMenu {
  private readonly menu = inject(TngMenu, { optional: true, host: true });
  private anchorType: TngContextMenuAnchorType = null;
  private pointerAnchor: TngContextMenuPointerAnchor | null = null;

  isDisabled(): boolean {
    return this.menu?.isDisabled() ?? true;
  }

  openFromPointer(
    target: HTMLElement,
    pointerAnchor: TngContextMenuPointerAnchor,
    triggerStateSync?: () => void,
  ): void {
    const menu = this.menu;
    if (menu === null) {
      return;
    }

    if (menu.isOpen()) {
      menu.close(false);
    }

    this.anchorType = 'pointer';
    this.pointerAnchor = pointerAnchor;
    menu.setTriggerElement(target, triggerStateSync);
    menu.setRestoreFocusOnOutsideClick(true);
    menu.open();
  }

  openFromKeyboard(target: HTMLElement, triggerStateSync?: () => void): void {
    const menu = this.menu;
    if (menu === null) {
      return;
    }

    if (menu.isOpen()) {
      menu.close(false);
    }

    this.anchorType = 'element';
    this.pointerAnchor = null;
    menu.setTriggerElement(target, triggerStateSync);
    menu.setRestoreFocusOnOutsideClick(true);
    menu.open();
  }

  isOpen(): boolean {
    return this.menu?.isOpen() ?? false;
  }

  close(restoreFocus: boolean): void {
    this.menu?.close(restoreFocus);
  }

  detachFromTarget(target: HTMLElement): void {
    this.menu?.clearTriggerLink(target);
  }

  getMenuId(): string | null {
    return this.menu?.id ?? null;
  }

  getAnchorType(): TngContextMenuAnchorType {
    return this.anchorType;
  }

  getPointerAnchor(): TngContextMenuPointerAnchor | null {
    return this.pointerAnchor;
  }
}

@Directive({
  selector: '[tngContextMenuTrigger]',
  exportAs: 'tngContextMenuTrigger',
  standalone: true,
})
export class TngContextMenuTrigger {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly resolvedId =
    this.hostRef.nativeElement.getAttribute('id') ?? createContextMenuTriggerId();

  readonly contextMenu = input<TngContextMenu | null>(null, {
    alias: 'tngContextMenuTrigger',
  });

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'context-menu-trigger' as const;

  @HostBinding('attr.id')
  protected readonly id = this.resolvedId;

  @HostBinding('attr.aria-haspopup')
  protected readonly ariaHaspopup = 'menu' as const;

  @HostBinding('attr.aria-controls')
  protected get ariaControls(): string | null {
    return this.contextMenu()?.getMenuId() ?? null;
  }

  ngOnInit(): void {
    this.syncAriaExpanded();
  }

  ngOnDestroy(): void {
    const contextMenu = this.contextMenu();
    if (contextMenu === null) {
      return;
    }

    contextMenu.detachFromTarget(this.hostRef.nativeElement);

    if (contextMenu.isOpen()) {
      contextMenu.close(false);
    }
  }

  @HostListener('contextmenu', ['$event'])
  protected onContextMenu(event: MouseEvent): void {
    if (this.isDisabled()) {
      return;
    }

    const contextMenu = this.contextMenu();
    if (contextMenu === null || contextMenu.isDisabled()) {
      return;
    }

    event.preventDefault();
    contextMenu.openFromPointer(
      this.hostRef.nativeElement,
      {
        x: event.clientX,
        y: event.clientY,
      },
      () => this.syncAriaExpanded(),
    );
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if (this.isDisabled()) {
      return;
    }

    const contextMenu = this.contextMenu();
    if (contextMenu === null || contextMenu.isDisabled()) {
      return;
    }

    if (event.key === 'ContextMenu' || (event.key === 'F10' && event.shiftKey)) {
      event.preventDefault();
      contextMenu.openFromKeyboard(this.hostRef.nativeElement, () => this.syncAriaExpanded());
    }
  }

  private syncAriaExpanded(): void {
    const contextMenu = this.contextMenu();
    if (contextMenu === null) {
      this.hostRef.nativeElement.removeAttribute('aria-expanded');
      return;
    }

    this.hostRef.nativeElement.setAttribute('aria-expanded', contextMenu.isOpen() ? 'true' : 'false');
  }

  private isDisabled(): boolean {
    const element = this.hostRef.nativeElement as HTMLElement & {
      disabled?: boolean;
    };

    return element.disabled || element.hasAttribute('disabled') || element.getAttribute('aria-disabled') === 'true';
  }
}
