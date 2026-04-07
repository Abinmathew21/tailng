import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { TngSelectComponent } from '@tailng-ui/components';
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

interface ReleaseStageOption {
  readonly value: string;
  readonly label: string;
  readonly note: string;
  readonly disabled?: boolean;
}

interface ReleaseOwnerOption {
  readonly id: string;
  readonly name: string;
  readonly team: string;
  readonly timezone: string;
  readonly disabled?: boolean;
}

const RELEASE_STAGE_OPTIONS: readonly ReleaseStageOption[] = Object.freeze([
  { value: 'draft', label: 'Draft', note: 'Internal drafting only.' },
  { value: 'review', label: 'In review', note: 'Editorial sign-off in progress.' },
  { value: 'qa', label: 'QA ready', note: 'Approved for validation.' },
  { value: 'scheduled', label: 'Scheduled', note: 'Queued for launch.', disabled: true },
]);

const RELEASE_OWNER_OPTIONS: readonly ReleaseOwnerOption[] = Object.freeze([
  { id: 'abigail', name: 'Abigail Chen', team: 'Design systems', timezone: 'UTC-8' },
  { id: 'mina', name: 'Mina Lee', team: 'Core UI', timezone: 'UTC-5' },
  { id: 'omar', name: 'Omar Aziz', team: 'Compliance', timezone: 'UTC+1', disabled: true },
  { id: 'sanjay', name: 'Sanjay Patel', team: 'Documentation', timezone: 'UTC+5:30' },
]);

const STAGE_PLAIN_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import { TngSelectComponent } from '@tailng-ui/components';

interface ComponentSelectboxExamplesPlainReleaseStageOption {
  readonly value: string;
  readonly label: string;
  readonly note: string;
  readonly disabled?: boolean;
}

const COMPONENT_SELECTBOX_EXAMPLES_PLAIN_RELEASE_STAGE_OPTIONS: readonly ComponentSelectboxExamplesPlainReleaseStageOption[] = Object.freeze([
  { value: 'draft', label: 'Draft', note: 'Internal drafting only.' },
  { value: 'review', label: 'In review', note: 'Editorial sign-off in progress.' },
  { value: 'qa', label: 'QA ready', note: 'Approved for validation.' },
  { value: 'scheduled', label: 'Scheduled', note: 'Queued for launch.', disabled: true },
]);

@Component({
  selector: 'app-component-selectbox-examples-stage-plain',
  standalone: true,
  imports: [TngSelectComponent],
  templateUrl: './component-selectbox-examples-stage-plain.component.html',
  styleUrl: './component-selectbox-examples-stage-plain.component.css',
})
export class ComponentSelectboxExamplesStagePlainComponent {
  readonly componentSelectboxExamplesPlainReleaseStages = COMPONENT_SELECTBOX_EXAMPLES_PLAIN_RELEASE_STAGE_OPTIONS;
  readonly componentSelectboxExamplesPlainSelectedStage = signal<string | null>('review');
  readonly componentSelectboxExamplesPlainSelectedStageSummary = computed(() => {
    const selectedValue = this.componentSelectboxExamplesPlainSelectedStage();
    if (selectedValue === null) {
      return 'none';
    }

    return this.componentSelectboxExamplesPlainReleaseStages.find((stage) => stage.value === selectedValue)?.label ?? 'none';
  });
  readonly getComponentSelectboxExamplesPlainStageValue = (stage: ComponentSelectboxExamplesPlainReleaseStageOption) => stage.value;
  readonly getComponentSelectboxExamplesPlainStageLabel = (stage: ComponentSelectboxExamplesPlainReleaseStageOption) => stage.label;
  readonly isComponentSelectboxExamplesPlainStageDisabled = (stage: ComponentSelectboxExamplesPlainReleaseStageOption) => stage.disabled === true;

  onComponentSelectboxExamplesPlainSelectedStageChange(value: unknown): void {
    this.componentSelectboxExamplesPlainSelectedStage.set(this.toComponentSelectboxExamplesPlainSingleValue(value));
  }

