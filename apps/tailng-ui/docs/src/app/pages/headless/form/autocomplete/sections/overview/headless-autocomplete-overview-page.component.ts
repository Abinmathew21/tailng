import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
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

const PRIMITIVE_IMPORT_CODE = String.raw`import {
  TngAutocomplete,
  TngAutocompleteTrigger,
  TngAutocompleteTriggerContainer,
  TngAutocompleteIcon,
  TngAutocompleteContent,
  TngAutocompleteOverlay,
  TngAutocompleteListbox,
  TngAutocompleteOption,
} from '@tailng-ui/primitives';
`;

const BASIC_USAGE_CODE = String.raw`<section
  tngAutocomplete
  [open]="open()"
  (openChange)="open.set($event)"
  [value]="selectedCountry()"
  (valueChange)="selectedCountry.set($event)"
  [query]="query()"
  (queryChange)="query.set($event)"
>
  <div tngAutocompleteTriggerContainer>
    <input
      tngAutocompleteTrigger
      type="text"
      [value]="displayText()"
      (input)="onInput($event)"
      aria-label="Country directory"
      placeholder="Search countries"
    />
    <span tngAutocompleteIcon aria-hidden="true">▾</span>
  </div>

    <div tngAutocompleteContent class="contents">
    <div tngAutocompleteOverlay>
      <ul tngAutocompleteListbox [value]="selectedCountry()">
        @for (country of filteredCountries(); track country.code) {
          <li tngAutocompleteOption [tngValue]="country.code">{{ country.label }}</li>
        }
      </ul>
    </div>
  </div>
</section>
`;

const PLAIN_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
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
  selector: 'app-headless-autocomplete-overview-plain',
  standalone: true,
  imports: [
    TngAutocomplete,
    TngAutocompleteTrigger,
    TngAutocompleteTriggerContainer,
    TngAutocompleteIcon,
    TngAutocompleteContent,
    TngAutocompleteOverlay,
    TngAutocompleteListbox,
    TngAutocompleteOption,
  ],
  templateUrl: './headless-autocomplete-overview-plain.component.html',
  styleUrl: './headless-autocomplete-overview-plain.component.css',
})
export class HeadlessAutocompleteOverviewPlainComponent {
  readonly countries = COUNTRY_OPTIONS;
  readonly open = signal(false);
  readonly selectedCountry = signal<string | null>('in');
  readonly query = signal('');

  readonly filteredCountries = computed(() => {
    const normalizedQuery = this.query().trim().toLowerCase();
    if (normalizedQuery === '') {
      return this.countries;
    }

    return this.countries.filter((country) =>
      country.label.toLowerCase().includes(normalizedQuery),
    );
  });

  readonly selectedLabel = computed(
    () => this.countries.find((country) => country.code === this.selectedCountry())?.label ?? 'none',
  );

  readonly displayText = computed(() => {
    if (this.open()) {
      return this.query();
    }

    return this.selectedLabel() === 'none' ? '' : this.selectedLabel();
  });

  onInput(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }
}
`;

const PLAIN_HTML_CODE = String.raw`<section class="headless-autocomplete-overview-example">
  <span class="headless-autocomplete-overview-label">Country directory</span>

  <section
    tngAutocomplete
    class="headless-autocomplete-overview-control"
    [open]="open()"
    (openChange)="open.set($event)"
    [value]="selectedCountry()"
    (valueChange)="selectedCountry.set($event)"
    [query]="query()"
    (queryChange)="query.set($event)"
  >
    <div tngAutocompleteTriggerContainer class="headless-autocomplete-overview-trigger">
      <input
        tngAutocompleteTrigger
        type="text"
        [value]="displayText()"
        (input)="onInput($event)"
        aria-label="Country directory"
        placeholder="Type Ind to filter"
      />
      <span tngAutocompleteIcon aria-hidden="true">▾</span>
    </div>

    <div tngAutocompleteContent class="contents">
      <div tngAutocompleteOverlay class="headless-autocomplete-overview-plain-overlay">
        <ul tngAutocompleteListbox [value]="selectedCountry()">
          @for (country of filteredCountries(); track country.code) {
            <li
              tngAutocompleteOption
              class="headless-autocomplete-overview-plain-option"
              [tngValue]="country.code"
            >
              {{ country.label }}
            </li>
          }
          @if (filteredCountries().length === 0) {
            <li data-slot="autocomplete-empty">No matches</li>
          }
        </ul>
      </div>
    </div>
  </section>

  <p class="headless-autocomplete-overview-summary">Selected: {{ selectedLabel() }}</p>
