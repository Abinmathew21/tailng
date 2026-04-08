import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
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

const PRIMITIVE_IMPORT_CODE = String.raw`import { TngChip, TngChipRemove, TngChips } from '@tailng-ui/primitives';`;

const BASIC_USAGE_CODE = String.raw`<section
  tngChips
  [tngChipsValues]="selectedTopics()"
  (valuesChange)="onSelectedTopicsChange($event)"
  [tngChipsAriaLabel]="'Selected topics'"
>
  <div class="topic-chip-row">
    @for (topic of selectedTopics(); track topic) {
      <span tngChip [tngChipValue]="topic" [tngChipLabel]="topic" class="topic-chip-pill">
        <span>{{ topic }}</span>
        <button tngChipRemove type="button" class="topic-chip-remove">&times;</button>
      </span>
    }
  </div>
</section>`;

const PLAIN_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import { TngChip, TngChipRemove, TngChips } from '@tailng-ui/primitives';

const HEADLESS_CHIPS_OVERVIEW_PLAIN_SELECTED_TOPICS = Object.freeze([
  'Accessibility',
  'Forms',
  'Release notes',
]);

@Component({
  selector: 'app-headless-chips-overview-plain-example',
  standalone: true,
  imports: [TngChips, TngChip, TngChipRemove],
  templateUrl: './headless-chips-overview-plain-example.component.html',
  styleUrl: './headless-chips-overview-plain-example.component.css',
})
export class HeadlessChipsOverviewPlainExampleComponent {
  readonly headlessChipsOverviewPlainSelectedTopics = signal<readonly string[]>(
    HEADLESS_CHIPS_OVERVIEW_PLAIN_SELECTED_TOPICS,
  );
  readonly headlessChipsOverviewPlainSummary = computed(() => {
    const values = this.headlessChipsOverviewPlainSelectedTopics();
    return values.length > 0 ? values.join(', ') : 'none';
  });

  onHeadlessChipsOverviewPlainValuesChange(nextValues: readonly unknown[]): void {
    this.headlessChipsOverviewPlainSelectedTopics.set(
      nextValues.filter((value): value is string => typeof value === 'string'),
    );
  }
}`;

const PLAIN_HTML_CODE = String.raw`<section class="docs-headless-chips-overview-plain-shell">
  <div class="docs-headless-chips-overview-plain-header">
    <span class="docs-headless-chips-overview-plain-kicker">Selected topics</span>
    <p class="docs-headless-chips-overview-plain-copy">
      Primitive-first removable chips with a light shell and a controlled value array.
    </p>
  </div>

  <section
    tngChips
    class="docs-headless-chips-overview-plain-root"
    [tngChipsValues]="headlessChipsOverviewPlainSelectedTopics()"
    (valuesChange)="onHeadlessChipsOverviewPlainValuesChange($event)"
    [tngChipsAriaLabel]="'Selected topics'"
  >
    <div class="docs-headless-chips-overview-plain-row">
      @for (topic of headlessChipsOverviewPlainSelectedTopics(); track topic) {
        <span tngChip [tngChipValue]="topic" [tngChipLabel]="topic" class="docs-headless-chips-overview-plain-chip">
          <span>{{ topic }}</span>
          <button tngChipRemove type="button" class="docs-headless-chips-overview-plain-chip-remove">&times;</button>
        </span>
      }
    </div>
  </section>

  <p class="docs-headless-chips-overview-plain-summary">Selected: {{ headlessChipsOverviewPlainSummary() }}</p>
</section>`;

const PLAIN_CSS_CODE = String.raw`.docs-headless-chips-overview-plain-shell {
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

.docs-headless-chips-overview-plain-header {
  display: grid;
  gap: 0.35rem;
}

.docs-headless-chips-overview-plain-kicker {
  font-size: 0.8rem;
  font-weight: 700;
  color: #64748b;
}

.docs-headless-chips-overview-plain-copy,
.docs-headless-chips-overview-plain-summary {
  margin: 0;
  color: #475569;
}

.docs-headless-chips-overview-plain-root {
  display: block;
  width: 100%;
  min-width: 0;
}

.docs-headless-chips-overview-plain-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.docs-headless-chips-overview-plain-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 999px;
  border: 1px solid #bfdbfe;
  background: #eff6ff;
  color: #1e3a8a;
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.2;
  padding: 0.45rem 0.8rem;
}

.docs-headless-chips-overview-plain-chip-remove {
  border: 0;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.12);
  color: inherit;
  cursor: pointer;
  display: inline-grid;
  place-items: center;
  inline-size: 1.2rem;
  block-size: 1.2rem;
  padding: 0;
}

