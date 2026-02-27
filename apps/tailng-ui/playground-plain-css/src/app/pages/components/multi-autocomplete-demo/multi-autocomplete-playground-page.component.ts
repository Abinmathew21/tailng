import {
  Component,
  computed,
  OnInit,
  signal,
  viewChild,
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
  readonly valueMultiA = signal<readonly string[]>([]);
  readonly valueMultiB = signal<readonly string[]>([]);
  readonly openA = signal(false);
  readonly openB = signal(false);

  private readonly multiARef = viewChild<TngMultiAutocomplete<string>>('multiA');
  private readonly multiBRef = viewChild<TngMultiAutocomplete<string>>('multiB');

  readonly filteredOptionsA = computed(() => {
    const q = (this.multiARef()?.query() ?? '').toLowerCase().trim();
    const list = this.countries();
    if (!q) return list.slice(0, 50);
    return list.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 50);
  });

  readonly filteredOptionsB = computed(() => {
    const q = (this.multiBRef()?.query() ?? '').toLowerCase().trim();
    const list = this.countries();
    if (!q) return list.slice(0, 50);
    return list.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 50);
  });

  readonly displayTextA = computed(() => {
    const m = this.multiARef();
    return m ? (this.openA() ? m.query() : '') : '';
  });

  readonly displayTextB = computed(() => {
    const m = this.multiBRef();
    return m ? (this.openB() ? m.query() : '') : '';
  });

  ngOnInit(): void {
    fetch('/assets/country-list.json')
      .then((r) => r.json())
      .then((data: Country[]) => this.countries.set(data))
      .catch(() => this.countries.set([]));
  }

  onValueChangeA(v: readonly string[]): void {
    this.valueMultiA.set(v);
  }

  onValueChangeB(v: readonly string[]): void {
    this.valueMultiB.set(v);
  }

  onOpenChangeA(open: boolean): void {
    this.openA.set(open);
  }

  onOpenChangeB(open: boolean): void {
    this.openB.set(open);
  }

  removeItemA(item: string): void {
    this.valueMultiA.update((v) => v.filter((x) => x !== item));
  }

  removeItemB(item: string): void {
    this.valueMultiB.update((v) => v.filter((x) => x !== item));
  }
}
