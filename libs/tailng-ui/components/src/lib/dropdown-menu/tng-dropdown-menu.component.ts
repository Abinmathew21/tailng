import {
  Component,
  ElementRef,
  HostListener,
  booleanAttribute,
  inject,
  input,
  signal,
} from '@angular/core';
import { TngDropdownMenu as TngDropdownMenuPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'tng-dropdown-menu',
  imports: [TngDropdownMenuPrimitive],
  templateUrl: './tng-dropdown-menu.component.html',
  styleUrl: './tng-dropdown-menu.component.css',
})
export class TngDropdownMenu {
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly label = input<string>('Actions');

  protected readonly open = signal(false);

  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: Event): void {
    if (!this.open()) {
      return;
    }

    const target = event.target;
    if (!(target instanceof Node)) {
      return;
    }

    if (!this.hostRef.nativeElement.contains(target)) {
      this.open.set(false);
    }
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape') {
      return;
    }

    this.open.set(false);
  }

  protected toggleOpen(): void {
    if (this.disabled()) {
      return;
    }

    this.open.set(!this.open());
  }
}
