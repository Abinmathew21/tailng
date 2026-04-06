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

interface HeadlessExamplesPlainLaunchMarketOption {
  readonly code: string;
  readonly label: string;
  readonly region: string;
}

const HEADLESS_EXAMPLES_PLAIN_LAUNCH_MARKET_OPTIONS: readonly HeadlessExamplesPlainLaunchMarketOption[] = Object.freeze([
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
  readonly headlessExamplesPlainLaunchMarkets = HEADLESS_EXAMPLES_PLAIN_LAUNCH_MARKET_OPTIONS;
  readonly headlessExamplesPlainLaunchMarketsOpen = signal(false);
  readonly headlessExamplesPlainLaunchMarketsQuery = signal('');
  readonly headlessExamplesPlainSelectedMarketCodes = signal<readonly string[]>(['in', 'jp']);

  readonly headlessExamplesPlainFilteredLaunchMarkets = computed(() => {
    const normalizedQuery = this.headlessExamplesPlainLaunchMarketsQuery().trim().toLowerCase();
    if (normalizedQuery === '') {
      return this.headlessExamplesPlainLaunchMarkets;
    }

    return this.headlessExamplesPlainLaunchMarkets.filter((market) =>
      (market.label + ' ' + market.region).toLowerCase().includes(normalizedQuery),
    );
  });

  readonly headlessExamplesPlainSelectedMarketSummary = computed(() => {
    if (this.headlessExamplesPlainSelectedMarketCodes().length === 0) {
      return 'none';
    }

    return this.headlessExamplesPlainSelectedMarketCodes()
      .map((code) => this.headlessExamplesPlainLaunchMarkets.find((market) => market.code === code)?.label ?? code)
      .join(', ');
  });

  onHeadlessExamplesPlainLaunchMarketsInput(event: Event): void {
    this.headlessExamplesPlainLaunchMarketsQuery.set((event.target as HTMLInputElement).value);
  }

  onHeadlessExamplesPlainLaunchMarketsValueChange(value: unknown): void {
    this.headlessExamplesPlainSelectedMarketCodes.set(this.toHeadlessExamplesPlainValueArray(value));
  }

  resolveHeadlessExamplesPlainLaunchMarketLabel(code: string): string {
    return this.headlessExamplesPlainLaunchMarkets.find((market) => market.code === code)?.label ?? code;
  }

  private toHeadlessExamplesPlainValueArray(value: unknown): readonly string[] {
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
    [open]="headlessExamplesPlainLaunchMarketsOpen()"
    (openChange)="headlessExamplesPlainLaunchMarketsOpen.set($event)"
    [query]="headlessExamplesPlainLaunchMarketsQuery()"
    (queryChange)="headlessExamplesPlainLaunchMarketsQuery.set($event)"
    [value]="headlessExamplesPlainSelectedMarketCodes()"
    (valueChange)="onHeadlessExamplesPlainLaunchMarketsValueChange($event)"
  >
    @for (code of headlessExamplesPlainSelectedMarketCodes(); track code) {
      <span tngMultiAutocompleteChip [tngValue]="code">{{ resolveHeadlessExamplesPlainLaunchMarketLabel(code) }}</span>
    }

    <input
      tngMultiAutocompleteTrigger
      type="text"
      [value]="headlessExamplesPlainLaunchMarketsQuery()"
      (input)="onHeadlessExamplesPlainLaunchMarketsInput($event)"
      placeholder="Search launch markets"
      aria-label="Launch markets"
    />

    <div tngMultiAutocompleteContent class="docs-headless-multi-autocomplete-launch-markets-plain-content">
      <div class="docs-headless-multi-autocomplete-launch-markets-plain-overlay" tngMultiAutocompleteOverlay>
        <ul tngMultiAutocompleteListbox class="docs-headless-multi-autocomplete-launch-markets-plain-listbox" [value]="headlessExamplesPlainSelectedMarketCodes()">
          @for (market of headlessExamplesPlainFilteredLaunchMarkets(); track market.code) {
            <li tngMultiAutocompleteOption class="docs-headless-multi-autocomplete-launch-markets-plain-option" [tngValue]="market.code">
              <span>{{ market.label }}</span>
              <small>{{ market.region }}</small>
            </li>
          }
        </ul>
      </div>
    </div>
  </section>

  <p class="docs-headless-multi-autocomplete-launch-markets-plain-summary">Selected: {{ headlessExamplesPlainSelectedMarketSummary() }}</p>
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
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem;
  min-height: 3.25rem;
  padding: 0.5rem;
  border: 1px solid #94a3b8;
  border-radius: 1.1rem;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  transition:
    border-color 140ms ease,
    box-shadow 140ms ease,
    background-color 140ms ease;
}

.docs-headless-multi-autocomplete-launch-markets-plain-control:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12);
}