</section>
`;

const PLAIN_CSS_CODE = String.raw`.headless-autocomplete-overview-example {
  display: grid;
  gap: 0.75rem;
  inline-size: min(100%, 32rem);
  margin-inline: auto;
}

.headless-autocomplete-overview-label {
  color: #64748b;
  font-size: 0.82rem;
  font-weight: 700;
}

.headless-autocomplete-overview-control {
  display: grid;
  gap: 0.5rem;
}

.headless-autocomplete-overview-trigger {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  min-height: 2.875rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.9rem;
  background: #ffffff;
  transition: border-color 140ms ease, box-shadow 140ms ease;
}

.headless-autocomplete-overview-trigger:has(:focus-visible) {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14);
}

.headless-autocomplete-overview-trigger [data-slot='autocomplete-trigger'] {
  flex: 1;
  min-width: 0;
  padding: 0.72rem 1rem;
  border: 0;
  background: transparent;
  color: #0f172a;
  outline: none;
}

.headless-autocomplete-overview-trigger [data-slot='autocomplete-trigger']::placeholder {
  color: #94a3b8;
}

.headless-autocomplete-overview-trigger [data-slot='autocomplete-icon'] {
  margin-inline-end: 1rem;
  color: #64748b;
}

.headless-autocomplete-overview-plain-overlay {
  border: 1px solid #cbd5e1;
  border-radius: 1rem;
  background: #ffffff;
  max-inline-size: min(92vw, 24rem);
  overflow: auto;
  box-shadow: 0 18px 40px -30px rgba(15, 23, 42, 0.28);
  padding: 0.5rem;
}

