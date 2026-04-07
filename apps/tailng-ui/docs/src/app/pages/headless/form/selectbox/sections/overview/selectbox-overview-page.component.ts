import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  TngSelect,
  TngSelectContent,
  TngSelectIcon,
  TngSelectListbox,
  TngSelectOption,
  TngSelectOverlay,
  TngSelectTrigger,
  TngSelectValue,
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
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../selectbox.util';

interface WorkflowStageOption {
  readonly disabled?: boolean;
  readonly label: string;
  readonly note: string;
  readonly value: string;
}

type SelectboxValue = string | readonly string[] | null;

const WORKFLOW_STAGE_OPTIONS: readonly WorkflowStageOption[] = Object.freeze([
  { value: 'draft', label: 'Draft', note: 'Internal drafting only.' },
  { value: 'review', label: 'In review', note: 'Waiting on editorial review.' },
  { value: 'qa', label: 'QA ready', note: 'Approved for validation.' },
  { value: 'live', label: 'Live', note: 'Already published.', disabled: true },
]);

const PRIMITIVE_IMPORT_CODE = String.raw`import {
  TngSelect,
  TngSelectContent,
  TngSelectIcon,
  TngSelectListbox,
  TngSelectOption,
  TngSelectOverlay,
  TngSelectTrigger,
  TngSelectValue,
} from '@tailng-ui/primitives';`;

const BASIC_USAGE_CODE = String.raw`<section
  tngSelect
  [value]="selectedStage()"
  (valueChange)="onSelectedStageChange($event)"
>
  <button type="button" tngSelectTrigger>
    <span tngSelectValue>{{ selectedStageLabel() ?? 'Choose workflow stage' }}</span>
    <span tngSelectIcon aria-hidden="true">▾</span>
  </button>

  <div tngSelectContent class="docs-headless-selectbox-basic-content">
    <div tngSelectOverlay>
      <div
        tngSelectListbox
        [value]="selectedStage()"
        (valueChange)="onSelectedStageChange($event)"
      >
        @for (stage of workflowStages; track stage.value) {
          <div tngSelectOption [tngValue]="stage.value">{{ stage.label }}</div>
        }
      </div>
    </div>
  </div>
</section>`;

const PLAIN_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import {
  TngSelect,
  TngSelectContent,
  TngSelectIcon,
  TngSelectListbox,
  TngSelectOption,
  TngSelectOverlay,
  TngSelectTrigger,
  TngSelectValue,
} from '@tailng-ui/primitives';

interface HeadlessSelectboxOverviewPlainWorkflowStageOption {
  readonly disabled?: boolean;
  readonly label: string;
  readonly note: string;
  readonly value: string;
}

type HeadlessSelectboxOverviewPlainValue = string | readonly string[] | null;

const HEADLESS_SELECTBOX_OVERVIEW_PLAIN_WORKFLOW_STAGE_OPTIONS: readonly HeadlessSelectboxOverviewPlainWorkflowStageOption[] = Object.freeze([
  { value: 'draft', label: 'Draft', note: 'Internal drafting only.' },
  { value: 'review', label: 'In review', note: 'Waiting on editorial review.' },
  { value: 'qa', label: 'QA ready', note: 'Approved for validation.' },
  { value: 'live', label: 'Live', note: 'Already published.', disabled: true },
]);