.docs-headless-multi-autocomplete-launch-markets-plain-control [data-slot='multi-autocomplete-chip'] {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-height: 2rem;
  padding: 0.375rem 0.8rem;
  border: 1px solid #dbeafe;
  border-radius: 999px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.15;
  white-space: nowrap;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.72),
    0 1px 2px rgba(37, 99, 235, 0.08);
}

.docs-headless-multi-autocomplete-launch-markets-plain-control [data-slot='multi-autocomplete-chip']:focus-visible {
  border-color: #60a5fa;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.72),
    0 0 0 2px rgba(37, 99, 235, 0.14);
}

.docs-headless-multi-autocomplete-launch-markets-plain-control [data-slot='multi-autocomplete-trigger'] {
  flex: 1 1 8rem;
  min-width: 8rem;
  align-self: center;
  border: 0;
  background: transparent;
  color: #0f172a;
  outline: none;
  font-size: 0.95rem;
}

.docs-headless-multi-autocomplete-launch-markets-plain-content {
  position: absolute;
  inset-inline: 0;
  inset-block-start: calc(100% + 0.55rem);
  z-index: 20;
}

.docs-headless-multi-autocomplete-launch-markets-plain-overlay[data-slot='multi-autocomplete-overlay'] {
  max-inline-size: min(100vw - 2rem, 36rem);
  border: 1px solid #dbeafe;
  border-radius: 1.15rem;
  background: #ffffff;
  padding: 0.5rem;
  box-shadow: 0 22px 44px rgba(15, 23, 42, 0.14);
}

.docs-headless-multi-autocomplete-launch-markets-plain-listbox[data-slot='multi-autocomplete-listbox'] {
  display: grid;
  gap: 0.45rem;
  margin: 0;
  padding: 0;
  list-style: none;
  max-block-size: 18rem;
  overflow: auto;
}

.docs-headless-multi-autocomplete-launch-markets-plain-option {
  display: grid;
  gap: 0.2rem;
  padding: 0.8rem 0.95rem;
  border: 1px solid transparent;
  border-radius: 0.95rem;
  cursor: pointer;
  color: #0f172a;
  transition:
    background-color 140ms ease,
    border-color 140ms ease,
    box-shadow 140ms ease,
    color 140ms ease;
}

.docs-headless-multi-autocomplete-launch-markets-plain-option small {
  color: #64748b;
}

.docs-headless-multi-autocomplete-launch-markets-plain-option[data-active] {
  background: #f8fafc;
  border-color: #cbd5e1;
  box-shadow: 0 0 0 1px rgba(148, 163, 184, 0.08);
}

.docs-headless-multi-autocomplete-launch-markets-plain-option[data-active] small {
  color: #475569;
}

.docs-headless-multi-autocomplete-launch-markets-plain-option[data-selected] {
  background: #eff6ff;
  border-color: #bfdbfe;
  color: #1d4ed8;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.72),
    0 1px 2px rgba(37, 99, 235, 0.08);
}

.docs-headless-multi-autocomplete-launch-markets-plain-option[data-selected] small {
  color: #2563eb;
}

.docs-headless-multi-autocomplete-launch-markets-plain-option[data-selected][data-active] {
  background: #dbeafe;
  border-color: #60a5fa;
  color: #1e40af;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.72),
    0 0 0 2px rgba(37, 99, 235, 0.12);
}

