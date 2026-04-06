import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
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

interface ReviewerOption {
  readonly id: string;
  readonly name: string;
  readonly team: string;
  readonly disabled?: boolean;
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

const REVIEWER_OPTIONS: readonly ReviewerOption[] = Object.freeze([
  { id: 'abigail', name: 'Abigail Chen', team: 'Design systems' },
  { id: 'mina', name: 'Mina Lee', team: 'Core UI' },
  { id: 'omar', name: 'Omar Aziz', team: 'Compliance', disabled: true },
  { id: 'sanjay', name: 'Sanjay Patel', team: 'Documentation' },
]);

const MARKET_PLAIN_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
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
  selector: 'app-headless-multi-autocomplete-launch-markets-plain',
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
  templateUrl: './headless-multi-autocomplete-launch-markets-plain.component.html',
  styleUrl: './headless-multi-autocomplete-launch-markets-plain.component.css',
})
export class HeadlessMultiAutocompleteLaunchMarketsPlainComponent {
  readonly markets = LAUNCH_MARKET_OPTIONS;
  readonly open = signal(false);
  readonly query = signal('');
  readonly selectedMarkets = signal<readonly string[]>(['in', 'jp']);

  readonly filteredMarkets = computed(() => {
    const normalizedQuery = this.query().trim().toLowerCase();
    if (normalizedQuery === '') {
      return this.markets;
    }

    return this.markets.filter((market) =>
      (market.label + ' ' + market.region).toLowerCase().includes(normalizedQuery),
    );
  });

  readonly selectedSummary = computed(() => {
    if (this.selectedMarkets().length === 0) {
      return 'none';
    }

    return this.selectedMarkets()
      .map((code) => this.markets.find((market) => market.code === code)?.label ?? code)
      .join(', ');
  });

  onInput(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  onValueChange(value: unknown): void {
    this.selectedMarkets.set(this.toValueArray(value));
  }

  resolveMarketLabel(code: string): string {
    return this.markets.find((market) => market.code === code)?.label ?? code;
  }

  private toValueArray(value: unknown): readonly string[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value.map((item) => (typeof item === 'string' ? item : String(item))).filter(Boolean);
  }
}`;

const MARKET_PLAIN_HTML_CODE = String.raw`<section class="docs-headless-multi-autocomplete-launch-markets-plain-shell">
  <div class="docs-headless-multi-autocomplete-launch-markets-plain-header">
    <span class="docs-headless-multi-autocomplete-launch-markets-plain-kicker">Launch markets</span>
    <p class="docs-headless-multi-autocomplete-launch-markets-plain-copy">
      Pick multiple launch regions while keeping chips visible in the owned shell.
    </p>
  </div>

  <section
    tngMultiAutocomplete
    class="docs-headless-multi-autocomplete-launch-markets-plain-control"
    [open]="open()"
    (openChange)="open.set($event)"
    [query]="query()"
    (queryChange)="query.set($event)"
    [value]="selectedMarkets()"
    (valueChange)="onValueChange($event)"
  >
    @for (code of selectedMarkets(); track code) {
      <span tngMultiAutocompleteChip [tngValue]="code">{{ resolveMarketLabel(code) }}</span>
    }

    <input
      tngMultiAutocompleteTrigger
      type="text"
      [value]="query()"
      (input)="onInput($event)"
      placeholder="Search launch markets"
      aria-label="Launch markets"
    />

    <div tngMultiAutocompleteContent class="contents">
      <div class="docs-headless-multi-autocomplete-launch-markets-plain-overlay" tngMultiAutocompleteOverlay>
        <ul tngMultiAutocompleteListbox [value]="selectedMarkets()">
          @for (market of filteredMarkets(); track market.code) {
            <li tngMultiAutocompleteOption [tngValue]="market.code">
              <span>{{ market.label }}</span>
              <small>{{ market.region }}</small>
            </li>
          }
        </ul>
      </div>
    </div>
  </section>

