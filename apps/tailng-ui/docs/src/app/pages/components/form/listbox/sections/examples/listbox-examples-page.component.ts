import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { TngListboxComponent } from '@tailng-ui/components';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../listbox.util';

type PriorityValue = 'low' | 'medium' | 'high';
type ChannelValue = 'changelog' | 'docs' | 'team' | 'support';
type ListboxModel = string | readonly string[] | null;

type PriorityOption = {
  readonly value: PriorityValue;
  readonly title: string;
  readonly description: string;
};

type ChannelOption = {
  readonly value: ChannelValue;
  readonly title: string;
  readonly description: string;
};

const PRIORITY_OPTIONS: readonly PriorityOption[] = [
  {
    value: 'low',
    title: 'Low priority',
    description: 'Queue behind roadmap and maintenance work.',
  },
  {
    value: 'medium',
    title: 'Medium priority',
    description: 'Schedule into the next planning window.',
  },
  {
    value: 'high',
    title: 'High priority',
    description: 'Promote into the current delivery sprint.',
  },
];

const CHANNEL_OPTIONS: readonly ChannelOption[] = [
  {
    value: 'changelog',
    title: 'Changelog',
    description: 'Release notes and external announcements.',
  },
  {
    value: 'docs',
    title: 'Docs',
    description: 'Public docs synchronization and snippets.',
  },
  {
    value: 'team',
    title: 'Team updates',
    description: 'Internal team status updates.',
  },
  {
    value: 'support',
    title: 'Support',
    description: 'Customer success and support queues.',
  },
];

function isPriorityValue(value: string): value is PriorityValue {
  return value === 'low' || value === 'medium' || value === 'high';
}

function isChannelValue(value: string): value is ChannelValue {
  return value === 'changelog' || value === 'docs' || value === 'team' || value === 'support';
}

function normalizeSingle<T extends string>(value: ListboxModel, guard: (candidate: string) => candidate is T): T | null {
  if (value == null) {
    return null;
  }

  const candidate = typeof value === 'string' ? value : value[0] ?? null;
  return candidate && guard(candidate) ? candidate : null;
}

@Component({
  selector: 'app-listbox-examples-page',
  imports: [TngListboxComponent, DocsExampleTabsSectionComponent, DocsExampleVariantDirective],
  templateUrl: './listbox-examples-page.component.html',
  styleUrl: './listbox-examples-page.component.css',
})
export class ListboxExamplesPageComponent implements OnDestroy {
  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;

  protected readonly priorityOptions = PRIORITY_OPTIONS;
  protected readonly channelOptions = CHANNEL_OPTIONS;

  protected readonly plainValue = signal<PriorityValue | null>('medium');
  protected readonly tailwindValue = signal<PriorityValue | null>('low');
  protected readonly dualPlainChannelValueA = signal<ChannelValue | null>('docs');
  protected readonly dualPlainChannelValueB = signal<ChannelValue | null>('team');
  protected readonly dualTailwindChannelValueA = signal<ChannelValue | null>('docs');
  protected readonly dualTailwindChannelValueB = signal<ChannelValue | null>('support');

