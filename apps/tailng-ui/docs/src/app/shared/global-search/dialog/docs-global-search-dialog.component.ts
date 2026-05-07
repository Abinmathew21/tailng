import {
  Component,
  Injector,
  afterNextRender,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import type { ElementRef } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { TngAutocompleteComponent, TngDialogComponent } from '@tailng-ui/components';
import {
  DocsSearchIndexService,
  type DocsSearchEntry,
} from './docs-search-index.service';

@Component({
  imports: [TngAutocompleteComponent, TngDialogComponent],
  selector: 'app-docs-global-search-dialog',
  templateUrl: './docs-global-search-dialog.component.html',
  styleUrl: './docs-global-search-dialog.component.css',
})
export class DocsGlobalSearchDialogComponent {
  private readonly autocompleteRef = viewChild<ElementRef<HTMLElement>>('autocompleteEl');
  private readonly injector = inject(Injector);
  private readonly router = inject(Router);
  private readonly searchIndex = toSignal(inject(DocsSearchIndexService).index$);

  public readonly open = input(false);
  public readonly initialValue = input('');
  public readonly openChange = output<boolean>();
  public readonly closed = output<void>();

  protected readonly query = signal('');
  protected readonly value = signal<string | null>(null);

  protected readonly filteredItems = signal<readonly DocsSearchEntry[]>([]);

  protected readonly getItemValue = (item: DocsSearchEntry): string => item.url;
  protected readonly getItemLabel = (item: DocsSearchEntry): string => item.title;
  protected readonly trackItem = (_: number, item: DocsSearchEntry): string => item.url;

  public constructor() {
    effect((): void => {
      const index = this.searchIndex();
      const query = this.query().trim();

      if (index === undefined) {
        this.filteredItems.set([]);
        return;
      }

      if (query.length === 0) {
        this.filteredItems.set(index.entries.slice(0, 8));
        return;
      }

      this.filteredItems.set(index.fuse.search(query).slice(0, 10).map((result) => result.item));
    });

    effect((): void => {
      if (!this.open()) {
        return;
      }

      this.query.set(this.initialValue());
      afterNextRender(
        (): void => {
          const inputEl = this.autocompleteRef()?.nativeElement.querySelector<HTMLInputElement>(
            '[data-slot="autocomplete-trigger"]',
          );
          inputEl?.focus();
        },
        { injector: this.injector },
      );
    });
  }

  protected onValueChange(url: string | null): void {
    this.value.set(url);

    if (url === null) {
      return;
    }

    this.openChange.emit(false);
    this.resetSearch();
    void this.router.navigateByUrl(url);
  }

  protected onDialogClosed(): void {
    this.resetSearch();
    this.closed.emit();
  }

  protected onDialogOpenChange(next: boolean): void {
    this.openChange.emit(next);
  }

  private resetSearch(): void {
    this.query.set('');
    this.value.set(null);
  }
}