.docs-headless-multi-autocomplete-launch-markets-plain-option[data-selected][data-active] small {
  color: #1d4ed8;
}`;

const MARKET_TAILWIND_TS_CODE = MARKET_PLAIN_TS_CODE
  .replace(/HeadlessMultiAutocompleteLaunchMarketsPlainComponent/g, 'HeadlessMultiAutocompleteLaunchMarketsTailwindComponent')
  .replace(/app-headless-multi-autocomplete-launch-markets-plain/g, 'app-headless-multi-autocomplete-launch-markets-tailwind')
  .replace(/headless-multi-autocomplete-launch-markets-plain\.component/g, 'headless-multi-autocomplete-launch-markets-tailwind.component')
  .replace(/HeadlessExamplesPlainLaunchMarketOption/g, 'HeadlessExamplesTailwindLaunchMarketOption')
  .replace(/HEADLESS_EXAMPLES_PLAIN_LAUNCH_MARKET_OPTIONS/g, 'HEADLESS_EXAMPLES_TAILWIND_LAUNCH_MARKET_OPTIONS')
  .replace(/headlessExamplesPlainLaunchMarkets/g, 'headlessExamplesTailwindLaunchMarkets')
  .replace(/headlessExamplesPlainSelectedMarketCodes/g, 'headlessExamplesTailwindSelectedMarketCodes')
  .replace(/headlessExamplesPlainFilteredLaunchMarkets/g, 'headlessExamplesTailwindFilteredLaunchMarkets')
  .replace(/headlessExamplesPlainSelectedMarketSummary/g, 'headlessExamplesTailwindSelectedMarketSummary')
  .replace(/onHeadlessExamplesPlainLaunchMarketsInput/g, 'onHeadlessExamplesTailwindLaunchMarketsInput')
  .replace(/onHeadlessExamplesPlainLaunchMarketsValueChange/g, 'onHeadlessExamplesTailwindLaunchMarketsValueChange')
  .replace(/resolveHeadlessExamplesPlainLaunchMarketLabel/g, 'resolveHeadlessExamplesTailwindLaunchMarketLabel')
  .replace(/toHeadlessExamplesPlainValueArray/g, 'toHeadlessExamplesTailwindValueArray');
const MARKET_TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid max-w-[36rem] gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Launch markets</span>
    <p class="m-0 text-sm text-slate-600">Pick multiple launch regions while keeping chips visible in the owned shell.</p>
  </div>

  <section
    tngMultiAutocomplete
    class="relative flex min-h-12 flex-wrap items-center gap-2 rounded-[1.15rem] border border-slate-300 bg-gradient-to-b from-white to-slate-50 p-2 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/15"
    [open]="headlessExamplesTailwindLaunchMarketsOpen()"
    (openChange)="headlessExamplesTailwindLaunchMarketsOpen.set($event)"
    [query]="headlessExamplesTailwindLaunchMarketsQuery()"
    (queryChange)="headlessExamplesTailwindLaunchMarketsQuery.set($event)"
    [value]="headlessExamplesTailwindSelectedMarketCodes()"
    (valueChange)="onHeadlessExamplesTailwindLaunchMarketsValueChange($event)"
  >
    @for (code of headlessExamplesTailwindSelectedMarketCodes(); track code) {
      <span tngMultiAutocompleteChip class="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700 shadow-sm shadow-blue-900/5" [tngValue]="code">
        {{ resolveHeadlessExamplesTailwindLaunchMarketLabel(code) }}
      </span>
    }

    <input
      tngMultiAutocompleteTrigger
      type="text"
      class="min-w-[9rem] flex-1 bg-transparent px-2 py-1.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
      [value]="headlessExamplesTailwindLaunchMarketsQuery()"
      (input)="onHeadlessExamplesTailwindLaunchMarketsInput($event)"
      placeholder="Search launch markets"
      aria-label="Launch markets"
    />

    <div tngMultiAutocompleteContent class="contents">
      <div tngMultiAutocompleteOverlay class="max-w-[min(100vw-2rem,36rem)] overflow-hidden rounded-[1.15rem] border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">
        <ul tngMultiAutocompleteListbox [value]="headlessExamplesTailwindSelectedMarketCodes()" class="m-0 grid max-h-72 list-none gap-2 overflow-auto p-0">
          @for (market of headlessExamplesTailwindFilteredLaunchMarkets(); track market.code) {
            <li tngMultiAutocompleteOption class="group grid cursor-pointer gap-1 rounded-xl border border-transparent bg-white px-4 py-3 text-sm text-slate-900 transition data-[active]:border-slate-300 data-[active]:bg-slate-50 data-[active]:shadow-[0_0_0_1px_rgba(148,163,184,0.08)] data-[selected]:border-blue-200 data-[selected]:bg-blue-50 data-[selected]:text-blue-700 data-[selected]:shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_1px_2px_rgba(37,99,235,0.08)] [&[data-selected][data-active]]:border-blue-400 [&[data-selected][data-active]]:bg-blue-100 [&[data-selected][data-active]]:text-blue-800 [&[data-selected][data-active]]:shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_0_0_2px_rgba(37,99,235,0.12)]" [tngValue]="market.code">
              <span class="font-medium">{{ market.label }}</span>
              <small class="text-xs text-slate-500 group-data-[active]:text-slate-600 group-data-[selected]:text-blue-600">{{ market.region }}</small>
            </li>
          }
        </ul>
      </div>
    </div>
  </section>

  <p class="m-0 text-xs text-slate-600">Selected: {{ headlessExamplesTailwindSelectedMarketSummary() }}</p>
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

interface HeadlessExamplesPlainReviewerRosterOption {
  readonly id: string;
  readonly name: string;
  readonly team: string;
  readonly disabled?: boolean;
}

const HEADLESS_EXAMPLES_PLAIN_REVIEWER_ROSTER_OPTIONS: readonly HeadlessExamplesPlainReviewerRosterOption[] = Object.freeze([
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
  readonly headlessExamplesPlainReviewerRoster = HEADLESS_EXAMPLES_PLAIN_REVIEWER_ROSTER_OPTIONS;
  readonly headlessExamplesPlainReviewerRosterOpen = signal(false);
  readonly headlessExamplesPlainReviewerQuery = signal('');
  readonly headlessExamplesPlainSelectedReviewerIds = signal<readonly string[]>(['abigail', 'sanjay']);

  readonly headlessExamplesPlainFilteredReviewerRoster = computed(() => {
    const normalizedQuery = this.headlessExamplesPlainReviewerQuery().trim().toLowerCase();
    if (normalizedQuery === '') {
      return this.headlessExamplesPlainReviewerRoster;
    }

    return this.headlessExamplesPlainReviewerRoster.filter((reviewer) =>
      (reviewer.name + ' ' + reviewer.team).toLowerCase().includes(normalizedQuery),
    );
  });

  readonly headlessExamplesPlainReviewerSummary = computed(() => {
    if (this.headlessExamplesPlainSelectedReviewerIds().length === 0) {
      return 'none';
    }

    return this.headlessExamplesPlainSelectedReviewerIds()
      .map((id) => this.resolveHeadlessExamplesPlainReviewerLabel(id))
      .join(', ');
  });

  onHeadlessExamplesPlainReviewerInput(event: Event): void {
    this.headlessExamplesPlainReviewerQuery.set((event.target as HTMLInputElement).value);
  }

  onHeadlessExamplesPlainReviewerValueChange(value: unknown): void {
    this.headlessExamplesPlainSelectedReviewerIds.set(this.toHeadlessExamplesPlainReviewerValueArray(value));
  }

  resolveHeadlessExamplesPlainReviewerLabel(id: string): string {
    return this.headlessExamplesPlainReviewerRoster.find((reviewer) => reviewer.id === id)?.name ?? id;
  }

  isHeadlessExamplesPlainReviewerDisabled(reviewer: HeadlessExamplesPlainReviewerRosterOption): boolean {
    return reviewer.disabled === true;
  }

  private toHeadlessExamplesPlainReviewerValueArray(value: unknown): readonly string[] {
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
    [open]="headlessExamplesPlainReviewerRosterOpen()"
    (openChange)="headlessExamplesPlainReviewerRosterOpen.set($event)"
    [query]="headlessExamplesPlainReviewerQuery()"
    (queryChange)="headlessExamplesPlainReviewerQuery.set($event)"
    [value]="headlessExamplesPlainSelectedReviewerIds()"
    (valueChange)="onHeadlessExamplesPlainReviewerValueChange($event)"
  >
    @for (id of headlessExamplesPlainSelectedReviewerIds(); track id) {
      <span tngMultiAutocompleteChip [tngValue]="id">{{ resolveHeadlessExamplesPlainReviewerLabel(id) }}</span>
    }

    <input
      tngMultiAutocompleteTrigger
      type="text"
      [value]="headlessExamplesPlainReviewerQuery()"
      (input)="onHeadlessExamplesPlainReviewerInput($event)"
      placeholder="Search reviewers"
      aria-label="Release owner roster"
    />

    <div tngMultiAutocompleteContent class="docs-headless-multi-autocomplete-reviewer-roster-plain-content">
      <div class="docs-headless-multi-autocomplete-reviewer-roster-plain-overlay" tngMultiAutocompleteOverlay>
        <ul tngMultiAutocompleteListbox class="docs-headless-multi-autocomplete-reviewer-roster-plain-listbox" [value]="headlessExamplesPlainSelectedReviewerIds()">
          @for (reviewer of headlessExamplesPlainFilteredReviewerRoster(); track reviewer.id) {
            <li tngMultiAutocompleteOption class="docs-headless-multi-autocomplete-reviewer-roster-plain-option" [tngValue]="reviewer.id" [disabled]="isHeadlessExamplesPlainReviewerDisabled(reviewer)">
              <span>{{ reviewer.name }}</span>
              <small>{{ reviewer.team }}</small>
            </li>
          }
        </ul>
      </div>
    </div>
  </section>

  <p class="docs-headless-multi-autocomplete-reviewer-roster-plain-summary">Selected: {{ headlessExamplesPlainReviewerSummary() }}</p>
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
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem;
  min-height: 3.25rem;
  padding: 0.5rem;
  border: 1px solid #94a3b8;
  border-radius: 1.1rem;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  transition:
    border-color 140ms ease,
    box-shadow 140ms ease,
    background-color 140ms ease;
}

.docs-headless-multi-autocomplete-reviewer-roster-plain-control:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12);
}

.docs-headless-multi-autocomplete-reviewer-roster-plain-control [data-slot='multi-autocomplete-chip'] {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-height: 2rem;
  padding: 0.375rem 0.8rem;
  border: 1px solid #dbeafe;
  border-radius: 999px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.15;
  white-space: nowrap;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.72),
    0 1px 2px rgba(37, 99, 235, 0.08);
}

.docs-headless-multi-autocomplete-reviewer-roster-plain-control [data-slot='multi-autocomplete-chip']:focus-visible {
  border-color: #60a5fa;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.72),
    0 0 0 2px rgba(37, 99, 235, 0.14);
}

.docs-headless-multi-autocomplete-reviewer-roster-plain-control [data-slot='multi-autocomplete-trigger'] {
  flex: 1 1 8rem;
  min-width: 8rem;
  align-self: center;
  border: 0;
  background: transparent;
  color: #0f172a;
  outline: none;
  font-size: 0.95rem;
}

.docs-headless-multi-autocomplete-reviewer-roster-plain-content {
  position: absolute;
  inset-inline: 0;
  inset-block-start: calc(100% + 0.55rem);
  z-index: 20;
}

.docs-headless-multi-autocomplete-reviewer-roster-plain-overlay[data-slot='multi-autocomplete-overlay'] {
  max-inline-size: min(100vw - 2rem, 36rem);
  border: 1px solid #dbeafe;
  border-radius: 1.15rem;
  background: #ffffff;
  padding: 0.5rem;
  box-shadow: 0 22px 44px rgba(15, 23, 42, 0.14);
}

.docs-headless-multi-autocomplete-reviewer-roster-plain-listbox[data-slot='multi-autocomplete-listbox'] {
  display: grid;
  gap: 0.45rem;
  margin: 0;
  padding: 0;
  list-style: none;
  max-block-size: 18rem;
  overflow: auto;
}

.docs-headless-multi-autocomplete-reviewer-roster-plain-option {
  display: grid;
  gap: 0.2rem;
  padding: 0.8rem 0.95rem;
  border: 1px solid transparent;
  border-radius: 0.95rem;
  cursor: pointer;
  color: #0f172a;
  transition:
    background-color 140ms ease,
    border-color 140ms ease,
    box-shadow 140ms ease,
    color 140ms ease;
}

.docs-headless-multi-autocomplete-reviewer-roster-plain-option small {
  color: #64748b;
}

.docs-headless-multi-autocomplete-reviewer-roster-plain-option[data-active] {
  background: #f8fafc;
  border-color: #cbd5e1;
  box-shadow: 0 0 0 1px rgba(148, 163, 184, 0.08);
}

.docs-headless-multi-autocomplete-reviewer-roster-plain-option[data-active] small {
  color: #475569;
}

.docs-headless-multi-autocomplete-reviewer-roster-plain-option[data-selected] {
  background: #eff6ff;
  border-color: #bfdbfe;
  color: #1d4ed8;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.72),
    0 1px 2px rgba(37, 99, 235, 0.08);
}

.docs-headless-multi-autocomplete-reviewer-roster-plain-option[data-selected] small {
  color: #2563eb;
}

.docs-headless-multi-autocomplete-reviewer-roster-plain-option[data-selected][data-active] {
  background: #dbeafe;
  border-color: #60a5fa;
  color: #1e40af;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.72),
    0 0 0 2px rgba(37, 99, 235, 0.12);
}

.docs-headless-multi-autocomplete-reviewer-roster-plain-option[data-selected][data-active] small {
  color: #1d4ed8;
}

.docs-headless-multi-autocomplete-reviewer-roster-plain-option[data-disabled] {
  cursor: not-allowed;
  background: #f8fafc;
  border-color: #e2e8f0;
  color: #94a3b8;
  box-shadow: none;
}

.docs-headless-multi-autocomplete-reviewer-roster-plain-option[data-disabled] small {
  color: #94a3b8;
}`;

