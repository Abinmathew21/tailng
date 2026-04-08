import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { TngChip, TngChipRemove, TngChips } from '@tailng-ui/primitives';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../chips.util';

const FILTER_PLAIN_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import { TngChip, TngChipRemove, TngChips } from '@tailng-ui/primitives';

const HEADLESS_CHIPS_EXAMPLES_PLAIN_FILTER_VALUES = Object.freeze([
  'Accessibility',
  'API docs',
  'Release notes',
]);

@Component({
  selector: 'app-headless-chips-examples-filter-plain',
  standalone: true,
  imports: [TngChips, TngChip, TngChipRemove],
  templateUrl: './headless-chips-examples-filter-plain.component.html',
  styleUrl: './headless-chips-examples-filter-plain.component.css',
})
export class HeadlessChipsExamplesFilterPlainComponent {
  readonly headlessChipsExamplesPlainFilterValues = signal<readonly string[]>(
    HEADLESS_CHIPS_EXAMPLES_PLAIN_FILTER_VALUES,
  );
  readonly headlessChipsExamplesPlainFilterSummary = computed(() => {
    const values = this.headlessChipsExamplesPlainFilterValues();
    return values.length > 0 ? values.join(', ') : 'none';
  });

  onHeadlessChipsExamplesPlainFilterValuesChange(nextValues: readonly unknown[]): void {
    this.headlessChipsExamplesPlainFilterValues.set(
      nextValues.filter((value): value is string => typeof value === 'string'),
    );
  }
}`;

const FILTER_PLAIN_HTML_CODE = String.raw`<section class="docs-headless-chips-examples-filter-plain-shell">
  <div class="docs-headless-chips-examples-filter-plain-header">
    <span class="docs-headless-chips-examples-filter-plain-kicker">Active filters</span>
    <p class="docs-headless-chips-examples-filter-plain-copy">
      Keep a controlled filter list while the primitive root handles semantics and chip removal events.
    </p>
  </div>

  <section tngChips
    class="docs-headless-chips-examples-filter-plain-control"
    [tngChipsValues]="headlessChipsExamplesPlainFilterValues()"
    (valuesChange)="onHeadlessChipsExamplesPlainFilterValuesChange($event)"
    [tngChipsAriaLabel]="'Active filters'"
  >
    <div class="docs-headless-chips-examples-filter-plain-row">
      @for (filter of headlessChipsExamplesPlainFilterValues(); track filter) {
        <span tngChip [tngChipValue]="filter" [tngChipLabel]="filter" class="docs-headless-chips-examples-filter-plain-chip">
          <span>{{ filter }}</span>
          <button tngChipRemove type="button" class="docs-headless-chips-examples-filter-plain-chip-remove">&times;</button>
        </span>
      }
    </div>
  </section>

  <p class="docs-headless-chips-examples-filter-plain-summary">Selected: {{ headlessChipsExamplesPlainFilterSummary() }}</p>
</section>`;

const FILTER_PLAIN_CSS_CODE = String.raw`.docs-headless-chips-examples-filter-plain-shell {
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

.docs-headless-chips-examples-filter-plain-control {
  display: block;
  width: 100%;
  min-width: 0;
  color-scheme: light;
  --tng-semantic-background-base: #ffffff;
  --tng-semantic-border-subtle: #d8e2ef;
  --tng-semantic-foreground-primary: #0f172a;
}

.docs-headless-chips-examples-filter-plain-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.docs-headless-chips-examples-filter-plain-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 999px;
  border: 1px solid #93c5fd;
  background: #eff6ff;
  color: #1d4ed8;
  padding: 0.45rem 0.8rem;
}

.docs-headless-chips-examples-filter-plain-chip-remove {
  border: 0;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.12);
  color: inherit;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 1.2rem;
  block-size: 1.2rem;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1;
  padding: 0;
}`;

const FILTER_TAILWIND_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import { TngChip, TngChipRemove, TngChips } from '@tailng-ui/primitives';

const HEADLESS_CHIPS_EXAMPLES_TAILWIND_FILTER_VALUES = Object.freeze([
  'Registry',
  'Docs',
  'CLI',
]);

@Component({
  selector: 'app-headless-chips-examples-filter-tailwind',
  standalone: true,
  imports: [TngChips, TngChip, TngChipRemove],
  templateUrl: './headless-chips-examples-filter-tailwind.component.html',
  styleUrl: './headless-chips-examples-filter-tailwind.component.css',
})
export class HeadlessChipsExamplesFilterTailwindComponent {
  readonly headlessChipsExamplesTailwindFilterValues = signal<readonly string[]>(
    HEADLESS_CHIPS_EXAMPLES_TAILWIND_FILTER_VALUES,
  );
  readonly headlessChipsExamplesTailwindFilterSummary = computed(() => {
    const values = this.headlessChipsExamplesTailwindFilterValues();
    return values.length > 0 ? values.join(', ') : 'none';
  });

  onHeadlessChipsExamplesTailwindFilterValuesChange(nextValues: readonly unknown[]): void {
    this.headlessChipsExamplesTailwindFilterValues.set(
      nextValues.filter((value): value is string => typeof value === 'string'),
    );
  }
}`;

