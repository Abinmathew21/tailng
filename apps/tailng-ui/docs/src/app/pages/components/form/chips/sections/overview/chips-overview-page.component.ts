import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { TngChip, TngChipRemove } from '@tailng-ui/primitives';
import { TngChipsComponent, TngCodeBlockComponent } from '@tailng-ui/components';
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

const COMPONENT_IMPORT_CODE = String.raw`import { TngChipsComponent } from '@tailng-ui/components';
import { TngChip, TngChipRemove } from '@tailng-ui/primitives';`;

const BASIC_USAGE_CODE = String.raw`<tng-chips
  [values]="selectedTopics()"
  (valuesChange)="onSelectedTopicsChange($event)"
  [ariaLabel]="'Selected topics'"
>
  <div class="topic-chip-row">
    @for (topic of selectedTopics(); track topic) {
      <span tngChip [tngChipValue]="topic" [tngChipLabel]="topic" class="topic-chip-pill">
        <span>{{ topic }}</span>
        <button tngChipRemove type="button" class="topic-chip-remove">&times;</button>
      </span>
    }
  </div>
</tng-chips>`;

const PLAIN_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import { TngChipsComponent } from '@tailng-ui/components';
import { TngChip, TngChipRemove } from '@tailng-ui/primitives';

const COMPONENT_CHIPS_OVERVIEW_PLAIN_SELECTED_TOPICS = Object.freeze([
  'Accessibility',
  'Forms',
  'Release notes',
]);

@Component({
  selector: 'app-component-chips-overview-plain-example',
  standalone: true,
  imports: [TngChipsComponent, TngChip, TngChipRemove],
  templateUrl: './component-chips-overview-plain-example.component.html',
  styleUrl: './component-chips-overview-plain-example.component.css',
})
export class ComponentChipsOverviewPlainExampleComponent {
  readonly componentChipsOverviewPlainSelectedTopics = signal<readonly string[]>(
    COMPONENT_CHIPS_OVERVIEW_PLAIN_SELECTED_TOPICS,
  );
  readonly componentChipsOverviewPlainSummary = computed(() => {
    const values = this.componentChipsOverviewPlainSelectedTopics();
    return values.length > 0 ? values.join(', ') : 'none';
  });

  onComponentChipsOverviewPlainValuesChange(nextValues: readonly unknown[]): void {
    this.componentChipsOverviewPlainSelectedTopics.set(
      nextValues.filter((value): value is string => typeof value === 'string'),
    );
  }
}`;

const PLAIN_HTML_CODE = String.raw`<section class="docs-component-chips-overview-plain-shell">
  <div class="docs-component-chips-overview-plain-header">
    <span class="docs-component-chips-overview-plain-kicker">Selected topics</span>
    <p class="docs-component-chips-overview-plain-copy">
      Wrapper-first removable chips with a light shell and a controlled value array.
    </p>
  </div>

  <tng-chips
    class="docs-component-chips-overview-plain-control"
    [values]="componentChipsOverviewPlainSelectedTopics()"
    (valuesChange)="onComponentChipsOverviewPlainValuesChange($event)"
    [ariaLabel]="'Selected topics'"
  >
    <div class="docs-component-chips-overview-plain-row">
      @for (topic of componentChipsOverviewPlainSelectedTopics(); track topic) {
        <span tngChip [tngChipValue]="topic" [tngChipLabel]="topic" class="docs-component-chips-overview-plain-chip">
          <span>{{ topic }}</span>
          <button tngChipRemove type="button" class="docs-component-chips-overview-plain-chip-remove">&times;</button>
        </span>
      }
    </div>
  </tng-chips>

  <p class="docs-component-chips-overview-plain-summary">Selected: {{ componentChipsOverviewPlainSummary() }}</p>
