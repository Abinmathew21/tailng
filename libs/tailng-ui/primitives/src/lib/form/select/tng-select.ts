import { Directive, ElementRef, HostBinding, inject, input, model } from '@angular/core';
import { TNG_SELECT } from './tng-select.tokens';
import { TNG_SELECT_HOST } from '../_shared/select/tng-select.tokens.shared';
import type { TngSelectHostApi } from '../_shared/select/tng-select.host-api';
import { TngSelectListboxApi } from './tng-select.listbox.types';

@Directive({
  selector: '[tngSelect]',
  exportAs: 'tngSelect',
  providers: [
    { provide: TNG_SELECT, useExisting: TngSelect },
    { provide: TNG_SELECT_HOST, useExisting: TngSelect },
  ],
})
export class TngSelect<T = unknown> implements TngSelectHostApi {
  readonly hostElement = inject(ElementRef<HTMLElement>).nativeElement;
  public readonly open = model<boolean>(false);
  public readonly disabled = input<boolean>(false);
  /** Value of the selected option. Single-select only. */
  public readonly value = model<T | null>(null);

  private _contentId: string | null = null;
  private _listboxId: string | null = null;
  private _activeId: string | null = null;
  private _listboxApi: TngSelectListboxApi<T> | null = null;

  public readonly loading = input<boolean>(false);
  public readonly invalid = input<boolean>(false);
  public readonly labelId = input<string | null>(null);
  public readonly descriptionId = input<string | null>(null);
  public readonly errorId = input<string | null>(null);

  @HostBinding('attr.data-slot')
  protected readonly dataSlot: 'select' = 'select';

  @HostBinding('attr.data-state')
  protected get dataState(): 'open' | 'closed' {
    return this.open() ? 'open' : 'closed';
  }

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

  /** Single-select: always false. Satisfies TngSelectHostApi. */
  public readonly multiple = (): boolean => false;

  public setContentId(id: string | null): void {
    this._contentId = id;
  }
  public getContentId(): string | null {
    return this._contentId;
  }
  public setListboxId(id: string | null): void {
    this._listboxId = id;
  }
  public getListboxId(): string | null {
    return this._listboxId;
  }
  public setActiveDescendantId(id: string | null): void {
    this._activeId = id;
  }
  public getActiveDescendantId(): string | null {
    return this._activeId;
  }

  public openSelect(): void {
    if (this.disabled()) return;
    this.open.set(true);
  }
  public close(): void {
    this.open.set(false);
  }
  public toggle(): void {
    if (this.disabled()) return;
    this.open.set(!this.open());
  }

  public selectValue(value: T): void {
    if (this.disabled()) return;
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
