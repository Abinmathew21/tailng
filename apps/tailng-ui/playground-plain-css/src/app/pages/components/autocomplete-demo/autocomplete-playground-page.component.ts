import type {
  OnInit} from '@angular/core';
import {
  Component,
  computed,
  signal,
} from '@angular/core';

import { TngAutocompleteComponent } from '@tailng-ui/components';
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
  imports: [
    TngAutocomplete,
    TngAutocompleteTrigger,
    TngAutocompleteTriggerContainer,
    TngAutocompleteContent,
    TngAutocompleteIcon,
    TngAutocompleteOverlay,
    TngAutocompleteListbox,
    TngAutocompleteOption,
    TngAutocompleteComponent,
  ],
  templateUrl: './autocomplete-playground-page.component.html',
  styleUrl: './autocomplete-playground-page.component.css',
})
export class AutocompletePlaygroundPageComponent implements OnInit {
  public readonly countries = signal<Country[]>([]);
  public readonly query = signal('');
  public readonly value = signal<string | null>(null);
  public readonly queryHeadless = signal('');
  public readonly valueHeadless = signal<string | null>(null);
  public readonly openHeadless = signal(false);
  public readonly valueC = signal<string | null>(null);
  public readonly valueCProgrammatic = signal<string | null>(null);
  public readonly valueFlag = signal<string | null>(null);
  public readonly open = signal(false);

  public readonly getCountryValue = (c: Country): string => c.name;
  public readonly getCountryLabel = (c: Country): string => c.name;
  public readonly getCountryCodeValue = (c: Country): string => c.code;

  protected readonly trackCountryByCode = (_index: number, country: Country): string => country.code;
  protected readonly getFlagClass = (country: Country): string =>
    `flag-chip country-flag country-flag--${country.code.toLowerCase()}`;

  public readonly filteredOptions = computed<Country[]>(() => {
    const q = this.query().toLowerCase().trim();
    const list = this.countries();
    if (!q) return list.slice(0, 50);
    return list
      .filter((c) => c.name.toLowerCase().includes(q))
      .slice(0, 50);
  });

  public readonly displayText = computed<string>(() => {
    return this.open() ? this.query() : (this.value() ?? '');
  });

  public readonly filteredHeadlessOptions = computed<Country[]>(() => {
    const q = this.queryHeadless().toLowerCase().trim();
    const list = this.countries();
    if (!q) return list.slice(0, 50);
    return list
      .filter((c) => c.name.toLowerCase().includes(q))
      .slice(0, 50);
  });

  public readonly displayHeadlessText = computed<string>(() => {
    return this.openHeadless() ? this.queryHeadless() : (this.valueHeadless() ?? '');
  });

  public ngOnInit(): void {
    fetch('/assets/country-list.json')
      .then((r) => r.json())
      .then((data: Country[]) => this.countries.set(data))
      .catch(() => this.countries.set([]));
  }

  public onInput(ev: Event): void {
    const val = (ev.target as HTMLInputElement).value;
    this.query.set(val);
  }

  public onValueChange(v: string | readonly string[] | null): void {
    const single: string | null =
      typeof v === 'string' ? v : Array.isArray(v) && typeof v[0] === 'string' ? v[0] : null;
    this.value.set(single);
    this.query.set(single ?? '');
  }

  public onOpenChange(open: boolean): void {
    this.open.set(open);
    if (!open) {
      this.query.set(this.value() ?? '');
    }
  }

  public onFlagValueChange(v: string | readonly string[] | null): void {
    const single: string | null =
      typeof v === 'string' ? v : Array.isArray(v) && typeof v[0] === 'string' ? v[0] : null;
    this.valueFlag.set(single);
  }

  public onValueCChange(v: string | readonly string[] | null): void {
    const single: string | null =
      typeof v === 'string' ? v : Array.isArray(v) && typeof v[0] === 'string' ? v[0] : null;
    this.valueC.set(single);
  }

  public onComponentProgrammaticValueChange(v: string | readonly string[] | null): void {
    const single: string | null =
      typeof v === 'string' ? v : Array.isArray(v) && typeof v[0] === 'string' ? v[0] : null;
    this.valueCProgrammatic.set(single);
  }

  public onHeadlessInput(ev: Event): void {
    const val = (ev.target as HTMLInputElement).value;
    this.queryHeadless.set(val);
  }

  public onHeadlessValueChange(v: string | readonly string[] | null): void {
    const single: string | null =
      typeof v === 'string' ? v : Array.isArray(v) && typeof v[0] === 'string' ? v[0] : null;

    if (single === null && this.valueHeadless() !== null) {
      this.queryHeadless.set(this.valueHeadless() ?? '');
      return;
    }

    this.valueHeadless.set(single);
    this.queryHeadless.set(single ?? '');
  }

  public onHeadlessOpenChange(open: boolean): void {
    this.openHeadless.set(open);
    if (!open) {
      this.queryHeadless.set(this.valueHeadless() ?? '');
    }
  }

  public selectHeadlessCountry(name: 'India' | 'Japan' | 'Spain'): void {
    this.openHeadless.set(false);
    this.valueHeadless.set(name);
    this.queryHeadless.set(name);
  }

  public selectComponentCountry(name: 'India' | 'Japan' | 'Spain'): void {
    this.valueCProgrammatic.set(name);
  }
}
