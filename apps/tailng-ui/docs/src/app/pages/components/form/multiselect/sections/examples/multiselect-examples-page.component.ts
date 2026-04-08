import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../multiselect.util';
import { TngMultiSelectComponent } from '@tailng-ui/components';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

interface SelectOption {
  readonly value: string;
  readonly label: string;
  readonly disabled?: boolean;
}

const STATUS_OPTIONS: readonly SelectOption[] = Object.freeze([
  { value: 'todo', label: 'To do' },
  { value: 'progress', label: 'In progress' },
  { value: 'review', label: 'In review' },
  { value: 'blocked', label: 'Blocked', disabled: true },
  { value: 'done', label: 'Done' },
]);

const TAG_OPTIONS: readonly SelectOption[] = Object.freeze([
  { value: 'a11y', label: 'A11y' },
  { value: 'forms', label: 'Forms' },
  { value: 'overlay', label: 'Overlay' },
  { value: 'docs', label: 'Docs' },
]);

const STATUS_PLAIN_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import { TngMultiSelectComponent } from '@tailng-ui/components';

interface StatusOption {
  readonly value: string;
  readonly label: string;
  readonly disabled?: boolean;
}

const STATUS_OPTIONS: readonly StatusOption[] = Object.freeze([
  { value: 'todo', label: 'To do' },
  { value: 'progress', label: 'In progress' },
  { value: 'review', label: 'In review' },
  { value: 'blocked', label: 'Blocked', disabled: true },
  { value: 'done', label: 'Done' },
]);

@Component({
  selector: 'app-status-multiselect-plain',
  standalone: true,
  imports: [TngMultiSelectComponent],
  templateUrl: './status-multiselect-plain.component.html',
  styleUrl: './status-multiselect-plain.component.css',
})
export class StatusMultiselectPlainComponent {
  readonly statusOptions = STATUS_OPTIONS;
  readonly selectedStatuses = signal<readonly string[]>(['todo', 'review']);
  readonly selectedSummary = computed(() => {
    const values = this.selectedStatuses();
    const labels = values
      .map((v) => this.statusOptions.find((o) => o.value === v)?.label)
      .filter((l): l is string => l !== undefined);
    return labels.length > 0 ? labels.join(', ') : 'none';
  });
  readonly getStatusValue = (option: StatusOption) => option.value;
  readonly getStatusLabel = (option: StatusOption) => option.label;

  onValueChange(value: unknown): void {
    this.selectedStatuses.set(this.toValueArray(value));
  }

  private toValueArray(value: unknown): readonly string[] {
    if (value === null || value === undefined) return [];
    if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string');
    return typeof value === 'string' ? [value] : [];
  }
}`;

const STATUS_PLAIN_HTML_CODE = String.raw`<section class="status-multiselect-plain-shell">
  <div class="status-multiselect-plain-header">
    <span class="status-multiselect-plain-kicker">Status filter</span>
    <p class="status-multiselect-plain-copy">
      Keep a controlled multi-value while the wrapper handles trigger and menu plumbing.
    </p>
  </div>

  <tng-multiselect
    class="status-multiselect-plain-control"
    [options]="statusOptions"
    [value]="selectedStatuses()"
    (valueChange)="onValueChange($event)"
    [getOptionValue]="getStatusValue"
    [getOptionLabel]="getStatusLabel"
    placeholder="Select statuses"
    aria-label="Status multiselect"
  ></tng-multiselect>

  <p class="status-multiselect-plain-summary">Selected: {{ selectedSummary() }}</p>
