import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  TngMultiAutocomplete,
  TngMultiAutocompleteChip,
  TngMultiAutocompleteContent,
  TngMultiAutocompleteListbox,
  TngMultiAutocompleteOption,
  TngMultiAutocompleteOverlay,
  TngMultiAutocompleteTrigger,
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
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../multi-autocomplete.util';

interface MarketOption {
  readonly code: string;
  readonly label: string;
  readonly region: string;
}

type MultiAutocompleteValueChange = unknown;

const MARKET_OPTIONS: readonly MarketOption[] = Object.freeze([
  { code: 'ca', label: 'Canada', region: 'North America' },
  { code: 'de', label: 'Germany', region: 'Europe' },
  { code: 'id', label: 'Indonesia', region: 'Asia Pacific' },
  { code: 'in', label: 'India', region: 'Asia Pacific' },
  { code: 'jp', label: 'Japan', region: 'Asia Pacific' },
  { code: 'mx', label: 'Mexico', region: 'North America' },
  { code: 'es', label: 'Spain', region: 'Europe' },
]);

const PRIMITIVE_IMPORT_CODE = String.raw`import {
  TngMultiAutocomplete,
  TngMultiAutocompleteTrigger,
  TngMultiAutocompleteChip,
  TngMultiAutocompleteContent,
  TngMultiAutocompleteOverlay,
  TngMultiAutocompleteListbox,
  TngMultiAutocompleteOption,
} from '@tailng-ui/primitives';`;

const BASIC_USAGE_CODE = String.raw`<section
  tngMultiAutocomplete
  [open]="open()"
  (openChange)="open.set($event)"
  [query]="query()"
  (queryChange)="query.set($event)"
  [value]="selectedMarkets()"
  (valueChange)="selectedMarkets.set(toValueArray($event))"
>
  @for (code of selectedMarkets(); track code) {
    <span tngMultiAutocompleteChip [tngValue]="code">{{ resolveMarketLabel(code) }}</span>
  }

  <input
    tngMultiAutocompleteTrigger
    type="text"
    [value]="query()"
    (input)="onInput($event)"
    placeholder="Type Ind to filter"
    aria-label="Launch markets"
  />

  <div tngMultiAutocompleteContent class="contents">
    <div tngMultiAutocompleteOverlay>
      <ul tngMultiAutocompleteListbox [value]="selectedMarkets()">
        @for (market of filteredMarkets(); track market.code) {
          <li tngMultiAutocompleteOption [tngValue]="market.code">
            {{ market.label }}
          </li>
        }
      </ul>
    </div>
  </div>
</section>`;

const PLAIN_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import {
  TngMultiAutocomplete,
  TngMultiAutocompleteChip,
  TngMultiAutocompleteContent,
  TngMultiAutocompleteListbox,
  TngMultiAutocompleteOption,
  TngMultiAutocompleteOverlay,
  TngMultiAutocompleteTrigger,
} from '@tailng-ui/primitives';

interface LaunchMarketOption {
  readonly code: string;
  readonly label: string;
  readonly region: string;
}

const LAUNCH_MARKET_OPTIONS: readonly LaunchMarketOption[] = Object.freeze([
  { code: 'ca', label: 'Canada', region: 'North America' },
  { code: 'de', label: 'Germany', region: 'Europe' },
  { code: 'id', label: 'Indonesia', region: 'Asia Pacific' },
  { code: 'in', label: 'India', region: 'Asia Pacific' },
  { code: 'jp', label: 'Japan', region: 'Asia Pacific' },
  { code: 'mx', label: 'Mexico', region: 'North America' },
  { code: 'es', label: 'Spain', region: 'Europe' },
]);

@Component({
  selector: 'app-headless-multi-autocomplete-overview-plain',
  standalone: true,
  imports: [
    TngMultiAutocomplete,
    TngMultiAutocompleteTrigger,
    TngMultiAutocompleteChip,
    TngMultiAutocompleteContent,
    TngMultiAutocompleteOverlay,
    TngMultiAutocompleteListbox,
    TngMultiAutocompleteOption,
  ],
  templateUrl: './headless-multi-autocomplete-overview-plain.component.html',
  styleUrl: './headless-multi-autocomplete-overview-plain.component.css',
})
export class HeadlessMultiAutocompleteOverviewPlainComponent {
  readonly launchMarkets = LAUNCH_MARKET_OPTIONS;
  readonly open = signal(false);
  readonly query = signal('');
  readonly selectedMarkets = signal<readonly string[]>(['in', 'jp']);

