import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngMultiAutocompleteComponent } from '@tailng-ui/components';
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

const MARKET_OPTIONS: readonly MarketOption[] = Object.freeze([
  { code: 'ca', label: 'Canada', region: 'North America' },
  { code: 'de', label: 'Germany', region: 'Europe' },
  { code: 'id', label: 'Indonesia', region: 'Asia Pacific' },
  { code: 'in', label: 'India', region: 'Asia Pacific' },
  { code: 'jp', label: 'Japan', region: 'Asia Pacific' },
  { code: 'mx', label: 'Mexico', region: 'North America' },
  { code: 'es', label: 'Spain', region: 'Europe' },
]);

const COMPONENT_IMPORT_CODE = String.raw`import { TngMultiAutocompleteComponent } from '@tailng-ui/components';`;

const BASIC_USAGE_CODE = String.raw`<tng-multi-autocomplete
  [options]="markets"
  [value]="selectedMarkets()"
  (valueChange)="onSelectedMarketsChange($event)"
  [getOptionValue]="getMarketValue"
  [getOptionLabel]="getMarketLabel"
  placeholder="Search launch markets"
  [ariaLabel]="'Launch markets'"
></tng-multi-autocomplete>`;

const PLAIN_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import { TngMultiAutocompleteComponent } from '@tailng-ui/components';

interface ComponentOverviewPlainLaunchMarketOption {
  readonly code: string;
  readonly label: string;
  readonly region: string;
}

const COMPONENT_OVERVIEW_PLAIN_LAUNCH_MARKET_OPTIONS: readonly ComponentOverviewPlainLaunchMarketOption[] = Object.freeze([
  { code: 'ca', label: 'Canada', region: 'North America' },
  { code: 'de', label: 'Germany', region: 'Europe' },
  { code: 'id', label: 'Indonesia', region: 'Asia Pacific' },
  { code: 'in', label: 'India', region: 'Asia Pacific' },
  { code: 'jp', label: 'Japan', region: 'Asia Pacific' },
  { code: 'mx', label: 'Mexico', region: 'North America' },
  { code: 'es', label: 'Spain', region: 'Europe' },
]);

@Component({
  selector: 'app-docs-multi-autocomplete-overview-plain',
  standalone: true,
  imports: [TngMultiAutocompleteComponent],
  templateUrl: './multi-autocomplete-overview-plain.component.html',
  styleUrl: './multi-autocomplete-overview-plain.component.css',
})
export class DocsMultiAutocompleteOverviewPlainComponent {
  readonly componentOverviewPlainLaunchMarkets = COMPONENT_OVERVIEW_PLAIN_LAUNCH_MARKET_OPTIONS;
  readonly componentOverviewPlainSelectedMarketCodes = signal<readonly string[]>(['in', 'jp']);
  readonly componentOverviewPlainSelectedMarketSummary = computed(() => {
    if (this.componentOverviewPlainSelectedMarketCodes().length === 0) {
      return 'none';
    }

    return this.componentOverviewPlainSelectedMarketCodes()
      .map((code) => this.componentOverviewPlainLaunchMarkets.find((market) => market.code === code)?.label ?? code)
      .join(', ');
  });
  readonly getComponentOverviewPlainMarketValue = (market: ComponentOverviewPlainLaunchMarketOption) => market.code;
  readonly getComponentOverviewPlainMarketLabel = (market: ComponentOverviewPlainLaunchMarketOption) => market.label;

  onComponentOverviewPlainSelectedMarketsChange(value: unknown): void {
    this.componentOverviewPlainSelectedMarketCodes.set(this.toComponentOverviewPlainValueArray(value));
  }

  private toComponentOverviewPlainValueArray(value: unknown): readonly string[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map((item) => (typeof item === 'string' ? item : String(item)))
      .filter((item) => item.length > 0);
  }
}`;

const PLAIN_HTML_CODE = String.raw`<section class="docs-multi-autocomplete-overview-plain-shell">
  <div class="docs-multi-autocomplete-overview-plain-header">
    <span class="docs-multi-autocomplete-overview-plain-kicker">Launch markets</span>
    <p class="docs-multi-autocomplete-overview-plain-copy">
      Wrapper-first multi selection with visible chips and a controlled value array.
    </p>
  </div>

  <tng-multi-autocomplete
    class="docs-multi-autocomplete-overview-plain-control"
    [options]="componentOverviewPlainLaunchMarkets"
    [value]="componentOverviewPlainSelectedMarketCodes()"
    (valueChange)="onComponentOverviewPlainSelectedMarketsChange($event)"
    [getOptionValue]="getComponentOverviewPlainMarketValue"
    [getOptionLabel]="getComponentOverviewPlainMarketLabel"
    placeholder="Search launch markets"
    [ariaLabel]="'Launch markets'"
  ></tng-multi-autocomplete>

  <p class="docs-multi-autocomplete-overview-plain-summary">Selected: {{ componentOverviewPlainSelectedMarketSummary() }}</p>
