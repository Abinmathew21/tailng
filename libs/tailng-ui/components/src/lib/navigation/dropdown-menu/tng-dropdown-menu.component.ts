import type { OnDestroy } from '@angular/core';
import {
  Component,
  ElementRef,
  HostListener,
  booleanAttribute,
  inject,
  input,
  signal,
} from '@angular/core';

@Component({
  selector: 'tng-dropdown-menu',
  templateUrl: './tng-dropdown-menu.component.html',
  styleUrl: './tng-dropdown-menu.component.css',
})
export class TngDropdownMenuComponent implements OnDestroy {
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly label = input<string>('Actions');

  protected readonly open = signal(false);

  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private removeScrollListener: (() => void) | null = null;

  public ngOnDestroy(): void {
    this.teardownScrollListener();
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: unknown): void {
    if (!(event instanceof Event)) {
      return;
    }

    if (!this.open()) {
      return;
    }

    const target = event.target;
    if (!(target instanceof Node)) {
      return;
    }

    if (!this.hostRef.nativeElement.contains(target)) {
      this.closeMenu();
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscapeKeydown(): void {
    if (!this.open()) {
      return;
    }

    this.closeMenu();
  }

  protected toggleOpen(): void {
    if (this.disabled()) {
      return;
    }

    const nextOpen = !this.open();
    this.open.set(nextOpen);
    if (nextOpen) {
      this.setupScrollListener();
      return;
    }

    this.teardownScrollListener();
  }

  private closeMenu(): void {
    this.open.set(false);
    this.teardownScrollListener();
  }

  private setupScrollListener(): void {
    if (this.removeScrollListener !== null || typeof window === 'undefined') {
      return;
    }

    const onScroll = (): void => {
      this.closeMenu();
    };
    window.addEventListener('scroll', onScroll, true);
    this.removeScrollListener = (): void => window.removeEventListener('scroll', onScroll, true);
  }

  private teardownScrollListener(): void {
    this.removeScrollListener?.();
    this.removeScrollListener = null;
  }
}
export { TngDropdownMenuComponent as TngDropdownMenu };
