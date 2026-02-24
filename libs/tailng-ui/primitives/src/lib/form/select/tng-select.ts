// tng-select.ts
import { Directive, HostBinding, input, model } from '@angular/core';
import { TNG_SELECT } from './tng-select.tokens';

@Directive({
  selector: '[tngSelect]',
  exportAs: 'tngSelect',
  standalone: true,
  providers: [{ provide: TNG_SELECT, useExisting: TngSelect }],
})
export class TngSelect<T = unknown> {
  public readonly open = model<boolean>(false);
  public readonly disabled = input<boolean>(false);
  public readonly value = model<T | null>(null);

  // ---- internal bridge state ----
  private _contentId: string | null = null;
  private _listboxId: string | null = null;
  private _activeId: string | null = null;

  // ---- keep styling/state on host ----
  @HostBinding('attr.data-slot')
  protected readonly dataSlot: 'select' = 'select';

  @HostBinding('attr.data-state')
  protected get dataState(): 'open' | 'closed' {
    return this.open() ? 'open' : 'closed';
  }

  // (optional but nice for styling)
  @HostBinding('attr.data-disabled')
  protected get dataDisabled(): '' | null {
    return this.disabled() ? '' : null;
  }


  public setContentId(id: string | null): void { this._contentId = id; }
  public getContentId(): string | null { return this._contentId; }

  public setListboxId(id: string | null): void { this._listboxId = id; }
  public getListboxId(): string | null { return this._listboxId; }

  public setActiveDescendantId(id: string | null): void { this._activeId = id; }
  public getActiveDescendantId(): string | null { return this._activeId; }

  public openSelect(): void {
    if (this.disabled()) return;
    this.open.set(true);
  }
  public close(): void { this.open.set(false); }
  public toggle(): void {
    if (this.disabled()) return;
    this.open.set(!this.open());
  }
  public selectValue(value: T): void {
    if (this.disabled()) return;
    this.value.set(value);
    this.close();
  }
}