</section>`;

const STATUS_PLAIN_CSS_CODE = String.raw`.status-multiselect-plain-shell {
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

.status-multiselect-plain-header {
  display: grid;
  gap: 0.35rem;
}

.status-multiselect-plain-kicker {
  font-size: 0.8rem;
  font-weight: 700;
  color: #64748b;
}

.status-multiselect-plain-copy,
.status-multiselect-plain-summary {
  margin: 0;
  color: #475569;
}

.status-multiselect-plain-control {
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

const STATUS_TAILWIND_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import { TngMultiSelectComponent } from '@tailng-ui/components';

interface StatusOption {
  readonly value: string;
  readonly label: string;
  readonly disabled?: boolean;
}

const STATUS_OPTIONS: readonly StatusOption[] = Object.freeze([
  { value: 'todo', label: 'To do' },
  { value: 'progress', label: 'In progress' },
  { value: 'review', label: 'In review' },
  { value: 'blocked', label: 'Blocked', disabled: true },
  { value: 'done', label: 'Done' },
]);

@Component({
  selector: 'app-status-multiselect-tailwind',
  standalone: true,
  imports: [TngMultiSelectComponent],
  templateUrl: './status-multiselect-tailwind.component.html',
  styleUrl: './status-multiselect-tailwind.component.css',
})
export class StatusMultiselectTailwindComponent {
  readonly statusOptions = STATUS_OPTIONS;
  readonly selectedStatuses = signal<readonly string[]>(['done']);
  readonly selectedSummary = computed(() => {
    const values = this.selectedStatuses();
    const labels = values
      .map((v) => this.statusOptions.find((o) => o.value === v)?.label)
      .filter((l): l is string => l !== undefined);
    return labels.length > 0 ? labels.join(', ') : 'none';
  });
  readonly getStatusValue = (option: StatusOption) => option.value;
  readonly getStatusLabel = (option: StatusOption) => option.label;

  onValueChange(value: unknown): void {
    this.selectedStatuses.set(this.toValueArray(value));
  }

  private toValueArray(value: unknown): readonly string[] {
    if (value === null || value === undefined) return [];
    if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string');
    return typeof value === 'string' ? [value] : [];
  }
}`;

const STATUS_TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid max-w-[36rem] gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-5 text-slate-900 shadow-sm [color-scheme:light]">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Status filter</span>
    <p class="m-0 text-sm text-slate-600">
      Keep a controlled multi-value while the wrapper handles trigger and menu plumbing.
    </p>
  </div>

  <tng-multiselect
    class="block w-full min-w-0 [--tng-semantic-background-canvas:#ffffff] [--tng-semantic-background-surface:#f8fafc] [--tng-semantic-border-subtle:#d8e2ef] [--tng-semantic-border-strong:#94a3b8] [--tng-semantic-foreground-primary:#0f172a] [--tng-semantic-foreground-secondary:#475569] [--tng-semantic-foreground-muted:#64748b] [--tng-semantic-accent-brand:#2563eb] [--tng-semantic-focus-ring:#2563eb] [--tng-select-radius:1rem] [--tng-select-trigger-py:0.625rem] [--tng-select-trigger-px:0.875rem] [--tng-select-option-py:0.625rem] [--tng-select-option-px:0.875rem] [--tng-select-bg:#ffffff] [--tng-select-surface:#f8fafc] [--tng-select-border:#d8e2ef] [--tng-select-border-strong:#94a3b8] [--tng-select-fg:#0f172a] [--tng-select-muted:#64748b] [--tng-select-brand:#2563eb] [--tng-select-focus-ring:#2563eb]"
    [options]="statusOptions"
    [value]="selectedStatuses()"
    (valueChange)="onValueChange($event)"
    [getOptionValue]="getStatusValue"
    [getOptionLabel]="getStatusLabel"
    placeholder="Select statuses"
    aria-label="Status multiselect"
  ></tng-multiselect>

  <p class="m-0 text-xs text-slate-600">Selected: {{ selectedSummary() }}</p>
</section>`;

const STATUS_TAILWIND_CSS_CODE = '/* Tailwind utilities are applied directly in the template. */';

const DUAL_PLAIN_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import { TngMultiSelectComponent } from '@tailng-ui/components';

interface TagOption {
  readonly value: string;
  readonly label: string;
}

const TAG_OPTIONS: readonly TagOption[] = Object.freeze([
  { value: 'a11y', label: 'A11y' },
  { value: 'forms', label: 'Forms' },
  { value: 'overlay', label: 'Overlay' },
  { value: 'docs', label: 'Docs' },
]);

@Component({
  selector: 'app-dual-multiselect-plain',
  standalone: true,
  imports: [TngMultiSelectComponent],
  templateUrl: './dual-multiselect-plain.component.html',
  styleUrl: './dual-multiselect-plain.component.css',
})
export class DualMultiselectPlainComponent {
  readonly tagOptions = TAG_OPTIONS;
  readonly tagValueA = signal<readonly string[]>(['a11y', 'docs']);
  readonly tagValueB = signal<readonly string[]>(['forms']);
  readonly tagSummaryA = computed(() => this.resolveLabels(this.tagValueA()));
  readonly tagSummaryB = computed(() => this.resolveLabels(this.tagValueB()));
  readonly getTagValue = (option: TagOption) => option.value;
  readonly getTagLabel = (option: TagOption) => option.label;

  onTagAValueChange(value: unknown): void {
    this.tagValueA.set(this.toValueArray(value));
  }

  onTagBValueChange(value: unknown): void {
    this.tagValueB.set(this.toValueArray(value));
  }

  private resolveLabels(values: readonly string[]): string {
    const labels = values
      .map((v) => this.tagOptions.find((o) => o.value === v)?.label)
      .filter((l): l is string => l !== undefined);
    return labels.length > 0 ? labels.join(', ') : 'none';
  }

  private toValueArray(value: unknown): readonly string[] {
    if (value === null || value === undefined) return [];
    if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string');
    return typeof value === 'string' ? [value] : [];
  }
}`;

const DUAL_PLAIN_HTML_CODE = String.raw`<section class="dual-multiselect-plain-shell">
  <div class="dual-multiselect-plain-header">
    <span class="dual-multiselect-plain-kicker">Dual tag groups</span>
    <p class="dual-multiselect-plain-copy">
      Two independent multiselects with Tab-based keyboard handoff between controls.
    </p>
  </div>

  <div class="dual-multiselect-plain-grid">
    <div class="dual-multiselect-plain-card">
      <p class="dual-multiselect-plain-card-title">Tag group A</p>
      <tng-multiselect
        class="dual-multiselect-plain-control"
        [options]="tagOptions"
        [value]="tagValueA()"
        (valueChange)="onTagAValueChange($event)"
        [getOptionValue]="getTagValue"
        [getOptionLabel]="getTagLabel"
        placeholder="Select tags"
        aria-label="Tag group A multiselect"
      ></tng-multiselect>
      <p class="dual-multiselect-plain-summary">Selected: {{ tagSummaryA() }}</p>
    </div>

    <div class="dual-multiselect-plain-card">
      <p class="dual-multiselect-plain-card-title">Tag group B</p>
      <tng-multiselect
        class="dual-multiselect-plain-control"
        [options]="tagOptions"
        [value]="tagValueB()"
        (valueChange)="onTagBValueChange($event)"
        [getOptionValue]="getTagValue"
        [getOptionLabel]="getTagLabel"
        placeholder="Select tags"
        aria-label="Tag group B multiselect"
      ></tng-multiselect>
      <p class="dual-multiselect-plain-summary">Selected: {{ tagSummaryB() }}</p>
    </div>
  </div>
</section>`;

const DUAL_PLAIN_CSS_CODE = String.raw`.dual-multiselect-plain-shell {
  display: grid;
  gap: 0.9rem;
  inline-size: 100%;
  padding: 1.1rem;
  border: 1px solid #cbd5e1;
  border-radius: 1.25rem;
  background: #ffffff;
  color: #0f172a;
  color-scheme: light;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);
}

.dual-multiselect-plain-header {
  display: grid;
  gap: 0.35rem;
}

.dual-multiselect-plain-kicker {
  font-size: 0.8rem;
  font-weight: 700;
  color: #64748b;
}

.dual-multiselect-plain-copy {
  margin: 0;
  color: #475569;
}

.dual-multiselect-plain-grid {
  display: grid;
  gap: 1rem;
}

@media (min-width: 64rem) {
  .dual-multiselect-plain-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.dual-multiselect-plain-card {
  display: grid;
  gap: 0.65rem;
  min-width: 0;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.85rem;
  background: #f8fafc;
}

.dual-multiselect-plain-card-title {
  font-size: 0.85rem;
  font-weight: 600;
  margin: 0;
  color: #334155;
}

.dual-multiselect-plain-summary {
  margin: 0;
  color: #475569;
}

.dual-multiselect-plain-control {
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
}`;

const DUAL_TAILWIND_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import { TngMultiSelectComponent } from '@tailng-ui/components';

interface TagOption {
  readonly value: string;
  readonly label: string;
}

const TAG_OPTIONS: readonly TagOption[] = Object.freeze([
  { value: 'a11y', label: 'A11y' },
  { value: 'forms', label: 'Forms' },
  { value: 'overlay', label: 'Overlay' },
  { value: 'docs', label: 'Docs' },
]);

@Component({
  selector: 'app-dual-multiselect-tailwind',
  standalone: true,
  imports: [TngMultiSelectComponent],
  templateUrl: './dual-multiselect-tailwind.component.html',
  styleUrl: './dual-multiselect-tailwind.component.css',
})
export class DualMultiselectTailwindComponent {
  readonly tagOptions = TAG_OPTIONS;
  readonly tagValueA = signal<readonly string[]>(['a11y', 'docs']);
  readonly tagValueB = signal<readonly string[]>(['forms']);
  readonly tagSummaryA = computed(() => this.resolveLabels(this.tagValueA()));
  readonly tagSummaryB = computed(() => this.resolveLabels(this.tagValueB()));
  readonly getTagValue = (option: TagOption) => option.value;
  readonly getTagLabel = (option: TagOption) => option.label;

  onTagAValueChange(value: unknown): void {
    this.tagValueA.set(this.toValueArray(value));
  }

  onTagBValueChange(value: unknown): void {
    this.tagValueB.set(this.toValueArray(value));
  }

  private resolveLabels(values: readonly string[]): string {
    const labels = values
      .map((v) => this.tagOptions.find((o) => o.value === v)?.label)
      .filter((l): l is string => l !== undefined);
    return labels.length > 0 ? labels.join(', ') : 'none';
  }

  private toValueArray(value: unknown): readonly string[] {
    if (value === null || value === undefined) return [];
    if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string');
    return typeof value === 'string' ? [value] : [];
  }
}`;

const DUAL_TAILWIND_HTML_CODE = String.raw`<section class="grid w-full gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-5 text-slate-900 shadow-sm [color-scheme:light]">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Dual tag groups</span>
    <p class="m-0 text-sm text-slate-600">
      Two independent multiselects with Tab-based keyboard handoff between controls.
    </p>
  </div>

  <div class="grid gap-4 lg:grid-cols-2">
    <div class="grid gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3">
      <p class="m-0 text-sm font-semibold text-slate-600">Tag group A</p>
      <tng-multiselect
        class="block w-full min-w-0 [--tng-semantic-background-canvas:#ffffff] [--tng-semantic-background-surface:#f8fafc] [--tng-semantic-border-subtle:#d8e2ef] [--tng-semantic-border-strong:#94a3b8] [--tng-semantic-foreground-primary:#0f172a] [--tng-semantic-foreground-secondary:#475569] [--tng-semantic-foreground-muted:#64748b] [--tng-semantic-accent-brand:#0f766e] [--tng-semantic-focus-ring:#0f766e] [--tng-select-radius:1rem] [--tng-select-trigger-py:0.625rem] [--tng-select-trigger-px:0.875rem] [--tng-select-option-py:0.625rem] [--tng-select-option-px:0.875rem] [--tng-select-bg:#ffffff] [--tng-select-surface:#f8fafc] [--tng-select-border:#d8e2ef] [--tng-select-border-strong:#94a3b8] [--tng-select-fg:#0f172a] [--tng-select-muted:#64748b] [--tng-select-brand:#0f766e] [--tng-select-focus-ring:#0f766e]"
        [options]="tagOptions"
        [value]="tagValueA()"
        (valueChange)="onTagAValueChange($event)"
        [getOptionValue]="getTagValue"
        [getOptionLabel]="getTagLabel"
        placeholder="Select tags"
        aria-label="Tag group A multiselect"
      ></tng-multiselect>
      <p class="m-0 text-xs text-slate-600">Selected: {{ tagSummaryA() }}</p>
    </div>

    <div class="grid gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3">
      <p class="m-0 text-sm font-semibold text-slate-600">Tag group B</p>
      <tng-multiselect
        class="block w-full min-w-0 [--tng-semantic-background-canvas:#ffffff] [--tng-semantic-background-surface:#f8fafc] [--tng-semantic-border-subtle:#d8e2ef] [--tng-semantic-border-strong:#94a3b8] [--tng-semantic-foreground-primary:#0f172a] [--tng-semantic-foreground-secondary:#475569] [--tng-semantic-foreground-muted:#64748b] [--tng-semantic-accent-brand:#0f766e] [--tng-semantic-focus-ring:#0f766e] [--tng-select-radius:1rem] [--tng-select-trigger-py:0.625rem] [--tng-select-trigger-px:0.875rem] [--tng-select-option-py:0.625rem] [--tng-select-option-px:0.875rem] [--tng-select-bg:#ffffff] [--tng-select-surface:#f8fafc] [--tng-select-border:#d8e2ef] [--tng-select-border-strong:#94a3b8] [--tng-select-fg:#0f172a] [--tng-select-muted:#64748b] [--tng-select-brand:#0f766e] [--tng-select-focus-ring:#0f766e]"
        [options]="tagOptions"
        [value]="tagValueB()"
        (valueChange)="onTagBValueChange($event)"
        [getOptionValue]="getTagValue"
        [getOptionLabel]="getTagLabel"
        placeholder="Select tags"
        aria-label="Tag group B multiselect"
      ></tng-multiselect>
      <p class="m-0 text-xs text-slate-600">Selected: {{ tagSummaryB() }}</p>
    </div>
  </div>
</section>`;

const DUAL_TAILWIND_CSS_CODE = '/* Tailwind utilities are applied directly in the template. */';

@Component({
  selector: 'app-multiselect-examples-page',
  imports: [
    TngMultiSelectComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './multiselect-examples-page.component.html',
  styleUrl: './multiselect-examples-page.component.css',
})
export class MultiselectExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly statusLabelByValue = new Map(
    STATUS_OPTIONS.map((option) => [option.value, option.label]),
  );
  private readonly tagLabelByValue = new Map(
    TAG_OPTIONS.map((option) => [option.value, option.label]),
  );

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly statusOptions = STATUS_OPTIONS;
  protected readonly tagOptions = TAG_OPTIONS;
  protected readonly getStatusValue = (option: SelectOption) => option.value;
  protected readonly getStatusLabel = (option: SelectOption) => option.label;
  protected readonly getTagValue = (option: SelectOption) => option.value;
  protected readonly getTagLabel = (option: SelectOption) => option.label;

  protected readonly statusPlainValue = signal<readonly string[]>(['todo', 'review']);
  protected readonly statusTailwindValue = signal<readonly string[]>(['done']);
  protected readonly tagPlainValueA = signal<readonly string[]>(['a11y', 'docs']);
  protected readonly tagPlainValueB = signal<readonly string[]>(['forms']);
  protected readonly tagTailwindValueA = signal<readonly string[]>(['a11y', 'docs']);
  protected readonly tagTailwindValueB = signal<readonly string[]>(['forms']);

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;

  protected readonly statusPlainSummary = computed(() => this.resolveStatusLabels(this.statusPlainValue()));
  protected readonly statusTailwindSummary = computed(() => this.resolveStatusLabels(this.statusTailwindValue()));
  protected readonly tagPlainSummaryA = computed(() => this.resolveTagLabels(this.tagPlainValueA()));
  protected readonly tagPlainSummaryB = computed(() => this.resolveTagLabels(this.tagPlainValueB()));
  protected readonly tagTailwindSummaryA = computed(() => this.resolveTagLabels(this.tagTailwindValueA()));
  protected readonly tagTailwindSummaryB = computed(() => this.resolveTagLabels(this.tagTailwindValueB()));

  protected readonly statusPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'status-multiselect-plain.component.ts', code: STATUS_PLAIN_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'status-multiselect-plain.component.html', code: STATUS_PLAIN_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'status-multiselect-plain.component.css', code: STATUS_PLAIN_CSS_CODE },
  ]);

  protected readonly statusTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'status-multiselect-tailwind.component.ts', code: STATUS_TAILWIND_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'status-multiselect-tailwind.component.html', code: STATUS_TAILWIND_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'status-multiselect-tailwind.component.css', code: STATUS_TAILWIND_CSS_CODE },
  ]);

  protected readonly dualPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'dual-multiselect-plain.component.ts', code: DUAL_PLAIN_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'dual-multiselect-plain.component.html', code: DUAL_PLAIN_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'dual-multiselect-plain.component.css', code: DUAL_PLAIN_CSS_CODE },
  ]);

  protected readonly dualTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'dual-multiselect-tailwind.component.ts', code: DUAL_TAILWIND_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'dual-multiselect-tailwind.component.html', code: DUAL_TAILWIND_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'dual-multiselect-tailwind.component.css', code: DUAL_TAILWIND_CSS_CODE },
  ]);

  protected onStatusPlainValueChange(value: unknown): void {
    this.statusPlainValue.set(this.toValueArray(value));
  }

  protected onStatusTailwindValueChange(value: unknown): void {
    this.statusTailwindValue.set(this.toValueArray(value));
  }

  protected onTagPlainAValueChange(value: unknown): void {
    this.tagPlainValueA.set(this.toValueArray(value));
  }

  protected onTagPlainBValueChange(value: unknown): void {
    this.tagPlainValueB.set(this.toValueArray(value));
  }

  protected onTagTailwindAValueChange(value: unknown): void {
    this.tagTailwindValueA.set(this.toValueArray(value));
  }

  protected onTagTailwindBValueChange(value: unknown): void {
    this.tagTailwindValueB.set(this.toValueArray(value));
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  private resolveStatusLabels(values: readonly string[]): string {
    const labels = values
      .map((value) => this.statusLabelByValue.get(value))
      .filter((label): label is string => label !== undefined);
    return labels.length > 0 ? labels.join(', ') : 'none';
  }

  private resolveTagLabels(values: readonly string[]): string {
    const labels = values
      .map((value) => this.tagLabelByValue.get(value))
      .filter((label): label is string => label !== undefined);
    return labels.length > 0 ? labels.join(', ') : 'none';
  }

  private toValueArray(value: unknown): readonly string[] {
    if (value === null || value === undefined) {
      return [];
    }

    if (Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === 'string');
    }

    return typeof value === 'string' ? [value] : [];
  }
}
