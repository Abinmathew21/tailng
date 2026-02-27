import {
  Component,
  computed,
  OnInit,
  signal,
} from '@angular/core';

import {
  TngMultiAutocomplete,
  TngMultiAutocompleteTrigger,
  TngMultiAutocompleteTriggerContainer,
  TngMultiAutocompleteContent,
  TngMultiAutocompleteIcon,
  TngMultiAutocompleteOverlay,
  TngMultiAutocompleteListbox,
  TngMultiAutocompleteOption,
} from '@tailng-ui/primitives';

type Country = { code: string; name: string };

@Component({
  selector: 'app-multi-autocomplete-playground-page',
  standalone: true,
  imports: [
    TngMultiAutocomplete,
    TngMultiAutocompleteTrigger,
    TngMultiAutocompleteTriggerContainer,
    TngMultiAutocompleteContent,
    TngMultiAutocompleteIcon,
    TngMultiAutocompleteOverlay,
    TngMultiAutocompleteListbox,
    TngMultiAutocompleteOption,
  ],
  templateUrl: './multi-autocomplete-playground-page.component.html',
  styleUrl: './multi-autocomplete-playground-page.component.css',
})
export class MultiAutocompletePlaygroundPageComponent implements OnInit {
  readonly countries = signal<Country[]>([]);
  readonly queryA = signal('');
  readonly queryB = signal('');
  readonly valueMultiA = signal<readonly string[]>([]);
  readonly valueMultiB = signal<readonly string[]>([]);
  readonly openA = signal(false);
  readonly openB = signal(false);

  readonly filteredOptionsA = computed(() => {
    const q = this.queryA().toLowerCase().trim();
    const list = this.countries();
    if (!q) return list.slice(0, 50);
    return list.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 50);
  });

  readonly filteredOptionsB = computed(() => {
    const q = this.queryB().toLowerCase().trim();
    const list = this.countries();
    if (!q) return list.slice(0, 50);
    return list.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 50);
  });

  readonly displayTextA = computed(() => {
    return this.openA() ? this.queryA() : this.formatSelected(this.valueMultiA());
  });

  readonly displayTextB = computed(() => {
    return this.openB() ? this.queryB() : this.formatSelected(this.valueMultiB());
  });

  ngOnInit(): void {
    fetch('/assets/country-list.json')
      .then((r) => r.json())
      .then((data: Country[]) => this.countries.set(data))
      .catch(() => this.countries.set([]));
  }

  onInputA(ev: Event): void {
    this.queryA.set((ev.target as HTMLInputElement).value);
  }

  onInputB(ev: Event): void {
    this.queryB.set((ev.target as HTMLInputElement).value);
  }

  onValueChangeA(v: readonly string[]): void {
    this.valueMultiA.set(v);
    if (!this.openA()) this.queryA.set('');
  }

  onValueChangeB(v: readonly string[]): void {
    this.valueMultiB.set(v);
    if (!this.openB()) this.queryB.set('');
  }

  onOpenChangeA(open: boolean): void {
    this.openA.set(open);
    if (!open) this.queryA.set('');
  }

  onOpenChangeB(open: boolean): void {
    this.openB.set(open);
    if (!open) this.queryB.set('');
  }

  formatSelected(v: readonly string[]): string {
    if (!v?.length) return '';
    return v.join(', ');
  }
}
