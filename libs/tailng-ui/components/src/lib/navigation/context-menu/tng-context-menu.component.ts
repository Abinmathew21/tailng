import {
  Component,
  DestroyRef,
  HostBinding,
  NgZone,
  ViewEncapsulation,
  inject,
  input,
} from '@angular/core';
import {
  TngContextMenu as TngContextMenuPrimitive,
  TngMenu as TngMenuPrimitive,
} from '@tailng-ui/primitives';

@Component({
  selector: 'tng-context-menu',
  hostDirectives: [
    {
      directive: TngMenuPrimitive,
      inputs: ['loop', 'disabled', 'closeOnSelect', 'dismissOnOutsideClick', 'dismissOnFocusout'],
      outputs: ['tngMenuOpened', 'tngMenuClosed', 'tngMenuSelect'],
    },
    {
      directive: TngContextMenuPrimitive,
    },
  ],
  templateUrl: './tng-context-menu.component.html',
  styleUrl: './tng-context-menu.component.css',
  encapsulation: ViewEncapsulation.None,
  exportAs: 'tngContextMenuComponent',
})
export class TngContextMenuComponent {
  private readonly menu = inject<TngMenuPrimitive>(TngMenuPrimitive);
  private readonly destroyRef = inject(DestroyRef);
  private readonly ngZone = inject(NgZone);
  private lastOpenState = false;
  private focusRafId: number | null = null;

  public readonly ariaLabel = input<string>('Context menu');

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.focusRafId !== null) {
        cancelAnimationFrame(this.focusRafId);
      }
    });
  }

  ngDoCheck(): void {
    const isOpen = this.menu.isOpen();

    if (!this.lastOpenState && isOpen) {
      this.queuePanelFocus();
    }

    if (!isOpen && this.focusRafId !== null) {
      cancelAnimationFrame(this.focusRafId);
      this.focusRafId = null;
    }

    this.lastOpenState = isOpen;
  }

  @HostBinding('attr.aria-label')
  protected get hostAriaLabel(): string {
    return this.ariaLabel();
  }

  @HostBinding('style.--tng-menu-z-overlay')
  protected readonly menuZOverlay =
    'var(--tng-context-menu-z-overlay, var(--tng-context-menu-overlay-z-index, var(--tng-menu-overlay-z-index, var(--tng-z-overlay, 50))))';

  private queuePanelFocus(): void {
    if (this.focusRafId !== null) {
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      this.focusRafId = requestAnimationFrame(() => {
        this.focusRafId = null;

        if (this.menu.isOpen()) {
          this.menu.focusPanel();
        }
      });
    });
  }
}
export { TngContextMenuComponent as TngContextMenu };