  private toComponentSelectboxExamplesPlainSingleValue(value: unknown): string | null {
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

const STAGE_PLAIN_HTML_CODE = String.raw`<section class="docs-component-selectbox-examples-stage-plain-shell">
  <div class="docs-component-selectbox-examples-stage-plain-header">
    <span class="docs-component-selectbox-examples-stage-plain-kicker">Release stage</span>
    <p class="docs-component-selectbox-examples-stage-plain-copy">
      Keep a controlled release-stage value while the wrapper handles trigger and menu plumbing.
    </p>
  </div>

  <tng-select
    class="docs-component-selectbox-examples-stage-plain-control"
    [options]="componentSelectboxExamplesPlainReleaseStages"
    [value]="componentSelectboxExamplesPlainSelectedStage()"
    (valueChange)="onComponentSelectboxExamplesPlainSelectedStageChange($event)"
    [getOptionValue]="getComponentSelectboxExamplesPlainStageValue"
    [getOptionLabel]="getComponentSelectboxExamplesPlainStageLabel"
    [isOptionDisabled]="isComponentSelectboxExamplesPlainStageDisabled"
    placeholder="Choose release stage"
    [ariaLabel]="'Release stage'"
  ></tng-select>

  <p class="docs-component-selectbox-examples-stage-plain-summary">Selected: {{ componentSelectboxExamplesPlainSelectedStageSummary() }}</p>
</section>`;

const STAGE_PLAIN_CSS_CODE = String.raw`.docs-component-selectbox-examples-stage-plain-shell {
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

.docs-component-selectbox-examples-stage-plain-header {
  display: grid;
  gap: 0.35rem;
}

.docs-component-selectbox-examples-stage-plain-kicker {
  font-size: 0.8rem;
  font-weight: 700;
  color: #64748b;
}

.docs-component-selectbox-examples-stage-plain-copy,
.docs-component-selectbox-examples-stage-plain-summary {
  margin: 0;
  color: #475569;
}

.docs-component-selectbox-examples-stage-plain-control {
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
  --tng-select-radius: 1rem;
  --tng-select-trigger-py: 0.625rem;
  --tng-select-trigger-px: 0.875rem;
  --tng-select-option-py: 0.625rem;
  --tng-select-option-px: 0.875rem;
  --tng-select-bg: #ffffff;
  --tng-select-surface: #f8fafc;
  --tng-select-border: #d8e2ef;
  --tng-select-border-strong: #94a3b8;
  --tng-select-fg: #0f172a;
  --tng-select-muted: #64748b;
  --tng-select-brand: #2563eb;
  --tng-select-focus-ring: #2563eb;
}`;

const STAGE_TAILWIND_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import { TngSelectComponent } from '@tailng-ui/components';

interface ComponentSelectboxExamplesTailwindReleaseStageOption {
  readonly value: string;
  readonly label: string;
  readonly note: string;
  readonly disabled?: boolean;
}

const COMPONENT_SELECTBOX_EXAMPLES_TAILWIND_RELEASE_STAGE_OPTIONS: readonly ComponentSelectboxExamplesTailwindReleaseStageOption[] = Object.freeze([
  { value: 'draft', label: 'Draft', note: 'Internal drafting only.' },
  { value: 'review', label: 'In review', note: 'Editorial sign-off in progress.' },
  { value: 'qa', label: 'QA ready', note: 'Approved for validation.' },
  { value: 'scheduled', label: 'Scheduled', note: 'Queued for launch.', disabled: true },
]);

@Component({
  selector: 'app-component-selectbox-examples-stage-tailwind',
  standalone: true,
  imports: [TngSelectComponent],
  templateUrl: './component-selectbox-examples-stage-tailwind.component.html',
  styleUrl: './component-selectbox-examples-stage-tailwind.component.css',
})
export class ComponentSelectboxExamplesStageTailwindComponent {
  readonly componentSelectboxExamplesTailwindReleaseStages = COMPONENT_SELECTBOX_EXAMPLES_TAILWIND_RELEASE_STAGE_OPTIONS;
  readonly componentSelectboxExamplesTailwindSelectedStage = signal<string | null>('qa');
  readonly componentSelectboxExamplesTailwindSelectedStageSummary = computed(() => {
    const selectedValue = this.componentSelectboxExamplesTailwindSelectedStage();
    if (selectedValue === null) {
      return 'none';
    }

    return this.componentSelectboxExamplesTailwindReleaseStages.find((stage) => stage.value === selectedValue)?.label ?? 'none';
  });
  readonly getComponentSelectboxExamplesTailwindStageValue = (stage: ComponentSelectboxExamplesTailwindReleaseStageOption) => stage.value;
  readonly getComponentSelectboxExamplesTailwindStageLabel = (stage: ComponentSelectboxExamplesTailwindReleaseStageOption) => stage.label;
  readonly isComponentSelectboxExamplesTailwindStageDisabled = (stage: ComponentSelectboxExamplesTailwindReleaseStageOption) => stage.disabled === true;

  onComponentSelectboxExamplesTailwindSelectedStageChange(value: unknown): void {
    this.componentSelectboxExamplesTailwindSelectedStage.set(this.toComponentSelectboxExamplesTailwindSingleValue(value));
  }

  private toComponentSelectboxExamplesTailwindSingleValue(value: unknown): string | null {
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

const STAGE_TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid max-w-[36rem] gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Release stage</span>
    <p class="m-0 text-sm text-slate-600">
      Keep a controlled release-stage value while the wrapper handles trigger and menu plumbing.
    </p>
  </div>

  <tng-select
    class="block w-full min-w-0 [--tng-semantic-background-canvas:#ffffff] [--tng-semantic-background-surface:#f8fafc] [--tng-semantic-border-subtle:#d8e2ef] [--tng-semantic-border-strong:#94a3b8] [--tng-semantic-foreground-primary:#0f172a] [--tng-semantic-foreground-secondary:#475569] [--tng-semantic-foreground-muted:#64748b] [--tng-semantic-accent-brand:#2563eb] [--tng-semantic-focus-ring:#2563eb] [--tng-select-radius:1rem] [--tng-select-trigger-py:0.625rem] [--tng-select-trigger-px:0.875rem] [--tng-select-option-py:0.625rem] [--tng-select-option-px:0.875rem] [--tng-select-bg:#ffffff] [--tng-select-surface:#f8fafc] [--tng-select-border:#d8e2ef] [--tng-select-border-strong:#94a3b8] [--tng-select-fg:#0f172a] [--tng-select-muted:#64748b] [--tng-select-brand:#2563eb] [--tng-select-focus-ring:#2563eb]"
    [options]="componentSelectboxExamplesTailwindReleaseStages"
    [value]="componentSelectboxExamplesTailwindSelectedStage()"
    (valueChange)="onComponentSelectboxExamplesTailwindSelectedStageChange($event)"
    [getOptionValue]="getComponentSelectboxExamplesTailwindStageValue"
    [getOptionLabel]="getComponentSelectboxExamplesTailwindStageLabel"
    [isOptionDisabled]="isComponentSelectboxExamplesTailwindStageDisabled"
    placeholder="Choose release stage"
    [ariaLabel]="'Release stage'"
  ></tng-select>

  <p class="m-0 text-xs text-slate-600">Selected: {{ componentSelectboxExamplesTailwindSelectedStageSummary() }}</p>
</section>`;

const STAGE_TAILWIND_CSS_CODE = '/* Tailwind utilities are applied directly in the template. */';

const OWNER_PLAIN_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import { TngSelectComponent } from '@tailng-ui/components';

interface ComponentSelectboxExamplesPlainReleaseOwnerOption {
  readonly id: string;
  readonly name: string;
  readonly team: string;
  readonly timezone: string;
  readonly disabled?: boolean;
}

const COMPONENT_SELECTBOX_EXAMPLES_PLAIN_RELEASE_OWNER_OPTIONS: readonly ComponentSelectboxExamplesPlainReleaseOwnerOption[] = Object.freeze([
  { id: 'abigail', name: 'Abigail Chen', team: 'Design systems', timezone: 'UTC-8' },
  { id: 'mina', name: 'Mina Lee', team: 'Core UI', timezone: 'UTC-5' },
  { id: 'omar', name: 'Omar Aziz', team: 'Compliance', timezone: 'UTC+1', disabled: true },
  { id: 'sanjay', name: 'Sanjay Patel', team: 'Documentation', timezone: 'UTC+5:30' },
]);

@Component({
  selector: 'app-component-selectbox-examples-owner-plain',
  standalone: true,
  imports: [TngSelectComponent],
  templateUrl: './component-selectbox-examples-owner-plain.component.html',
  styleUrl: './component-selectbox-examples-owner-plain.component.css',
})
export class ComponentSelectboxExamplesOwnerPlainComponent {
  readonly componentSelectboxExamplesPlainReleaseOwners = COMPONENT_SELECTBOX_EXAMPLES_PLAIN_RELEASE_OWNER_OPTIONS;
  readonly componentSelectboxExamplesPlainSelectedOwnerId = signal<string | null>('mina');
  readonly componentSelectboxExamplesPlainSelectedOwnerSummary = computed(() => {
    const selectedValue = this.componentSelectboxExamplesPlainSelectedOwnerId();
    if (selectedValue === null) {
      return 'none';
    }

    return this.componentSelectboxExamplesPlainReleaseOwners.find((owner) => owner.id === selectedValue)?.name ?? 'none';
  });
  readonly getComponentSelectboxExamplesPlainOwnerValue = (owner: ComponentSelectboxExamplesPlainReleaseOwnerOption) => owner.id;
  readonly getComponentSelectboxExamplesPlainOwnerLabel = (owner: ComponentSelectboxExamplesPlainReleaseOwnerOption) => owner.name;
  readonly isComponentSelectboxExamplesPlainOwnerDisabled = (owner: ComponentSelectboxExamplesPlainReleaseOwnerOption) => owner.disabled === true;

  onComponentSelectboxExamplesPlainSelectedOwnerChange(value: unknown): void {
    this.componentSelectboxExamplesPlainSelectedOwnerId.set(this.toComponentSelectboxExamplesPlainSingleValue(value));
  }

  private toComponentSelectboxExamplesPlainSingleValue(value: unknown): string | null {
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

const OWNER_PLAIN_HTML_CODE = String.raw`<section class="docs-component-selectbox-examples-owner-plain-shell">
  <div class="docs-component-selectbox-examples-owner-plain-header">
    <span class="docs-component-selectbox-examples-owner-plain-kicker">Release owner roster</span>
    <p class="docs-component-selectbox-examples-owner-plain-copy">
      Custom templates let the wrapper show richer trigger and option content without rebuilding the select primitive.
    </p>
  </div>

  <tng-select
    class="docs-component-selectbox-examples-owner-plain-control"
    [options]="componentSelectboxExamplesPlainReleaseOwners"
    [value]="componentSelectboxExamplesPlainSelectedOwnerId()"
    (valueChange)="onComponentSelectboxExamplesPlainSelectedOwnerChange($event)"
    [getOptionValue]="getComponentSelectboxExamplesPlainOwnerValue"
    [getOptionLabel]="getComponentSelectboxExamplesPlainOwnerLabel"
    [isOptionDisabled]="isComponentSelectboxExamplesPlainOwnerDisabled"
    placeholder="Assign release owner"
    [ariaLabel]="'Release owner roster'"
  >
    <ng-template #tngSelectValueTpl let-selected>
      <div class="docs-component-selectbox-examples-owner-plain-value-row">
        <strong>{{ selected.label }}</strong>
        <small>{{ selected.option?.team }}</small>
      </div>
    </ng-template>

    <ng-template #tngSelectOptionTpl let-option>
      <div class="docs-component-selectbox-examples-owner-plain-option-row">
        <span class="docs-component-selectbox-examples-owner-plain-option-label">{{ option.label }}</span>
        <small class="docs-component-selectbox-examples-owner-plain-option-meta">{{ option.option.team }} · {{ option.option.timezone }}</small>
      </div>
    </ng-template>
  </tng-select>

  <p class="docs-component-selectbox-examples-owner-plain-summary">Selected: {{ componentSelectboxExamplesPlainSelectedOwnerSummary() }}</p>
</section>`;

const OWNER_PLAIN_CSS_CODE = String.raw`.docs-component-selectbox-examples-owner-plain-shell {
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

.docs-component-selectbox-examples-owner-plain-header {
  display: grid;
  gap: 0.35rem;
}

.docs-component-selectbox-examples-owner-plain-kicker {
  font-size: 0.8rem;
  font-weight: 700;
  color: #64748b;
}

.docs-component-selectbox-examples-owner-plain-copy,
.docs-component-selectbox-examples-owner-plain-summary {
  margin: 0;
  color: #475569;
}

.docs-component-selectbox-examples-owner-plain-control {
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
  --tng-semantic-accent-brand: #0f766e;
  --tng-semantic-focus-ring: #0f766e;
  --tng-select-radius: 1rem;
  --tng-select-trigger-py: 0.625rem;
  --tng-select-trigger-px: 0.875rem;
  --tng-select-option-py: 0.625rem;
  --tng-select-option-px: 0.875rem;
  --tng-select-bg: #ffffff;
  --tng-select-surface: #f8fafc;
  --tng-select-border: #d8e2ef;
  --tng-select-border-strong: #94a3b8;
  --tng-select-fg: #0f172a;
  --tng-select-muted: #64748b;
  --tng-select-brand: #0f766e;
  --tng-select-focus-ring: #0f766e;
}

.docs-component-selectbox-examples-owner-plain-value-row,
.docs-component-selectbox-examples-owner-plain-option-row {
  display: grid;
  gap: 0.15rem;
}

.docs-component-selectbox-examples-owner-plain-value-row strong,
.docs-component-selectbox-examples-owner-plain-option-label {
  font-weight: 600;
}

.docs-component-selectbox-examples-owner-plain-value-row small,
.docs-component-selectbox-examples-owner-plain-option-meta {
  color: #64748b;
}`;

const OWNER_TAILWIND_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import { TngSelectComponent } from '@tailng-ui/components';

interface ComponentSelectboxExamplesTailwindReleaseOwnerOption {
  readonly id: string;
  readonly name: string;
  readonly team: string;
  readonly timezone: string;
  readonly disabled?: boolean;
}

const COMPONENT_SELECTBOX_EXAMPLES_TAILWIND_RELEASE_OWNER_OPTIONS: readonly ComponentSelectboxExamplesTailwindReleaseOwnerOption[] = Object.freeze([
  { id: 'abigail', name: 'Abigail Chen', team: 'Design systems', timezone: 'UTC-8' },
  { id: 'mina', name: 'Mina Lee', team: 'Core UI', timezone: 'UTC-5' },
  { id: 'omar', name: 'Omar Aziz', team: 'Compliance', timezone: 'UTC+1', disabled: true },
  { id: 'sanjay', name: 'Sanjay Patel', team: 'Documentation', timezone: 'UTC+5:30' },
]);

@Component({
  selector: 'app-component-selectbox-examples-owner-tailwind',
  standalone: true,
  imports: [TngSelectComponent],
  templateUrl: './component-selectbox-examples-owner-tailwind.component.html',
  styleUrl: './component-selectbox-examples-owner-tailwind.component.css',
})
export class ComponentSelectboxExamplesOwnerTailwindComponent {
  readonly componentSelectboxExamplesTailwindReleaseOwners = COMPONENT_SELECTBOX_EXAMPLES_TAILWIND_RELEASE_OWNER_OPTIONS;
  readonly componentSelectboxExamplesTailwindSelectedOwnerId = signal<string | null>('abigail');
  readonly componentSelectboxExamplesTailwindSelectedOwnerSummary = computed(() => {
    const selectedValue = this.componentSelectboxExamplesTailwindSelectedOwnerId();
    if (selectedValue === null) {
      return 'none';
    }

    return this.componentSelectboxExamplesTailwindReleaseOwners.find((owner) => owner.id === selectedValue)?.name ?? 'none';
  });
  readonly getComponentSelectboxExamplesTailwindOwnerValue = (owner: ComponentSelectboxExamplesTailwindReleaseOwnerOption) => owner.id;
  readonly getComponentSelectboxExamplesTailwindOwnerLabel = (owner: ComponentSelectboxExamplesTailwindReleaseOwnerOption) => owner.name;
  readonly isComponentSelectboxExamplesTailwindOwnerDisabled = (owner: ComponentSelectboxExamplesTailwindReleaseOwnerOption) => owner.disabled === true;

  onComponentSelectboxExamplesTailwindSelectedOwnerChange(value: unknown): void {
    this.componentSelectboxExamplesTailwindSelectedOwnerId.set(this.toComponentSelectboxExamplesTailwindSingleValue(value));
  }

  private toComponentSelectboxExamplesTailwindSingleValue(value: unknown): string | null {
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

const OWNER_TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid max-w-[36rem] gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Release owner roster</span>
    <p class="m-0 text-sm text-slate-600">
      Custom templates let the wrapper show richer trigger and option content without rebuilding the select primitive.
    </p>
  </div>

  <tng-select
    class="block w-full min-w-0 [--tng-semantic-background-canvas:#ffffff] [--tng-semantic-background-surface:#f8fafc] [--tng-semantic-border-subtle:#d8e2ef] [--tng-semantic-border-strong:#94a3b8] [--tng-semantic-foreground-primary:#0f172a] [--tng-semantic-foreground-secondary:#475569] [--tng-semantic-foreground-muted:#64748b] [--tng-semantic-accent-brand:#0f766e] [--tng-semantic-focus-ring:#0f766e] [--tng-select-radius:1rem] [--tng-select-trigger-py:0.625rem] [--tng-select-trigger-px:0.875rem] [--tng-select-option-py:0.625rem] [--tng-select-option-px:0.875rem] [--tng-select-bg:#ffffff] [--tng-select-surface:#f8fafc] [--tng-select-border:#d8e2ef] [--tng-select-border-strong:#94a3b8] [--tng-select-fg:#0f172a] [--tng-select-muted:#64748b] [--tng-select-brand:#0f766e] [--tng-select-focus-ring:#0f766e]"
    [options]="componentSelectboxExamplesTailwindReleaseOwners"
    [value]="componentSelectboxExamplesTailwindSelectedOwnerId()"
    (valueChange)="onComponentSelectboxExamplesTailwindSelectedOwnerChange($event)"
    [getOptionValue]="getComponentSelectboxExamplesTailwindOwnerValue"
    [getOptionLabel]="getComponentSelectboxExamplesTailwindOwnerLabel"
    [isOptionDisabled]="isComponentSelectboxExamplesTailwindOwnerDisabled"
    placeholder="Assign release owner"
    [ariaLabel]="'Release owner roster'"
  >
    <ng-template #tngSelectValueTpl let-selected>
      <div class="grid gap-0.5">
        <strong class="text-sm font-semibold text-slate-900">{{ selected.label }}</strong>
        <small class="text-xs text-slate-500">{{ selected.option?.team }}</small>
      </div>
    </ng-template>

    <ng-template #tngSelectOptionTpl let-option>
      <div class="grid gap-0.5">
        <span class="text-sm font-medium text-slate-900">{{ option.label }}</span>
        <small class="text-xs text-slate-500">{{ option.option.team }} · {{ option.option.timezone }}</small>
      </div>
    </ng-template>
  </tng-select>

  <p class="m-0 text-xs text-slate-600">Selected: {{ componentSelectboxExamplesTailwindSelectedOwnerSummary() }}</p>
</section>`;

const OWNER_TAILWIND_CSS_CODE = '/* Tailwind utilities are applied directly in the template. */';

@Component({
  selector: 'app-selectbox-examples-page',
  imports: [TngSelectComponent, DocsExampleTabsSectionComponent, DocsExampleVariantDirective],
  templateUrl: './selectbox-examples-page.component.html',
  styleUrl: './selectbox-examples-page.component.css',
})
export class SelectboxExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly releaseStageLabelByValue = new Map(
    RELEASE_STAGE_OPTIONS.map((stage) => [stage.value, stage.label]),
  );
  private readonly releaseOwnerLabelByValue = new Map(
    RELEASE_OWNER_OPTIONS.map((owner) => [owner.id, owner.name]),
  );

  readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );

  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly releaseStages = RELEASE_STAGE_OPTIONS;
  protected readonly releaseOwners = RELEASE_OWNER_OPTIONS;
  protected readonly releaseStagePlainSelectedValue = signal<string | null>('review');
  protected readonly releaseStageTailwindSelectedValue = signal<string | null>('qa');
  protected readonly releaseOwnerPlainSelectedValue = signal<string | null>('mina');
  protected readonly releaseOwnerTailwindSelectedValue = signal<string | null>('abigail');
  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;

  protected readonly releaseStagePlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'component-selectbox-examples-stage-plain.component.ts', code: STAGE_PLAIN_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'component-selectbox-examples-stage-plain.component.html', code: STAGE_PLAIN_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'component-selectbox-examples-stage-plain.component.css', code: STAGE_PLAIN_CSS_CODE },
  ]);

