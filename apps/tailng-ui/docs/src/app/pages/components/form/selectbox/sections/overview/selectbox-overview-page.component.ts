import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngSelectComponent } from '@tailng-ui/components';
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
  readonly value: string;
  readonly label: string;
  readonly note: string;
  readonly disabled?: boolean;
}

const WORKFLOW_STAGE_OPTIONS: readonly WorkflowStageOption[] = Object.freeze([
  { value: 'draft', label: 'Draft', note: 'Internal drafting only.' },
  { value: 'review', label: 'In review', note: 'Waiting on editorial review.' },
  { value: 'qa', label: 'QA ready', note: 'Approved for validation.' },
  { value: 'live', label: 'Live', note: 'Already published.', disabled: true },
]);

const COMPONENT_IMPORT_CODE = String.raw`import { TngSelectComponent } from '@tailng-ui/components';`;

const BASIC_USAGE_CODE = String.raw`<tng-select
  [options]="workflowStages"
  [value]="selectedStage()"
  (valueChange)="onSelectedStageChange($event)"
  [getOptionValue]="getWorkflowStageValue"
  [getOptionLabel]="getWorkflowStageLabel"
  [isOptionDisabled]="isWorkflowStageDisabled"
  placeholder="Choose workflow stage"
  [labelId]="'workflow-stage-label'"
></tng-select>`;

const PLAIN_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import { TngSelectComponent } from '@tailng-ui/components';

interface ComponentSelectboxOverviewPlainWorkflowStageOption {
  readonly value: string;
  readonly label: string;
  readonly note: string;
  readonly disabled?: boolean;
}

const COMPONENT_SELECTBOX_OVERVIEW_PLAIN_WORKFLOW_STAGE_OPTIONS: readonly ComponentSelectboxOverviewPlainWorkflowStageOption[] = Object.freeze([
  { value: 'draft', label: 'Draft', note: 'Internal drafting only.' },
  { value: 'review', label: 'In review', note: 'Waiting on editorial review.' },
  { value: 'qa', label: 'QA ready', note: 'Approved for validation.' },
  { value: 'live', label: 'Live', note: 'Already published.', disabled: true },
]);

@Component({
  selector: 'app-component-selectbox-overview-plain-example',
  standalone: true,
  imports: [TngSelectComponent],
  templateUrl: './component-selectbox-overview-plain-example.component.html',
  styleUrl: './component-selectbox-overview-plain-example.component.css',
})
export class ComponentSelectboxOverviewPlainExampleComponent {
  readonly componentSelectboxOverviewPlainWorkflowStages = COMPONENT_SELECTBOX_OVERVIEW_PLAIN_WORKFLOW_STAGE_OPTIONS;
  readonly componentSelectboxOverviewPlainSelectedStage = signal<string | null>('review');
  readonly componentSelectboxOverviewPlainSelectedStageSummary = computed(() => {
    const selectedValue = this.componentSelectboxOverviewPlainSelectedStage();
    if (selectedValue === null) {
      return 'none';
    }

    return this.componentSelectboxOverviewPlainWorkflowStages.find((stage) => stage.value === selectedValue)?.label ?? 'none';
  });
  readonly getComponentSelectboxOverviewPlainWorkflowStageValue = (stage: ComponentSelectboxOverviewPlainWorkflowStageOption) => stage.value;
  readonly getComponentSelectboxOverviewPlainWorkflowStageLabel = (stage: ComponentSelectboxOverviewPlainWorkflowStageOption) => stage.label;
  readonly isComponentSelectboxOverviewPlainWorkflowStageDisabled = (stage: ComponentSelectboxOverviewPlainWorkflowStageOption) => stage.disabled === true;

  onComponentSelectboxOverviewPlainSelectedStageChange(value: unknown): void {
    this.componentSelectboxOverviewPlainSelectedStage.set(this.toComponentSelectboxOverviewPlainSingleValue(value));
  }