const REVIEWER_TAILWIND_TS_CODE = REVIEWER_PLAIN_TS_CODE
  .replace(/HeadlessMultiAutocompleteReviewerRosterPlainComponent/g, 'HeadlessMultiAutocompleteReviewerRosterTailwindComponent')
  .replace(/app-headless-multi-autocomplete-reviewer-roster-plain/g, 'app-headless-multi-autocomplete-reviewer-roster-tailwind')
  .replace(/headless-multi-autocomplete-reviewer-roster-plain\.component/g, 'headless-multi-autocomplete-reviewer-roster-tailwind.component')
  .replace(/HeadlessExamplesPlainReviewerRosterOption/g, 'HeadlessExamplesTailwindReviewerRosterOption')
  .replace(/HEADLESS_EXAMPLES_PLAIN_REVIEWER_ROSTER_OPTIONS/g, 'HEADLESS_EXAMPLES_TAILWIND_REVIEWER_ROSTER_OPTIONS')
  .replace(/headlessExamplesPlainReviewerRoster/g, 'headlessExamplesTailwindReviewerRoster')
  .replace(/headlessExamplesPlainReviewerSummary/g, 'headlessExamplesTailwindReviewerSummary')
  .replace(/headlessExamplesPlainReviewerQuery/g, 'headlessExamplesTailwindReviewerQuery')
  .replace(/headlessExamplesPlainSelectedReviewerIds/g, 'headlessExamplesTailwindSelectedReviewerIds')
  .replace(/headlessExamplesPlainFilteredReviewerRoster/g, 'headlessExamplesTailwindFilteredReviewerRoster')
  .replace(/onHeadlessExamplesPlainReviewerInput/g, 'onHeadlessExamplesTailwindReviewerInput')
  .replace(/onHeadlessExamplesPlainReviewerValueChange/g, 'onHeadlessExamplesTailwindReviewerValueChange')
  .replace(/resolveHeadlessExamplesPlainReviewerLabel/g, 'resolveHeadlessExamplesTailwindReviewerLabel')
  .replace(/isHeadlessExamplesPlainReviewerDisabled/g, 'isHeadlessExamplesTailwindReviewerDisabled')
  .replace(/toHeadlessExamplesPlainReviewerValueArray/g, 'toHeadlessExamplesTailwindReviewerValueArray');