  readonly filteredMarkets = computed(() => {
    const normalizedQuery = this.query().trim().toLowerCase();
    if (normalizedQuery === '') {
      return this.launchMarkets;
    }

    return this.launchMarkets.filter((market) =>
      (market.label + ' ' + market.region).toLowerCase().includes(normalizedQuery),
    );
  });

  readonly selectedSummary = computed(() => {
    if (this.selectedMarkets().length === 0) {
      return 'none';
    }

    return this.selectedMarkets()
      .map((code) => this.launchMarkets.find((market) => market.code === code)?.label ?? code)
      .join(', ');
  });

  onInput(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  onValueChange(value: unknown): void {
    this.selectedMarkets.set(this.toValueArray(value));
  }

  resolveMarketLabel(code: string): string {
    return this.launchMarkets.find((market) => market.code === code)?.label ?? code;
  }

  private toValueArray(value: unknown): readonly string[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map((item) => (typeof item === 'string' ? item : String(item)))
      .filter((item) => item.length > 0);
  }
}`;

const PLAIN_HTML_CODE = String.raw`<section class="docs-headless-multi-autocomplete-overview-plain-shell">
  <div class="docs-headless-multi-autocomplete-overview-plain-header">
    <span class="docs-headless-multi-autocomplete-overview-plain-kicker">Launch markets</span>
    <p class="docs-headless-multi-autocomplete-overview-plain-copy">
      Primitive-first shell with chips that stay visible while the trigger query filters the list.
    </p>
  </div>

  <section
    tngMultiAutocomplete
    class="docs-headless-multi-autocomplete-overview-plain-control"
    [open]="open()"
    (openChange)="open.set($event)"
    [query]="query()"
    (queryChange)="query.set($event)"
    [value]="selectedMarkets()"
    (valueChange)="onValueChange($event)"
  >
    @for (code of selectedMarkets(); track code) {
      <span
        tngMultiAutocompleteChip
        class="docs-headless-multi-autocomplete-overview-plain-chip"
        [tngValue]="code"
      >
        {{ resolveMarketLabel(code) }}
      </span>
    }

    <input
      tngMultiAutocompleteTrigger
      type="text"
      [value]="query()"
      (input)="onInput($event)"
      placeholder="Type Ind to filter"
      aria-label="Launch markets"
    />

    <div
      tngMultiAutocompleteContent
      class="docs-headless-multi-autocomplete-overview-plain-content"
    >
      <div class="docs-headless-multi-autocomplete-overview-plain-overlay" tngMultiAutocompleteOverlay>
        <ul tngMultiAutocompleteListbox [value]="selectedMarkets()">
          @for (market of filteredMarkets(); track market.code) {
            <li
              tngMultiAutocompleteOption
              class="docs-headless-multi-autocomplete-overview-plain-option"
              [tngValue]="market.code"
            >
              <span>{{ market.label }}</span>
              <small>{{ market.region }}</small>
            </li>
          }
        </ul>
      </div>
    </div>
  </section>

