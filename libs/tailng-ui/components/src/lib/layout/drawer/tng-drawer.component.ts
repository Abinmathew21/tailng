import { Component, HostBinding, inject, input } from '@angular/core';
import { TngDrawer as TngDrawerPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'tng-drawer',
  standalone: true,
  hostDirectives: [
    {
      directive: TngDrawerPrimitive,
      inputs: [
        'opened',
        'defaultOpened',
        'mode',
        'position',
        'disabled',
        'backdrop',
        'closeOnOutsideClick',
        'closeOnEscape',
        'restoreFocus',
        'autoFocus',
        'trapFocus',
        'inertContent',
        'allowBodyScroll',
        'closeOnTab',
        'role',
        'fixedInViewport',
        'fixedTopGap',
        'fixedBottomGap',
        'swipeToClose',
      ],
      outputs: [
        'openedChange',
        'tngDrawerOpened',
        'tngDrawerClosed',
        'openStart',
        'closeStart',
        'backdropClick',
        'positionChange',
      ],
    },
  ],
  templateUrl: './tng-drawer.component.html',
  styleUrl: './tng-drawer.component.css',
  exportAs: 'tngDrawerComponent',
})
export class TngDrawerComponent {
  private readonly primitive = inject<TngDrawerPrimitive>(TngDrawerPrimitive);

  public readonly ariaLabel = input<string>('Drawer');

  @HostBinding('attr.aria-label')
  protected get hostAriaLabel(): string {
    return this.ariaLabel();
  }

  open(): void {
    this.primitive.open();
  }

  close(): void {
    this.primitive.close();
  }

  toggle(force?: boolean): void {
    this.primitive.toggle(force);
  }

  isOpen(): boolean {
    return this.primitive.isOpen();
  }

  setRestoreFocusFallback(target: HTMLElement | null): void {
    this.primitive.setRestoreFocusFallback(target);
  }

  setRestoreFocusTarget(target: HTMLElement | null): void {
    this.primitive.setRestoreFocusTarget(target);
  }
}
