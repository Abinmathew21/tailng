import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { TngAutocompleteComponent, TngCodeBlockComponent } from '@tailng-ui/components';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../autocomplete.util';

interface CountryOption {
  readonly code: string;
  readonly label: string;
}

const COUNTRY_OPTIONS: readonly CountryOption[] = Object.freeze([
  { code: 'ca', label: 'Canada' },
  { code: 'de', label: 'Germany' },
  { code: 'id', label: 'Indonesia' },
  { code: 'in', label: 'India' },
  { code: 'jp', label: 'Japan' },
  { code: 'mx', label: 'Mexico' },
  { code: 'es', label: 'Spain' },
]);

const COMPONENT_IMPORT_CODE = String.raw`import { TngAutocompleteComponent } from '@tailng-ui/components';`;

const BASIC_USAGE_CODE = String.raw`<tng-autocomplete
  [options]="filteredCountries()"
  [value]="selectedCountry()"
  (valueChange)="onSelectedCountryChange($event)"
  [query]="countryQuery()"
  (queryChange)="countryQuery.set($event)"
  [getOptionValue]="getCountryValue"
  [getOptionLabel]="getCountryLabel"
  placeholder="Search countries"
  [ariaLabel]="'Country directory'"
></tng-autocomplete>
`;

const PLAIN_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import { TngAutocompleteComponent } from '@tailng-ui/components';

interface CountryOption {
  readonly code: string;
  readonly label: string;
}

const COUNTRY_OPTIONS: readonly CountryOption[] = Object.freeze([
  { code: 'ca', label: 'Canada' },
  { code: 'de', label: 'Germany' },
  { code: 'id', label: 'Indonesia' },
  { code: 'in', label: 'India' },
  { code: 'jp', label: 'Japan' },
  { code: 'mx', label: 'Mexico' },
  { code: 'es', label: 'Spain' },
]);

@Component({
  selector: 'app-docs-autocomplete-overview-plain',
  standalone: true,
  imports: [TngAutocompleteComponent],
  templateUrl: './autocomplete-overview-plain.component.html',
  styleUrl: './autocomplete-overview-plain.component.css',
})
export class DocsAutocompleteOverviewPlainComponent {
  readonly countries = COUNTRY_OPTIONS;
  readonly selectedCountry = signal<string | null>('in');
  readonly countryQuery = signal('');
  readonly filteredCountries = computed(() => {
    const query = this.countryQuery().toLowerCase().trim();

    if (!query) {
      return this.countries;
    }

    return this.countries.filter((country) =>
      country.label.toLowerCase().includes(query),
    );
  });
  readonly selectedLabel = computed(
    () => this.countries.find((country) => country.code === this.selectedCountry())?.label ?? 'none',
  );
  readonly getCountryValue = (country: CountryOption) => country.code;
  readonly getCountryLabel = (country: CountryOption) => country.label;

  onSelectedCountryChange(value: string | null): void {
    this.selectedCountry.set(typeof value === 'string' ? value : null);
  }
}
`;

const PLAIN_HTML_CODE = String.raw`<section class="docs-autocomplete-overview-example">
  <div class="docs-autocomplete-overview-example__header">
    <span class="docs-autocomplete-overview-example__eyebrow">Country directory</span>
    <p class="docs-autocomplete-overview-example__copy">
      Wrapper-first autocomplete for standard country search.
    </p>
  </div>

  <div class="docs-autocomplete-overview-example__control">
    <tng-autocomplete
      [options]="filteredCountries()"
      [value]="selectedCountry()"
      (valueChange)="onSelectedCountryChange($event)"
      [query]="countryQuery()"
      (queryChange)="countryQuery.set($event)"
      [getOptionValue]="getCountryValue"
      [getOptionLabel]="getCountryLabel"
      placeholder="Type Ind to filter"
      [ariaLabel]="'Country directory'"
    ></tng-autocomplete>
  </div>

  <p class="docs-autocomplete-overview-example__summary">
    Selected: {{ selectedLabel() }}
  </p>
</section>
`;

const PLAIN_CSS_CODE = String.raw`.docs-autocomplete-overview-example {
  display: grid;
  gap: 0.85rem;
  inline-size: min(100%, 34rem);
  margin-inline: auto;
  padding: 1rem;
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 1rem;
  background: var(--tng-semantic-background-surface);
  color: var(--tng-semantic-foreground-primary);
}

.docs-autocomplete-overview-example__header {
  display: grid;
  gap: 0.35rem;
}

.docs-autocomplete-overview-example__eyebrow {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--tng-semantic-foreground-muted);
}

.docs-autocomplete-overview-example__copy,
.docs-autocomplete-overview-example__summary {
  margin: 0;
  color: var(--tng-semantic-foreground-secondary);
}

/* Host-level tokens – the component base CSS consumes them automatically. */
.docs-autocomplete-overview-example__control {
  display: block;
  width: 100%;
  min-width: 0;
}