.docs-headless-chips-overview-plain-chip-remove[data-focused] {
  outline: 2px solid rgba(37, 99, 235, 0.28);
  outline-offset: 2px;
}`;

const TAILWIND_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import { TngChip, TngChipRemove, TngChips } from '@tailng-ui/primitives';

const HEADLESS_CHIPS_OVERVIEW_TAILWIND_SELECTED_SURFACES = Object.freeze([
  'Registry',
  'CLI',
  'Docs',
]);

@Component({
  selector: 'app-headless-chips-overview-tailwind-example',
  standalone: true,
  imports: [TngChips, TngChip, TngChipRemove],
  templateUrl: './headless-chips-overview-tailwind-example.component.html',
  styleUrl: './headless-chips-overview-tailwind-example.component.css',
})
export class HeadlessChipsOverviewTailwindExampleComponent {
  readonly headlessChipsOverviewTailwindSelectedSurfaces = signal<readonly string[]>(
    HEADLESS_CHIPS_OVERVIEW_TAILWIND_SELECTED_SURFACES,
  );
  readonly headlessChipsOverviewTailwindSummary = computed(() => {
    const values = this.headlessChipsOverviewTailwindSelectedSurfaces();
    return values.length > 0 ? values.join(', ') : 'none';
  });

  onHeadlessChipsOverviewTailwindValuesChange(nextValues: readonly unknown[]): void {
    this.headlessChipsOverviewTailwindSelectedSurfaces.set(
      nextValues.filter((value): value is string => typeof value === 'string'),
    );
  }
}`;

const TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid max-w-[36rem] gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Selected surfaces</span>
    <p class="m-0 text-sm text-slate-600">
      Primitive-first removable chips with utility-first styling on top of the same projected chip parts.
    </p>
  </div>

  <section
    tngChips
    class="block w-full min-w-0"
    [tngChipsValues]="headlessChipsOverviewTailwindSelectedSurfaces()"
    (valuesChange)="onHeadlessChipsOverviewTailwindValuesChange($event)"
    [tngChipsAriaLabel]="'Selected surfaces'"
  >
    <div class="flex flex-wrap gap-2">
      @for (surface of headlessChipsOverviewTailwindSelectedSurfaces(); track surface) {
        <span tngChip [tngChipValue]="surface" [tngChipLabel]="surface" class="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-medium text-sky-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
          <span>{{ surface }}</span>
          <button tngChipRemove type="button" class="inline-grid h-5 w-5 place-items-center rounded-full bg-sky-100 text-[0.8rem] leading-none text-sky-800 transition hover:bg-sky-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400">&times;</button>
        </span>
      }
    </div>
  </section>

  <p class="m-0 text-xs text-slate-600">Selected: {{ headlessChipsOverviewTailwindSummary() }}</p>
</section>`;

const TAILWIND_CSS_CODE = '/* Tailwind utilities are applied directly in the template. */';

@Component({
  selector: 'app-headless-chips-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngChips,
    TngChip,
    TngChipRemove,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './chips-overview-page.component.html',
  styleUrl: './chips-overview-page.component.css',
})
export class HeadlessChipsOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly primitiveImportCode = PRIMITIVE_IMPORT_CODE;
  protected readonly basicUsageCode = BASIC_USAGE_CODE;

  protected readonly overviewPlainSelectedTopics = signal<readonly string[]>([
    'Accessibility',
    'Forms',
    'Release notes',
  ]);
  protected readonly overviewTailwindSelectedSurfaces = signal<readonly string[]>([
    'Registry',
    'CLI',
    'Docs',
  ]);

  protected readonly overviewPlainSummary = computed(() => {
    const values = this.overviewPlainSelectedTopics();
    return values.length > 0 ? values.join(', ') : 'none';
  });
  protected readonly overviewTailwindSummary = computed(() => {
    const values = this.overviewTailwindSelectedSurfaces();
    return values.length > 0 ? values.join(', ') : 'none';
  });

  protected readonly plainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-chips-overview-plain.component.ts',
      code: PLAIN_TS_CODE,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-chips-overview-plain.component.html',
      code: PLAIN_HTML_CODE,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-chips-overview-plain.component.css',
      code: PLAIN_CSS_CODE,
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-chips-overview-tailwind.component.ts',
      code: TAILWIND_TS_CODE,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-chips-overview-tailwind.component.html',
      code: TAILWIND_HTML_CODE,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-chips-overview-tailwind.component.css',
      code: TAILWIND_CSS_CODE,
    },
  ]);

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;

  protected onOverviewPlainValuesChange(nextValues: readonly unknown[]): void {
    this.overviewPlainSelectedTopics.set(
      nextValues.filter((value): value is string => typeof value === 'string'),
    );
  }

  protected onOverviewTailwindValuesChange(nextValues: readonly unknown[]): void {
    this.overviewTailwindSelectedSurfaces.set(
      nextValues.filter((value): value is string => typeof value === 'string'),
    );
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