const FILTER_TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid max-w-[36rem] gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Active filters</span>
    <p class="m-0 text-sm text-slate-600">
      Keep a controlled filter list while the primitive root handles semantics and chip removal events.
    </p>
  </div>

  <section tngChips
    class="block w-full min-w-0 [--tng-semantic-background-base:#ffffff] [--tng-semantic-border-subtle:#d8e2ef] [--tng-semantic-foreground-primary:#0f172a]"
    [tngChipsValues]="headlessChipsExamplesTailwindFilterValues()"
    (valuesChange)="onHeadlessChipsExamplesTailwindFilterValuesChange($event)"
    [tngChipsAriaLabel]="'Active filters'"
  >
    <div class="flex flex-wrap gap-2">
      @for (filter of headlessChipsExamplesTailwindFilterValues(); track filter) {
        <span tngChip [tngChipValue]="filter" [tngChipLabel]="filter" class="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-medium text-sky-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
          <span>{{ filter }}</span>
          <button tngChipRemove type="button" class="inline-grid h-5 w-5 place-items-center rounded-full bg-sky-100 text-[0.8rem] leading-none text-sky-800 transition hover:bg-sky-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400">&times;</button>
        </span>
      }
    </div>
  </section>

  <p class="m-0 text-xs text-slate-600">Selected: {{ headlessChipsExamplesTailwindFilterSummary() }}</p>
</section>`;

const FILTER_TAILWIND_CSS_CODE = '/* Tailwind utilities are applied directly in the template. */';

const LOCKED_PLAIN_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import { TngChip, TngChipRemove, TngChips } from '@tailng-ui/primitives';

const HEADLESS_CHIPS_EXAMPLES_PLAIN_RELEASE_LANES = Object.freeze([
  'Stable',
  'Preview',
  'Locked',
]);

@Component({
  selector: 'app-headless-chips-examples-locked-plain',
  standalone: true,
  imports: [TngChips, TngChip, TngChipRemove],
  templateUrl: './headless-chips-examples-locked-plain.component.html',
  styleUrl: './headless-chips-examples-locked-plain.component.css',
})
export class HeadlessChipsExamplesLockedPlainComponent {
  readonly headlessChipsExamplesPlainReleaseLanes = signal<readonly string[]>(
    HEADLESS_CHIPS_EXAMPLES_PLAIN_RELEASE_LANES,
  );
  readonly headlessChipsExamplesPlainReleaseLaneSummary = computed(() => {
    const values = this.headlessChipsExamplesPlainReleaseLanes();
    return values.length > 0 ? values.join(', ') : 'none';
  });

  onHeadlessChipsExamplesPlainReleaseLanesChange(nextValues: readonly unknown[]): void {
    this.headlessChipsExamplesPlainReleaseLanes.set(
      nextValues.filter((value): value is string => typeof value === 'string'),
    );
  }

  isHeadlessChipsExamplesPlainReleaseLaneLocked(lane: string): boolean {
    return lane === 'Locked';
  }
}`;

