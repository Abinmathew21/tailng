import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy, type OnInit } from '@angular/core';
import { TngAutocompleteComponent, TngCodeBlockComponent } from '@tailng-ui/components';
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

type AutocompleteValueChange = unknown;

@Component({
  selector: 'app-autocomplete-overview-page',
  imports: [
    TngCodeBlockComponent,
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
  templateUrl: './autocomplete-overview-page.component.html',
  styleUrl: './autocomplete-overview-page.component.css',
})
export class AutocompleteOverviewPageComponent implements OnDestroy, OnInit {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  protected readonly countries = signal<readonly CountryOption[]>([]);
  private readonly countriesByCode = computed(() =>
    new Map(this.countries().map((country) => [country.code, country])),
  );
  protected readonly getCountryValue = (country: CountryOption) => country.code;
  protected readonly getCountryLabel = (country: CountryOption) => country.label;

  protected readonly headlessOpen = signal(false);
  protected readonly headlessValue = signal<string | null>(null);
  protected readonly headlessQuery = signal('');

  protected readonly plainValue = signal<string | null>('id');
  protected readonly tailwindValue = signal<string | null>('in');

  protected readonly headlessDisplayText = computed(() => {
    if (this.headlessOpen()) {
      return this.headlessQuery();
    }

    return this.resolveCountryLabel(this.headlessValue()) ?? '';
  });

  protected readonly headlessFilteredCountries = computed<readonly CountryOption[]>(() => {
    const query = this.headlessQuery().trim().toLowerCase();
    const list = this.countries();
    if (query === '') {
      return list;
    }

    return list.filter((country) => country.label.toLowerCase().includes(query));
  });

  protected readonly headlessSelectedLabel = computed(
    () => this.resolveCountryLabel(this.headlessValue()) ?? 'none',
  );
  protected readonly plainSelectedLabel = computed(
    () => this.resolveCountryLabel(this.plainValue()) ?? 'none',
  );
  protected readonly tailwindSelectedLabel = computed(
    () => this.resolveCountryLabel(this.tailwindValue()) ?? 'none',
  );

  protected readonly primitiveImportCode = [
    'import {',
    '  TngAutocomplete,',
    '  TngAutocompleteTrigger,',
    '  TngAutocompleteTriggerContainer,',
    '  TngAutocompleteContent,',
    '  TngAutocompleteOverlay,',
    '  TngAutocompleteListbox,',
    '  TngAutocompleteOption,',
    "} from '@tailng-ui/primitives';",
    '',
  ].join('\n');

  protected readonly componentImportCode =
    "import { TngAutocompleteComponent } from '@tailng-ui/components';";

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'autocomplete-headless-country-filter.component.ts',
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
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'autocomplete-headless-country-filter.component.html',
      code: [
        '<div',
        '  tngAutocomplete',
        '  #api="tngAutocomplete"',
        '  [open]="open()"',
        '  (openChange)="open.set($event)"',
        '  [value]="value()"',
        '  (valueChange)="onValueChange($event)"',
        '>',
        '  <div tngAutocompleteTriggerContainer>',
        '    <input',
        '      tngAutocompleteTrigger',
        '      type="text"',
        '      [value]="displayText()"',
        '      (input)="onInput($event)"',
        '      placeholder="Type Ind to filter"',
        '      aria-label="Country filter"',
        '    />',
        '    <span tngAutocompleteIcon aria-hidden="true">▾</span>',
        '  </div>',
        '',
        '  <div tngAutocompleteContent>',
        '    <div tngAutocompleteOverlay>',
        '      <ul tngAutocompleteListbox [value]="api.value()">',
        '        @for (country of filteredCountries(); track country.code) {',
        '          <li tngAutocompleteOption [tngValue]="country.code">{{ country.label }}</li>',
        '        }',
        '      </ul>',
        '    </div>',
        '  </div>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'autocomplete-headless-country-filter.component.css',
      code: [
        '.autocomplete-preview-shell {',
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
      title: 'autocomplete-plain-css-country-filter.component.ts',
      code: [
        "readonly selectedCountry = signal<string | null>('id');",
        '',
        'onValueChange(value: string | readonly string[] | null): void {',
        '  this.selectedCountry.set(this.toSingleValue(value));',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'autocomplete-plain-css-country-filter.component.html',
      code: [
        '<div class="autocomplete-preview-shell autocomplete-preview-shell--plain">',
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
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'autocomplete-plain-css-country-filter.component.css',
      code: [
        '.autocomplete-preview-shell--plain {',
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
      title: 'autocomplete-tailwind-country-filter.component.ts',
      code: [
        "readonly selectedCountry = signal<string | null>('in');",
        '',
        'onValueChange(value: string | readonly string[] | null): void {',
        '  this.selectedCountry.set(this.toSingleValue(value));',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'autocomplete-tailwind-country-filter.component.html',
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
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'autocomplete-tailwind-country-filter.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected onHeadlessInput(event: Event): void {
    this.headlessQuery.set((event.target as HTMLInputElement).value);
  }

  protected onHeadlessOpenChange(open: boolean): void {
    this.headlessOpen.set(open);
    if (!open) {
      this.headlessQuery.set(this.resolveCountryLabel(this.headlessValue()) ?? '');
    }
  }

  protected onHeadlessValueChange(value: AutocompleteValueChange): void {
    const singleValue = this.toSingleValue(value);
    this.headlessValue.set(singleValue);
    this.headlessQuery.set(this.resolveCountryLabel(singleValue) ?? '');
  }

  protected onPlainValueChange(value: AutocompleteValueChange): void {
    this.plainValue.set(this.toSingleValue(value));
  }

  protected onTailwindValueChange(value: AutocompleteValueChange): void {
    this.tailwindValue.set(this.toSingleValue(value));
  }

  ngOnInit(): void {
    fetch('/assets/country-list.json')
      .then((r) => r.json())
      .then((data: Array<{ code: string; name: string }>) =>
        this.countries.set(
          data.map((c) => ({ code: c.code.toLowerCase(), label: c.name })),
        ),
      )
      .catch(() => this.countries.set([]));
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

    return this.countriesByCode().get(code)?.label ?? null;
  }

  protected readonly getCountryFlagUrl = (code: string): string =>
    `https://cdn.jsdelivr.net/npm/flag-icons@7.5.0/flags/4x3/${code.toLowerCase()}.svg`;

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