  protected readonly plainSummary = computed(() => this.formatSingleSelection(this.plainValue(), PRIORITY_OPTIONS));
  protected readonly tailwindSummary = computed(() => this.formatSingleSelection(this.tailwindValue(), PRIORITY_OPTIONS));
  protected readonly dualPlainChannelSummaryA = computed(() => this.formatSingleSelection(this.dualPlainChannelValueA(), CHANNEL_OPTIONS));
  protected readonly dualPlainChannelSummaryB = computed(() => this.formatSingleSelection(this.dualPlainChannelValueB(), CHANNEL_OPTIONS));
  protected readonly dualTailwindChannelSummaryA = computed(() => this.formatSingleSelection(this.dualTailwindChannelValueA(), CHANNEL_OPTIONS));
  protected readonly dualTailwindChannelSummaryB = computed(() => this.formatSingleSelection(this.dualTailwindChannelValueB(), CHANNEL_OPTIONS));

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = [
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'docs-listbox-priority-plain-css-example.component.ts',
      code: `import { Component, computed, signal } from '@angular/core';
import { TngListboxComponent } from '@tailng-ui/components';

type PriorityValue = 'low' | 'medium' | 'high';
type ListboxModel = string | readonly string[] | null;

interface PriorityOption {
  readonly value: PriorityValue;
  readonly title: string;
  readonly description: string;
}

const PRIORITY_OPTIONS: readonly PriorityOption[] = [
  {
    value: 'low',
    title: 'Low priority',
    description: 'Queue behind roadmap and maintenance work.',
  },
  {
    value: 'medium',
    title: 'Medium priority',
    description: 'Schedule into the next planning window.',
  },
  {
    value: 'high',
    title: 'High priority',
    description: 'Promote into the current delivery sprint.',
  },
];

function isPriorityValue(value: string): value is PriorityValue {
  return value === 'low' || value === 'medium' || value === 'high';
}

@Component({
  selector: 'app-docs-listbox-priority-plain-css-example',
  standalone: true,
  imports: [TngListboxComponent],
  templateUrl: './docs-listbox-priority-plain-css-example.component.html',
  styleUrl: './docs-listbox-priority-plain-css-example.component.css',
})
export class DocsListboxPriorityPlainCssExampleComponent {
  readonly priorityOptions = PRIORITY_OPTIONS;
  readonly selectedPriority = signal<PriorityValue | null>('medium');
  readonly selectedPrioritySummary = computed(() => {
    const current = this.selectedPriority();
    if (!current) {
      return 'None selected';
    }

    return PRIORITY_OPTIONS.find((option) => option.value === current)?.title ?? 'Unknown';
  });

  onSelectedPriorityChange(value: ListboxModel): void {
    const candidate = typeof value === 'string' ? value : value?.[0] ?? null;
    this.selectedPriority.set(candidate && isPriorityValue(candidate) ? candidate : null);
  }
}
`,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'docs-listbox-priority-plain-css-example.component.html',
      code: `<section class="docs-listbox-priority-example">
  <header class="docs-listbox-priority-example__header">
    <h2 class="docs-listbox-priority-example__title">Priority queue</h2>
    <p class="docs-listbox-priority-example__copy">
      Use the component wrapper to carry a fully styled listbox while keeping the primitive
      keyboard model underneath.
    </p>
  </header>

  <div class="docs-listbox-priority-example__listbox">
    <tng-listbox
      ariaLabel="Priority queue"
      [options]="priorityOptions"
      [value]="selectedPriority()"
      (valueChange)="onSelectedPriorityChange($event)"
    ></tng-listbox>
  </div>

  <p class="docs-listbox-priority-example__summary">
    Selected priority: {{ selectedPrioritySummary() }}
  </p>
</section>
`,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'docs-listbox-priority-plain-css-example.component.css',
      code: `.docs-listbox-priority-example {
  display: grid;
  gap: 1rem;
  padding: 1.5rem;
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 1.25rem;
  background: var(--tng-semantic-background-surface);
  color: var(--tng-semantic-foreground-primary);
  box-shadow: 0 18px 40px -28px rgba(15, 23, 42, 0.35);
}

.docs-listbox-priority-example__header {
  display: grid;
  gap: 0.5rem;
}

.docs-listbox-priority-example__title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
}

.docs-listbox-priority-example__copy {
  margin: 0;
  color: var(--tng-semantic-foreground-secondary);
}

.docs-listbox-priority-example__listbox {
  width: 100%;
  max-width: none;
}

.docs-listbox-priority-example__listbox tng-listbox {
  width: 100%;
  max-width: none;
}

.docs-listbox-priority-example__summary {
  margin: 0;
  color: var(--tng-semantic-foreground-secondary);
  font-size: 0.95rem;
  font-weight: 600;
}
`,
    },
  ];

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = [
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'docs-listbox-priority-tailwind-example.component.ts',
      code: `import { Component, computed, signal } from '@angular/core';
import { TngListboxComponent } from '@tailng-ui/components';

type PriorityValue = 'low' | 'medium' | 'high';
type ListboxModel = string | readonly string[] | null;

interface PriorityOption {
  readonly value: PriorityValue;
  readonly title: string;
  readonly description: string;
}

const PRIORITY_OPTIONS: readonly PriorityOption[] = [
  {
    value: 'low',
    title: 'Low priority',
    description: 'Queue behind roadmap and maintenance work.',
  },
  {
    value: 'medium',
    title: 'Medium priority',
    description: 'Schedule into the next planning window.',
  },
  {
    value: 'high',
    title: 'High priority',
    description: 'Promote into the current delivery sprint.',
  },
];

function isPriorityValue(value: string): value is PriorityValue {
  return value === 'low' || value === 'medium' || value === 'high';
}

@Component({
  selector: 'app-docs-listbox-priority-tailwind-example',
  standalone: true,
  imports: [TngListboxComponent],
  templateUrl: './docs-listbox-priority-tailwind-example.component.html',
})
export class DocsListboxPriorityTailwindExampleComponent {
  readonly priorityOptions = PRIORITY_OPTIONS;
  readonly selectedPriority = signal<PriorityValue | null>('low');
  readonly selectedPrioritySummary = computed(() => {
    const current = this.selectedPriority();
    if (!current) {
      return 'None selected';
    }

    return PRIORITY_OPTIONS.find((option) => option.value === current)?.title ?? 'Unknown';
  });

  onSelectedPriorityChange(value: ListboxModel): void {
    const candidate = typeof value === 'string' ? value : value?.[0] ?? null;
    this.selectedPriority.set(candidate && isPriorityValue(candidate) ? candidate : null);
  }
}
`,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'docs-listbox-priority-tailwind-example.component.html',
      code: `<section class="grid gap-4 rounded-3xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-6 text-[var(--tng-semantic-foreground-primary)] shadow-sm">
  <header class="grid gap-2">
    <h2 class="m-0 text-lg font-semibold">Priority queue</h2>
    <p class="m-0 text-sm text-[var(--tng-semantic-foreground-secondary)]">
      Use the component wrapper to carry a fully styled listbox while keeping the primitive
      keyboard model underneath.
    </p>
  </header>

  <div class="w-full max-w-none rounded-2xl">
    <tng-listbox
      ariaLabel="Priority queue"
      [options]="priorityOptions"
      [value]="selectedPriority()"
      (valueChange)="onSelectedPriorityChange($event)"
    ></tng-listbox>
  </div>

  <p class="m-0 text-sm font-medium text-[var(--tng-semantic-foreground-secondary)]">
    Selected priority: {{ selectedPrioritySummary() }}
  </p>
</section>
`,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'docs-listbox-priority-tailwind-example.component.css',
      code: `/* Tailwind utilities are defined inline in the template. */
`,
    },
  ];

  protected readonly dualListPlainCodeTabs: readonly DocsExampleCodeTab[] = [
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'docs-listbox-dual-handoff-plain-css-example.component.ts',
      code: `import { Component, computed, signal } from '@angular/core';
import { TngListboxComponent } from '@tailng-ui/components';

type ChannelValue = 'changelog' | 'docs' | 'team' | 'support';
type ListboxModel = string | readonly string[] | null;

interface ChannelOption {
  readonly value: ChannelValue;
  readonly title: string;
  readonly description: string;
}

const CHANNEL_OPTIONS: readonly ChannelOption[] = [
  {
    value: 'changelog',
    title: 'Changelog',
    description: 'Release notes and external announcements.',
  },
  {
    value: 'docs',
    title: 'Docs',
    description: 'Public docs synchronization and snippets.',
  },
  {
    value: 'team',
    title: 'Team updates',
    description: 'Internal team status updates.',
  },
  {
    value: 'support',
    title: 'Support',
    description: 'Customer success and support queues.',
  },
];

function isChannelValue(value: string): value is ChannelValue {
  return value === 'changelog' || value === 'docs' || value === 'team' || value === 'support';
}

@Component({
  selector: 'app-docs-listbox-dual-handoff-plain-css-example',
  standalone: true,
  imports: [TngListboxComponent],
  templateUrl: './docs-listbox-dual-handoff-plain-css-example.component.html',
  styleUrl: './docs-listbox-dual-handoff-plain-css-example.component.css',
})
export class DocsListboxDualHandoffPlainCssExampleComponent {
  readonly channelOptions = CHANNEL_OPTIONS;
  readonly selectedChannelA = signal<ChannelValue | null>('docs');
  readonly selectedChannelB = signal<ChannelValue | null>('team');
  readonly selectedChannelSummaryA = computed(() => this.formatSelection(this.selectedChannelA()));
  readonly selectedChannelSummaryB = computed(() => this.formatSelection(this.selectedChannelB()));

  onSelectedChannelAChange(value: ListboxModel): void {
    const candidate = typeof value === 'string' ? value : value?.[0] ?? null;
    this.selectedChannelA.set(candidate && isChannelValue(candidate) ? candidate : null);
  }

  onSelectedChannelBChange(value: ListboxModel): void {
    const candidate = typeof value === 'string' ? value : value?.[0] ?? null;
    this.selectedChannelB.set(candidate && isChannelValue(candidate) ? candidate : null);
  }

  private formatSelection(value: ChannelValue | null): string {
    if (!value) {
      return 'none';
    }

    return CHANNEL_OPTIONS.find((option) => option.value === value)?.title ?? 'unknown';
  }
}
`,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'docs-listbox-dual-handoff-plain-css-example.component.html',
      code: `<div class="docs-listbox-dual-handoff-example">
  <section class="docs-listbox-dual-handoff-example__card">
    <h2 class="docs-listbox-dual-handoff-example__title">Publish channels A</h2>
    <div class="docs-listbox-dual-handoff-example__listbox docs-listbox-dual-handoff-example__listbox--dark">
      <tng-listbox
        ariaLabel="Publish channels A"
        [options]="channelOptions"
        [value]="selectedChannelA()"
        (valueChange)="onSelectedChannelAChange($event)"
      ></tng-listbox>
    </div>
    <p class="docs-listbox-dual-handoff-example__summary">selected: {{ selectedChannelSummaryA() }}</p>
  </section>

  <section class="docs-listbox-dual-handoff-example__card">
    <h2 class="docs-listbox-dual-handoff-example__title">Publish channels B</h2>
    <div class="docs-listbox-dual-handoff-example__listbox docs-listbox-dual-handoff-example__listbox--dark">
      <tng-listbox
        ariaLabel="Publish channels B"
        [options]="channelOptions"
        [value]="selectedChannelB()"
        (valueChange)="onSelectedChannelBChange($event)"
      ></tng-listbox>
    </div>
    <p class="docs-listbox-dual-handoff-example__summary">selected: {{ selectedChannelSummaryB() }}</p>
  </section>
</div>
`,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'docs-listbox-dual-handoff-plain-css-example.component.css',
      code: `.docs-listbox-dual-handoff-example {
  display: grid;
  gap: 1.5rem;
}

@media (min-width: 80rem) {
  .docs-listbox-dual-handoff-example {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.docs-listbox-dual-handoff-example__card {
  display: grid;
  gap: 1rem;
  padding: 1.5rem;
  border: 1px solid var(--tng-semantic-border-subtle);
  border-radius: 1.25rem;
  background: var(--tng-semantic-background-surface);
  color: var(--tng-semantic-foreground-primary);
}

.docs-listbox-dual-handoff-example__title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
}

.docs-listbox-dual-handoff-example__listbox {
  width: 100%;
  max-width: none;
}

.docs-listbox-dual-handoff-example__listbox tng-listbox {
  width: 100%;
  max-width: none;
}

.docs-listbox-dual-handoff-example__listbox--dark {}

.docs-listbox-dual-handoff-example__summary {
  margin: 0;
  color: var(--tng-semantic-foreground-secondary);
  font-size: 0.95rem;
  font-weight: 600;
}
`,
    },
  ];

  protected readonly dualListTailwindCodeTabs: readonly DocsExampleCodeTab[] = [
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'docs-listbox-dual-handoff-tailwind-example.component.ts',
      code: `import { Component, computed, signal } from '@angular/core';
import { TngListboxComponent } from '@tailng-ui/components';

type ChannelValue = 'changelog' | 'docs' | 'team' | 'support';
type ListboxModel = string | readonly string[] | null;

interface ChannelOption {
  readonly value: ChannelValue;
  readonly title: string;
  readonly description: string;
}

const CHANNEL_OPTIONS: readonly ChannelOption[] = [
  {
    value: 'changelog',
    title: 'Changelog',
    description: 'Release notes and external announcements.',
  },
  {
    value: 'docs',
    title: 'Docs',
    description: 'Public docs synchronization and snippets.',
  },
  {
    value: 'team',
    title: 'Team updates',
    description: 'Internal team status updates.',
  },
  {
    value: 'support',
    title: 'Support',
    description: 'Customer success and support queues.',
  },
];

function isChannelValue(value: string): value is ChannelValue {
  return value === 'changelog' || value === 'docs' || value === 'team' || value === 'support';
}

@Component({
  selector: 'app-docs-listbox-dual-handoff-tailwind-example',
  standalone: true,
  imports: [TngListboxComponent],
  templateUrl: './docs-listbox-dual-handoff-tailwind-example.component.html',
})
export class DocsListboxDualHandoffTailwindExampleComponent {
  readonly channelOptions = CHANNEL_OPTIONS;
  readonly selectedChannelA = signal<ChannelValue | null>('docs');
  readonly selectedChannelB = signal<ChannelValue | null>('support');
  readonly selectedChannelSummaryA = computed(() => this.formatSelection(this.selectedChannelA()));
  readonly selectedChannelSummaryB = computed(() => this.formatSelection(this.selectedChannelB()));

  onSelectedChannelAChange(value: ListboxModel): void {
    const candidate = typeof value === 'string' ? value : value?.[0] ?? null;
    this.selectedChannelA.set(candidate && isChannelValue(candidate) ? candidate : null);
  }

  onSelectedChannelBChange(value: ListboxModel): void {
    const candidate = typeof value === 'string' ? value : value?.[0] ?? null;
    this.selectedChannelB.set(candidate && isChannelValue(candidate) ? candidate : null);
  }

  private formatSelection(value: ChannelValue | null): string {
    if (!value) {
      return 'none';
    }

    return CHANNEL_OPTIONS.find((option) => option.value === value)?.title ?? 'unknown';
  }
}
`,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'docs-listbox-dual-handoff-tailwind-example.component.html',
      code: `<div class="grid gap-4 xl:grid-cols-2">
  <section class="grid gap-3 rounded-3xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-4 text-[var(--tng-semantic-foreground-primary)] shadow-sm">
    <h2 class="m-0 text-lg font-semibold">Publish channels A</h2>
    <div class="w-full max-w-none rounded-2xl">
      <tng-listbox
        ariaLabel="Publish channels A"
        [options]="channelOptions"
        [value]="selectedChannelA()"
        (valueChange)="onSelectedChannelAChange($event)"
      ></tng-listbox>
    </div>
    <p class="m-0 text-sm font-medium text-[var(--tng-semantic-foreground-secondary)]">selected: {{ selectedChannelSummaryA() }}</p>
  </section>

  <section class="grid gap-3 rounded-3xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-4 text-[var(--tng-semantic-foreground-primary)] shadow-sm">
    <h2 class="m-0 text-lg font-semibold">Publish channels B</h2>
    <div class="w-full max-w-none rounded-2xl">
      <tng-listbox
        ariaLabel="Publish channels B"
        [options]="channelOptions"
        [value]="selectedChannelB()"
        (valueChange)="onSelectedChannelBChange($event)"
      ></tng-listbox>
    </div>
    <p class="m-0 text-sm font-medium text-[var(--tng-semantic-foreground-secondary)]">selected: {{ selectedChannelSummaryB() }}</p>
  </section>
</div>
`,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'docs-listbox-dual-handoff-tailwind-example.component.css',
      code: `/* Tailwind utilities are defined inline in the template. */
`,
    },
  ];

  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected onPlainValueChange(value: ListboxModel): void {
    this.plainValue.set(normalizeSingle(value, isPriorityValue));
  }

  protected onTailwindValueChange(value: ListboxModel): void {
    this.tailwindValue.set(normalizeSingle(value, isPriorityValue));
  }

  protected onDualPlainChannelAValueChange(value: ListboxModel): void {
    this.dualPlainChannelValueA.set(normalizeSingle(value, isChannelValue));
  }

  protected onDualPlainChannelBValueChange(value: ListboxModel): void {
    this.dualPlainChannelValueB.set(normalizeSingle(value, isChannelValue));
  }

  protected onDualTailwindChannelAValueChange(value: ListboxModel): void {
    this.dualTailwindChannelValueA.set(normalizeSingle(value, isChannelValue));
  }

  protected onDualTailwindChannelBValueChange(value: ListboxModel): void {
    this.dualTailwindChannelValueB.set(normalizeSingle(value, isChannelValue));
  }

  private formatSingleSelection(
    value: PriorityValue | ChannelValue | null,
    options: readonly PriorityOption[] | readonly ChannelOption[],
  ): string {
    if (!value) {
      return 'none';
    }

    return options.find((option) => option.value === value)?.title ?? value;
  }
}
