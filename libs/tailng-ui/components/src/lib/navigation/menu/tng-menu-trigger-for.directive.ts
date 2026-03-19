import { Directive, ElementRef, HostBinding, HostListener, effect, inject, input } from '@angular/core';
import { TngMenu } from '@tailng-ui/primitives';

type TngMenuTriggerKeyboardEvent = Readonly<Pick<KeyboardEvent, 'key'>> &
  Readonly<{ preventDefault: () => void }>;

type TngMenuOpenFocusAction = 'none' | 'first' | 'last';

function resolveFocusActionForOpenKey(key: string): TngMenuOpenFocusAction | null {
  switch (key) {
    case 'ArrowDown':
      return 'first';
    case 'ArrowUp':
      return 'last';
    case 'Enter':
    case ' ':
      return 'none';
    default:
      return null;
  }
}

@Directive({
  selector: '[tngMenuTriggerFor]',
  exportAs: 'tngMenuTriggerFor',
})
export class TngMenuTriggerFor {
  readonly tngMenuTriggerFor = input.required<TngMenu>();

  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);

  @HostBinding('attr.aria-haspopup')
  protected readonly ariaHasPopup = 'menu' as const;

  public constructor() {
    effect((onCleanup): void => {
      const menu = this.tngMenuTriggerFor();
      const trigger = this.hostRef.nativeElement;
      menu.setTriggerElement(trigger, () => this.syncAriaState());
      menu.setRestoreFocusOnOutsideClick(false);
      this.syncAriaState();

      onCleanup((): void => {
        menu.clearTriggerLink(trigger);
        trigger.removeAttribute('aria-controls');
        trigger.removeAttribute('aria-expanded');
      });
    });
  }

  @HostListener('click')
  protected onClick(): void {
    const menu = this.tngMenuTriggerFor();
    if (menu.isDisabled()) {
      return;
    }

    if (menu.isOpen()) {
      menu.close(true);
      return;
    }

    menu.open('none');
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: TngMenuTriggerKeyboardEvent): void {
    const menu = this.tngMenuTriggerFor();
    if (menu.isDisabled()) {
      return;
    }

    const focusAction = resolveFocusActionForOpenKey(event.key);
    if (focusAction !== null) {
      event.preventDefault();
      menu.open(focusAction);
      return;
    }

    if (event.key === 'Escape' && menu.isOpen()) {
      event.preventDefault();
      menu.close(true);
    }
  }

  private syncAriaState(): void {
    const trigger = this.hostRef.nativeElement;
    const menu = this.tngMenuTriggerFor();

    trigger.setAttribute('aria-controls', menu.id);
    trigger.setAttribute('aria-expanded', menu.isOpen() ? 'true' : 'false');
  }
}