.docs-autocomplete-overview-example__control tng-autocomplete {
  width: 100%;
  min-width: 0;
}
`;

const TAILWIND_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import { TngAutocompleteComponent } from '@tailng-ui/components';

interface CountryOption {
  readonly code: string;
  readonly label: string;
}

const COUNTRY_OPTIONS: readonly CountryOption[] = Object.freeze([
  { code: 'ca', label: 'Canada' },
  { code: 'de', label: 'Germany' },
  { code: 'id', label: 'Indonesia' },
  { code: 'in', label: 'India' },
  { code: 'jp', label: 'Japan' },
  { code: 'mx', label: 'Mexico' },
  { code: 'es', label: 'Spain' },
]);

@Component({
  selector: 'app-docs-autocomplete-overview-tailwind',
  standalone: true,
  imports: [TngAutocompleteComponent],
  templateUrl: './autocomplete-overview-tailwind.component.html',
  styleUrl: './autocomplete-overview-tailwind.component.css',
})
export class DocsAutocompleteOverviewTailwindComponent {
  readonly countries = COUNTRY_OPTIONS;
  readonly selectedCountry = signal<string | null>('de');
  readonly countryQuery = signal('');
  readonly filteredCountries = computed(() => {
    const query = this.countryQuery().toLowerCase().trim();

    if (!query) {
      return this.countries;
    }

    return this.countries.filter((country) =>
      country.label.toLowerCase().includes(query),
    );
  });
  readonly selectedLabel = computed(
    () => this.countries.find((country) => country.code === this.selectedCountry())?.label ?? 'none',
  );
  readonly getCountryValue = (country: CountryOption) => country.code;
  readonly getCountryLabel = (country: CountryOption) => country.label;

  onSelectedCountryChange(value: string | null): void {
    this.selectedCountry.set(typeof value === 'string' ? value : null);
  }
}
`;

const TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid max-w-[34rem] gap-4 rounded-3xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-5 text-[var(--tng-semantic-foreground-primary)] shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold text-[var(--tng-semantic-foreground-muted)]">Country directory</span>
    <p class="m-0 text-sm text-[var(--tng-semantic-foreground-secondary)]">
      Wrapper-first autocomplete for standard country search.
    </p>
  </div>

  <div class="block min-w-0 w-full">
    <tng-autocomplete
      [options]="filteredCountries()"
      [value]="selectedCountry()"
      (valueChange)="onSelectedCountryChange($event)"
      [query]="countryQuery()"
      (queryChange)="countryQuery.set($event)"
      [getOptionValue]="getCountryValue"
      [getOptionLabel]="getCountryLabel"
      placeholder="Type Ind to filter"
      [ariaLabel]="'Country directory'"
    ></tng-autocomplete>
  </div>

  <p class="m-0 text-xs text-[var(--tng-semantic-foreground-secondary)]">Selected: {{ selectedLabel() }}</p>
</section>
`;

const TAILWIND_CSS_CODE = '/* Tokens are applied via Tailwind arbitrary properties in the template. */\n/* The component base CSS consumes them automatically. */';

function resolveCountryLabel(value: string | null): string {
  return COUNTRY_OPTIONS.find((country) => country.code === value)?.label ?? 'none';
}

function filterCountries(query: string): readonly CountryOption[] {
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) {
    return COUNTRY_OPTIONS;
  }

  return COUNTRY_OPTIONS.filter((country) =>
    country.label.toLowerCase().includes(normalizedQuery),
  );
}

@Component({
  selector: 'app-autocomplete-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngAutocompleteComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './autocomplete-overview-page.component.html',
  styleUrl: './autocomplete-overview-page.component.css',
})
export class AutocompleteOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;
  protected readonly countries = COUNTRY_OPTIONS;
  protected readonly getCountryValue = (country: CountryOption) => country.code;
  protected readonly getCountryLabel = (country: CountryOption) => country.label;
  protected readonly plainCountry = signal<string | null>('in');
  protected readonly tailwindCountry = signal<string | null>('de');
  protected readonly plainCountryQuery = signal('');
  protected readonly tailwindCountryQuery = signal('');
  protected readonly plainSummary = computed(() => resolveCountryLabel(this.plainCountry()));
  protected readonly tailwindSummary = computed(() => resolveCountryLabel(this.tailwindCountry()));
  protected readonly filteredPlainCountries = computed(() => filterCountries(this.plainCountryQuery()));
  protected readonly filteredTailwindCountries = computed(() =>
    filterCountries(this.tailwindCountryQuery()),
  );
  protected readonly componentImportCode = COMPONENT_IMPORT_CODE;
  protected readonly basicUsageCode = BASIC_USAGE_CODE;

  protected readonly plainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'autocomplete-overview-plain.component.ts', code: PLAIN_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'autocomplete-overview-plain.component.html', code: PLAIN_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'autocomplete-overview-plain.component.css', code: PLAIN_CSS_CODE },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'autocomplete-overview-tailwind.component.ts', code: TAILWIND_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'autocomplete-overview-tailwind.component.html', code: TAILWIND_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'autocomplete-overview-tailwind.component.css', code: TAILWIND_CSS_CODE },
  ]);

  protected onPlainCountryChange(value: unknown): void {
    this.plainCountry.set(typeof value === 'string' ? value : null);
  }

  protected onTailwindCountryChange(value: unknown): void {
    this.tailwindCountry.set(typeof value === 'string' ? value : null);
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
