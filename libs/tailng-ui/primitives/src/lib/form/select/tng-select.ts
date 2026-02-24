import { Directive, HostBinding, HostListener, input, model, signal } from '@angular/core';
import { TNG_SELECT } from './tng-select.tokens';
let __seq = 0;

@Directive({
  selector: '[tngSelect]',
  exportAs: 'tngSelect',
  standalone: true,
  providers: [{ provide: TNG_SELECT, useExisting: TngSelect }],
})
export class TngSelect<T = unknown> {

  public readonly __debugId = `TngSelect#${++__seq}`;


  // public API (controlled-capable)
  public readonly open = model<boolean>(false);
  public readonly disabled = input<boolean>(false);

  private _contentId: string | null = null;

  // selected value (controlled-capable)
  public readonly value = model<T | null>(null);

  /** @internal Called by TngSelectContent to register its id. */
  public setContentId(id: string): void {
    this._contentId = id;
  }
  
  public clearContentId(id: string): void {
    if (this._contentId === id) this._contentId = null;
  }

  // slots / styling hooks
  @HostBinding('attr.data-slot')
  protected readonly dataSlot: 'select' = 'select';

  // a11y
  @HostBinding('attr.role')
  protected readonly role: 'combobox' = 'combobox';

  @HostBinding('attr.aria-expanded')
  protected get ariaExpanded(): 'true' | 'false' {
    return this.open() ? 'true' : 'false';
  }

  @HostBinding('attr.aria-disabled')
  protected get ariaDisabled(): 'true' | null {
    return this.disabled() ? 'true' : null;
  }
  
  @HostBinding('attr.aria-controls')
  protected get ariaControls(): string | null {
    return this.open() ? this._contentId : null;
  }

  @HostBinding('attr.data-state')
  protected get dataState(): 'open' | 'closed' {
    return this.open() ? 'open' : 'closed';
  }

  /** Programmatically open (no-op when disabled). */
  public openSelect(): void {
    if (this.disabled()) return;
    this.open.set(true);
  }

  /** Programmatically close. */
  public close(): void {
    this.open.set(false);
  }

  /** Toggle open/closed (no-op when disabled). */
  public toggle(): void {
    if (this.disabled()) return;
    this.open.set(!this.open());
  }

  // called by option / listbox wrapper when a value is chosen
  public selectValue(value: T): void {
    if (this.disabled()) return;
    this.value.set(value);
    this.close();
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape') return;
    if (event.defaultPrevented) return;
    if (!this.open()) return;

    // For select-like popovers, Escape should close and not bubble to parent overlays.
    event.preventDefault();
    event.stopPropagation();
    this.close();
  }
}