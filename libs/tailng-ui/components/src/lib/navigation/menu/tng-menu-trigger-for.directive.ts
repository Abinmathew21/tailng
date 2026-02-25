import { Directive, ElementRef, HostBinding, HostListener, effect, inject, input } from '@angular/core';
import type { TngMenuComponent } from './tng-menu.component';

type TngMenuTriggerKeyboardEvent = Readonly<Pick<KeyboardEvent, 'key'>> &
  Readonly<{ preventDefault: () => void }>;

function shouldOpenMenuForKey(key: string): boolean {
  return key === 'ArrowDown' || key === 'Enter' || key === ' ';
}

@Directive({
  selector: '[tngMenuTriggerFor]',
  exportAs: 'tngMenuTriggerFor',
})
export class TngMenuTriggerFor {
  public readonly tngMenuTriggerFor = input.required<TngMenuComponent>();

  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);

  @HostBinding('attr.aria-haspopup')
  protected readonly ariaHasPopup = 'menu' as const;

  public constructor() {
    effect((onCleanup): void => {
      const menu = this.tngMenuTriggerFor();
      const trigger = this.hostRef.nativeElement;
      menu.registerTrigger(trigger);

      onCleanup((): void => {
        menu.unregisterTrigger(trigger);
      });
    });
  }

  @HostBinding('attr.aria-controls')
  protected get ariaControls(): string | null {
    const menu = this.tngMenuTriggerFor();
    return menu.isOpen() ? menu.getPanelId() : null;
  }

  @HostBinding('attr.aria-expanded')
  protected get ariaExpanded(): boolean {
    return this.tngMenuTriggerFor().isOpen();
  }

  @HostListener('click')
  protected onClick(): void {
    this.tngMenuTriggerFor().toggleMenu();
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: TngMenuTriggerKeyboardEvent): void {
    if (!shouldOpenMenuForKey(event.key)) {
      return;
    }

    event.preventDefault();
    this.tngMenuTriggerFor().openMenu();
  }
}