  <p class="docs-headless-multi-autocomplete-launch-markets-plain-summary">Selected: {{ selectedSummary() }}</p>
</section>`;

const MARKET_PLAIN_CSS_CODE = String.raw`.docs-headless-multi-autocomplete-launch-markets-plain-shell {
  display: grid;
  gap: 0.9rem;
  inline-size: min(100%, 36rem);
  margin-inline: auto;
  padding: 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 1rem;
  background: #ffffff;
  color: #0f172a;
  color-scheme: light;
}

.docs-headless-multi-autocomplete-launch-markets-plain-header {
  display: grid;
  gap: 0.35rem;
}

.docs-headless-multi-autocomplete-launch-markets-plain-kicker {
  font-size: 0.8rem;
  font-weight: 700;
  color: #64748b;
}

.docs-headless-multi-autocomplete-launch-markets-plain-copy,
.docs-headless-multi-autocomplete-launch-markets-plain-summary {
  margin: 0;
  color: #475569;
}

.docs-headless-multi-autocomplete-launch-markets-plain-control {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  min-height: 3rem;
  padding: 0.45rem;
  border: 1px solid #94a3b8;
  border-radius: 1rem;
  background: #f8fafc;
}

.docs-headless-multi-autocomplete-launch-markets-plain-control [data-slot='multi-autocomplete-trigger'] {
  flex: 1 1 8rem;
  min-width: 8rem;
  border: 0;
  background: transparent;
  color: #0f172a;
  outline: none;
}

.docs-headless-multi-autocomplete-launch-markets-plain-overlay[data-slot='multi-autocomplete-overlay'] {
  max-inline-size: min(100vw - 2rem, 36rem);
  background: #ffffff;
}
`;

const MARKET_TAILWIND_TS_CODE = MARKET_PLAIN_TS_CODE.replace(/LaunchMarketsPlainComponent/g, 'LaunchMarketsTailwindComponent');
const MARKET_TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid max-w-[36rem] gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Launch markets</span>
    <p class="m-0 text-sm text-slate-600">Pick multiple launch regions while keeping chips visible in the owned shell.</p>
  </div>

  <section
    tngMultiAutocomplete
    class="relative flex min-h-12 flex-wrap gap-2 rounded-2xl border border-slate-300 bg-slate-50 p-2 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/15"
    [open]="open()"
    (openChange)="open.set($event)"
    [query]="query()"
    (queryChange)="query.set($event)"
    [value]="selectedMarkets()"
    (valueChange)="onValueChange($event)"
  >
    @for (code of selectedMarkets(); track code) {
      <span tngMultiAutocompleteChip class="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700" [tngValue]="code">
        {{ resolveMarketLabel(code) }}
      </span>
    }

    <input
      tngMultiAutocompleteTrigger
      type="text"
      class="min-w-[9rem] flex-1 bg-transparent px-2 py-1.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
      [value]="query()"
      (input)="onInput($event)"
      placeholder="Search launch markets"
      aria-label="Launch markets"
    />

    <div tngMultiAutocompleteContent class="contents">
      <div tngMultiAutocompleteOverlay class="max-w-[min(100vw-2rem,36rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
        <ul tngMultiAutocompleteListbox>
          @for (market of filteredMarkets(); track market.code) {
            <li tngMultiAutocompleteOption class="grid gap-1 rounded-xl px-4 py-3 text-sm text-slate-900" [tngValue]="market.code">
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
const MARKET_TAILWIND_CSS_CODE = String.raw`/* No additional CSS file is required for this Tailwind example. */`;

const REVIEWER_PLAIN_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import {
  TngMultiAutocomplete,
  TngMultiAutocompleteChip,
  TngMultiAutocompleteContent,
  TngMultiAutocompleteListbox,
  TngMultiAutocompleteOption,
  TngMultiAutocompleteOverlay,
  TngMultiAutocompleteTrigger,
} from '@tailng-ui/primitives';

interface ReviewerRosterOption {
  readonly id: string;
  readonly name: string;
  readonly team: string;
  readonly disabled?: boolean;
}

const REVIEWER_ROSTER_OPTIONS: readonly ReviewerRosterOption[] = Object.freeze([
  { id: 'abigail', name: 'Abigail Chen', team: 'Design systems' },
  { id: 'mina', name: 'Mina Lee', team: 'Core UI' },
  { id: 'omar', name: 'Omar Aziz', team: 'Compliance', disabled: true },
  { id: 'sanjay', name: 'Sanjay Patel', team: 'Documentation' },
]);

@Component({
  selector: 'app-headless-multi-autocomplete-reviewer-roster-plain',
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
  templateUrl: './headless-multi-autocomplete-reviewer-roster-plain.component.html',
  styleUrl: './headless-multi-autocomplete-reviewer-roster-plain.component.css',
})
export class HeadlessMultiAutocompleteReviewerRosterPlainComponent {
  readonly reviewers = REVIEWER_ROSTER_OPTIONS;
  readonly open = signal(false);
  readonly query = signal('');
  readonly selectedReviewers = signal<readonly string[]>(['abigail', 'sanjay']);

  readonly filteredReviewers = computed(() => {
    const normalizedQuery = this.query().trim().toLowerCase();
    if (normalizedQuery === '') {
      return this.reviewers;
    }

    return this.reviewers.filter((reviewer) =>
      (reviewer.name + ' ' + reviewer.team).toLowerCase().includes(normalizedQuery),
    );
  });

  readonly selectedSummary = computed(() => this.selectedReviewers().join(', '));

  onInput(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  onValueChange(value: unknown): void {
    this.selectedReviewers.set(this.toValueArray(value));
  }

  isReviewerDisabled(reviewer: ReviewerRosterOption): boolean {
    return reviewer.disabled === true;
  }

  private toValueArray(value: unknown): readonly string[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value.map((item) => (typeof item === 'string' ? item : String(item))).filter(Boolean);
  }
}`;

const REVIEWER_PLAIN_HTML_CODE = String.raw`<section class="docs-headless-multi-autocomplete-reviewer-roster-plain-shell">
  <div class="docs-headless-multi-autocomplete-reviewer-roster-plain-header">
    <span class="docs-headless-multi-autocomplete-reviewer-roster-plain-kicker">Release owner roster</span>
    <p class="docs-headless-multi-autocomplete-reviewer-roster-plain-copy">
      Disabled options stay visible so reviewers understand who is locked out of the current handoff.
    </p>
  </div>

  <section
    tngMultiAutocomplete
    class="docs-headless-multi-autocomplete-reviewer-roster-plain-control"
    [open]="open()"
    (openChange)="open.set($event)"
    [query]="query()"
    (queryChange)="query.set($event)"
    [value]="selectedReviewers()"
    (valueChange)="onValueChange($event)"
  >
    @for (id of selectedReviewers(); track id) {
      <span tngMultiAutocompleteChip [tngValue]="id">{{ id }}</span>
    }

    <input
      tngMultiAutocompleteTrigger
      type="text"
      [value]="query()"
      (input)="onInput($event)"
      placeholder="Search reviewers"
      aria-label="Release owner roster"
    />

    <div tngMultiAutocompleteContent class="contents">
      <div class="docs-headless-multi-autocomplete-reviewer-roster-plain-overlay" tngMultiAutocompleteOverlay>
        <ul tngMultiAutocompleteListbox [value]="selectedReviewers()">
          @for (reviewer of filteredReviewers(); track reviewer.id) {
            <li tngMultiAutocompleteOption [tngValue]="reviewer.id" [disabled]="isReviewerDisabled(reviewer)">
              <span>{{ reviewer.name }}</span>
              <small>{{ reviewer.team }}</small>
            </li>
          }
        </ul>
      </div>
    </div>
  </section>

  <p class="docs-headless-multi-autocomplete-reviewer-roster-plain-summary">Selected: {{ selectedSummary() }}</p>
</section>`;

const REVIEWER_PLAIN_CSS_CODE = String.raw`.docs-headless-multi-autocomplete-reviewer-roster-plain-shell {
  display: grid;
  gap: 0.9rem;
  inline-size: min(100%, 36rem);
  margin-inline: auto;
  padding: 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 1rem;
  background: #ffffff;
  color: #0f172a;
  color-scheme: light;
}

.docs-headless-multi-autocomplete-reviewer-roster-plain-header {
  display: grid;
  gap: 0.35rem;
}

.docs-headless-multi-autocomplete-reviewer-roster-plain-kicker {
  font-size: 0.8rem;
  font-weight: 700;
  color: #64748b;
}

.docs-headless-multi-autocomplete-reviewer-roster-plain-copy,
.docs-headless-multi-autocomplete-reviewer-roster-plain-summary {
  margin: 0;
  color: #475569;
}

.docs-headless-multi-autocomplete-reviewer-roster-plain-control {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  min-height: 3rem;
  padding: 0.45rem;
  border: 1px solid #94a3b8;
  border-radius: 1rem;
  background: #ffffff;
}
`;

const REVIEWER_TAILWIND_TS_CODE = REVIEWER_PLAIN_TS_CODE.replace(/ReviewerRosterPlainComponent/g, 'ReviewerRosterTailwindComponent');
const REVIEWER_TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid max-w-[36rem] gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Release owner roster</span>
    <p class="m-0 text-sm text-slate-600">Disabled options stay visible so reviewers understand who is locked out of the current handoff.</p>
  </div>