  private toComponentSelectboxOverviewPlainSingleValue(value: unknown): string | null {
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

const PLAIN_HTML_CODE = String.raw`<section class="docs-component-selectbox-overview-plain-shell">
  <div class="docs-component-selectbox-overview-plain-header">
    <span class="docs-component-selectbox-overview-plain-kicker">Workflow stage</span>
    <p class="docs-component-selectbox-overview-plain-copy">
      Wrapper-first single selection with a light shell and a committed value summary.
    </p>
  </div>

  <tng-select
    class="docs-component-selectbox-overview-plain-control"
    [options]="componentSelectboxOverviewPlainWorkflowStages"
    [value]="componentSelectboxOverviewPlainSelectedStage()"
    (valueChange)="onComponentSelectboxOverviewPlainSelectedStageChange($event)"
    [getOptionValue]="getComponentSelectboxOverviewPlainWorkflowStageValue"
    [getOptionLabel]="getComponentSelectboxOverviewPlainWorkflowStageLabel"
    [isOptionDisabled]="isComponentSelectboxOverviewPlainWorkflowStageDisabled"
    placeholder="Choose workflow stage"
    [ariaLabel]="'Workflow stage'"
  >
    <ng-template #tngSelectOptionTpl let-option>
      <span class="docs-component-selectbox-overview-plain-option-row">
        <span class="docs-component-selectbox-overview-plain-option-label">{{ option.label }}</span>
        <span class="docs-component-selectbox-overview-plain-option-meta">{{ option.option.note }}</span>
      </span>
    </ng-template>
  </tng-select>

  <p class="docs-component-selectbox-overview-plain-summary">
    Selected: {{ componentSelectboxOverviewPlainSelectedStageSummary() }}
  </p>
</section>`;

const PLAIN_CSS_CODE = String.raw`.docs-component-selectbox-overview-plain-shell {
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

.docs-component-selectbox-overview-plain-header {
  display: grid;
  gap: 0.35rem;
}

.docs-component-selectbox-overview-plain-kicker {
  font-size: 0.8rem;
  font-weight: 700;
  color: #64748b;
}

.docs-component-selectbox-overview-plain-copy,
.docs-component-selectbox-overview-plain-summary {
  margin: 0;
  color: #475569;
}

/* Host-level tokens – the component base CSS consumes them automatically. */
.docs-component-selectbox-overview-plain-control {
  display: block;
  width: 100%;
  min-width: 0;
  color-scheme: light;
  --tng-semantic-background-base: #ffffff;
  --tng-semantic-background-canvas: #ffffff;
  --tng-semantic-background-surface: #f8fafc;
  --tng-semantic-border-subtle: #d8e2ef;
  --tng-semantic-border-strong: #94a3b8;
  --tng-semantic-foreground-primary: #0f172a;
  --tng-semantic-foreground-secondary: #475569;
  --tng-semantic-foreground-muted: #64748b;
  --tng-semantic-accent-brand: #2563eb;
  --tng-semantic-focus-ring: #2563eb;
  --tng-select-radius: 1rem;
  --tng-select-trigger-min-height: 3.35rem;
  --tng-select-trigger-py: 0.8rem;
  --tng-select-trigger-px: 0.95rem;
  --tng-select-trigger-gap: 0.75rem;
  --tng-select-option-py: 0.75rem;
  --tng-select-option-px: 0.85rem;
  --tng-select-option-radius: 0.85rem;
  --tng-select-bg: #ffffff;
  --tng-select-surface: #ffffff;
  --tng-select-border: #d8e2ef;
  --tng-select-border-strong: #94a3b8;
  --tng-select-border-hover: #64748b;
  --tng-select-fg: #0f172a;
  --tng-select-muted: #64748b;
  --tng-select-brand: #2563eb;
  --tng-select-focus-ring: #2563eb;
  --tng-select-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  --tng-select-shadow-focus: 0 0 0 3px rgba(37, 99, 235, 0.18);
  --tng-select-icon-size: 0.75rem;
  --tng-select-icon-margin-inline-start: 0.35rem;
  --tng-select-overlay-max-width: min(92vw, 36rem);
  --tng-select-overlay-border: #d8e2ef;
  --tng-select-overlay-radius: 1rem;
  --tng-select-overlay-bg: #ffffff;
  --tng-select-overlay-padding: 0.4rem;
  --tng-select-overlay-shadow: 0 18px 38px rgba(15, 23, 42, 0.14);
  --tng-select-option-bg-active: #f8fafc;
  --tng-select-option-border-active: #cbd5e1;
  --tng-select-option-bg-selected: #eff6ff;
  --tng-select-option-border-selected: #93c5fd;
  --tng-select-option-fg-selected: #142033;
  --tng-select-option-bg-selected-active: #dbeafe;
  --tng-select-option-border-selected-active: #60a5fa;
  --tng-select-option-shadow-selected-active: 0 0 0 1px rgba(37, 99, 235, 0.12);
}

.docs-component-selectbox-overview-plain-option-row {
  display: grid;
  gap: 0.18rem;
}

.docs-component-selectbox-overview-plain-option-label {
  color: #0f172a;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.3;
}

.docs-component-selectbox-overview-plain-option-meta {
  color: #64748b;
  font-size: 0.82rem;
  line-height: 1.35;
}`;

const TAILWIND_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import { TngSelectComponent } from '@tailng-ui/components';

interface ComponentSelectboxOverviewTailwindWorkflowStageOption {
  readonly value: string;
  readonly label: string;
  readonly note: string;
  readonly disabled?: boolean;
}

const COMPONENT_SELECTBOX_OVERVIEW_TAILWIND_WORKFLOW_STAGE_OPTIONS: readonly ComponentSelectboxOverviewTailwindWorkflowStageOption[] = Object.freeze([
  { value: 'draft', label: 'Draft', note: 'Internal drafting only.' },
  { value: 'review', label: 'In review', note: 'Waiting on editorial review.' },
  { value: 'qa', label: 'QA ready', note: 'Approved for validation.' },
  { value: 'live', label: 'Live', note: 'Already published.', disabled: true },
]);

@Component({
  selector: 'app-component-selectbox-overview-tailwind-example',
  standalone: true,
  imports: [TngSelectComponent],
  templateUrl: './component-selectbox-overview-tailwind-example.component.html',
  styleUrl: './component-selectbox-overview-tailwind-example.component.css',
})
export class ComponentSelectboxOverviewTailwindExampleComponent {
  readonly componentSelectboxOverviewTailwindWorkflowStages = COMPONENT_SELECTBOX_OVERVIEW_TAILWIND_WORKFLOW_STAGE_OPTIONS;
  readonly componentSelectboxOverviewTailwindSelectedStage = signal<string | null>('qa');
  readonly componentSelectboxOverviewTailwindSelectedStageSummary = computed(() => {
    const selectedValue = this.componentSelectboxOverviewTailwindSelectedStage();
    if (selectedValue === null) {
      return 'none';
    }

    return this.componentSelectboxOverviewTailwindWorkflowStages.find((stage) => stage.value === selectedValue)?.label ?? 'none';
  });
  readonly getComponentSelectboxOverviewTailwindWorkflowStageValue = (stage: ComponentSelectboxOverviewTailwindWorkflowStageOption) => stage.value;
  readonly getComponentSelectboxOverviewTailwindWorkflowStageLabel = (stage: ComponentSelectboxOverviewTailwindWorkflowStageOption) => stage.label;
  readonly isComponentSelectboxOverviewTailwindWorkflowStageDisabled = (stage: ComponentSelectboxOverviewTailwindWorkflowStageOption) => stage.disabled === true;

  onComponentSelectboxOverviewTailwindSelectedStageChange(value: unknown): void {
    this.componentSelectboxOverviewTailwindSelectedStage.set(this.toComponentSelectboxOverviewTailwindSingleValue(value));
  }

  private toComponentSelectboxOverviewTailwindSingleValue(value: unknown): string | null {
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

const TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid max-w-[36rem] gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-5 text-slate-900 shadow-[0_12px_32px_rgba(15,23,42,0.08)] [color-scheme:light]">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Workflow stage</span>
    <p class="m-0 text-sm text-slate-600">
      Wrapper-first single selection with a utility-first shell and the same select contract.
    </p>
  </div>

  <tng-select
    class="docs-component-selectbox-overview-tailwind-control block w-full min-w-0 [color-scheme:light] [--tng-semantic-background-base:#ffffff] [--tng-semantic-background-canvas:#ffffff] [--tng-semantic-background-surface:#f8fafc] [--tng-semantic-border-subtle:#d8e2ef] [--tng-semantic-border-strong:#94a3b8] [--tng-semantic-foreground-primary:#0f172a] [--tng-semantic-foreground-secondary:#475569] [--tng-semantic-foreground-muted:#64748b] [--tng-semantic-accent-brand:#0f766e] [--tng-semantic-focus-ring:#0f766e] [--tng-select-radius:1rem] [--tng-select-trigger-py:0.95rem] [--tng-select-trigger-px:1rem] [--tng-select-option-py:0.75rem] [--tng-select-option-px:0.85rem] [--tng-select-bg:#ffffff] [--tng-select-surface:#ffffff] [--tng-select-border:#d8e2ef] [--tng-select-border-strong:#94a3b8] [--tng-select-fg:#0f172a] [--tng-select-muted:#64748b] [--tng-select-brand:#0f766e] [--tng-select-focus-ring:#0f766e] [--tng-select-shadow:0_1px_2px_rgba(15,23,42,0.04)] [--tng-select-shadow-focus:0_0_0_3px_rgba(15,118,110,0.18)]"
    [options]="componentSelectboxOverviewTailwindWorkflowStages"
    [value]="componentSelectboxOverviewTailwindSelectedStage()"
    (valueChange)="onComponentSelectboxOverviewTailwindSelectedStageChange($event)"
    [getOptionValue]="getComponentSelectboxOverviewTailwindWorkflowStageValue"
    [getOptionLabel]="getComponentSelectboxOverviewTailwindWorkflowStageLabel"
    [isOptionDisabled]="isComponentSelectboxOverviewTailwindWorkflowStageDisabled"
    placeholder="Choose workflow stage"
    [ariaLabel]="'Workflow stage'"
  >
    <ng-template #tngSelectOptionTpl let-option>
      <span class="grid gap-0.5">
        <span class="text-sm font-semibold text-slate-900">{{ option.label }}</span>
        <span class="text-xs text-slate-500">{{ option.option.note }}</span>
      </span>
    </ng-template>
  </tng-select>

  <p class="m-0 text-xs text-slate-600">Selected: {{ componentSelectboxOverviewTailwindSelectedStageSummary() }}</p>
</section>`;

const TAILWIND_CSS_CODE = '/* Tokens are applied via Tailwind arbitrary properties in the template. */\n/* The component base CSS consumes them automatically. */';

@Component({
  selector: 'app-selectbox-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngSelectComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './selectbox-overview-page.component.html',
  styleUrl: './selectbox-overview-page.component.css',
})
export class SelectboxOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly workflowStageLabelByValue = new Map(
    WORKFLOW_STAGE_OPTIONS.map((stage) => [stage.value, stage.label]),
  );

  readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );

  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly workflowStages = WORKFLOW_STAGE_OPTIONS;
  protected readonly overviewPlainSelectedStage = signal<string | null>('review');
  protected readonly overviewTailwindSelectedStage = signal<string | null>('qa');
  protected readonly componentImportCode = COMPONENT_IMPORT_CODE;
  protected readonly basicUsageCode = BASIC_USAGE_CODE;
  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;

  protected readonly plainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'component-selectbox-overview-plain-example.component.ts', code: PLAIN_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'component-selectbox-overview-plain-example.component.html', code: PLAIN_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'component-selectbox-overview-plain-example.component.css', code: PLAIN_CSS_CODE },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'component-selectbox-overview-tailwind-example.component.ts', code: TAILWIND_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'component-selectbox-overview-tailwind-example.component.html', code: TAILWIND_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'component-selectbox-overview-tailwind-example.component.css', code: TAILWIND_CSS_CODE },
  ]);

  protected readonly getWorkflowStageValue = (stage: WorkflowStageOption) => stage.value;
  protected readonly getWorkflowStageLabel = (stage: WorkflowStageOption) => stage.label;
  protected readonly isWorkflowStageDisabled = (stage: WorkflowStageOption) => stage.disabled === true;

  protected readonly overviewPlainSummary = computed(() => this.resolveWorkflowStageLabel(this.overviewPlainSelectedStage()));
  protected readonly overviewTailwindSummary = computed(() => this.resolveWorkflowStageLabel(this.overviewTailwindSelectedStage()));

  protected onOverviewPlainSelectedStageChange(value: unknown): void {
    this.overviewPlainSelectedStage.set(this.toSingleValue(value));
  }

  protected onOverviewTailwindSelectedStageChange(value: unknown): void {
    this.overviewTailwindSelectedStage.set(this.toSingleValue(value));
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  private resolveWorkflowStageLabel(value: string | null): string {
    if (value === null) {
      return 'none';
    }

    return this.workflowStageLabelByValue.get(value) ?? 'none';
  }

  private toSingleValue(value: unknown): string | null {
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