  <p class="docs-headless-multi-autocomplete-overview-plain-summary">
    Selected: {{ selectedSummary() }}
  </p>
</section>`;

const PLAIN_CSS_CODE = String.raw`.docs-headless-multi-autocomplete-overview-plain-shell {
  display: grid;
  gap: 0.9rem;
  inline-size: min(100%, 36rem);
  margin-inline: auto;
  padding: 1.15rem;
  border: 1px solid #d8e1ee;
  border-radius: 1.25rem;
  background: #ffffff;
  color: #0f172a;
  color-scheme: light;
  box-shadow: 0 12px 28px -28px rgba(15, 23, 42, 0.28);
}

.docs-headless-multi-autocomplete-overview-plain-header {
  display: grid;
  gap: 0.35rem;
}

.docs-headless-multi-autocomplete-overview-plain-kicker {
  font-size: 0.8rem;
  font-weight: 700;
  color: #64748b;
  letter-spacing: 0.01em;
}

.docs-headless-multi-autocomplete-overview-plain-copy,
.docs-headless-multi-autocomplete-overview-plain-summary {
  margin: 0;
  color: #475569;
  line-height: 1.55;
}

.docs-headless-multi-autocomplete-overview-plain-control {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  align-content: flex-start;
  gap: 0.5rem;
  min-height: 3.25rem;
  padding: 0.55rem;
  --tng-multi-autocomplete-bg: #f8fafc;
  --tng-multi-autocomplete-surface: #ffffff;
  --tng-multi-autocomplete-border: #cbd5e1;
  --tng-multi-autocomplete-border-strong: #c6d3e6;
  --tng-multi-autocomplete-fg: #0f172a;
  --tng-multi-autocomplete-muted: #64748b;
  --tng-multi-autocomplete-brand: #2563eb;
  --tng-multi-autocomplete-focus-ring: #2563eb;
  border: 1px solid #c6d3e6;
  border-radius: 1.15rem;
  background: linear-gradient(180deg, #f8fbff 0%, #f3f7fc 100%);
  position: relative;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.72);
}

.docs-headless-multi-autocomplete-overview-plain-control:has([data-slot='multi-autocomplete-trigger']:focus-visible),
.docs-headless-multi-autocomplete-overview-plain-control:has([data-slot='multi-autocomplete-chip']:focus-visible) {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14);
}

.docs-headless-multi-autocomplete-overview-plain-control [data-slot='multi-autocomplete-trigger'] {
  flex: 1 1 10rem;
  min-width: 10rem;
  padding: 0.55rem 0.4rem;
  border: 0;
  background: transparent;
  color: #0f172a;
  font-size: 1rem;
  outline: none;
}

.docs-headless-multi-autocomplete-overview-plain-control [data-slot='multi-autocomplete-trigger']::placeholder {
  color: #94a3b8;
}

.docs-headless-multi-autocomplete-overview-plain-content[data-slot='multi-autocomplete-content'] {
  position: absolute;
  inset-inline: 0;
  inset-block-start: calc(100% + 0.5rem);
  z-index: 20;
}

.docs-headless-multi-autocomplete-overview-plain-chip {
  display: inline-flex;
  align-items: center;
  min-height: 2.15rem;
  padding: 0.4rem 0.78rem;
  border: 1px solid #bfdbfe;
  border-radius: 999px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 0.92rem;
  font-weight: 600;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06);
}

.docs-headless-multi-autocomplete-overview-plain-overlay[data-slot='multi-autocomplete-overlay'] {
  max-inline-size: min(100vw - 2rem, 36rem);
  border: 1px solid #d8e1ee;
  border-radius: 1rem;
  background: #ffffff;
  overflow: hidden;
  box-shadow: 0 24px 40px -24px rgba(15, 23, 42, 0.24);
  padding: 0.5rem;
}

.docs-headless-multi-autocomplete-overview-plain-overlay [data-slot='multi-autocomplete-listbox'] {
  gap: 0.35rem;
}

.docs-headless-multi-autocomplete-overview-plain-option {
  display: grid;
  gap: 0.15rem;
  border: 1px solid transparent;
  border-radius: 0.95rem;
  padding: 0.82rem 1rem;
  color: #0f172a;
  background: #ffffff;
}

.docs-headless-multi-autocomplete-overview-plain-option[data-active] {
  background: #f8fbff;
  border-color: #d7e7fb;
}

.docs-headless-multi-autocomplete-overview-plain-option[data-selected] {
  background: #e8f1ff;
  border-color: #93c5fd;
  color: #1d4ed8;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.62);
}

.docs-headless-multi-autocomplete-overview-plain-option[data-selected][data-active] {
  background: #dbeafe;
  border-color: #60a5fa;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.72),
    0 0 0 1px rgba(37, 99, 235, 0.14);
}

.docs-headless-multi-autocomplete-overview-plain-option[data-selected] small {
  color: #2563eb;
}