  protected readonly releaseStageTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'component-selectbox-examples-stage-tailwind.component.ts', code: STAGE_TAILWIND_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'component-selectbox-examples-stage-tailwind.component.html', code: STAGE_TAILWIND_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'component-selectbox-examples-stage-tailwind.component.css', code: STAGE_TAILWIND_CSS_CODE },
  ]);

  protected readonly releaseOwnerPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'component-selectbox-examples-owner-plain.component.ts', code: OWNER_PLAIN_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'component-selectbox-examples-owner-plain.component.html', code: OWNER_PLAIN_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'component-selectbox-examples-owner-plain.component.css', code: OWNER_PLAIN_CSS_CODE },
  ]);

  protected readonly releaseOwnerTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'component-selectbox-examples-owner-tailwind.component.ts', code: OWNER_TAILWIND_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'component-selectbox-examples-owner-tailwind.component.html', code: OWNER_TAILWIND_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'component-selectbox-examples-owner-tailwind.component.css', code: OWNER_TAILWIND_CSS_CODE },
  ]);

  protected readonly getReleaseStageValue = (stage: ReleaseStageOption) => stage.value;
  protected readonly getReleaseStageLabel = (stage: ReleaseStageOption) => stage.label;
  protected readonly isReleaseStageDisabled = (stage: ReleaseStageOption) => stage.disabled === true;
  protected readonly getReleaseOwnerValue = (owner: ReleaseOwnerOption) => owner.id;
  protected readonly getReleaseOwnerLabel = (owner: ReleaseOwnerOption) => owner.name;
  protected readonly isReleaseOwnerDisabled = (owner: ReleaseOwnerOption) => owner.disabled === true;

  protected readonly releaseStagePlainSummary = computed(() => this.resolveReleaseStageLabel(this.releaseStagePlainSelectedValue()));
  protected readonly releaseStageTailwindSummary = computed(() => this.resolveReleaseStageLabel(this.releaseStageTailwindSelectedValue()));
  protected readonly releaseOwnerPlainSummary = computed(() => this.resolveReleaseOwnerLabel(this.releaseOwnerPlainSelectedValue()));
  protected readonly releaseOwnerTailwindSummary = computed(() => this.resolveReleaseOwnerLabel(this.releaseOwnerTailwindSelectedValue()));

  protected onReleaseStagePlainSelectedValueChange(value: unknown): void {
    this.releaseStagePlainSelectedValue.set(this.toSingleValue(value));
  }

  protected onReleaseStageTailwindSelectedValueChange(value: unknown): void {
    this.releaseStageTailwindSelectedValue.set(this.toSingleValue(value));
  }

  protected onReleaseOwnerPlainSelectedValueChange(value: unknown): void {
    this.releaseOwnerPlainSelectedValue.set(this.toSingleValue(value));
  }

  protected onReleaseOwnerTailwindSelectedValueChange(value: unknown): void {
    this.releaseOwnerTailwindSelectedValue.set(this.toSingleValue(value));
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  private resolveReleaseStageLabel(value: string | null): string {
    if (value === null) {
      return 'none';
    }

    return this.releaseStageLabelByValue.get(value) ?? 'none';
  }

  private resolveReleaseOwnerLabel(value: string | null): string {
    if (value === null) {
      return 'none';
    }

    return this.releaseOwnerLabelByValue.get(value) ?? 'none';
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