@Component({
  selector: 'app-headless-selectbox-overview-plain-example',
  standalone: true,
  imports: [
    TngSelect,
    TngSelectTrigger,
    TngSelectValue,
    TngSelectIcon,
    TngSelectContent,
    TngSelectOverlay,
    TngSelectListbox,
    TngSelectOption,
  ],
  templateUrl: './headless-selectbox-overview-plain-example.component.html',
  styleUrl: './headless-selectbox-overview-plain-example.component.css',
})
export class HeadlessSelectboxOverviewPlainExampleComponent {
  readonly headlessSelectboxOverviewPlainWorkflowStages =
    HEADLESS_SELECTBOX_OVERVIEW_PLAIN_WORKFLOW_STAGE_OPTIONS;
  readonly headlessSelectboxOverviewPlainSelectedStage = signal<string | null>('review');
  readonly headlessSelectboxOverviewPlainSelectedStageLabel = computed(() => {
    const selectedValue = this.headlessSelectboxOverviewPlainSelectedStage();
    if (selectedValue === null) {
      return null;
    }

    return (
      this.headlessSelectboxOverviewPlainWorkflowStages.find(
        (stage) => stage.value === selectedValue,
      )?.label ?? null
    );
  });
  readonly headlessSelectboxOverviewPlainSelectedStageSummary = computed(() =>
    this.headlessSelectboxOverviewPlainSelectedStageLabel() ?? 'none',
  );

  onHeadlessSelectboxOverviewPlainSelectedStageChange(
    value: HeadlessSelectboxOverviewPlainValue,
  ): void {
    this.headlessSelectboxOverviewPlainSelectedStage.set(
      this.toHeadlessSelectboxOverviewPlainSingleValue(value),
    );
  }

  private toHeadlessSelectboxOverviewPlainSingleValue(
    value: HeadlessSelectboxOverviewPlainValue,
  ): string | null {
    if (typeof value === 'string') {
      return value;
    }

    if (Array.isArray(value)) {
      const first = value[0];
      return typeof first === 'string' ? first : null;
    }

    return null;
  }
}`;

const PLAIN_HTML_CODE = String.raw`<section class="docs-headless-selectbox-overview-plain-shell">
  <div class="docs-headless-selectbox-overview-plain-header">
    <span class="docs-headless-selectbox-overview-plain-kicker">Workflow stage</span>
    <p class="docs-headless-selectbox-overview-plain-copy">
      Primitive-first single selection with an owned trigger and owned overlay rows.
    </p>
  </div>

  <section
    tngSelect
    class="docs-headless-selectbox-overview-plain-root"
    [value]="headlessSelectboxOverviewPlainSelectedStage()"
    (valueChange)="onHeadlessSelectboxOverviewPlainSelectedStageChange($event)"
  >
    <button type="button" tngSelectTrigger class="docs-headless-selectbox-overview-plain-trigger">
      <span
        tngSelectValue
        class="docs-headless-selectbox-overview-plain-value"
        [attr.data-placeholder]="headlessSelectboxOverviewPlainSelectedStageLabel() === null ? '' : null"
      >
        {{ headlessSelectboxOverviewPlainSelectedStageLabel() ?? 'Choose workflow stage' }}
      </span>
      <span tngSelectIcon class="docs-headless-selectbox-overview-plain-icon" aria-hidden="true">▾</span>
    </button>

    <div tngSelectContent class="docs-headless-selectbox-overview-plain-content">
      <div tngSelectOverlay class="docs-headless-selectbox-overview-plain-overlay">
        <div
          tngSelectListbox
          class="docs-headless-selectbox-overview-plain-listbox"
          [value]="headlessSelectboxOverviewPlainSelectedStage()"
          (valueChange)="onHeadlessSelectboxOverviewPlainSelectedStageChange($event)"
        >
          @for (stage of headlessSelectboxOverviewPlainWorkflowStages; track stage.value) {
            <div
              tngSelectOption
              class="docs-headless-selectbox-overview-plain-option"
              [tngValue]="stage.value"
              [disabled]="stage.disabled === true"
            >
              <p class="docs-headless-selectbox-overview-plain-option-label">{{ stage.label }}</p>
              <p class="docs-headless-selectbox-overview-plain-option-meta">{{ stage.note }}</p>
            </div>
          }
        </div>
      </div>
    </div>
  </section>

  <p class="docs-headless-selectbox-overview-plain-summary">
    Selected: {{ headlessSelectboxOverviewPlainSelectedStageSummary() }}
  </p>