.docs-headless-multi-autocomplete-overview-plain-option small {
  color: #64748b;
  font-size: 0.85rem;
}`;

const TAILWIND_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import {
  TngMultiAutocomplete,
  TngMultiAutocompleteChip,
  TngMultiAutocompleteContent,
  TngMultiAutocompleteListbox,
  TngMultiAutocompleteOption,
  TngMultiAutocompleteOverlay,
  TngMultiAutocompleteTrigger,
} from '@tailng-ui/primitives';

interface LaunchMarketOption {
  readonly code: string;
  readonly label: string;
  readonly region: string;
}

const LAUNCH_MARKET_OPTIONS: readonly LaunchMarketOption[] = Object.freeze([
  { code: 'ca', label: 'Canada', region: 'North America' },
  { code: 'de', label: 'Germany', region: 'Europe' },
  { code: 'id', label: 'Indonesia', region: 'Asia Pacific' },
  { code: 'in', label: 'India', region: 'Asia Pacific' },
  { code: 'jp', label: 'Japan', region: 'Asia Pacific' },
  { code: 'mx', label: 'Mexico', region: 'North America' },
  { code: 'es', label: 'Spain', region: 'Europe' },
]);

@Component({
  selector: 'app-headless-multi-autocomplete-overview-tailwind',
  standalone: true,
  imports: [
    TngMultiAutocomplete,
    TngMultiAutocompleteTrigger,
    TngMultiAutocompleteChip,
    TngMultiAutocompleteContent,
    TngMultiAutocompleteOverlay,
    TngMultiAutocompleteListbox,
    TngMultiAutocompleteOption,
  ],
  templateUrl: './headless-multi-autocomplete-overview-tailwind.component.html',
})
export class HeadlessMultiAutocompleteOverviewTailwindComponent {
  readonly launchMarkets = LAUNCH_MARKET_OPTIONS;
  readonly open = signal(false);
  readonly query = signal('');
  readonly selectedMarkets = signal<readonly string[]>(['ca', 'es']);

  readonly filteredMarkets = computed(() => {
    const normalizedQuery = this.query().trim().toLowerCase();
    if (normalizedQuery === '') {
      return this.launchMarkets;
    }

    return this.launchMarkets.filter((market) =>
      (market.label + ' ' + market.region).toLowerCase().includes(normalizedQuery),
    );
  });

  readonly selectedSummary = computed(() => {
    if (this.selectedMarkets().length === 0) {
      return 'none';
    }

    return this.selectedMarkets()
      .map((code) => this.launchMarkets.find((market) => market.code === code)?.label ?? code)
      .join(', ');
  });

  onInput(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  onValueChange(value: unknown): void {
    this.selectedMarkets.set(this.toValueArray(value));
  }

  resolveMarketLabel(code: string): string {
    return this.launchMarkets.find((market) => market.code === code)?.label ?? code;
  }

  private toValueArray(value: unknown): readonly string[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map((item) => (typeof item === 'string' ? item : String(item)))
      .filter((item) => item.length > 0);
  }
}`;

const TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid max-w-[36rem] gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Launch markets</span>
    <p class="m-0 text-sm text-slate-600">
      Primitive-first composition with a light shell and explicit chip treatment.
    </p>
  </div>

  <section
    tngMultiAutocomplete
    class="relative flex min-h-[3.25rem] min-w-0 flex-wrap items-center content-start gap-2 rounded-[1.35rem] border border-slate-300 bg-slate-50 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/15"
    [open]="open()"
    (openChange)="open.set($event)"
    [query]="query()"
    (queryChange)="query.set($event)"
    [value]="selectedMarkets()"
    (valueChange)="onValueChange($event)"
  >
    @for (code of selectedMarkets(); track code) {
      <span
        tngMultiAutocompleteChip
        class="inline-flex shrink-0 items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-semibold leading-5 text-blue-700 shadow-sm"
        [tngValue]="code"
      >
        {{ resolveMarketLabel(code) }}
      </span>
    }

    <input
      tngMultiAutocompleteTrigger
      type="text"
      class="basis-40 min-w-[9rem] flex-1 bg-transparent px-2 py-2 text-sm leading-6 text-slate-900 outline-none placeholder:text-slate-400"
      [value]="query()"
      (input)="onInput($event)"
      placeholder="Type Ind to filter"
      aria-label="Launch markets"
    />

    <div tngMultiAutocompleteContent class="absolute inset-x-0 top-[calc(100%+0.5rem)] z-20">
      <div
        tngMultiAutocompleteOverlay
        class="w-auto max-w-[calc(100vw-2rem)] overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white p-2 shadow-[0_24px_40px_-24px_rgba(15,23,42,0.24)]"
      >
        <ul tngMultiAutocompleteListbox class="m-0 grid max-h-64 list-none gap-1 overflow-auto p-0">
          @for (market of filteredMarkets(); track market.code) {
            <li
              tngMultiAutocompleteOption
              class="grid w-full gap-1 rounded-xl border border-transparent px-4 py-3 text-sm text-slate-900 transition hover:bg-slate-50 data-[active]:border-slate-200 data-[active]:bg-slate-50 data-[selected]:border-blue-300 data-[selected]:bg-blue-50 data-[selected]:font-medium data-[selected]:text-blue-700 data-[selected]:shadow-[inset_0_1px_0_rgba(255,255,255,0.62)] [&[data-selected][data-active]]:border-blue-500 [&[data-selected][data-active]]:bg-blue-100 [&[data-selected][data-active]]:text-blue-800 [&[data-selected][data-active]]:shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_0_0_2px_rgba(37,99,235,0.16)]"
              [tngValue]="market.code"
            >
              <span class="font-medium">{{ market.label }}</span>
              <small class="text-xs text-slate-500">{{ market.region }}</small>
            </li>
          }
        </ul>
      </div>
    </div>
  </section>

  <p class="m-0 text-xs text-slate-600">Selected: {{ selectedSummary() }}</p>
