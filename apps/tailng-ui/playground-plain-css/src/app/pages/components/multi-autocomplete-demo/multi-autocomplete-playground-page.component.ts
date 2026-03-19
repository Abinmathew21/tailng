import { Component, computed, OnInit, signal } from '@angular/core';

import { TngMultiAutocompleteComponent } from '@tailng-ui/components';
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
  imports: [
    TngMultiAutocomplete,
    TngMultiAutocompleteChip,
    TngMultiAutocompleteTrigger,
    TngMultiAutocompleteContent,
    TngMultiAutocompleteOverlay,
    TngMultiAutocompleteListbox,
    TngMultiAutocompleteOption,
    TngMultiAutocompleteComponent,
  ],
  templateUrl: './multi-autocomplete-playground-page.component.html',
  styleUrl: './multi-autocomplete-playground-page.component.css',
})
export class MultiAutocompletePlaygroundPageComponent implements OnInit {
  readonly countries = signal<Country[]>([]);
  readonly query = signal('');
  readonly value = signal<readonly string[]>([]);
  readonly valueC = signal<readonly string[]>([]);
  readonly open = signal(false);

  readonly getCountryValue = (c: Country) => c.name;
  readonly getCountryLabel = (c: Country) => c.name;

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

  ngOnInit(): void {
    fetch('/assets/country-list.json')
      .then((r) => r.json())
      .then((data: Country[]) => this.countries.set(data))
      .catch(() => this.countries.set([]));
  }

  onOpenChange(open: boolean): void {
    this.open.set(open);
    if (!open) {
      this.query.set('');
    }
  }

  onQueryChange(query: string): void {
    this.query.set(query);
  }

  onValueChange(value: readonly string[]): void {
    this.value.set(value);
  }

  removeItem(item: string): void {
    this.value.update((current) => current.filter((entry) => entry !== item));
  }
}
