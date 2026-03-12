import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngMultiAutocompleteComponent } from '@tailng-ui/components';
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
  selector: 'app-multi-autocomplete-overview-page',
  imports: [
    TngCodeBlockComponent,
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
  templateUrl: './multi-autocomplete-overview-page.component.html',
  styleUrl: './multi-autocomplete-overview-page.component.css',
})
export class MultiAutocompleteOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );

  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  protected readonly countries = signal<readonly CountryOption[]>(COUNTRY_OPTIONS);
  private readonly countriesByCode = computed(
    () => new Map(this.countries().map((country) => [country.code, country])),
  );

  protected readonly getCountryValue = (country: CountryOption) => country.code;
  protected readonly getCountryLabel = (country: CountryOption) => country.label;

  protected readonly headlessOpen = signal(false);
  protected readonly headlessQuery = signal('');
  protected readonly headlessValue = signal<readonly string[]>(['in']);

  protected readonly plainValue = signal<readonly string[]>(['id', 'jp']);
  protected readonly tailwindValue = signal<readonly string[]>(['ca']);

  protected readonly headlessFilteredCountries = computed<readonly CountryOption[]>(() => {
    const query = this.headlessQuery().trim().toLowerCase();
    const list = this.countries();

    if (query === '') {
      return list;
    }

    return list.filter((country) => country.label.toLowerCase().includes(query));
  });

  protected readonly headlessSelectedSummary = computed(() =>
    this.formatSelection(this.headlessValue()),
  );

  protected readonly plainSelectedSummary = computed(() => this.formatSelection(this.plainValue()));

  protected readonly tailwindSelectedSummary = computed(() =>
    this.formatSelection(this.tailwindValue()),
  );

  protected readonly primitiveImportCode = [
    'import {',
    '  TngMultiAutocomplete,',
    '  TngMultiAutocompleteTrigger,',
    '  TngMultiAutocompleteChip,',
    '  TngMultiAutocompleteContent,',
    '  TngMultiAutocompleteOverlay,',
    '  TngMultiAutocompleteListbox,',
    '  TngMultiAutocompleteOption,',
    "} from '@tailng-ui/primitives';",
    '',
  ].join('\n');

  protected readonly componentImportCode =
    "import { TngMultiAutocompleteComponent } from '@tailng-ui/components';";

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'multi-autocomplete-headless-country-tags.component.ts',
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
        '',
        'onInput(event: Event): void {',
        '  this.query.set((event.target as HTMLInputElement).value);',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'multi-autocomplete-headless-country-tags.component.html',
      code: [
        '<section',
        '  tngMultiAutocomplete',
        '  #api="tngMultiAutocomplete"',
        '  [open]="open()"',
        '  [query]="query()"',
        '  [value]="value()"',
        '  (queryChange)="query.set($event)"',
        '  (valueChange)="value.set(toValueArray($event))"',
        '>',
        '  @for (code of value(); track code) {',
        '    <span tngMultiAutocompleteChip [tngValue]="code">{{ resolveCountryLabel(code) }}</span>',
        '  }',
        '',
        '  <input',
        '    tngMultiAutocompleteTrigger',
        '    type="text"',
        '    [value]="query()"',
        '    (input)="onInput($event)"',
        '    placeholder="Type Ind to filter countries"',
        '  />',
        '',
        '  <div tngMultiAutocompleteContent>',
        '    <div tngMultiAutocompleteOverlay>',
        '      <ul tngMultiAutocompleteListbox [value]="api.value()">',
        '        @for (country of filteredCountries(); track country.code) {',
        '          <li tngMultiAutocompleteOption [tngValue]="country.code">{{ country.label }}</li>',
        '        }',
        '      </ul>',
        '    </div>',
        '  </div>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'multi-autocomplete-headless-country-tags.component.css',
      code: [
        '.multi-autocomplete-preview-shell {',
        '  display: grid;',
        '  gap: 0.65rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'multi-autocomplete-plain-css-country-tags.component.ts',
      code: [
        "readonly selectedCountries = signal<readonly string[]>(['id', 'jp']);",
        '',
        'onValueChange(value: unknown): void {',
        '  this.selectedCountries.set(this.toValueArray(value));',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'multi-autocomplete-plain-css-country-tags.component.html',
      code: [
        '<div class="multi-autocomplete-preview-shell multi-autocomplete-preview-shell--plain">',
        '  <tng-multi-autocomplete',
        '    [options]="countries"',
        '    [value]="selectedCountries()"',
        '    (valueChange)="onValueChange($event)"',
        '    [getOptionValue]="getCountryValue"',
        '    [getOptionLabel]="getCountryLabel"',
        '    placeholder="Type Ind to filter countries"',
        '    ariaLabel="Country tags"',
        '  ></tng-multi-autocomplete>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'multi-autocomplete-plain-css-country-tags.component.css',
      code: [
        '.multi-autocomplete-preview-shell--plain {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.8rem;',
        '  padding: 0.9rem 1rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'multi-autocomplete-tailwind-country-tags.component.ts',
      code: [
        "readonly selectedCountries = signal<readonly string[]>(['ca']);",
        '',
        'onValueChange(value: unknown): void {',
        '  this.selectedCountries.set(this.toValueArray(value));',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'multi-autocomplete-tailwind-country-tags.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-multi-autocomplete',
        '    [options]="countries"',
        '    [value]="selectedCountries()"',
        '    (valueChange)="onValueChange($event)"',
        '    [getOptionValue]="getCountryValue"',
        '    [getOptionLabel]="getCountryLabel"',
        '    placeholder="Type Ind to filter countries"',
        '    ariaLabel="Country tags"',
        '  ></tng-multi-autocomplete>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'multi-autocomplete-tailwind-country-tags.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
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

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected resolveCountryLabel(code: string): string {
    return this.countriesByCode().get(code)?.label ?? code;
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