const LOCKED_PLAIN_HTML_CODE = String.raw`<section class="docs-headless-chips-examples-locked-plain-shell">
  <div class="docs-headless-chips-examples-locked-plain-header">
    <span class="docs-headless-chips-examples-locked-plain-kicker">Release lanes</span>
    <p class="docs-headless-chips-examples-locked-plain-copy">
      Disabled chips stay visible, but only active lanes remain removable.
    </p>
  </div>

  <section tngChips
    class="docs-headless-chips-examples-locked-plain-control"
    [tngChipsValues]="headlessChipsExamplesPlainReleaseLanes()"
    (valuesChange)="onHeadlessChipsExamplesPlainReleaseLanesChange($event)"
    [tngChipsAriaLabel]="'Release lanes'"
  >
    <div class="docs-headless-chips-examples-locked-plain-row">
      @for (lane of headlessChipsExamplesPlainReleaseLanes(); track lane) {
        <span
          tngChip
          [tngChipValue]="lane"
          [tngChipLabel]="lane"
          [tngChipDisabled]="isHeadlessChipsExamplesPlainReleaseLaneLocked(lane)"
          class="docs-headless-chips-examples-locked-plain-chip"
        >
          <span>{{ lane }}</span>
          <button tngChipRemove type="button" class="docs-headless-chips-examples-locked-plain-chip-remove">&times;</button>
        </span>
      }
    </div>
  </section>

  <p class="docs-headless-chips-examples-locked-plain-summary">Selected: {{ headlessChipsExamplesPlainReleaseLaneSummary() }}</p>
</section>`;

const LOCKED_PLAIN_CSS_CODE = String.raw`.docs-headless-chips-examples-locked-plain-shell {
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

.docs-headless-chips-examples-locked-plain-control {
  display: block;
  width: 100%;
  min-width: 0;
  color-scheme: light;
  --tng-semantic-background-base: #ffffff;
  --tng-semantic-border-subtle: #d8e2ef;
  --tng-semantic-foreground-primary: #0f172a;
}

.docs-headless-chips-examples-locked-plain-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.docs-headless-chips-examples-locked-plain-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 999px;
  border: 1px solid #99f6e4;
  background: #ecfeff;
  color: #115e59;
  padding: 0.45rem 0.8rem;
}

.docs-headless-chips-examples-locked-plain-chip[data-disabled] {
  border-color: #cbd5e1;
  background: #f8fafc;
  color: #94a3b8;
}

.docs-headless-chips-examples-locked-plain-chip-remove {
  border: 0;
  border-radius: 999px;
  background: rgba(20, 184, 166, 0.16);
  color: inherit;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 1.2rem;
  block-size: 1.2rem;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1;
  padding: 0;
}`;

const LOCKED_TAILWIND_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import { TngChip, TngChipRemove, TngChips } from '@tailng-ui/primitives';

const HEADLESS_CHIPS_EXAMPLES_TAILWIND_RELEASE_LANES = Object.freeze([
  'Stable',
  'Preview',
  'Canary',
]);

@Component({
  selector: 'app-headless-chips-examples-locked-tailwind',
  standalone: true,
  imports: [TngChips, TngChip, TngChipRemove],
  templateUrl: './headless-chips-examples-locked-tailwind.component.html',
  styleUrl: './headless-chips-examples-locked-tailwind.component.css',
})
export class HeadlessChipsExamplesLockedTailwindComponent {
  readonly headlessChipsExamplesTailwindReleaseLanes = signal<readonly string[]>(
    HEADLESS_CHIPS_EXAMPLES_TAILWIND_RELEASE_LANES,
  );
  readonly headlessChipsExamplesTailwindReleaseLaneSummary = computed(() => {
    const values = this.headlessChipsExamplesTailwindReleaseLanes();
    return values.length > 0 ? values.join(', ') : 'none';
  });

  onHeadlessChipsExamplesTailwindReleaseLanesChange(nextValues: readonly unknown[]): void {
    this.headlessChipsExamplesTailwindReleaseLanes.set(
      nextValues.filter((value): value is string => typeof value === 'string'),
    );
  }

  isHeadlessChipsExamplesTailwindReleaseLaneLocked(lane: string): boolean {
    return lane === 'Canary';
  }
}`;

const LOCKED_TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid max-w-[36rem] gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Release lanes</span>
    <p class="m-0 text-sm text-slate-600">
      Disabled chips stay visible, but only active lanes remain removable.
    </p>
  </div>

  <section tngChips
    class="block w-full min-w-0 [--tng-semantic-background-base:#ffffff] [--tng-semantic-border-subtle:#d8e2ef] [--tng-semantic-foreground-primary:#0f172a]"
    [tngChipsValues]="headlessChipsExamplesTailwindReleaseLanes()"
    (valuesChange)="onHeadlessChipsExamplesTailwindReleaseLanesChange($event)"
    [tngChipsAriaLabel]="'Release lanes'"
  >
    <div class="flex flex-wrap gap-2">
      @for (lane of headlessChipsExamplesTailwindReleaseLanes(); track lane) {
        <span tngChip [tngChipValue]="lane" [tngChipLabel]="lane" [tngChipDisabled]="isHeadlessChipsExamplesTailwindReleaseLaneLocked(lane)" class="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] data-[disabled]:border-slate-200 data-[disabled]:bg-slate-50 data-[disabled]:text-slate-400">
          <span>{{ lane }}</span>
          <button tngChipRemove type="button" class="inline-grid h-5 w-5 place-items-center rounded-full bg-amber-100 text-[0.8rem] leading-none text-amber-800 transition hover:bg-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400">&times;</button>
        </span>
      }
    </div>
  </section>

  <p class="m-0 text-xs text-slate-600">Selected: {{ headlessChipsExamplesTailwindReleaseLaneSummary() }}</p>
</section>`;