</section>`;

const PLAIN_CSS_CODE = String.raw`.docs-component-chips-overview-plain-shell {
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

.docs-component-chips-overview-plain-header {
  display: grid;
  gap: 0.35rem;
}

.docs-component-chips-overview-plain-kicker {
  font-size: 0.8rem;
  font-weight: 700;
  color: #64748b;
}

.docs-component-chips-overview-plain-copy,
.docs-component-chips-overview-plain-summary {
  margin: 0;
  color: #475569;
}

.docs-component-chips-overview-plain-control {
  display: block;
  width: 100%;
  min-width: 0;
  color-scheme: light;
  --tng-semantic-background-base: #ffffff;
  --tng-semantic-border-subtle: #d8e2ef;
  --tng-semantic-foreground-primary: #0f172a;
}

.docs-component-chips-overview-plain-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.docs-component-chips-overview-plain-chip {
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

.docs-component-chips-overview-plain-chip-remove {
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

.docs-component-chips-overview-plain-chip-remove[data-focused] {
  outline: 2px solid rgba(37, 99, 235, 0.28);
  outline-offset: 2px;
}`;

const TAILWIND_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import { TngChipsComponent } from '@tailng-ui/components';
import { TngChip, TngChipRemove } from '@tailng-ui/primitives';

const COMPONENT_CHIPS_OVERVIEW_TAILWIND_SELECTED_SURFACES = Object.freeze([
  'Registry',
  'CLI',
  'Docs',
]);

@Component({
  selector: 'app-component-chips-overview-tailwind-example',
  standalone: true,
  imports: [TngChipsComponent, TngChip, TngChipRemove],
  templateUrl: './component-chips-overview-tailwind-example.component.html',
  styleUrl: './component-chips-overview-tailwind-example.component.css',
})
export class ComponentChipsOverviewTailwindExampleComponent {
  readonly componentChipsOverviewTailwindSelectedSurfaces = signal<readonly string[]>(
    COMPONENT_CHIPS_OVERVIEW_TAILWIND_SELECTED_SURFACES,
  );
  readonly componentChipsOverviewTailwindSummary = computed(() => {
    const values = this.componentChipsOverviewTailwindSelectedSurfaces();
    return values.length > 0 ? values.join(', ') : 'none';
  });

  onComponentChipsOverviewTailwindValuesChange(nextValues: readonly unknown[]): void {
    this.componentChipsOverviewTailwindSelectedSurfaces.set(
      nextValues.filter((value): value is string => typeof value === 'string'),
    );
  }
}`;

const TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid max-w-[36rem] gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Selected surfaces</span>
    <p class="m-0 text-sm text-slate-600">
      Wrapper-first removable chips with utility-first styling on top of the same projected primitive parts.
    </p>
  </div>

  <tng-chips
    class="block w-full min-w-0 [--tng-semantic-background-base:#ffffff] [--tng-semantic-border-subtle:#d8e2ef] [--tng-semantic-foreground-primary:#0f172a]"
    [values]="componentChipsOverviewTailwindSelectedSurfaces()"
    (valuesChange)="onComponentChipsOverviewTailwindValuesChange($event)"
    [ariaLabel]="'Selected surfaces'"
  >
    <div class="flex flex-wrap gap-2">
      @for (surface of componentChipsOverviewTailwindSelectedSurfaces(); track surface) {
        <span tngChip [tngChipValue]="surface" [tngChipLabel]="surface" class="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
          <span>{{ surface }}</span>
          <button tngChipRemove type="button" class="inline-grid h-5 w-5 place-items-center rounded-full bg-emerald-100 text-[0.8rem] leading-none text-emerald-800 transition hover:bg-emerald-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400">&times;</button>
        </span>
      }
    </div>
  </tng-chips>

  <p class="m-0 text-xs text-slate-600">Selected: {{ componentChipsOverviewTailwindSummary() }}</p>
</section>`;

const TAILWIND_CSS_CODE = '/* Tailwind utilities are applied directly in the template. */';

@Component({
  selector: 'app-chips-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngChipsComponent,
    TngChip,
    TngChipRemove,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './chips-overview-page.component.html',
  styleUrl: './chips-overview-page.component.css',
})
export class ChipsOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly componentImportCode = COMPONENT_IMPORT_CODE;
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
      title: 'component-chips-overview-plain-example.component.ts',
      code: PLAIN_TS_CODE,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'component-chips-overview-plain-example.component.html',
      code: PLAIN_HTML_CODE,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'component-chips-overview-plain-example.component.css',
      code: PLAIN_CSS_CODE,
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'component-chips-overview-tailwind-example.component.ts',
      code: TAILWIND_TS_CODE,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'component-chips-overview-tailwind-example.component.html',
      code: TAILWIND_HTML_CODE,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'component-chips-overview-tailwind-example.component.css',
      code: TAILWIND_CSS_CODE,
    },
  ]);

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;

  ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected onOverviewPlainValuesChange(nextValues: readonly unknown[]): void {
    this.overviewPlainSelectedTopics.set(this.toStringArray(nextValues));
  }

  protected onOverviewTailwindValuesChange(nextValues: readonly unknown[]): void {
    this.overviewTailwindSelectedSurfaces.set(this.toStringArray(nextValues));
  }

  private toStringArray(nextValues: readonly unknown[]): readonly string[] {
    return nextValues.filter((value): value is string => typeof value === 'string');
  }
}
