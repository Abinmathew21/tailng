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
  [options]="countries"
  [value]="selectedCountry()"
  (valueChange)="onSelectedCountryChange($event)"
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

  <tng-autocomplete
    class="docs-autocomplete-overview-example__control"
    [options]="countries"
    [value]="selectedCountry()"
    (valueChange)="onSelectedCountryChange($event)"
    [getOptionValue]="getCountryValue"
    [getOptionLabel]="getCountryLabel"
    placeholder="Type Ind to filter"
    [ariaLabel]="'Country directory'"
  ></tng-autocomplete>

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
  border: 1px solid #cbd5e1;
  border-radius: 1rem;
  background: #ffffff;
  color: #0f172a;
  color-scheme: light;
}

.docs-autocomplete-overview-example__header {
  display: grid;
  gap: 0.35rem;
}

.docs-autocomplete-overview-example__eyebrow {
  font-size: 0.8rem;
  font-weight: 700;
  color: #64748b;
}

.docs-autocomplete-overview-example__copy,
.docs-autocomplete-overview-example__summary {
  margin: 0;
  color: #475569;
}

.docs-autocomplete-overview-example__control {
  display: block;
  width: 100%;
  min-width: 0;
  --tng-semantic-background-canvas: #ffffff;
  --tng-semantic-background-surface: #f1f5f9;
  --tng-semantic-border-subtle: #cbd5e1;
  --tng-semantic-border-strong: #94a3b8;
  --tng-semantic-foreground-primary: #0f172a;
  --tng-semantic-foreground-secondary: #475569;
  --tng-semantic-foreground-muted: #64748b;
  --tng-semantic-accent-brand: #2563eb;
  --tng-semantic-focus-ring: #2563eb;
  --tng-autocomplete-bg: #ffffff;
  --tng-autocomplete-surface: #f1f5f9;
  --tng-autocomplete-border: #cbd5e1;
  --tng-autocomplete-border-strong: #94a3b8;
  --tng-autocomplete-fg: #0f172a;
  --tng-autocomplete-muted: #64748b;
  --tng-autocomplete-brand: #2563eb;
  --tng-autocomplete-focus-ring: #2563eb;
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

const TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid max-w-[34rem] gap-4 rounded-3xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold text-slate-500">Country directory</span>
    <p class="m-0 text-sm text-slate-600">
      Wrapper-first autocomplete for standard country search.
    </p>
  </div>

  <tng-autocomplete
    class="block min-w-0 w-full [--tng-semantic-background-canvas:#ffffff] [--tng-semantic-background-surface:#f1f5f9] [--tng-semantic-border-subtle:#cbd5e1] [--tng-semantic-border-strong:#94a3b8] [--tng-semantic-foreground-primary:#0f172a] [--tng-semantic-foreground-secondary:#475569] [--tng-semantic-foreground-muted:#64748b] [--tng-semantic-accent-brand:#2563eb] [--tng-semantic-focus-ring:#2563eb] [--tng-autocomplete-bg:#ffffff] [--tng-autocomplete-surface:#f1f5f9] [--tng-autocomplete-border:#cbd5e1] [--tng-autocomplete-border-strong:#94a3b8] [--tng-autocomplete-fg:#0f172a] [--tng-autocomplete-muted:#64748b] [--tng-autocomplete-brand:#2563eb] [--tng-autocomplete-focus-ring:#2563eb]"
    [options]="countries"
    [value]="selectedCountry()"
    (valueChange)="onSelectedCountryChange($event)"
    [getOptionValue]="getCountryValue"
    [getOptionLabel]="getCountryLabel"
    placeholder="Type Ind to filter"
    [ariaLabel]="'Country directory'"
  ></tng-autocomplete>

  <p class="m-0 text-xs text-slate-600">Selected: {{ selectedLabel() }}</p>
</section>
`;

const TAILWIND_CSS_CODE = String.raw`/* No additional CSS file is required for this Tailwind example. */`;

function resolveCountryLabel(value: string | null): string {
  return COUNTRY_OPTIONS.find((country) => country.code === value)?.label ?? 'none';
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
  protected readonly plainSummary = computed(() => resolveCountryLabel(this.plainCountry()));
  protected readonly tailwindSummary = computed(() => resolveCountryLabel(this.tailwindCountry()));
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