const REVIEWER_TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid max-w-[36rem] gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Release owner roster</span>
    <p class="m-0 text-sm text-slate-600">Disabled options stay visible so reviewers understand who is locked out of the current handoff.</p>
  </div>

  <section
    tngMultiAutocomplete
    class="relative flex min-h-12 flex-wrap items-center gap-2 rounded-[1.15rem] border border-slate-300 bg-white p-2 shadow-sm shadow-slate-900/5 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/15"
    [open]="headlessExamplesTailwindReviewerRosterOpen()"
    (openChange)="headlessExamplesTailwindReviewerRosterOpen.set($event)"
    [query]="headlessExamplesTailwindReviewerQuery()"
    (queryChange)="headlessExamplesTailwindReviewerQuery.set($event)"
    [value]="headlessExamplesTailwindSelectedReviewerIds()"
    (valueChange)="onHeadlessExamplesTailwindReviewerValueChange($event)"
  >
    @for (id of headlessExamplesTailwindSelectedReviewerIds(); track id) {
      <span tngMultiAutocompleteChip class="inline-flex items-center rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 shadow-sm shadow-slate-900/5" [tngValue]="id">{{ resolveHeadlessExamplesTailwindReviewerLabel(id) }}</span>
    }

    <input
      tngMultiAutocompleteTrigger
      type="text"
      class="min-w-[9rem] flex-1 bg-transparent px-2 py-1.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
      [value]="headlessExamplesTailwindReviewerQuery()"
      (input)="onHeadlessExamplesTailwindReviewerInput($event)"
      placeholder="Search reviewers"
      aria-label="Release owner roster"
    />

    <div tngMultiAutocompleteContent class="contents">
      <div tngMultiAutocompleteOverlay class="max-w-[min(100vw-2rem,36rem)] overflow-hidden rounded-[1.15rem] border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">
        <ul tngMultiAutocompleteListbox [value]="headlessExamplesTailwindSelectedReviewerIds()" class="m-0 grid max-h-72 list-none gap-2 overflow-auto p-0">
          @for (reviewer of headlessExamplesTailwindFilteredReviewerRoster(); track reviewer.id) {
            <li tngMultiAutocompleteOption class="group grid gap-1 rounded-xl border border-transparent bg-white px-4 py-3 text-sm text-slate-900 transition data-[active]:border-slate-300 data-[active]:bg-slate-50 data-[active]:shadow-[0_0_0_1px_rgba(148,163,184,0.08)] data-[selected]:border-blue-200 data-[selected]:bg-blue-50 data-[selected]:text-blue-700 data-[selected]:shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_1px_2px_rgba(37,99,235,0.08)] data-[disabled]:cursor-not-allowed data-[disabled]:border-slate-200 data-[disabled]:bg-slate-50 data-[disabled]:text-slate-400 data-[disabled]:shadow-none [&[data-selected][data-active]]:border-blue-400 [&[data-selected][data-active]]:bg-blue-100 [&[data-selected][data-active]]:text-blue-800 [&[data-selected][data-active]]:shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_0_0_2px_rgba(37,99,235,0.12)]" [tngValue]="reviewer.id" [disabled]="isHeadlessExamplesTailwindReviewerDisabled(reviewer)">
              <span class="font-medium">{{ reviewer.name }}</span>
              <small class="text-xs text-slate-500 group-data-[active]:text-slate-600 group-data-[selected]:text-blue-600 group-data-[disabled]:text-slate-400">{{ reviewer.team }}</small>
            </li>
          }
        </ul>
      </div>
    </div>
  </section>

  <p class="m-0 text-xs text-slate-600">Selected: {{ headlessExamplesTailwindReviewerSummary() }}</p>
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
  private readonly reviewersById = new Map(this.reviewers.map((reviewer) => [reviewer.id, reviewer]));

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
  protected readonly reviewerPlainSummary = computed(() => this.formatReviewerSummary(this.reviewerPlainValues()));
  protected readonly reviewerTailwindSummary = computed(() => this.formatReviewerSummary(this.reviewerTailwindValues()));

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
  protected resolveReviewerLabel(id: string): string { return this.reviewersById.get(id)?.name ?? id; }
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

  private formatReviewerSummary(values: readonly string[]): string {
    if (values.length === 0) return 'none';
    return values.map((value) => this.resolveReviewerLabel(value)).join(', ');
  }
}
