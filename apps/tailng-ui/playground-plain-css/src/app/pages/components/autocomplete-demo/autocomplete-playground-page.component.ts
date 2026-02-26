import {
  Component,
  computed,
  OnInit,
  signal,
} from '@angular/core';

import {
  TngAutocomplete,
  TngAutocompleteTrigger,
  TngAutocompleteTriggerContainer,
  TngAutocompleteContent,
  TngAutocompleteIcon,
  TngAutocompleteOverlay,
  TngAutocompleteListbox,
  TngAutocompleteOption,
} from '@tailng-ui/primitives';

type Country = { code: string; name: string };

@Component({
  selector: 'app-autocomplete-playground-page',
  standalone: true,
  imports: [
    TngAutocomplete,
    TngAutocompleteTrigger,
    TngAutocompleteTriggerContainer,
    TngAutocompleteContent,
    TngAutocompleteIcon,
    TngAutocompleteOverlay,
    TngAutocompleteListbox,
    TngAutocompleteOption,
  ],
  templateUrl: './autocomplete-playground-page.component.html',
  styleUrl: './autocomplete-playground-page.component.css',
})
export class AutocompletePlaygroundPageComponent implements OnInit {
  readonly countries = signal<Country[]>([]);
  readonly query = signal('');
  readonly value = signal<string | null>(null);
  readonly open = signal(false);

  readonly filteredOptions = computed(() => {
    const q = this.query().toLowerCase().trim();
    const list = this.countries();
    if (!q) return list.slice(0, 50);
    return list
      .filter((c) => c.name.toLowerCase().includes(q))
      .slice(0, 50);
  });

  readonly displayText = computed(() => {
    return this.open() ? this.query() : (this.value() ?? '');
  });

  ngOnInit(): void {
    fetch('/assets/country-list.json')
      .then((r) => r.json())
      .then((data: Country[]) => this.countries.set(data))
      .catch(() => this.countries.set([]));
  }

  onInput(ev: Event): void {
    const val = (ev.target as HTMLInputElement).value;
    this.query.set(val);
  }

  onValueChange(v: string | readonly string[] | null): void {
    const single = v === null ? null : Array.isArray(v) ? (v[0] ?? null) : v;
    this.value.set(single);
    this.query.set(single ?? '');
  }

  onOpenChange(open: boolean): void {
    this.open.set(open);
    if (!open) {
      this.query.set(this.value() ?? '');
    }
  }
}