.headless-autocomplete-overview-plain-overlay [data-slot='autocomplete-listbox'] {
  display: grid;
  gap: 0.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.headless-autocomplete-overview-plain-option {
  border: 1px solid transparent;
  border-radius: 0.75rem;
  padding: 0.7rem 0.85rem;
  color: #0f172a;
}

.headless-autocomplete-overview-plain-option[data-active] {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.headless-autocomplete-overview-plain-option[data-selected] {
  background: #dbeafe;
  border-color: #93c5fd;
  color: #1d4ed8;
  font-weight: 600;
}

.headless-autocomplete-overview-summary {
  margin: 0;
  color: #475569;
  font-size: 0.82rem;
}
`;

const TAILWIND_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
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
  selector: 'app-headless-autocomplete-overview-tailwind',
  standalone: true,
  imports: [
    TngAutocomplete,
    TngAutocompleteTrigger,
    TngAutocompleteTriggerContainer,
    TngAutocompleteIcon,
    TngAutocompleteContent,
    TngAutocompleteOverlay,
    TngAutocompleteListbox,
    TngAutocompleteOption,
  ],
  templateUrl: './headless-autocomplete-overview-tailwind.component.html',
  styleUrl: './headless-autocomplete-overview-tailwind.component.css',
})
export class HeadlessAutocompleteOverviewTailwindComponent {
  readonly countries = COUNTRY_OPTIONS;
  readonly open = signal(false);
  readonly selectedCountry = signal<string | null>('id');
  readonly query = signal('');

  readonly filteredCountries = computed(() => {
    const normalizedQuery = this.query().trim().toLowerCase();
    if (normalizedQuery === '') {
      return this.countries;
    }

    return this.countries.filter((country) =>
      country.label.toLowerCase().includes(normalizedQuery),
    );
  });

  readonly selectedLabel = computed(
    () => this.countries.find((country) => country.code === this.selectedCountry())?.label ?? 'none',
  );

  readonly displayText = computed(() => {
    if (this.open()) {
      return this.query();
    }

    return this.selectedLabel() === 'none' ? '' : this.selectedLabel();
  });

  onInput(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }
}
`;

const TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid max-w-[32rem] gap-3">
  <span class="text-xs font-semibold text-slate-500">Country directory</span>

  <section
    tngAutocomplete
    class="grid gap-2"
    [open]="open()"
    (openChange)="open.set($event)"
    [value]="selectedCountry()"
    (valueChange)="selectedCountry.set($event)"
    [query]="query()"
    (queryChange)="query.set($event)"
  >
    <div
      tngAutocompleteTriggerContainer
      class="flex min-h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-white shadow-sm transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10"
    >
      <input
        tngAutocompleteTrigger
        type="text"
        class="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
        [value]="displayText()"
        (input)="onInput($event)"
        aria-label="Country directory"
        placeholder="Type Ind to filter"
      />
      <span tngAutocompleteIcon aria-hidden="true" class="mr-4 text-slate-400">▾</span>
    </div>

    <div tngAutocompleteContent class="contents">
      <div
        tngAutocompleteOverlay
        class="rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/10"
      >
        <ul tngAutocompleteListbox [value]="selectedCountry()" class="grid gap-1">
          @for (country of filteredCountries(); track country.code) {
            <li
              tngAutocompleteOption
              class="rounded-xl border border-transparent px-3 py-2 text-sm text-slate-700 transition data-[active]:border-slate-200 data-[active]:bg-slate-50 data-[selected]:border-blue-200 data-[selected]:bg-blue-50 data-[selected]:font-semibold data-[selected]:text-blue-700"
              [tngValue]="country.code"
            >
              {{ country.label }}
            </li>
          }
          @if (filteredCountries().length === 0) {
            <li data-slot="autocomplete-empty" class="px-3 py-2 text-sm text-slate-500">No matches</li>
          }
        </ul>
      </div>
    </div>
  </section>

  <p class="m-0 text-xs text-slate-600">Selected: {{ selectedLabel() }}</p>
</section>
`;

const TAILWIND_CSS_CODE = String.raw`/* No additional CSS file is required for this Tailwind example. */
`;

function findCountryLabel(code: string | null): string | null {
  if (code === null) {
    return null;
  }

  return COUNTRY_OPTIONS.find((country) => country.code === code)?.label ?? null;
}

function filterCountries(query: string): readonly CountryOption[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (normalizedQuery === '') {
    return COUNTRY_OPTIONS;
  }

  return COUNTRY_OPTIONS.filter((country) => country.label.toLowerCase().includes(normalizedQuery));
}

@Component({
  selector: 'app-headless-autocomplete-overview-page',
  imports: [
    TngCodeBlockComponent,
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
  templateUrl: './headless-autocomplete-overview-page.component.html',
  styleUrl: './headless-autocomplete-overview-page.component.css',
})
export class HeadlessAutocompleteOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;

  protected readonly primitiveImportCode = PRIMITIVE_IMPORT_CODE;
  protected readonly basicUsageCode = BASIC_USAGE_CODE;

  protected readonly plainOpen = signal(false);
  protected readonly plainValue = signal<string | null>('in');
  protected readonly plainQuery = signal('');
  protected readonly tailwindOpen = signal(false);
  protected readonly tailwindValue = signal<string | null>('id');
  protected readonly tailwindQuery = signal('');

  protected readonly plainDisplayText = computed(() =>
    this.plainOpen() ? this.plainQuery() : (findCountryLabel(this.plainValue()) ?? ''),
  );
  protected readonly plainFilteredCountries = computed(() => filterCountries(this.plainQuery()));
  protected readonly plainSelectedLabel = computed(() => findCountryLabel(this.plainValue()) ?? 'none');

  protected readonly tailwindDisplayText = computed(() =>
    this.tailwindOpen() ? this.tailwindQuery() : (findCountryLabel(this.tailwindValue()) ?? ''),
  );
  protected readonly tailwindFilteredCountries = computed(() => filterCountries(this.tailwindQuery()));
  protected readonly tailwindSelectedLabel = computed(() => findCountryLabel(this.tailwindValue()) ?? 'none');

  protected readonly plainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'headless-autocomplete-overview-plain.component.ts', code: PLAIN_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'headless-autocomplete-overview-plain.component.html', code: PLAIN_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'headless-autocomplete-overview-plain.component.css', code: PLAIN_CSS_CODE },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'headless-autocomplete-overview-tailwind.component.ts', code: TAILWIND_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'headless-autocomplete-overview-tailwind.component.html', code: TAILWIND_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'headless-autocomplete-overview-tailwind.component.css', code: TAILWIND_CSS_CODE },
  ]);

  protected onPlainInput(event: Event): void {
    this.plainQuery.set((event.target as HTMLInputElement).value);
  }

  protected onTailwindInput(event: Event): void {
    this.tailwindQuery.set((event.target as HTMLInputElement).value);
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
