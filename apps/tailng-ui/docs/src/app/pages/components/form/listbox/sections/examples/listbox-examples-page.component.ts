import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { TngListboxDirective, TngOptionDirective } from '@tailng-ui/primitives';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';

import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../listbox.util';

type ListboxOption = {
  readonly value: string;
  readonly title: string;
  readonly description: string;
};

type ListboxModel = readonly string[] | string | null | undefined;

const PRIORITY_OPTIONS: readonly ListboxOption[] = [
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

const CHANNEL_OPTIONS: readonly ListboxOption[] = [
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

@Component({
  selector: 'app-listbox-examples-page',
  imports: [
    TngListboxDirective,
    TngOptionDirective,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './listbox-examples-page.component.html',
  styleUrl: './listbox-examples-page.component.css',
})
export class ListboxExamplesPageComponent implements OnDestroy {
  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;

  protected readonly priorityOptions = PRIORITY_OPTIONS;
  protected readonly channelOptions = CHANNEL_OPTIONS;

  protected readonly plainValue = signal<readonly string[]>(['medium']);
  protected readonly tailwindValue = signal<readonly string[]>(['low']);
  protected readonly dualPlainChannelValueA = signal<readonly string[]>(['docs']);
  protected readonly dualPlainChannelValueB = signal<readonly string[]>(['team']);
  protected readonly dualTailwindChannelValueA = signal<readonly string[]>(['docs']);
  protected readonly dualTailwindChannelValueB = signal<readonly string[]>(['support']);

  protected readonly plainSummary = computed(() =>
    this.formatSelection(this.plainValue(), PRIORITY_OPTIONS),
  );

  protected readonly tailwindSummary = computed(() =>
    this.formatSelection(this.tailwindValue(), PRIORITY_OPTIONS),
  );

  protected readonly dualPlainChannelSummaryA = computed(() =>
    this.formatSelection(this.dualPlainChannelValueA(), CHANNEL_OPTIONS),
  );

  protected readonly dualPlainChannelSummaryB = computed(() =>
    this.formatSelection(this.dualPlainChannelValueB(), CHANNEL_OPTIONS),
  );

  protected readonly dualTailwindChannelSummaryA = computed(() =>
    this.formatSelection(this.dualTailwindChannelValueA(), CHANNEL_OPTIONS),
  );

  protected readonly dualTailwindChannelSummaryB = computed(() =>
    this.formatSelection(this.dualTailwindChannelValueB(), CHANNEL_OPTIONS),
  );

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = [
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'docs-listbox-priority-plain-css-example.component.ts',
      code: `import { Component, computed, signal } from '@angular/core';
import { TngListboxDirective, TngOptionDirective } from '@tailng-ui/primitives';

interface PriorityOption {
  readonly value: PriorityValue;
  readonly title: string;
  readonly description: string;
}

type PriorityValue = 'low' | 'medium' | 'high';
type ListboxModel = readonly string[] | string | null | undefined;

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

@Component({
  selector: 'app-docs-listbox-priority-plain-css-example',
  standalone: true,
  imports: [TngListboxDirective, TngOptionDirective],
  templateUrl: './docs-listbox-priority-plain-css-example.component.html',
  styleUrl: './docs-listbox-priority-plain-css-example.component.css',
})
export class DocsListboxPriorityPlainCssExampleComponent {
  readonly priorityOptions = PRIORITY_OPTIONS;
  readonly selectedPriority = signal<readonly PriorityValue[]>(['medium']);
  readonly selectedPrioritySummary = computed(() =>
    this.formatSelection(this.selectedPriority()),
  );

  onSelectedPriorityChange(value: ListboxModel): void {
    this.selectedPriority.set(this.toArray(value).filter(this.isPriorityValue));
  }

  private formatSelection(value: readonly PriorityValue[]): string {
    const [first] = value;
    if (!first) {
      return 'None selected';
    }

    return PRIORITY_OPTIONS.find((option) => option.value === first)?.title ?? 'Unknown';
  }

  private toArray(value: ListboxModel): readonly string[] {
    if (Array.isArray(value)) {
      return value;
    }

    return value == null ? [] : [value];
  }

  private isPriorityValue(value: string): value is PriorityValue {
    return value === 'low' || value === 'medium' || value === 'high';
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

  <div
    tngListbox
    class="docs-listbox-priority-example__listbox"
    aria-label="Priority queue"
    [value]="selectedPriority()"
    (valueChange)="onSelectedPriorityChange($event)"
  >
    @for (option of priorityOptions; track option.value) {
      <button
        type="button"
        tngOption
        class="docs-listbox-priority-example__option"
        [value]="option.value"
      >
        <span class="docs-listbox-priority-example__option-title">{{ option.title }}</span>
        <span class="docs-listbox-priority-example__option-description">{{ option.description }}</span>
      </button>
    }
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
  border: 1px solid #cbd5e1;
  border-radius: 1.25rem;
  background: #ffffff;
  color: #0f172a;
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
  color: #475569;
}

.docs-listbox-priority-example__listbox {
  display: grid;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 1rem;
  background: #f8fafc;
  outline: none;
}

.docs-listbox-priority-example__listbox:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.18);
}

.docs-listbox-priority-example__option {
  appearance: none;
  display: grid;
  gap: 0.35rem;
  width: 100%;
  padding: 1rem 1rem 1.05rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.875rem;
  background: #ffffff;
  color: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 140ms ease,
    background-color 140ms ease,
    transform 140ms ease,
    box-shadow 140ms ease;
}

.docs-listbox-priority-example__option:hover {
  border-color: #93c5fd;
  background: #eff6ff;
}

.docs-listbox-priority-example__option[data-active] {
  border-color: #60a5fa;
  box-shadow: 0 0 0 2px rgba(147, 197, 253, 0.28);
}

.docs-listbox-priority-example__option[data-selected] {
  border-color: #bfdbfe;
  background: #dbeafe;
}

.docs-listbox-priority-example__option-title {
  font-size: 1rem;
  font-weight: 700;
}

.docs-listbox-priority-example__option-description {
  color: #475569;
  font-size: 0.92rem;
}

.docs-listbox-priority-example__summary {
  margin: 0;
  color: #475569;
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
import { TngListboxDirective, TngOptionDirective } from '@tailng-ui/primitives';

interface PriorityOption {
  readonly value: PriorityValue;
  readonly title: string;
  readonly description: string;
}

type PriorityValue = 'low' | 'medium' | 'high';
type ListboxModel = readonly string[] | string | null | undefined;

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

@Component({
  selector: 'app-docs-listbox-priority-tailwind-example',
  standalone: true,
  imports: [TngListboxDirective, TngOptionDirective],
  templateUrl: './docs-listbox-priority-tailwind-example.component.html',
})
export class DocsListboxPriorityTailwindExampleComponent {
  readonly priorityOptions = PRIORITY_OPTIONS;
  readonly selectedPriority = signal<readonly PriorityValue[]>(['low']);
  readonly selectedPrioritySummary = computed(() =>
    this.formatSelection(this.selectedPriority()),
  );

  onSelectedPriorityChange(value: ListboxModel): void {
    this.selectedPriority.set(this.toArray(value).filter(this.isPriorityValue));
  }

  private formatSelection(value: readonly PriorityValue[]): string {
    const [first] = value;
    if (!first) {
      return 'None selected';
    }

    return PRIORITY_OPTIONS.find((option) => option.value === first)?.title ?? 'Unknown';
  }

  private toArray(value: ListboxModel): readonly string[] {
    if (Array.isArray(value)) {
      return value;
    }

    return value == null ? [] : [value];
  }

  private isPriorityValue(value: string): value is PriorityValue {
    return value === 'low' || value === 'medium' || value === 'high';
  }
}
`,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'docs-listbox-priority-tailwind-example.component.html',
      code: `<section class="grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm [color-scheme:light]">
  <header class="grid gap-2">
    <h2 class="m-0 text-lg font-semibold">Priority queue</h2>
    <p class="m-0 text-sm text-slate-600">
      Use the component wrapper to carry a fully styled listbox while keeping the primitive
      keyboard model underneath.
    </p>
  </header>

  <div
    tngListbox
    aria-label="Priority queue"
    class="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
    [value]="selectedPriority()"
    (valueChange)="onSelectedPriorityChange($event)"
  >
    @for (option of priorityOptions; track option.value) {
      <button
        type="button"
        tngOption
        [value]="option.value"
        class="grid w-full gap-1 rounded-xl border border-slate-200 bg-white px-4 py-4 text-left text-slate-900 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 data-[active]:border-blue-400 data-[active]:ring-2 data-[active]:ring-blue-200 data-[selected]:border-blue-200 data-[selected]:bg-blue-50"
      >
        <span class="text-base font-semibold">{{ option.title }}</span>
        <span class="text-sm text-slate-600">{{ option.description }}</span>
      </button>
    }
  </div>

  <p class="m-0 text-sm font-medium text-slate-600">
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
import { TngListboxDirective, TngOptionDirective } from '@tailng-ui/primitives';

interface ChannelOption {
  readonly value: ChannelValue;
  readonly title: string;
  readonly description: string;
}

type ChannelValue = 'changelog' | 'docs' | 'team' | 'support';
type ListboxModel = readonly string[] | string | null | undefined;

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

@Component({
  selector: 'app-docs-listbox-dual-handoff-plain-css-example',
  standalone: true,
  imports: [TngListboxDirective, TngOptionDirective],
  templateUrl: './docs-listbox-dual-handoff-plain-css-example.component.html',
  styleUrl: './docs-listbox-dual-handoff-plain-css-example.component.css',
})
export class DocsListboxDualHandoffPlainCssExampleComponent {
  readonly channelOptions = CHANNEL_OPTIONS;
  readonly selectedChannelA = signal<readonly ChannelValue[]>(['docs']);
  readonly selectedChannelB = signal<readonly ChannelValue[]>(['team']);
  readonly selectedChannelSummaryA = computed(() => this.formatSelection(this.selectedChannelA()));
  readonly selectedChannelSummaryB = computed(() => this.formatSelection(this.selectedChannelB()));

  onSelectedChannelAChange(value: ListboxModel): void {
    this.selectedChannelA.set(this.toArray(value).filter(this.isChannelValue));
  }

  onSelectedChannelBChange(value: ListboxModel): void {
    this.selectedChannelB.set(this.toArray(value).filter(this.isChannelValue));
  }

  private formatSelection(value: readonly ChannelValue[]): string {
    const [first] = value;
    if (!first) {
      return 'none';
    }

    return CHANNEL_OPTIONS.find((option) => option.value === first)?.title ?? 'unknown';
  }

  private toArray(value: ListboxModel): readonly string[] {
    if (Array.isArray(value)) {
      return value;
    }

    return value == null ? [] : [value];
  }

  private isChannelValue(value: string): value is ChannelValue {
    return value === 'changelog' || value === 'docs' || value === 'team' || value === 'support';
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
    <div
      tngListbox
      class="docs-listbox-dual-handoff-example__listbox"
      aria-label="Publish channels A"
      [value]="selectedChannelA()"
      (valueChange)="onSelectedChannelAChange($event)"
    >
      @for (option of channelOptions; track option.value) {
        <button
          type="button"
          tngOption
          class="docs-listbox-dual-handoff-example__option"
          [value]="option.value"
        >
          <span class="docs-listbox-dual-handoff-example__option-title">{{ option.title }}</span>
          <span class="docs-listbox-dual-handoff-example__option-description">{{ option.description }}</span>
        </button>
      }
    </div>
    <p class="docs-listbox-dual-handoff-example__summary">selected: {{ selectedChannelSummaryA() }}</p>
  </section>

  <section class="docs-listbox-dual-handoff-example__card">
    <h2 class="docs-listbox-dual-handoff-example__title">Publish channels B</h2>
    <div
      tngListbox
      class="docs-listbox-dual-handoff-example__listbox"
      aria-label="Publish channels B"
      [value]="selectedChannelB()"
      (valueChange)="onSelectedChannelBChange($event)"
    >
      @for (option of channelOptions; track option.value) {
        <button
          type="button"
          tngOption
          class="docs-listbox-dual-handoff-example__option"
          [value]="option.value"
        >
          <span class="docs-listbox-dual-handoff-example__option-title">{{ option.title }}</span>
          <span class="docs-listbox-dual-handoff-example__option-description">{{ option.description }}</span>
        </button>
      }
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
  border: 1px solid #475569;
  border-radius: 1.25rem;
  background: #334155;
  color: #f8fafc;
}

.docs-listbox-dual-handoff-example__title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
}

.docs-listbox-dual-handoff-example__listbox {
  display: grid;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid #334155;
  border-radius: 1rem;
  background: #0f172a;
  outline: none;
}

.docs-listbox-dual-handoff-example__listbox:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.16);
}

.docs-listbox-dual-handoff-example__option {
  appearance: none;
  display: grid;
  gap: 0.35rem;
  width: 100%;
  padding: 1.15rem 1rem;
  border: 1px solid #475569;
  border-radius: 0.875rem;
  background: #334155;
  color: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 140ms ease,
    background-color 140ms ease,
    transform 140ms ease,
    box-shadow 140ms ease;
}

.docs-listbox-dual-handoff-example__option:hover {
  border-color: #64748b;
  background: #3b4b61;
}

.docs-listbox-dual-handoff-example__option[data-active] {
  border-color: #60a5fa;
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.2);
}

.docs-listbox-dual-handoff-example__option[data-selected] {
  border-color: #93c5fd;
  background: #3b82f6;
}

.docs-listbox-dual-handoff-example__option-title {
  font-size: 1rem;
  font-weight: 700;
}

.docs-listbox-dual-handoff-example__option-description {
  color: #cbd5e1;
  font-size: 0.92rem;
}

.docs-listbox-dual-handoff-example__summary {
  margin: 0;
  color: #cbd5e1;
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
import { TngListboxDirective, TngOptionDirective } from '@tailng-ui/primitives';

interface ChannelOption {
  readonly value: ChannelValue;
  readonly title: string;
  readonly description: string;
}

type ChannelValue = 'changelog' | 'docs' | 'team' | 'support';
type ListboxModel = readonly string[] | string | null | undefined;

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

@Component({
  selector: 'app-docs-listbox-dual-handoff-tailwind-example',
  standalone: true,
  imports: [TngListboxDirective, TngOptionDirective],
  templateUrl: './docs-listbox-dual-handoff-tailwind-example.component.html',
})
export class DocsListboxDualHandoffTailwindExampleComponent {
  readonly channelOptions = CHANNEL_OPTIONS;
  readonly selectedChannelA = signal<readonly ChannelValue[]>(['docs']);
  readonly selectedChannelB = signal<readonly ChannelValue[]>(['support']);
  readonly selectedChannelSummaryA = computed(() => this.formatSelection(this.selectedChannelA()));
  readonly selectedChannelSummaryB = computed(() => this.formatSelection(this.selectedChannelB()));

  onSelectedChannelAChange(value: ListboxModel): void {
    this.selectedChannelA.set(this.toArray(value).filter(this.isChannelValue));
  }

  onSelectedChannelBChange(value: ListboxModel): void {
    this.selectedChannelB.set(this.toArray(value).filter(this.isChannelValue));
  }

  private formatSelection(value: readonly ChannelValue[]): string {
    const [first] = value;
    if (!first) {
      return 'none';
    }

    return CHANNEL_OPTIONS.find((option) => option.value === first)?.title ?? 'unknown';
  }

  private toArray(value: ListboxModel): readonly string[] {
    if (Array.isArray(value)) {
      return value;
    }

    return value == null ? [] : [value];
  }

  private isChannelValue(value: string): value is ChannelValue {
    return value === 'changelog' || value === 'docs' || value === 'team' || value === 'support';
  }
}
`,
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'docs-listbox-dual-handoff-tailwind-example.component.html',
      code: `<div class="grid gap-4 xl:grid-cols-2 [color-scheme:light]">
  <section class="grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 text-slate-900 shadow-sm">
    <h2 class="m-0 text-lg font-semibold">Publish channels A</h2>
    <div
      tngListbox
      aria-label="Publish channels A"
      class="grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      [value]="selectedChannelA()"
      (valueChange)="onSelectedChannelAChange($event)"
    >
      @for (option of channelOptions; track option.value) {
        <button
          type="button"
          tngOption
          [value]="option.value"
          class="grid w-full gap-1 rounded-xl border border-slate-200 bg-white px-4 py-4 text-left text-slate-900 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 data-[active]:border-blue-400 data-[active]:ring-2 data-[active]:ring-blue-200 data-[selected]:border-blue-200 data-[selected]:bg-blue-50"
        >
          <span class="text-base font-semibold">{{ option.title }}</span>
          <span class="text-sm text-slate-600">{{ option.description }}</span>
        </button>
      }
    </div>
    <p class="m-0 text-sm font-medium text-slate-600">selected: {{ selectedChannelSummaryA() }}</p>
  </section>

  <section class="grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 text-slate-900 shadow-sm">
    <h2 class="m-0 text-lg font-semibold">Publish channels B</h2>
    <div
      tngListbox
      aria-label="Publish channels B"
      class="grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      [value]="selectedChannelB()"
      (valueChange)="onSelectedChannelBChange($event)"
    >
      @for (option of channelOptions; track option.value) {
        <button
          type="button"
          tngOption
          [value]="option.value"
          class="grid w-full gap-1 rounded-xl border border-slate-200 bg-white px-4 py-4 text-left text-slate-900 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 data-[active]:border-blue-400 data-[active]:ring-2 data-[active]:ring-blue-200 data-[selected]:border-blue-200 data-[selected]:bg-blue-50"
        >
          <span class="text-base font-semibold">{{ option.title }}</span>
          <span class="text-sm text-slate-600">{{ option.description }}</span>
        </button>
      }
    </div>
    <p class="m-0 text-sm font-medium text-slate-600">selected: {{ selectedChannelSummaryB() }}</p>
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
    this.plainValue.set(this.toArray(value));
  }

  protected onTailwindValueChange(value: ListboxModel): void {
    this.tailwindValue.set(this.toArray(value));
  }

  protected onDualPlainChannelAValueChange(value: ListboxModel): void {
    this.dualPlainChannelValueA.set(this.toArray(value));
  }

  protected onDualPlainChannelBValueChange(value: ListboxModel): void {
    this.dualPlainChannelValueB.set(this.toArray(value));
  }

  protected onDualTailwindChannelAValueChange(value: ListboxModel): void {
    this.dualTailwindChannelValueA.set(this.toArray(value));
  }

  protected onDualTailwindChannelBValueChange(value: ListboxModel): void {
    this.dualTailwindChannelValueB.set(this.toArray(value));
  }

  private toArray(value: ListboxModel): readonly string[] {
    if (value == null) {
      return [];
    }

    return typeof value === 'string' ? [value] : value;
  }

  private formatSelection(model: readonly string[], options: readonly ListboxOption[]): string {
    const [selected] = model;
    if (!selected) {
      return 'none';
    }

    return options.find((option) => option.value === selected)?.title ?? selected;
  }
}
