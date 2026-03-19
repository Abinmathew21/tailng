import {
  Directive,
  ElementRef,
  HostBinding,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { TNG_AUTOCOMPLETE } from './tng-autocomplete.tokens';
import type { TngAutocompleteListboxApi } from './tng-autocomplete.listbox.types';

/** Emitted when user commits a free-form value (Enter with no active option). */
export interface TngAutocompleteCreateEvent {
  query: string;
}

@Directive({
  selector: '[tngAutocomplete]',
  exportAs: 'tngAutocomplete',
  providers: [{ provide: TNG_AUTOCOMPLETE, useExisting: TngAutocomplete }],
})
export class TngAutocomplete<T = unknown> {
  readonly hostElement = inject(ElementRef<HTMLElement>).nativeElement;

  public readonly open = model<boolean>(false);
  public readonly disabled = input<boolean>(false);
  /** Value of the selected option. */
  public readonly value = model<T | null>(null);
  /** Allow free-form create when Enter with no active option. */
  public readonly allowCreate = input<boolean>(false);
  /** When true, blocks free-form create (strict = must select from list). */
  public readonly strict = input<boolean>(false);
  /** Emitted when user presses Enter with no active option and allowCreate and !strict. */
  public readonly create = output<TngAutocompleteCreateEvent>();

  private _contentId: string | null = null;
  private _listboxId: string | null = null;
  private _activeId: string | null = null;
  private _listboxApi: TngAutocompleteListboxApi | null = null;
  /** Set by overlay before programmatic focus restore to prevent reopen-on-focus. */
  _restoringFocus = false;
  /** Set by trigger when create is emitted; listbox effect skips sync to avoid overwriting consumer value. */
  _createJustEmitted = false;

  public readonly loading = input<boolean>(false);
  public readonly invalid = input<boolean>(false);
  public readonly labelId = input<string | null>(null);
  public readonly descriptionId = input<string | null>(null);
  public readonly errorId = input<string | null>(null);

    /** Current input query (used for filtering). */
  public readonly query = model<string>('');

  /** Emitted when query changes (typing OR open-on-focus empty emit). */
  public readonly queryChange = output<string>();

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'autocomplete' as const;

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

  setContentId(id: string | null): void { this._contentId = id; }
  getContentId(): string | null { return this._contentId; }
  setListboxId(id: string | null): void { this._listboxId = id; }
  getListboxId(): string | null { return this._listboxId; }
  setActiveDescendantId(id: string | null): void { this._activeId = id; }
  getActiveDescendantId(): string | null { return this._activeId; }

  openSelect(): void {
    if (this.disabled()) return;
    this.open.set(true);
  }

  close(): void { this.open.set(false); }

  selectValue(value: T): void {
    if (this.disabled()) return;
    this.value.set(value);
    this.close();
  }

  setListboxApi(api: TngAutocompleteListboxApi | null): void {
    this._listboxApi = api;
  }

  getListboxApi(): TngAutocompleteListboxApi | null {
    return this._listboxApi;
  }
}
