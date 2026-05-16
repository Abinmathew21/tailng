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
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../select.util';

type WorkflowStageOption = {
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

interface ComponentSelectOverviewPlainWorkflowStageOption {
  readonly value: string;
  readonly label: string;
  readonly note: string;
  readonly disabled?: boolean;
}

const COMPONENT_SELECT_OVERVIEW_PLAIN_WORKFLOW_STAGE_OPTIONS: readonly ComponentSelectOverviewPlainWorkflowStageOption[] = Object.freeze([
  { value: 'draft', label: 'Draft', note: 'Internal drafting only.' },
  { value: 'review', label: 'In review', note: 'Waiting on editorial review.' },
  { value: 'qa', label: 'QA ready', note: 'Approved for validation.' },
  { value: 'live', label: 'Live', note: 'Already published.', disabled: true },
]);

@Component({
  selector: 'app-component-select-overview-plain-example',
  standalone: true,
  imports: [TngSelectComponent],
  templateUrl: './component-select-overview-plain-example.component.html',
  styleUrl: './component-select-overview-plain-example.component.css',
})
export class ComponentSelectOverviewPlainExampleComponent {
  readonly componentSelectOverviewPlainWorkflowStages = COMPONENT_SELECT_OVERVIEW_PLAIN_WORKFLOW_STAGE_OPTIONS;
  readonly componentSelectOverviewPlainSelectedStage = signal<string | null>('review');
  readonly componentSelectOverviewPlainSelectedStageSummary = computed(() => {
    const selectedValue = this.componentSelectOverviewPlainSelectedStage();
    if (selectedValue === null) {
      return 'none';
    }

    return this.componentSelectOverviewPlainWorkflowStages.find((stage) => stage.value === selectedValue)?.label ?? 'none';
  });
  readonly getComponentSelectOverviewPlainWorkflowStageValue = (stage: ComponentSelectOverviewPlainWorkflowStageOption) => stage.value;
  readonly getComponentSelectOverviewPlainWorkflowStageLabel = (stage: ComponentSelectOverviewPlainWorkflowStageOption) => stage.label;
  readonly isComponentSelectOverviewPlainWorkflowStageDisabled = (stage: ComponentSelectOverviewPlainWorkflowStageOption) => stage.disabled === true;

  onComponentSelectOverviewPlainSelectedStageChange(value: unknown): void {
    this.componentSelectOverviewPlainSelectedStage.set(this.toComponentSelectOverviewPlainSingleValue(value));
  }

  private toComponentSelectOverviewPlainSingleValue(value: unknown): string | null {
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

const PLAIN_HTML_CODE = String.raw`<section class="docs-component-select-overview-plain-shell">
  <div class="docs-component-select-overview-plain-header">
    <span class="docs-component-select-overview-plain-kicker">Workflow stage</span>
    <p class="docs-component-select-overview-plain-copy">
      Wrapper-first single selection with a light shell and a committed value summary.
    </p>
  </div>

  <div class="docs-component-select-overview-plain-control">
    <tng-select
      [options]="componentSelectOverviewPlainWorkflowStages"
      [value]="componentSelectOverviewPlainSelectedStage()"
      (valueChange)="onComponentSelectOverviewPlainSelectedStageChange($event)"
      [getOptionValue]="getComponentSelectOverviewPlainWorkflowStageValue"
      [getOptionLabel]="getComponentSelectOverviewPlainWorkflowStageLabel"
      [isOptionDisabled]="isComponentSelectOverviewPlainWorkflowStageDisabled"
      placeholder="Choose workflow stage"
      [ariaLabel]="'Workflow stage'"
    >
      <ng-template #tngSelectOptionTpl let-option>
        <span class="docs-component-select-overview-plain-option-row">
          <span class="docs-component-select-overview-plain-option-label">{{ option.label }}</span>
          <span class="docs-component-select-overview-plain-option-meta">{{ option.option.note }}</span>
        </span>
      </ng-template>
    </tng-select>
  </div>

  <p class="docs-component-select-overview-plain-summary">
    Selected: {{ componentSelectOverviewPlainSelectedStageSummary() }}
  </p>
</section>`;

const PLAIN_CSS_CODE = String.raw`.docs-component-select-overview-plain-shell {
  display: grid;
  gap: 0.9rem;
  inline-size: min(100%, 36rem);
  margin-inline: auto;
  padding: 1.1rem;
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 1.25rem;
  background: var(--tng-semantic-background-surface);
  color: var(--tng-semantic-foreground-primary);
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);
}

.docs-component-select-overview-plain-header {
  display: grid;
  gap: 0.35rem;
}

.docs-component-select-overview-plain-kicker {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--tng-semantic-foreground-muted);
}

.docs-component-select-overview-plain-copy,
.docs-component-select-overview-plain-summary {
  margin: 0;
  color: var(--tng-semantic-foreground-secondary);
}

/* Host-level tokens – the component base CSS consumes them automatically. */
.docs-component-select-overview-plain-control {
  display: block;
  width: 100%;
  min-width: 0;
  --tng-select-radius: 1rem;
  --tng-select-trigger-min-height: 3.35rem;
  --tng-select-trigger-py: 0.8rem;
  --tng-select-trigger-px: 0.95rem;
  --tng-select-trigger-gap: 0.75rem;
  --tng-select-option-py: 0.75rem;
  --tng-select-option-px: 0.85rem;
  --tng-select-option-radius: 0.85rem;
  --tng-select-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  --tng-select-shadow-focus: 0 0 0 3px rgba(37, 99, 235, 0.18);
  --tng-select-icon-size: 0.75rem;
  --tng-select-icon-margin-inline-start: 0.35rem;
  --tng-select-overlay-max-width: min(92vw, 36rem);
  --tng-select-overlay-radius: 1rem;
  --tng-select-overlay-padding: 0.4rem;
  --tng-select-overlay-shadow: 0 18px 38px rgba(15, 23, 42, 0.14);
}

.docs-component-select-overview-plain-option-row {
  display: grid;
  gap: 0.18rem;
}

.docs-component-select-overview-plain-option-label {
  color: var(--tng-semantic-foreground-primary);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.3;
}

.docs-component-select-overview-plain-option-meta {
  color: var(--tng-semantic-foreground-muted);
  font-size: 0.82rem;
  line-height: 1.35;
}`;

const TAILWIND_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import { TngSelectComponent } from '@tailng-ui/components';

interface ComponentSelectOverviewTailwindWorkflowStageOption {
  readonly value: string;
  readonly label: string;
  readonly note: string;
  readonly disabled?: boolean;
}

const COMPONENT_SELECT_OVERVIEW_TAILWIND_WORKFLOW_STAGE_OPTIONS: readonly ComponentSelectOverviewTailwindWorkflowStageOption[] = Object.freeze([
  { value: 'draft', label: 'Draft', note: 'Internal drafting only.' },
  { value: 'review', label: 'In review', note: 'Waiting on editorial review.' },
  { value: 'qa', label: 'QA ready', note: 'Approved for validation.' },
  { value: 'live', label: 'Live', note: 'Already published.', disabled: true },
]);

@Component({
  selector: 'app-component-select-overview-tailwind-example',
  standalone: true,
  imports: [TngSelectComponent],
  templateUrl: './component-select-overview-tailwind-example.component.html',
  styleUrl: './component-select-overview-tailwind-example.component.css',
})
export class ComponentSelectOverviewTailwindExampleComponent {
  readonly componentSelectOverviewTailwindWorkflowStages = COMPONENT_SELECT_OVERVIEW_TAILWIND_WORKFLOW_STAGE_OPTIONS;
  readonly componentSelectOverviewTailwindSelectedStage = signal<string | null>('qa');
  readonly componentSelectOverviewTailwindSelectedStageSummary = computed(() => {
    const selectedValue = this.componentSelectOverviewTailwindSelectedStage();
    if (selectedValue === null) {
      return 'none';
    }

    return this.componentSelectOverviewTailwindWorkflowStages.find((stage) => stage.value === selectedValue)?.label ?? 'none';
  });
  readonly getComponentSelectOverviewTailwindWorkflowStageValue = (stage: ComponentSelectOverviewTailwindWorkflowStageOption) => stage.value;
  readonly getComponentSelectOverviewTailwindWorkflowStageLabel = (stage: ComponentSelectOverviewTailwindWorkflowStageOption) => stage.label;
  readonly isComponentSelectOverviewTailwindWorkflowStageDisabled = (stage: ComponentSelectOverviewTailwindWorkflowStageOption) => stage.disabled === true;

  onComponentSelectOverviewTailwindSelectedStageChange(value: unknown): void {
    this.componentSelectOverviewTailwindSelectedStage.set(this.toComponentSelectOverviewTailwindSingleValue(value));
  }

  private toComponentSelectOverviewTailwindSingleValue(value: unknown): string | null {
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

const TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid max-w-[36rem] gap-4 rounded-[1.75rem] border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-5 text-[var(--tng-semantic-foreground-primary)] shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--tng-semantic-foreground-muted)]">Workflow stage</span>
    <p class="m-0 text-sm text-[var(--tng-semantic-foreground-secondary)]">
      Wrapper-first single selection with a utility-first shell and the same select contract.
    </p>
  </div>

  <div class="docs-component-select-overview-tailwind-control block w-full min-w-0 [--tng-select-radius:1rem] [--tng-select-trigger-py:0.95rem] [--tng-select-trigger-px:1rem] [--tng-select-option-py:0.75rem] [--tng-select-option-px:0.85rem] [--tng-select-shadow:0_1px_2px_rgba(15,23,42,0.04)] [--tng-select-shadow-focus:0_0_0_3px_rgba(15,118,110,0.18)]">
    <tng-select
      [options]="componentSelectOverviewTailwindWorkflowStages"
      [value]="componentSelectOverviewTailwindSelectedStage()"
      (valueChange)="onComponentSelectOverviewTailwindSelectedStageChange($event)"
      [getOptionValue]="getComponentSelectOverviewTailwindWorkflowStageValue"
      [getOptionLabel]="getComponentSelectOverviewTailwindWorkflowStageLabel"
      [isOptionDisabled]="isComponentSelectOverviewTailwindWorkflowStageDisabled"
      placeholder="Choose workflow stage"
      [ariaLabel]="'Workflow stage'"
    >
      <ng-template #tngSelectOptionTpl let-option>
        <span class="grid gap-0.5">
        <span class="text-sm font-semibold text-[var(--tng-semantic-foreground-primary)]">{{ option.label }}</span>
        <span class="text-xs text-[var(--tng-semantic-foreground-muted)]">{{ option.option.note }}</span>
        </span>
      </ng-template>
    </tng-select>
  </div>

  <p class="m-0 text-xs text-[var(--tng-semantic-foreground-secondary)]">Selected: {{ componentSelectOverviewTailwindSelectedStageSummary() }}</p>
</section>`;

const TAILWIND_CSS_CODE = '/* Tokens are applied via Tailwind arbitrary properties in the template. */\n/* The component base CSS consumes them automatically. */';

@Component({
  selector: 'app-select-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngSelectComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './select-overview-page.component.html',
  styleUrl: './select-overview-page.component.css',
})
export class SelectOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly workflowStageLabelByValue = new Map(
    WORKFLOW_STAGE_OPTIONS.map((stage) => [stage.value, stage.label]),
  );

  protected readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
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
    { value: 'ts', label: 'TS', language: 'ts', title: 'component-select-overview-plain-example.component.ts', code: PLAIN_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'component-select-overview-plain-example.component.html', code: PLAIN_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'component-select-overview-plain-example.component.css', code: PLAIN_CSS_CODE },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'component-select-overview-tailwind-example.component.ts', code: TAILWIND_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'component-select-overview-tailwind-example.component.html', code: TAILWIND_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'component-select-overview-tailwind-example.component.css', code: TAILWIND_CSS_CODE },
  ]);

  protected readonly getWorkflowStageValue = (stage: WorkflowStageOption): string => stage.value;
  protected readonly getWorkflowStageLabel = (stage: WorkflowStageOption): string => stage.label;
  protected readonly isWorkflowStageDisabled = (stage: WorkflowStageOption): boolean => stage.disabled === true;

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
      const first: unknown = value[0];
      return typeof first === 'string' ? first : null;
    }

    return null;
  }
}