</section>`;

const TAILWIND_CSS_CODE = String.raw`/* No additional CSS file is required for this Tailwind example. */`;

@Component({
  selector: 'app-headless-multi-autocomplete-overview-page',
  imports: [
    TngCodeBlockComponent,
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
  templateUrl: './headless-multi-autocomplete-overview-page.component.html',
  styleUrl: './headless-multi-autocomplete-overview-page.component.css',
})
export class HeadlessMultiAutocompleteOverviewPageComponent implements OnDestroy {
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
  protected readonly markets = MARKET_OPTIONS;
  private readonly marketsByCode = new Map(this.markets.map((market) => [market.code, market]));

  protected readonly plainOpen = signal(false);
  protected readonly plainQuery = signal('');
  protected readonly plainValues = signal<readonly string[]>(['in', 'jp']);

  protected readonly tailwindOpen = signal(false);
  protected readonly tailwindQuery = signal('');
  protected readonly tailwindValues = signal<readonly string[]>(['ca', 'es']);

  protected readonly plainFilteredMarkets = computed(() =>
    this.filterMarkets(this.plainQuery()),
  );
  protected readonly tailwindFilteredMarkets = computed(() =>
    this.filterMarkets(this.tailwindQuery()),
  );
  protected readonly plainSummary = computed(() => this.formatSelection(this.plainValues()));
  protected readonly tailwindSummary = computed(() => this.formatSelection(this.tailwindValues()));

  protected readonly primitiveImportCode = PRIMITIVE_IMPORT_CODE;
  protected readonly basicUsageCode = BASIC_USAGE_CODE;
  protected readonly plainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'headless-multi-autocomplete-overview-plain.component.ts', code: PLAIN_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'headless-multi-autocomplete-overview-plain.component.html', code: PLAIN_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'headless-multi-autocomplete-overview-plain.component.css', code: PLAIN_CSS_CODE },
  ]);
  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'headless-multi-autocomplete-overview-tailwind.component.ts', code: TAILWIND_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'headless-multi-autocomplete-overview-tailwind.component.html', code: TAILWIND_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'headless-multi-autocomplete-overview-tailwind.component.css', code: TAILWIND_CSS_CODE },
  ]);

  protected onPlainInput(event: Event): void {
    this.plainQuery.set((event.target as HTMLInputElement).value);
  }

  protected onPlainValueChange(value: MultiAutocompleteValueChange): void {
    this.plainValues.set(this.toValueArray(value));
  }

  protected onTailwindInput(event: Event): void {
    this.tailwindQuery.set((event.target as HTMLInputElement).value);
  }

  protected onTailwindValueChange(value: MultiAutocompleteValueChange): void {
    this.tailwindValues.set(this.toValueArray(value));
  }

  protected resolveMarketLabel(code: string): string {
    return this.marketsByCode.get(code)?.label ?? code;
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  private filterMarkets(query: string): readonly MarketOption[] {
    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery === '') {
      return this.markets;
    }

    return this.markets.filter((market) =>
      `${market.label} ${market.region}`.toLowerCase().includes(normalizedQuery),
    );
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

    return values.map((value) => this.resolveMarketLabel(value)).join(', ');
  }
}
