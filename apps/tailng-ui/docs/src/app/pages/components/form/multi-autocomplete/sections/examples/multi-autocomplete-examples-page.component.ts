import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
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
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

interface CountryOption {
  code: string;
  label: string;
}

type MultiAutocompleteValueChange = unknown;

const COUNTRY_OPTIONS: readonly CountryOption[] = Object.freeze([
  { code: 'in', label: 'India' },
  { code: 'id', label: 'Indonesia' },
  { code: 'ca', label: 'Canada' },
  { code: 'de', label: 'Germany' },
  { code: 'jp', label: 'Japan' },
  { code: 'mx', label: 'Mexico' },
  { code: 'es', label: 'Spain' },
]);

@Component({
  selector: 'app-multi-autocomplete-examples-page',
  imports: [
    TngMultiAutocompleteComponent,
    TngMultiAutocomplete,
    TngMultiAutocompleteTrigger,
    TngMultiAutocompleteChip,
    TngMultiAutocompleteContent,
    TngMultiAutocompleteOverlay,
    TngMultiAutocompleteListbox,
    TngMultiAutocompleteOption,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './multi-autocomplete-examples-page.component.html',
  styleUrl: './multi-autocomplete-examples-page.component.css',
})
export class MultiAutocompleteExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );

  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  protected readonly countries = COUNTRY_OPTIONS;
  private readonly countriesByCode = new Map(this.countries.map((country) => [country.code, country]));

  protected readonly getCountryValue = (country: CountryOption) => country.code;
  protected readonly getCountryLabel = (country: CountryOption) => country.label;

  protected readonly headlessOpen = signal(false);
  protected readonly headlessQuery = signal('');
  protected readonly headlessValue = signal<readonly string[]>(['in']);

  protected readonly plainValue = signal<readonly string[]>(['id', 'de']);
  protected readonly tailwindValue = signal<readonly string[]>(['ca']);

  protected readonly disabledValue = signal<readonly string[]>(['jp']);
  protected readonly invalidValue = signal<readonly string[]>(['mx']);

  protected readonly headlessFilteredCountries = computed<readonly CountryOption[]>(() => {
    const query = this.headlessQuery().trim().toLowerCase();
    if (query === '') {
      return this.countries;
    }

    return this.countries.filter((country) => country.label.toLowerCase().includes(query));
  });

  protected readonly headlessSummary = computed(() => this.formatSelection(this.headlessValue()));
  protected readonly plainSummary = computed(() => this.formatSelection(this.plainValue()));
  protected readonly tailwindSummary = computed(() => this.formatSelection(this.tailwindValue()));
  protected readonly invalidSummary = computed(() => this.formatSelection(this.invalidValue()));

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'multi-autocomplete-headless-tags.component.ts',
      code: [
        'readonly open = signal(false);',
        "readonly query = signal('');",
        "readonly value = signal<readonly string[]>(['in']);",
        '',
        'readonly filteredCountries = computed(() => {',
        '  const q = this.query().trim().toLowerCase();',
        '  if (!q) return this.countries;',
        '  return this.countries.filter((country) => country.label.toLowerCase().includes(q));',
        '});',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'multi-autocomplete-headless-tags.component.html',
      code: [
        '<section tngMultiAutocomplete [query]="query()" [value]="value()">',
        '  @for (code of value(); track code) {',
        '    <span tngMultiAutocompleteChip [tngValue]="code">{{ resolveLabel(code) }}</span>',
        '  }',
        '  <input tngMultiAutocompleteTrigger (input)="onInput($event)" />',
        '  <div tngMultiAutocompleteContent>',
        '    <div tngMultiAutocompleteOverlay>',
        '      <ul tngMultiAutocompleteListbox>',
        '        @for (country of filteredCountries(); track country.code) {',
        '          <li tngMultiAutocompleteOption [tngValue]="country.code">{{ country.label }}</li>',
        '        }',
        '      </ul>',
        '    </div>',
        '  </div>',
        '</section>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'multi-autocomplete-headless-tags.component.css',
      code: '.tags-shell { display: grid; gap: 0.65rem; }',
    },
  ]);

  protected readonly plainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'multi-autocomplete-plain-css-tags.component.ts',
      code: [
        "readonly selectedCountries = signal<readonly string[]>(['id', 'de']);",
        'onValueChange(value: unknown): void {',
        '  this.selectedCountries.set(this.toValueArray(value));',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'multi-autocomplete-plain-css-tags.component.html',
      code: [
        '<tng-multi-autocomplete',
        '  [options]="countries"',
        '  [value]="selectedCountries()"',
        '  (valueChange)="onValueChange($event)"',
        '  [getOptionValue]="getCountryValue"',
        '  [getOptionLabel]="getCountryLabel"',
        '></tng-multi-autocomplete>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'multi-autocomplete-plain-css-tags.component.css',
      code: '.tags-shell--plain { border: 1px solid var(--tng-semantic-border-subtle); }',
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'multi-autocomplete-tailwind-tags.component.ts',
      code: "readonly selectedCountries = signal<readonly string[]>(['ca']);",
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'multi-autocomplete-tailwind-tags.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-multi-autocomplete [options]="countries"></tng-multi-autocomplete>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'multi-autocomplete-tailwind-tags.component.css',
      code: '/* Tailwind utilities in template */',
    },
  ]);

  protected onHeadlessInput(event: Event): void {
    this.headlessQuery.set((event.target as HTMLInputElement).value);
  }

  protected onHeadlessQueryChange(query: string): void {
    this.headlessQuery.set(query);
  }

  protected onHeadlessValueChange(value: MultiAutocompleteValueChange): void {
    this.headlessValue.set(this.toValueArray(value));
  }

  protected onPlainValueChange(value: MultiAutocompleteValueChange): void {
    this.plainValue.set(this.toValueArray(value));
  }

  protected onTailwindValueChange(value: MultiAutocompleteValueChange): void {
    this.tailwindValue.set(this.toValueArray(value));
  }

  protected onInvalidValueChange(value: MultiAutocompleteValueChange): void {
    this.invalidValue.set(this.toValueArray(value));
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected resolveCountryLabel(code: string): string {
    return this.countriesByCode.get(code)?.label ?? code;
  }

  private toValueArray(value: MultiAutocompleteValueChange): readonly string[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map((item) => (typeof item === 'string' ? item : String(item)))
      .filter((item) => item.length > 0);
  }

  private formatSelection(values: readonly string[]): string {
    if (values.length === 0) {
      return 'none';
    }

    return values.map((value) => this.resolveCountryLabel(value)).join(', ');
  }

  private observeCodeThemeChanges(): MutationObserver | null {
    const mutationObserverCtor = this.documentRef.defaultView?.MutationObserver;
    if (mutationObserverCtor === undefined) {
      return null;
    }

    const observer = new mutationObserverCtor(() => {
      this.codeBlockTheme.set(this.resolveCodeBlockTheme());
    });

    observer.observe(this.documentRef.documentElement, {
      attributeFilter: ['style', 'class'],
      attributes: true,
    });

    return observer;
  }

  private resolveCodeBlockTheme(): 'github-dark' | 'github-light' {
    const root = this.documentRef.documentElement;
    const inlineColorScheme = root.style.getPropertyValue('color-scheme').trim().toLowerCase();
    if (inlineColorScheme.includes('dark')) {
      return 'github-dark';
    }

    const computedColorScheme = this.documentRef.defaultView
      ?.getComputedStyle(root)
      .getPropertyValue('color-scheme')
      .trim()
      .toLowerCase();

    return computedColorScheme?.includes('dark') ? 'github-dark' : 'github-light';
  }
}
