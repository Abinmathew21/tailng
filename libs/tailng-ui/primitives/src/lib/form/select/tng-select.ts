// tng-select.ts
import { Directive, ElementRef, HostBinding, computed, inject, input, model } from '@angular/core';
import { TNG_SELECT, TNG_SELECT_FORCE_MULTIPLE } from './tng-select.tokens';
import { TngSelectListboxApi } from './tng-select.listbox.types';

@Directive({
  selector: '[tngSelect]',
  exportAs: 'tngSelect',
  standalone: true,
  providers: [{ provide: TNG_SELECT, useExisting: TngSelect }],
})
export class TngSelect<T = unknown> {
  /** Host element of the select (the [tngSelect] element). Used by overlay for trigger lookup when portaled. */
  readonly hostElement = inject(ElementRef<HTMLElement>).nativeElement;
  public readonly open = model<boolean>(false);
  public readonly disabled = input<boolean>(false);
  private readonly _forceMultiple = inject(TNG_SELECT_FORCE_MULTIPLE, { optional: true });
  readonly multipleInput = input<boolean>(false, { alias: 'multiple' });
  /** Whether multiple options can be selected. */
  public readonly multiple = computed(() => this._forceMultiple ?? this.multipleInput());
  /** Value of the selected option(s). Single: T | null; multiple: readonly T[] | null. */
  public readonly value = model<T | readonly T[] | null>(null);

  // ---- internal bridge state ----
  private _contentId: string | null = null;
  private _listboxId: string | null = null;
  private _activeId: string | null = null;

  private _listboxApi: TngSelectListboxApi<T> | null = null;

  public readonly loading = input<boolean>(false);
  public readonly invalid = input<boolean>(false);

  public readonly labelId = input<string | null>(null);
  public readonly descriptionId = input<string | null>(null);
  public readonly errorId = input<string | null>(null);

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

  @HostBinding('attr.data-loading')
  protected get dataLoading(): '' | null {
    return this.loading() ? '' : null;
  }

  @HostBinding('attr.data-invalid')
  protected get dataInvalid(): '' | null {
    return this.invalid() ? '' : null;
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
  /** Select a value (single mode only). In multiple mode, use listbox valueChange. */
  public selectValue(value: T): void {
    if (this.disabled() || this.multiple()) return;
    this.value.set(value);
    this.close();
  }

  public setListboxApi(api: TngSelectListboxApi<T> | null): void {
    this._listboxApi = api;
  }
  
  public getListboxApi(): TngSelectListboxApi<T> | null {
    return this._listboxApi;
  }
}