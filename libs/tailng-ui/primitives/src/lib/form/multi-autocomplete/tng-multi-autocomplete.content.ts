import { DestroyRef, Directive, HostBinding, inject } from '@angular/core';
import { createTngIdFactory } from '@tailng-ui/cdk';
import { TNG_MULTI_AUTOCOMPLETE } from './tng-multi-autocomplete.tokens';
import type { TngMultiAutocomplete } from './tng-multi-autocomplete';

const createContentId = createTngIdFactory('tng-multi-autocomplete-content');

@Directive({
  selector: '[tngMultiAutocompleteContent]',
  exportAs: 'tngMultiAutocompleteContent',
  standalone: true,
})
export class TngMultiAutocompleteContent {
  private readonly multi = inject<TngMultiAutocomplete>(TNG_MULTI_AUTOCOMPLETE);
  private readonly destroyRef = inject(DestroyRef);

  @HostBinding('attr.id')
  readonly id = createContentId();

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'multi-autocomplete-content' as const;

  @HostBinding('attr.hidden')
  protected get hidden(): '' | null {
    return this.multi.open() ? null : '';
  }

  @HostBinding('attr.aria-busy')
  protected get ariaBusy(): 'true' | null {
    return this.multi.loading() ? 'true' : null;
  }

  constructor() {
    this.multi.setContentId(this.id);
    this.destroyRef.onDestroy(() => {
      if (this.multi.getContentId() === this.id) this.multi.setContentId(null);
    });
  }
}