</section>`;

const PLAIN_CSS_CODE = String.raw`.docs-multi-autocomplete-overview-plain-shell {
  display: grid;
  gap: 0.9rem;
  inline-size: min(100%, 36rem);
  margin-inline: auto;
  padding: 1.1rem;
  border: 1px solid #cbd5e1;
  border-radius: 1.25rem;
  background: #ffffff;
  color: #0f172a;
  color-scheme: light;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);
}

.docs-multi-autocomplete-overview-plain-header {
  display: grid;
  gap: 0.35rem;
}

.docs-multi-autocomplete-overview-plain-kicker {
  font-size: 0.8rem;
  font-weight: 700;
  color: #64748b;
}

.docs-multi-autocomplete-overview-plain-copy,
.docs-multi-autocomplete-overview-plain-summary {
  margin: 0;
  color: #475569;
}

.docs-multi-autocomplete-overview-plain-control {
  display: block;
  width: 100%;
  min-width: 0;
  --tng-semantic-background-canvas: #ffffff;
  --tng-semantic-background-surface: #f8fafc;
  --tng-semantic-border-subtle: #d8e2ef;
  --tng-semantic-border-strong: #94a3b8;
  --tng-semantic-foreground-primary: #0f172a;
  --tng-semantic-foreground-secondary: #475569;
  --tng-semantic-foreground-muted: #64748b;
  --tng-semantic-accent-brand: #2563eb;
  --tng-semantic-focus-ring: #2563eb;
  --tng-multi-autocomplete-radius: 1rem;
  --tng-multi-autocomplete-padding: 0.5rem;
  --tng-multi-autocomplete-trigger-py: 0.45rem;
  --tng-multi-autocomplete-trigger-px: 0.5rem;
  --tng-multi-autocomplete-chip-py: 0.375rem;
  --tng-multi-autocomplete-chip-px: 0.75rem;
  --tng-multi-autocomplete-option-py: 0.625rem;
  --tng-multi-autocomplete-option-px: 0.875rem;
  --tng-multi-autocomplete-bg: #ffffff;
  --tng-multi-autocomplete-surface: #f8fafc;
  --tng-multi-autocomplete-border: #d8e2ef;
  --tng-multi-autocomplete-border-strong: #94a3b8;
  --tng-multi-autocomplete-fg: #0f172a;
  --tng-multi-autocomplete-muted: #64748b;
  --tng-multi-autocomplete-brand: #2563eb;
  --tng-multi-autocomplete-focus-ring: #2563eb;
}`;

const TAILWIND_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import { TngMultiAutocompleteComponent } from '@tailng-ui/components';

interface ComponentOverviewTailwindLaunchMarketOption {
  readonly code: string;
  readonly label: string;
  readonly region: string;
}

const COMPONENT_OVERVIEW_TAILWIND_LAUNCH_MARKET_OPTIONS: readonly ComponentOverviewTailwindLaunchMarketOption[] = Object.freeze([
  { code: 'ca', label: 'Canada', region: 'North America' },
  { code: 'de', label: 'Germany', region: 'Europe' },
  { code: 'id', label: 'Indonesia', region: 'Asia Pacific' },
  { code: 'in', label: 'India', region: 'Asia Pacific' },
  { code: 'jp', label: 'Japan', region: 'Asia Pacific' },
  { code: 'mx', label: 'Mexico', region: 'North America' },
  { code: 'es', label: 'Spain', region: 'Europe' },
]);

@Component({
  selector: 'app-docs-multi-autocomplete-overview-tailwind',
  standalone: true,
  imports: [TngMultiAutocompleteComponent],
  templateUrl: './multi-autocomplete-overview-tailwind.component.html',
  styleUrl: './multi-autocomplete-overview-tailwind.component.css',
})
export class DocsMultiAutocompleteOverviewTailwindComponent {
  readonly componentOverviewTailwindLaunchMarkets = COMPONENT_OVERVIEW_TAILWIND_LAUNCH_MARKET_OPTIONS;
  readonly componentOverviewTailwindSelectedMarketCodes = signal<readonly string[]>(['ca', 'es']);
  readonly componentOverviewTailwindSelectedMarketSummary = computed(() => {
    if (this.componentOverviewTailwindSelectedMarketCodes().length === 0) {
      return 'none';
    }

    return this.componentOverviewTailwindSelectedMarketCodes()
      .map((code) => this.componentOverviewTailwindLaunchMarkets.find((market) => market.code === code)?.label ?? code)
      .join(', ');
  });
  readonly getComponentOverviewTailwindMarketValue = (market: ComponentOverviewTailwindLaunchMarketOption) => market.code;
  readonly getComponentOverviewTailwindMarketLabel = (market: ComponentOverviewTailwindLaunchMarketOption) => market.label;

  onComponentOverviewTailwindSelectedMarketsChange(value: unknown): void {
    this.componentOverviewTailwindSelectedMarketCodes.set(this.toComponentOverviewTailwindValueArray(value));
  }

  private toComponentOverviewTailwindValueArray(value: unknown): readonly string[] {
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
      Wrapper-first multi selection with visible chips and a controlled value array.
    </p>
  </div>

  <tng-multi-autocomplete
    class="block w-full min-w-0 [--tng-semantic-background-canvas:#ffffff] [--tng-semantic-background-surface:#f8fafc] [--tng-semantic-border-subtle:#d8e2ef] [--tng-semantic-border-strong:#94a3b8] [--tng-semantic-foreground-primary:#0f172a] [--tng-semantic-foreground-secondary:#475569] [--tng-semantic-foreground-muted:#64748b] [--tng-semantic-accent-brand:#2563eb] [--tng-semantic-focus-ring:#2563eb] [--tng-multi-autocomplete-radius:1rem] [--tng-multi-autocomplete-padding:0.5rem] [--tng-multi-autocomplete-trigger-py:0.45rem] [--tng-multi-autocomplete-trigger-px:0.5rem] [--tng-multi-autocomplete-chip-py:0.375rem] [--tng-multi-autocomplete-chip-px:0.75rem] [--tng-multi-autocomplete-option-py:0.625rem] [--tng-multi-autocomplete-option-px:0.875rem] [--tng-multi-autocomplete-bg:#ffffff] [--tng-multi-autocomplete-surface:#f8fafc] [--tng-multi-autocomplete-border:#d8e2ef] [--tng-multi-autocomplete-border-strong:#94a3b8] [--tng-multi-autocomplete-fg:#0f172a] [--tng-multi-autocomplete-muted:#64748b] [--tng-multi-autocomplete-brand:#2563eb] [--tng-multi-autocomplete-focus-ring:#2563eb]"
    [options]="componentOverviewTailwindLaunchMarkets"
    [value]="componentOverviewTailwindSelectedMarketCodes()"
    (valueChange)="onComponentOverviewTailwindSelectedMarketsChange($event)"
    [getOptionValue]="getComponentOverviewTailwindMarketValue"
    [getOptionLabel]="getComponentOverviewTailwindMarketLabel"
    placeholder="Search launch markets"
    [ariaLabel]="'Launch markets'"
  ></tng-multi-autocomplete>

  <p class="m-0 text-xs text-slate-600">Selected: {{ componentOverviewTailwindSelectedMarketSummary() }}</p>
</section>`;

