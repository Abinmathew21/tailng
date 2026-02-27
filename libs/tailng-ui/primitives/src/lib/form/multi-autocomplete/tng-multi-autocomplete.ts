import {
  Directive,
  ElementRef,
  HostBinding,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { TNG_MULTI_AUTOCOMPLETE } from './tng-multi-autocomplete.tokens';
import type { TngMultiAutocompleteListboxApi } from './tng-multi-autocomplete.listbox.types';

/** Emitted when user commits a free-form value (Enter with no active option). */
export interface TngMultiAutocompleteCreateEvent {
  query: string;
}

@Directive({
  selector: '[tngMultiAutocomplete]',
  exportAs: 'tngMultiAutocomplete',
  standalone: true,
  providers: [{ provide: TNG_MULTI_AUTOCOMPLETE, useExisting: TngMultiAutocomplete }],
})
export class TngMultiAutocomplete<T = unknown> {
  readonly hostElement = inject(ElementRef<HTMLElement>).nativeElement;

  public readonly open = model<boolean>(false);
  public readonly disabled = input<boolean>(false);
  /** Values of selected options. Empty array = no selection. */
  public readonly value = model<readonly T[]>([]);
  /** Allow free-form create when Enter with no active option. */
  public readonly allowCreate = input<boolean>(false);
  /** When true, blocks free-form create (strict = must select from list). */
  public readonly strict = input<boolean>(false);
  /** Emitted when user presses Enter with no active option and allowCreate and !strict. */
  public readonly create = output<TngMultiAutocompleteCreateEvent>();

  private _contentId: string | null = null;
  private _listboxId: string | null = null;
  private _activeId: string | null = null;
  private _listboxApi: TngMultiAutocompleteListboxApi<T> | null = null;
  /** Set by overlay before programmatic focus restore to prevent reopen-on-focus. */
  _restoringFocus = false;
  /** Set by trigger when create is emitted; listbox effect skips sync. */
  _createJustEmitted = false;

  public readonly loading = input<boolean>(false);
  public readonly invalid = input<boolean>(false);
  public readonly labelId = input<string | null>(null);
  public readonly descriptionId = input<string | null>(null);
  public readonly errorId = input<string | null>(null);

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'multi-autocomplete' as const;

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

  setContentId(id: string | null): void {
    this._contentId = id;
  }
  getContentId(): string | null {
    return this._contentId;
  }
  setListboxId(id: string | null): void {
    this._listboxId = id;
  }
  getListboxId(): string | null {
    return this._listboxId;
  }
  setActiveDescendantId(id: string | null): void {
    this._activeId = id;
  }
  getActiveDescendantId(): string | null {
    return this._activeId;
  }

  openSelect(): void {
    if (this.disabled()) return;
    this.open.set(true);
  }

  close(): void {
    this.open.set(false);
  }

  /** Multi: toggles value in selection, overlay stays open. */
  toggleValue(val: T): void {
    if (this.disabled()) return;
    const cur = this.value();
    const idx = cur.findIndex((v) => Object.is(v, val));
    let next: readonly T[];
    if (idx >= 0) {
      next = [...cur.slice(0, idx), ...cur.slice(idx + 1)];
    } else {
      next = [...cur, val];
    }
    this.value.set(next);
  }

  setListboxApi(api: TngMultiAutocompleteListboxApi<T> | null): void {
    this._listboxApi = api;
  }

  getListboxApi(): TngMultiAutocompleteListboxApi<T> | null {
    return this._listboxApi;
  }
}