  <section
    tngMultiAutocomplete
    class="relative flex min-h-12 flex-wrap gap-2 rounded-2xl border border-slate-300 bg-white p-2 shadow-sm shadow-slate-900/5 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/15"
    [open]="open()"
    (openChange)="open.set($event)"
    [query]="query()"
    (queryChange)="query.set($event)"
    [value]="selectedReviewers()"
    (valueChange)="onValueChange($event)"
  >
    @for (id of selectedReviewers(); track id) {
      <span tngMultiAutocompleteChip class="rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700" [tngValue]="id">{{ id }}</span>
    }

    <input
      tngMultiAutocompleteTrigger
      type="text"
      class="min-w-[9rem] flex-1 bg-transparent px-2 py-1.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
      [value]="query()"
      (input)="onInput($event)"
      placeholder="Search reviewers"
      aria-label="Release owner roster"
    />

    <div tngMultiAutocompleteContent class="contents">
      <div tngMultiAutocompleteOverlay class="max-w-[min(100vw-2rem,36rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
        <ul tngMultiAutocompleteListbox>
          @for (reviewer of filteredReviewers(); track reviewer.id) {
            <li tngMultiAutocompleteOption class="grid gap-1 rounded-xl px-4 py-3 text-sm text-slate-900" [tngValue]="reviewer.id" [disabled]="isReviewerDisabled(reviewer)">
              <span class="font-medium">{{ reviewer.name }}</span>
              <small class="text-xs text-slate-500">{{ reviewer.team }}</small>
            </li>
          }
        </ul>
      </div>
    </div>
  </section>