const TAILWIND_CSS_CODE = String.raw`/* No additional CSS file is required for this Tailwind example. */`;

@Component({
  selector: 'app-multi-autocomplete-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngMultiAutocompleteComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './multi-autocomplete-overview-page.component.html',
  styleUrl: './multi-autocomplete-overview-page.component.css',
})
export class MultiAutocompleteOverviewPageComponent implements OnDestroy {
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
  protected readonly getMarketValue = (market: MarketOption) => market.code;
  protected readonly getMarketLabel = (market: MarketOption) => market.label;
  protected readonly plainMarkets = signal<readonly string[]>(['in', 'jp']);
  protected readonly tailwindMarkets = signal<readonly string[]>(['ca', 'es']);
  protected readonly plainSummary = computed(() => this.formatSelection(this.plainMarkets()));
  protected readonly tailwindSummary = computed(() => this.formatSelection(this.tailwindMarkets()));

  protected readonly componentImportCode = COMPONENT_IMPORT_CODE;
  protected readonly basicUsageCode = BASIC_USAGE_CODE;
  protected readonly plainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'multi-autocomplete-overview-plain.component.ts', code: PLAIN_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'multi-autocomplete-overview-plain.component.html', code: PLAIN_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'multi-autocomplete-overview-plain.component.css', code: PLAIN_CSS_CODE },
  ]);
  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'multi-autocomplete-overview-tailwind.component.ts', code: TAILWIND_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'multi-autocomplete-overview-tailwind.component.html', code: TAILWIND_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'multi-autocomplete-overview-tailwind.component.css', code: TAILWIND_CSS_CODE },
  ]);

  protected onPlainMarketsChange(value: unknown): void {
    this.plainMarkets.set(this.toValueArray(value));
  }

  protected onTailwindMarketsChange(value: unknown): void {
    this.tailwindMarkets.set(this.toValueArray(value));
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  private toValueArray(value: unknown): readonly string[] {
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

    return values
      .map((value) => this.markets.find((market) => market.code === value)?.label ?? value)
      .join(', ');
  }
}