</section>`;

const PLAIN_CSS_CODE = String.raw`.docs-headless-selectbox-overview-plain-shell {
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

.docs-headless-selectbox-overview-plain-header {
  display: grid;
  gap: 0.35rem;
}

.docs-headless-selectbox-overview-plain-kicker {
  font-size: 0.8rem;
  font-weight: 700;
  color: #64748b;
}

.docs-headless-selectbox-overview-plain-copy,
.docs-headless-selectbox-overview-plain-summary {
  margin: 0;
  color: #475569;
}

.docs-headless-selectbox-overview-plain-root {
  display: block;
  width: 100%;
}

.docs-headless-selectbox-overview-plain-trigger {
  display: flex;
  width: 100%;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.8rem 0.95rem;
  border: 1px solid #94a3b8;
  border-radius: 1rem;
  background: #ffffff;
  color: #0f172a;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  cursor: pointer;
  transition: border-color 140ms ease, box-shadow 140ms ease, background-color 140ms ease;
}

.docs-headless-selectbox-overview-plain-trigger:hover {
  border-color: #64748b;
}

.docs-headless-selectbox-overview-plain-trigger:focus,
.docs-headless-selectbox-overview-plain-trigger:focus-visible {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.18);
}

.docs-headless-selectbox-overview-plain-value {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.docs-headless-selectbox-overview-plain-value[data-placeholder] {
  color: #64748b;
}

.docs-headless-selectbox-overview-plain-icon {
  color: #64748b;
  font-size: 0.75rem;
}

.docs-headless-selectbox-overview-plain-content {
  display: contents;
}

.docs-headless-selectbox-overview-plain-overlay {
  max-inline-size: min(92vw, 36rem);
  border: 1px solid #d8e2ef;
  border-radius: 1rem;
  background: #ffffff;
  box-shadow: 0 18px 38px rgba(15, 23, 42, 0.14);
  padding: 0.4rem;
}

.docs-headless-selectbox-overview-plain-listbox {
  display: grid;
  gap: 0.25rem;
}

.docs-headless-selectbox-overview-plain-option {
  display: grid;
  gap: 0.2rem;
  padding: 0.75rem 0.85rem;
  border: 1px solid transparent;
  border-radius: 0.85rem;
  background: transparent;
  cursor: pointer;
  transition: border-color 120ms ease, background-color 120ms ease, box-shadow 120ms ease, opacity 120ms ease;
}

.docs-headless-selectbox-overview-plain-option[data-active] {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.docs-headless-selectbox-overview-plain-option[data-selected] {
  background: #eff6ff;
  border-color: #93c5fd;
}

.docs-headless-selectbox-overview-plain-option[data-selected][data-active] {
  background: #dbeafe;
  border-color: #60a5fa;
  box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.12);
}

.docs-headless-selectbox-overview-plain-option[data-disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

.docs-headless-selectbox-overview-plain-option-label,
.docs-headless-selectbox-overview-plain-option-meta {
  margin: 0;
}

.docs-headless-selectbox-overview-plain-option-label {
  font-weight: 600;
  color: #0f172a;
}

.docs-headless-selectbox-overview-plain-option-meta {
  color: #64748b;
  font-size: 0.875rem;
}`;

const TAILWIND_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import {
  TngSelect,
  TngSelectContent,
  TngSelectIcon,
  TngSelectListbox,
  TngSelectOption,
  TngSelectOverlay,
  TngSelectTrigger,
  TngSelectValue,
} from '@tailng-ui/primitives';

interface HeadlessSelectboxOverviewTailwindWorkflowStageOption {
  readonly disabled?: boolean;
  readonly label: string;
  readonly note: string;
  readonly value: string;
}

type HeadlessSelectboxOverviewTailwindValue = string | readonly string[] | null;

const HEADLESS_SELECTBOX_OVERVIEW_TAILWIND_WORKFLOW_STAGE_OPTIONS: readonly HeadlessSelectboxOverviewTailwindWorkflowStageOption[] = Object.freeze([
  { value: 'draft', label: 'Draft', note: 'Internal drafting only.' },
  { value: 'review', label: 'In review', note: 'Waiting on editorial review.' },
  { value: 'qa', label: 'QA ready', note: 'Approved for validation.' },
  { value: 'live', label: 'Live', note: 'Already published.', disabled: true },
]);

@Component({
  selector: 'app-headless-selectbox-overview-tailwind-example',
  standalone: true,
  imports: [
    TngSelect,
    TngSelectTrigger,
    TngSelectValue,
    TngSelectIcon,
    TngSelectContent,
    TngSelectOverlay,
    TngSelectListbox,
    TngSelectOption,
  ],
  templateUrl: './headless-selectbox-overview-tailwind-example.component.html',
  styleUrl: './headless-selectbox-overview-tailwind-example.component.css',
})
export class HeadlessSelectboxOverviewTailwindExampleComponent {
  readonly headlessSelectboxOverviewTailwindWorkflowStages =
    HEADLESS_SELECTBOX_OVERVIEW_TAILWIND_WORKFLOW_STAGE_OPTIONS;
  readonly headlessSelectboxOverviewTailwindSelectedStage = signal<string | null>('qa');
  readonly headlessSelectboxOverviewTailwindSelectedStageLabel = computed(() => {
    const selectedValue = this.headlessSelectboxOverviewTailwindSelectedStage();
    if (selectedValue === null) {
      return null;
    }

    return (
      this.headlessSelectboxOverviewTailwindWorkflowStages.find(
        (stage) => stage.value === selectedValue,
      )?.label ?? null
    );
  });
  readonly headlessSelectboxOverviewTailwindSelectedStageSummary = computed(() =>
    this.headlessSelectboxOverviewTailwindSelectedStageLabel() ?? 'none',
  );

  onHeadlessSelectboxOverviewTailwindSelectedStageChange(
    value: HeadlessSelectboxOverviewTailwindValue,
  ): void {
    this.headlessSelectboxOverviewTailwindSelectedStage.set(
      this.toHeadlessSelectboxOverviewTailwindSingleValue(value),
    );
  }

  private toHeadlessSelectboxOverviewTailwindSingleValue(
    value: HeadlessSelectboxOverviewTailwindValue,
  ): string | null {
    if (typeof value === 'string') {
      return value;
    }

    if (Array.isArray(value)) {
      const first = value[0];
      return typeof first === 'string' ? first : null;
    }

    return null;
  }
}`;

const TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid max-w-[36rem] gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-5 text-slate-900 shadow-sm [color-scheme:light]">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Workflow stage</span>
    <p class="m-0 text-sm text-slate-600">
      Primitive-first single selection with an owned trigger and owned overlay rows.
    </p>
  </div>

  <section
    tngSelect
    class="block w-full"
    [value]="headlessSelectboxOverviewTailwindSelectedStage()"
    (valueChange)="onHeadlessSelectboxOverviewTailwindSelectedStageChange($event)"
  >
    <button
      type="button"
      tngSelectTrigger
      class="flex w-full min-w-0 items-center justify-between gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-left text-slate-900 shadow-sm transition hover:border-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-100"
    >
      <span
        tngSelectValue
        class="min-w-0 truncate"
        [attr.data-placeholder]="headlessSelectboxOverviewTailwindSelectedStageLabel() === null ? '' : null"
      >
        {{ headlessSelectboxOverviewTailwindSelectedStageLabel() ?? 'Choose workflow stage' }}
      </span>
      <span tngSelectIcon class="text-xs text-slate-500" aria-hidden="true">▾</span>
    </button>

    <div tngSelectContent class="contents">
      <div tngSelectOverlay class="max-w-[min(92vw,36rem)] rounded-2xl border border-slate-200 bg-white p-2 text-slate-900 shadow-2xl [color-scheme:light]">
        <div
          tngSelectListbox
          class="grid gap-1"
          [value]="headlessSelectboxOverviewTailwindSelectedStage()"
          (valueChange)="onHeadlessSelectboxOverviewTailwindSelectedStageChange($event)"
        >
          @for (stage of headlessSelectboxOverviewTailwindWorkflowStages; track stage.value) {
            <div
              tngSelectOption
              class="grid gap-1 rounded-xl border border-transparent px-4 py-3 text-slate-900 transition data-[active]:border-slate-200 data-[active]:bg-slate-50 data-[selected]:border-emerald-200 data-[selected]:bg-emerald-50 data-[selected]:text-emerald-800 [&[data-selected][data-active]]:border-emerald-400 [&[data-selected][data-active]]:bg-emerald-100 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-45"
              [tngValue]="stage.value"
              [disabled]="stage.disabled === true"
            >
              <p class="m-0 text-sm font-semibold text-current">{{ stage.label }}</p>
              <p class="m-0 text-sm text-slate-500">{{ stage.note }}</p>
            </div>
          }
        </div>
      </div>
    </div>
  </section>

  <p class="m-0 text-xs text-slate-600">Selected: {{ headlessSelectboxOverviewTailwindSelectedStageSummary() }}</p>
</section>`;

const TAILWIND_CSS_CODE = String.raw`/* No additional CSS required. Tailwind utility classes define the shell. */`;

@Component({
  selector: 'app-headless-selectbox-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngSelect,
    TngSelectTrigger,
    TngSelectValue,
    TngSelectIcon,
    TngSelectContent,
    TngSelectOverlay,
    TngSelectListbox,
    TngSelectOption,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './selectbox-overview-page.component.html',
  styleUrl: './selectbox-overview-page.component.css',
})
export class HeadlessSelectboxOverviewPageComponent implements OnDestroy {
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
  protected readonly workflowStages = WORKFLOW_STAGE_OPTIONS;

  protected readonly primitiveImportCode = PRIMITIVE_IMPORT_CODE;
  protected readonly basicUsageCode = BASIC_USAGE_CODE;

  protected readonly overviewPlainSelectedStage = signal<string | null>('review');
  protected readonly overviewTailwindSelectedStage = signal<string | null>('qa');

  protected readonly overviewPlainSelectedStageLabel = computed(() =>
    this.findWorkflowStageLabel(this.overviewPlainSelectedStage()),
  );
  protected readonly overviewTailwindSelectedStageLabel = computed(() =>
    this.findWorkflowStageLabel(this.overviewTailwindSelectedStage()),
  );

  protected readonly overviewPlainSummary = computed(
    () => this.overviewPlainSelectedStageLabel() ?? 'none',
  );
  protected readonly overviewTailwindSummary = computed(
    () => this.overviewTailwindSelectedStageLabel() ?? 'none',
  );

  protected readonly plainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-selectbox-overview-plain.component.ts',
      code: PLAIN_TS_CODE,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-selectbox-overview-plain.component.html',
      code: PLAIN_HTML_CODE,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-selectbox-overview-plain.component.css',
      code: PLAIN_CSS_CODE,
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-selectbox-overview-tailwind.component.ts',
      code: TAILWIND_TS_CODE,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-selectbox-overview-tailwind.component.html',
      code: TAILWIND_HTML_CODE,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-selectbox-overview-tailwind.component.css',
      code: TAILWIND_CSS_CODE,
    },
  ]);

  protected onOverviewPlainSelectedStageChange(value: SelectboxValue): void {
    this.overviewPlainSelectedStage.set(this.toSingleValue(value));
  }

  protected onOverviewTailwindSelectedStageChange(value: SelectboxValue): void {
    this.overviewTailwindSelectedStage.set(this.toSingleValue(value));
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  private findWorkflowStageLabel(value: string | null): string | null {
    if (value === null) {
      return null;
    }

    return this.workflowStages.find((stage) => stage.value === value)?.label ?? null;
  }

  private toSingleValue(value: SelectboxValue): string | null {
    if (typeof value === 'string') {
      return value;
    }

    if (Array.isArray(value)) {
      const first = value[0];
      return typeof first === 'string' ? first : null;
    }

    return null;
  }
}
