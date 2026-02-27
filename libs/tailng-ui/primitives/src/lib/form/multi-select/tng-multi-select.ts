import { Directive, ElementRef, HostBinding, inject, input, model } from '@angular/core';
import { TNG_MULTI_SELECT } from './tng-multi-select.tokens';
import { TNG_SELECT_HOST } from '../_shared/select/tng-select.tokens.shared';
import type { TngSelectHostApi } from '../_shared/select/tng-select.host-api';
import { TngMultiSelectListboxApi } from './tng-multi-select.listbox.types';

@Directive({
  selector: '[tngMultiSelect]',
  exportAs: 'tngMultiSelect',
  standalone: true,
  providers: [
    { provide: TNG_MULTI_SELECT, useExisting: TngMultiSelect },
    { provide: TNG_SELECT_HOST, useExisting: TngMultiSelect },
  ],
})
export class TngMultiSelect<T = unknown> implements TngSelectHostApi {
  readonly hostElement = inject(ElementRef<HTMLElement>).nativeElement;
  public readonly open = model<boolean>(false);
  public readonly disabled = input<boolean>(false);
  /** Values of selected options. Empty array = no selection. */
  public readonly value = model<readonly T[]>([]);

  private _contentId: string | null = null;
  private _listboxId: string | null = null;
  private _activeId: string | null = null;
  private _listboxApi: TngMultiSelectListboxApi<T> | null = null;

  public readonly loading = input<boolean>(false);
  public readonly invalid = input<boolean>(false);
  public readonly labelId = input<string | null>(null);
  public readonly descriptionId = input<string | null>(null);
  public readonly errorId = input<string | null>(null);

  @HostBinding('attr.data-slot')
  protected readonly dataSlot: 'multi-select' = 'multi-select';

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

  /** Multi-select: always true. Satisfies TngSelectHostApi. */
  public readonly multiple = (): boolean => true;

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

  /** Adds an item to the selection if not already selected. */
  public addSelectedItem(item: T): void {
    if (this.disabled()) return;
    const cur = this.value();
    if (cur.some((v) => Object.is(v, item))) return;
    this.value.set([...cur, item]);
  }

  /** Removes an item from the selection if currently selected. */
  public removeSelectedItem(item: T): void {
    if (this.disabled()) return;
    const cur = this.value();
    const idx = cur.findIndex((v) => Object.is(v, item));
    if (idx < 0) return;
    this.value.set([...cur.slice(0, idx), ...cur.slice(idx + 1)]);
  }

  /** Toggles an item in the selection (add if not present, remove if present). */
  public toggleSelectedItem(item: T): void {
    if (this.disabled()) return;
    const cur = this.value();
    const idx = cur.findIndex((v) => Object.is(v, item));
    const next =
      idx >= 0
        ? [...cur.slice(0, idx), ...cur.slice(idx + 1)]
        : [...cur, item];
    this.value.set(next);
  }

  /** Clears the selection. */
  public clear(): void {
    if (this.disabled()) return;
    this.value.set([]);
  }

  public setListboxApi(api: TngMultiSelectListboxApi<T> | null): void {
    this._listboxApi = api;
  }
  public getListboxApi(): TngMultiSelectListboxApi<T> | null {
    return this._listboxApi;
  }
}
