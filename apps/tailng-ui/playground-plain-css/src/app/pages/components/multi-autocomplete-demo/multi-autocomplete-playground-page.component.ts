import { Component, computed, effect, OnInit, signal } from '@angular/core';

import {
  TngMultiAutocomplete,
  TngMultiAutocompleteChip,
  TngMultiAutocompleteContent,
  TngMultiAutocompleteListbox,
  TngMultiAutocompleteOption,
  TngMultiAutocompleteOverlay,
  TngMultiAutocompleteTrigger,
} from '@tailng-ui/primitives';

type Country = { code: string; name: string };

@Component({
  selector: 'app-multi-autocomplete-playground-page',
  standalone: true,
  imports: [
    TngMultiAutocomplete,
    TngMultiAutocompleteChip,
    TngMultiAutocompleteTrigger,
    TngMultiAutocompleteContent,
    TngMultiAutocompleteOverlay,
    TngMultiAutocompleteListbox,
    TngMultiAutocompleteOption,
  ],
  templateUrl: './multi-autocomplete-playground-page.component.html',
  styleUrl: './multi-autocomplete-playground-page.component.css',
})
export class MultiAutocompletePlaygroundPageComponent implements OnInit {
  readonly countries = signal<Country[]>([]);
  readonly query = signal('');
  readonly value = signal<readonly string[]>([]);
  readonly open = signal(false);

  readonly filteredOptions = computed(() => {
    const q = this.query().toLowerCase().trim();
    const list = this.countries();
    const selected = new Set(this.value());
    const matches = q
      ? list.filter((c) => c.name.toLowerCase().includes(q))
      : list;

    const pinnedSelected = list.filter(
      (c) => selected.has(c.name) && (!q || c.name.toLowerCase().includes(q)),
    );

    const remaining = matches.filter((c) => !selected.has(c.name));

    return [...pinnedSelected, ...remaining].slice(0, 50);
  });

  constructor() {
    effect(() => {
      console.log('[multi-autocomplete-demo] state', {
        open: this.open(),
        query: this.query(),
        value: [...this.value()],
        filteredCount: this.filteredOptions().length,
      });
    });
  }

  ngOnInit(): void {
    fetch('/assets/country-list.json')
      .then((r) => r.json())
      .then((data: Country[]) => {
        console.log('[multi-autocomplete-demo] countries-loaded', {
          count: data.length,
        });
        this.countries.set(data);
      })
      .catch((error) => {
        console.log('[multi-autocomplete-demo] countries-load-failed', { error });
        this.countries.set([]);
      });
  }

  onOpenChange(open: boolean): void {
    console.log('[multi-autocomplete-demo] openChange', {
      prev: this.open(),
      next: open,
    });
    this.open.set(open);
    if (!open) {
      this.query.set('');
    }
  }

  onQueryChange(query: string): void {
    console.log('[multi-autocomplete-demo] queryChange', {
      prev: this.query(),
      next: query,
    });
    this.query.set(query);
  }

  onValueChange(value: readonly string[]): void {
    console.log('[multi-autocomplete-demo] valueChange', {
      prev: [...this.value()],
      next: [...value],
    });
    this.value.set(value);
  }

  removeItem(item: string): void {
    console.log('[multi-autocomplete-demo] removeItem', {
      item,
      prev: [...this.value()],
    });
    this.value.update((current) => current.filter((entry) => entry !== item));
  }

  logNativeInput(event: Event): void {
    const value = (event.target as HTMLInputElement | null)?.value ?? '';
    console.log('[multi-autocomplete-demo] native-input', { value });
  }

  logOptionEvent(type: 'pointerdown' | 'click', value: string): void {
    console.log(`[multi-autocomplete-demo] option-${type}`, {
      value,
      query: this.query(),
      currentValue: [...this.value()],
    });
  }
}
