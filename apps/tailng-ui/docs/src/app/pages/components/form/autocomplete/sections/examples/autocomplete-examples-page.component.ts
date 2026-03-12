import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { TngAutocompleteComponent } from '@tailng-ui/components';
import {
  TngAutocomplete,
  TngAutocompleteContent,
  TngAutocompleteIcon,
  TngAutocompleteListbox,
  TngAutocompleteOption,
  TngAutocompleteOverlay,
  TngAutocompleteTrigger,
  TngAutocompleteTriggerContainer,
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

interface RepositoryOption {
  id: string;
  name: string;
}

type AutocompleteValueChange = unknown;

const COUNTRY_OPTIONS: readonly CountryOption[] = Object.freeze([
  { code: 'in', label: 'India' },
  { code: 'id', label: 'Indonesia' },
  { code: 'ca', label: 'Canada' },
  { code: 'de', label: 'Germany' },
  { code: 'jp', label: 'Japan' },
  { code: 'mx', label: 'Mexico' },
  { code: 'es', label: 'Spain' },
]);

const REPOSITORY_OPTIONS: readonly RepositoryOption[] = Object.freeze([
  { id: 'tailng-ui', name: 'tailng-ui' },
  { id: 'tailng-docs', name: 'tailng-docs' },
  { id: 'tailng-cli', name: 'tailng-cli' },
  { id: 'angular', name: 'angular' },
  { id: 'angular-components', name: 'angular/components' },
  { id: 'storybook', name: 'storybook' },
  { id: 'nx', name: 'nx' },
]);

@Component({
  selector: 'app-autocomplete-examples-page',
  imports: [
    TngAutocompleteComponent,
    TngAutocomplete,
    TngAutocompleteTrigger,
    TngAutocompleteTriggerContainer,
    TngAutocompleteIcon,
    TngAutocompleteContent,
    TngAutocompleteOverlay,
    TngAutocompleteListbox,
    TngAutocompleteOption,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './autocomplete-examples-page.component.html',
  styleUrl: './autocomplete-examples-page.component.css',
})
export class AutocompleteExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly countriesByCode = new Map(COUNTRY_OPTIONS.map((country) => [country.code, country]));
  private readonly repositoriesById = new Map(
    REPOSITORY_OPTIONS.map((repository) => [repository.id, repository]),
  );
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );

  protected readonly countries = COUNTRY_OPTIONS;
  protected readonly repositories = REPOSITORY_OPTIONS;
  protected readonly getCountryValue = (country: CountryOption) => country.code;
  protected readonly getCountryLabel = (country: CountryOption) => country.label;
  protected readonly getRepositoryValue = (repository: RepositoryOption) => repository.id;
  protected readonly getRepositoryLabel = (repository: RepositoryOption) => repository.name;

  protected readonly countryHeadlessOpen = signal(false);
  protected readonly countryHeadlessValue = signal<string | null>(null);
  protected readonly countryHeadlessQuery = signal('');
  protected readonly countryPlainValue = signal<string | null>('id');
  protected readonly countryTailwindValue = signal<string | null>('in');
  protected readonly compareOpen = signal(false);
  protected readonly compareValue = signal<string | null>(null);
  protected readonly compareQuery = signal('');
  protected readonly compareComponentValue = signal<string | null>(null);

  protected readonly repositoryHeadlessOpen = signal(false);
  protected readonly repositoryHeadlessValue = signal<string | null>(null);
  protected readonly repositoryHeadlessQuery = signal('');
  protected readonly repositoryPlainValue = signal<string | null>('tailng-ui');
  protected readonly repositoryTailwindValue = signal<string | null>('angular');

  protected readonly countryHeadlessDisplayText = computed(() => {
    if (this.countryHeadlessOpen()) {
      return this.countryHeadlessQuery();
    }

    return this.resolveCountryLabel(this.countryHeadlessValue()) ?? '';
  });

  protected readonly countryHeadlessFiltered = computed<readonly CountryOption[]>(() => {
    const query = this.countryHeadlessQuery().trim().toLowerCase();
    if (query === '') {
      return this.countries;
    }

    return this.countries.filter((country) => country.label.toLowerCase().includes(query));
  });

  protected readonly repositoryHeadlessDisplayText = computed(() => {
    if (this.repositoryHeadlessOpen()) {
      return this.repositoryHeadlessQuery();
    }

    return this.resolveRepositoryLabel(this.repositoryHeadlessValue()) ?? '';
  });

  protected readonly repositoryHeadlessFiltered = computed<readonly RepositoryOption[]>(() => {
    const query = this.repositoryHeadlessQuery().trim().toLowerCase();
    if (query === '') {
      return this.repositories;
    }

    return this.repositories.filter((repository) => repository.name.toLowerCase().includes(query));
  });

  protected readonly countryHeadlessSummary = computed(
    () => this.resolveCountryLabel(this.countryHeadlessValue()) ?? 'none',
  );
  protected readonly compareSummary = computed(
    () => this.resolveCountryLabel(this.compareValue()) ?? 'none',
  );
  protected readonly compareComponentSummary = computed(
    () => this.resolveCountryLabel(this.compareComponentValue()) ?? 'none',
  );
  protected readonly countryPlainSummary = computed(
    () => this.resolveCountryLabel(this.countryPlainValue()) ?? 'none',
  );
  protected readonly countryTailwindSummary = computed(
    () => this.resolveCountryLabel(this.countryTailwindValue()) ?? 'none',
  );

  protected readonly repositoryHeadlessSummary = computed(
    () => this.resolveRepositoryLabel(this.repositoryHeadlessValue()) ?? 'none',
  );
  protected readonly repositoryPlainSummary = computed(
    () => this.resolveRepositoryLabel(this.repositoryPlainValue()) ?? 'none',
  );
  protected readonly repositoryTailwindSummary = computed(
    () => this.resolveRepositoryLabel(this.repositoryTailwindValue()) ?? 'none',
  );
  protected readonly compareDisplayText = computed(() => {
    if (this.compareOpen()) {
      return this.compareQuery();
    }

    return this.resolveCountryLabel(this.compareValue()) ?? '';
  });
  protected readonly compareFilteredCountries = computed<readonly CountryOption[]>(() => {
    const query = this.compareQuery().trim().toLowerCase();
    if (query === '') {
      return this.countries;
    }

    return this.countries.filter((country) => country.label.toLowerCase().includes(query));
  });

  protected readonly countryHeadlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'autocomplete-country-headless.component.ts',
      code: [
        'readonly open = signal(false);',
        'readonly value = signal<string | null>(null);',
        "readonly query = signal('');",
        '',
        'readonly filteredCountries = computed(() => {',
        '  const q = this.query().trim().toLowerCase();',
        "  if (!q) return this.countries;",
        '  return this.countries.filter((country) => country.label.toLowerCase().includes(q));',
        '});',
        '',
        'onInput(event: Event): void {',
        '  this.query.set((event.target as HTMLInputElement).value);',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'autocomplete-country-headless.component.html',
      code: [
        '<div tngAutocomplete [open]="open()" [value]="value()">',
        '  <div tngAutocompleteTriggerContainer>',
        '    <input',
        '      tngAutocompleteTrigger',
        '      type="text"',
        '      [value]="displayText()"',
        '      (input)="onInput($event)"',
        '      placeholder="Type Ind to filter countries"',
        '    />',
        '    <span tngAutocompleteIcon>▾</span>',
        '  </div>',
        '',
        '  <div tngAutocompleteContent>',
        '    <div tngAutocompleteOverlay>',
        '      <ul tngAutocompleteListbox>',
        '        @for (country of filteredCountries(); track country.code) {',
        '          <li tngAutocompleteOption [tngValue]="country.code">{{ country.label }}</li>',
        '        }',
        '      </ul>',
        '    </div>',
        '  </div>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'autocomplete-country-headless.component.css',
      code: [
        '.example-shell {',
        '  display: grid;',
        '  gap: 0.65rem;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly countryPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'autocomplete-country-plain-css.component.ts',
      code: [
        "readonly selectedCountry = signal<string | null>('id');",
        '',
        'onValueChange(value: string | readonly string[] | null): void {',
        '  this.selectedCountry.set(this.toSingleValue(value));',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'autocomplete-country-plain-css.component.html',
      code: [
        '<tng-autocomplete',
        '  [options]="countries"',
        '  [value]="selectedCountry()"',
        '  (valueChange)="onValueChange($event)"',
        '  [getOptionValue]="getCountryValue"',
        '  [getOptionLabel]="getCountryLabel"',
        '  placeholder="Type Ind to filter countries"',
        '  ariaLabel="Country filter"',
        '></tng-autocomplete>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'autocomplete-country-plain-css.component.css',
      code: [
        '.example-shell--plain {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.8rem;',
        '  padding: 0.9rem 1rem;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly countryTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'autocomplete-country-tailwind.component.ts',
      code: [
        "readonly selectedCountry = signal<string | null>('in');",
        '',
        'onValueChange(value: string | readonly string[] | null): void {',
        '  this.selectedCountry.set(this.toSingleValue(value));',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'autocomplete-country-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-autocomplete',
        '    [options]="countries"',
        '    [value]="selectedCountry()"',
        '    (valueChange)="onValueChange($event)"',
        '    [getOptionValue]="getCountryValue"',
        '    [getOptionLabel]="getCountryLabel"',
        '    placeholder="Type Ind to filter countries"',
        '    ariaLabel="Country filter"',
        '  ></tng-autocomplete>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'autocomplete-country-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected readonly repositoryHeadlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'autocomplete-repository-headless.component.ts',
      code: [
        "readonly repoQuery = signal('');",
        '',
        'readonly filteredRepositories = computed(() => {',
        '  const q = this.repoQuery().trim().toLowerCase();',
        "  if (!q) return this.repositories;",
        '  return this.repositories.filter((repo) => repo.name.toLowerCase().includes(q));',
        '});',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'autocomplete-repository-headless.component.html',
      code: [
        '<div tngAutocomplete>',
        '  <div tngAutocompleteTriggerContainer>',
        '    <input tngAutocompleteTrigger placeholder="Search repository" />',
        '    <span tngAutocompleteIcon>▾</span>',
        '  </div>',
        '  <div tngAutocompleteContent>',
        '    <div tngAutocompleteOverlay>',
        '      <ul tngAutocompleteListbox>',
        '        @for (repo of filteredRepositories(); track repo.id) {',
        '          <li tngAutocompleteOption [tngValue]="repo.id">{{ repo.name }}</li>',
        '        }',
        '      </ul>',
        '    </div>',
        '  </div>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'autocomplete-repository-headless.component.css',
      code: '/* Uses the same shell contract as the country example. */',
    },
  ]);

  protected readonly repositoryPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'autocomplete-repository-plain-css.component.ts',
      code: [
        "readonly selectedRepository = signal<string | null>('tailng-ui');",
        '',
        'onValueChange(value: string | readonly string[] | null): void {',
        '  this.selectedRepository.set(this.toSingleValue(value));',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'autocomplete-repository-plain-css.component.html',
      code: [
        '<tng-autocomplete',
        '  [options]="repositories"',
        '  [value]="selectedRepository()"',
        '  (valueChange)="onValueChange($event)"',
        '  [getOptionValue]="getRepositoryValue"',
        '  [getOptionLabel]="getRepositoryLabel"',
        '  placeholder="Search repository"',
        '  ariaLabel="Repository filter"',
        '></tng-autocomplete>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'autocomplete-repository-plain-css.component.css',
      code: '/* Plain CSS shell styles match the country example. */',
    },
  ]);

  protected readonly repositoryTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'autocomplete-repository-tailwind.component.ts',
      code: [
        "readonly selectedRepository = signal<string | null>('angular');",
        '',
        'onValueChange(value: string | readonly string[] | null): void {',
        '  this.selectedRepository.set(this.toSingleValue(value));',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'autocomplete-repository-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-autocomplete',
        '    [options]="repositories"',
        '    [value]="selectedRepository()"',
        '    (valueChange)="onValueChange($event)"',
        '    [getOptionValue]="getRepositoryValue"',
        '    [getOptionLabel]="getRepositoryLabel"',
        '    placeholder="Search repository"',
        '    ariaLabel="Repository filter"',
        '  ></tng-autocomplete>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'autocomplete-repository-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected onCountryHeadlessInput(event: Event): void {
    this.countryHeadlessQuery.set((event.target as HTMLInputElement).value);
  }

  protected onCountryHeadlessOpenChange(open: boolean): void {
    this.countryHeadlessOpen.set(open);
    if (!open) {
      this.countryHeadlessQuery.set(this.resolveCountryLabel(this.countryHeadlessValue()) ?? '');
    }
  }

  protected onCountryHeadlessValueChange(value: AutocompleteValueChange): void {
    const single = this.toSingleValue(value);
    this.countryHeadlessValue.set(single);
    this.countryHeadlessQuery.set(this.resolveCountryLabel(single) ?? '');
  }

  protected onCountryPlainValueChange(value: AutocompleteValueChange): void {
    this.countryPlainValue.set(this.toSingleValue(value));
  }

  protected onCountryTailwindValueChange(value: AutocompleteValueChange): void {
    this.countryTailwindValue.set(this.toSingleValue(value));
  }

  protected onCompareInput(event: Event): void {
    this.compareQuery.set((event.target as HTMLInputElement).value);
  }

  protected onCompareOpenChange(open: boolean): void {
    this.compareOpen.set(open);
    if (!open) {
      this.compareQuery.set(this.resolveCountryLabel(this.compareValue()) ?? '');
    }
  }

  protected onCompareValueChange(value: AutocompleteValueChange): void {
    const single = this.toSingleValue(value);
    this.compareValue.set(single);
    this.compareQuery.set(this.resolveCountryLabel(single) ?? '');
  }

  protected onCompareComponentValueChange(value: AutocompleteValueChange): void {
    this.compareComponentValue.set(this.toSingleValue(value));
  }

  protected onRepositoryHeadlessInput(event: Event): void {
    this.repositoryHeadlessQuery.set((event.target as HTMLInputElement).value);
  }

  protected onRepositoryHeadlessOpenChange(open: boolean): void {
    this.repositoryHeadlessOpen.set(open);
    if (!open) {
      this.repositoryHeadlessQuery.set(
        this.resolveRepositoryLabel(this.repositoryHeadlessValue()) ?? '',
      );
    }
  }

  protected onRepositoryHeadlessValueChange(value: AutocompleteValueChange): void {
    const single = this.toSingleValue(value);
    this.repositoryHeadlessValue.set(single);
    this.repositoryHeadlessQuery.set(this.resolveRepositoryLabel(single) ?? '');
  }

  protected onRepositoryPlainValueChange(value: AutocompleteValueChange): void {
    this.repositoryPlainValue.set(this.toSingleValue(value));
  }

  protected onRepositoryTailwindValueChange(value: AutocompleteValueChange): void {
    this.repositoryTailwindValue.set(this.toSingleValue(value));
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  private toSingleValue(value: AutocompleteValueChange): string | null {
    if (value === null) {
      return null;
    }

    if (Array.isArray(value)) {
      const first = value[0];
      return typeof first === 'string' ? first : first === null ? null : String(first);
    }

    return typeof value === 'string' ? value : String(value);
  }

  private resolveCountryLabel(code: string | null): string | null {
    if (code === null) {
      return null;
    }

    return this.countriesByCode.get(code)?.label ?? null;
  }

  private resolveRepositoryLabel(id: string | null): string | null {
    if (id === null) {
      return null;
    }

    return this.repositoriesById.get(id)?.name ?? null;
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