const LOCKED_TAILWIND_CSS_CODE = '/* Tailwind utilities are applied directly in the template. */';

@Component({
  selector: 'app-headless-chips-examples-page',
  imports: [
    TngChips,
    TngChip,
    TngChipRemove,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './chips-examples-page.component.html',
  styleUrl: './chips-examples-page.component.css',
})
export class HeadlessChipsExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly filterPlainValues = signal<readonly string[]>([
    'Accessibility',
    'API docs',
    'Release notes',
  ]);
  protected readonly filterTailwindValues = signal<readonly string[]>(['Registry', 'Docs', 'CLI']);
  protected readonly lockedPlainValues = signal<readonly string[]>(['Stable', 'Preview', 'Locked']);
  protected readonly lockedTailwindValues = signal<readonly string[]>(['Stable', 'Preview', 'Canary']);

  protected readonly filterPlainSummary = computed(() => this.joinValues(this.filterPlainValues()));
  protected readonly filterTailwindSummary = computed(() => this.joinValues(this.filterTailwindValues()));
  protected readonly lockedPlainSummary = computed(() => this.joinValues(this.lockedPlainValues()));
  protected readonly lockedTailwindSummary = computed(() => this.joinValues(this.lockedTailwindValues()));

  protected readonly removablePlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'headless-chips-examples-filter-plain.component.ts', code: FILTER_PLAIN_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'headless-chips-examples-filter-plain.component.html', code: FILTER_PLAIN_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'headless-chips-examples-filter-plain.component.css', code: FILTER_PLAIN_CSS_CODE },
  ]);
  protected readonly removableTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'headless-chips-examples-filter-tailwind.component.ts', code: FILTER_TAILWIND_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'headless-chips-examples-filter-tailwind.component.html', code: FILTER_TAILWIND_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'headless-chips-examples-filter-tailwind.component.css', code: FILTER_TAILWIND_CSS_CODE },
  ]);
  protected readonly lockedPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'headless-chips-examples-locked-plain.component.ts', code: LOCKED_PLAIN_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'headless-chips-examples-locked-plain.component.html', code: LOCKED_PLAIN_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'headless-chips-examples-locked-plain.component.css', code: LOCKED_PLAIN_CSS_CODE },
  ]);
  protected readonly lockedTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'headless-chips-examples-locked-tailwind.component.ts', code: LOCKED_TAILWIND_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'headless-chips-examples-locked-tailwind.component.html', code: LOCKED_TAILWIND_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'headless-chips-examples-locked-tailwind.component.css', code: LOCKED_TAILWIND_CSS_CODE },
  ]);

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;

  ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected onFilterPlainValuesChange(nextValues: readonly unknown[]): void {
    this.filterPlainValues.set(this.toStringArray(nextValues));
  }

  protected onFilterTailwindValuesChange(nextValues: readonly unknown[]): void {
    this.filterTailwindValues.set(this.toStringArray(nextValues));
  }

  protected onLockedPlainValuesChange(nextValues: readonly unknown[]): void {
    this.lockedPlainValues.set(this.toStringArray(nextValues));
  }

  protected onLockedTailwindValuesChange(nextValues: readonly unknown[]): void {
    this.lockedTailwindValues.set(this.toStringArray(nextValues));
  }

  protected isLockedPlainValue(value: string): boolean {
    return value === 'Locked';
  }

  protected isLockedTailwindValue(value: string): boolean {
    return value === 'Canary';
  }

  private toStringArray(nextValues: readonly unknown[]): readonly string[] {
    return nextValues.filter((value): value is string => typeof value === 'string');
  }

  private joinValues(values: readonly string[]): string {
    return values.length > 0 ? values.join(', ') : 'none';
  }
}