  <p class="m-0 text-xs text-slate-600">Selected: {{ selectedSummary() }}</p>
</section>`;
const REVIEWER_TAILWIND_CSS_CODE = String.raw`/* No additional CSS file is required for this Tailwind example. */`;

@Component({
  selector: 'app-headless-multi-autocomplete-examples-page',
  imports: [
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
  templateUrl: './headless-multi-autocomplete-examples-page.component.html',
  styleUrl: './headless-multi-autocomplete-examples-page.component.css',
})
export class HeadlessMultiAutocompleteExamplesPageComponent implements OnDestroy {
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
  protected readonly reviewers = REVIEWER_OPTIONS;
  private readonly marketsByCode = new Map(this.markets.map((market) => [market.code, market]));

  protected readonly launchPlainOpen = signal(false);
  protected readonly launchPlainQuery = signal('');
  protected readonly launchPlainValues = signal<readonly string[]>(['in', 'jp']);

  protected readonly launchTailwindOpen = signal(false);
  protected readonly launchTailwindQuery = signal('');
  protected readonly launchTailwindValues = signal<readonly string[]>(['ca', 'es']);

  protected readonly reviewerPlainOpen = signal(false);
  protected readonly reviewerPlainQuery = signal('');
  protected readonly reviewerPlainValues = signal<readonly string[]>(['abigail', 'sanjay']);

  protected readonly reviewerTailwindOpen = signal(false);
  protected readonly reviewerTailwindQuery = signal('');
  protected readonly reviewerTailwindValues = signal<readonly string[]>(['mina']);

  protected readonly launchPlainFiltered = computed(() => this.filterMarkets(this.launchPlainQuery()));
  protected readonly launchTailwindFiltered = computed(() => this.filterMarkets(this.launchTailwindQuery()));
  protected readonly reviewerPlainFiltered = computed(() => this.filterReviewers(this.reviewerPlainQuery()));
  protected readonly reviewerTailwindFiltered = computed(() => this.filterReviewers(this.reviewerTailwindQuery()));

  protected readonly launchPlainSummary = computed(() => this.formatMarketSummary(this.launchPlainValues()));
  protected readonly launchTailwindSummary = computed(() => this.formatMarketSummary(this.launchTailwindValues()));
  protected readonly reviewerPlainSummary = computed(() => this.reviewerPlainValues().join(', '));
  protected readonly reviewerTailwindSummary = computed(() => this.reviewerTailwindValues().join(', '));

  protected readonly marketPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'headless-multi-autocomplete-launch-markets-plain.component.ts', code: MARKET_PLAIN_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'headless-multi-autocomplete-launch-markets-plain.component.html', code: MARKET_PLAIN_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'headless-multi-autocomplete-launch-markets-plain.component.css', code: MARKET_PLAIN_CSS_CODE },
  ]);
  protected readonly marketTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'headless-multi-autocomplete-launch-markets-tailwind.component.ts', code: MARKET_TAILWIND_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'headless-multi-autocomplete-launch-markets-tailwind.component.html', code: MARKET_TAILWIND_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'headless-multi-autocomplete-launch-markets-tailwind.component.css', code: MARKET_TAILWIND_CSS_CODE },
  ]);
  protected readonly reviewerPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'headless-multi-autocomplete-reviewer-roster-plain.component.ts', code: REVIEWER_PLAIN_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'headless-multi-autocomplete-reviewer-roster-plain.component.html', code: REVIEWER_PLAIN_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'headless-multi-autocomplete-reviewer-roster-plain.component.css', code: REVIEWER_PLAIN_CSS_CODE },
  ]);
  protected readonly reviewerTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'headless-multi-autocomplete-reviewer-roster-tailwind.component.ts', code: REVIEWER_TAILWIND_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'headless-multi-autocomplete-reviewer-roster-tailwind.component.html', code: REVIEWER_TAILWIND_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'headless-multi-autocomplete-reviewer-roster-tailwind.component.css', code: REVIEWER_TAILWIND_CSS_CODE },
  ]);

  protected onLaunchPlainInput(event: Event): void { this.launchPlainQuery.set((event.target as HTMLInputElement).value); }
  protected onLaunchPlainValueChange(value: MultiAutocompleteValueChange): void { this.launchPlainValues.set(this.toValueArray(value)); }
  protected onLaunchTailwindInput(event: Event): void { this.launchTailwindQuery.set((event.target as HTMLInputElement).value); }
  protected onLaunchTailwindValueChange(value: MultiAutocompleteValueChange): void { this.launchTailwindValues.set(this.toValueArray(value)); }
  protected onReviewerPlainInput(event: Event): void { this.reviewerPlainQuery.set((event.target as HTMLInputElement).value); }
  protected onReviewerPlainValueChange(value: MultiAutocompleteValueChange): void { this.reviewerPlainValues.set(this.toValueArray(value)); }
  protected onReviewerTailwindInput(event: Event): void { this.reviewerTailwindQuery.set((event.target as HTMLInputElement).value); }
  protected onReviewerTailwindValueChange(value: MultiAutocompleteValueChange): void { this.reviewerTailwindValues.set(this.toValueArray(value)); }

  protected resolveMarketLabel(code: string): string { return this.marketsByCode.get(code)?.label ?? code; }
  protected isReviewerDisabled(reviewer: ReviewerOption): boolean { return reviewer.disabled === true; }

  public ngOnDestroy(): void { this.colorSchemeObserver?.disconnect(); }

  private filterMarkets(query: string): readonly MarketOption[] {
    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery === '') return this.markets;
    return this.markets.filter((market) => `${market.label} ${market.region}`.toLowerCase().includes(normalizedQuery));
  }

  private filterReviewers(query: string): readonly ReviewerOption[] {
    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery === '') return this.reviewers;
    return this.reviewers.filter((reviewer) => `${reviewer.name} ${reviewer.team}`.toLowerCase().includes(normalizedQuery));
  }

  private toValueArray(value: MultiAutocompleteValueChange): readonly string[] {
    if (!Array.isArray(value)) return [];
    return value.map((item) => (typeof item === 'string' ? item : String(item))).filter(Boolean);
  }

  private formatMarketSummary(values: readonly string[]): string {
    if (values.length === 0) return 'none';
    return values.map((value) => this.resolveMarketLabel(value)).join(', ');
  }
}
