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

@Directive({
  selector: '[tngMultiAutocomplete]',
  exportAs: 'tngMultiAutocomplete',
  standalone: true,
  providers: [{ provide: TNG_MULTI_AUTOCOMPLETE, useExisting: TngMultiAutocomplete }],
})
export class TngMultiAutocomplete<T = unknown> {
  readonly hostElement = inject(ElementRef<HTMLElement>).nativeElement;

  /** Whether overlay is open. */
  readonly open = model<boolean>(false);

  /** Disabled state. */
  readonly disabled = input<boolean>(false);

  /** Selected values (always array). */
  readonly value = model<readonly T[]>([]);

  /** Current input query (used for filtering). */
  readonly query = model<string>('');

  /** Emits whenever query changes (focus-open emit, typing, selection-clear, etc.) */
  readonly queryChange = output<string>();

  /** Optional states (styling/aria). */
  readonly loading = input<boolean>(false);
  readonly invalid = input<boolean>(false);

  // ---- internal bridge state ----
  private _contentId: string | null = null;
  private _listboxId: string | null = null;
  private _activeId: string | null = null;
  private _listboxApi: TngMultiAutocompleteListboxApi | null = null;

  // ---- host styling hooks ----

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

  // ---- overlay control ----

  openSelect(): void {
    if (this.disabled()) return;
    this.open.set(true);
  }

  close(): void {
    this.open.set(false);
  }

  toggleOpen(): void {
    if (this.disabled()) return;
    this.open.set(!this.open());
  }

  // =========================================================
  // Selection API
  // =========================================================

  add(value: T): void {
    if (this.disabled()) return;

    const current = this.value();
    const exists = current.some((v) => Object.is(v, value));
    if (exists) return;

    this.value.set([...current, value]);
  }

  remove(value: T): void {
    if (this.disabled()) return;

    const current = this.value();
    const next = current.filter((v) => !Object.is(v, value));

    if (next.length !== current.length) {
      this.value.set(next);
    }
  }

  toggle(value: T): void {
    if (this.disabled()) return;

    const current = this.value();
    const exists = current.some((v) => Object.is(v, value));

    if (exists) {
      this.value.set(current.filter((v) => !Object.is(v, value)));
    } else {
      this.value.set([...current, value]);
    }
  }

  clear(): void {
    if (this.disabled()) return;
    this.value.set([]);
  }

  removeLast(): void {
    if (this.disabled()) return;

    const current = this.value();
    if (current.length === 0) return;

    this.value.set(current.slice(0, -1));
  }

  // =========================================================
  // Listbox bridge
  // =========================================================

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

  setListboxApi(api: TngMultiAutocompleteListboxApi | null): void {
    this._listboxApi = api;
  }
  getListboxApi(): TngMultiAutocompleteListboxApi | null {
    return this._listboxApi;
  }
}
