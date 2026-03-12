import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { TngListboxDirective, TngOptionDirective } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

interface ListboxOption {
  readonly description: string;
  readonly disabled?: boolean;
  readonly id: string;
  readonly label: string;
}

type ListboxModel = string | readonly string[] | null;

const PRIORITY_OPTIONS: readonly ListboxOption[] = Object.freeze([
  {
    description: 'Regression blockers and ship-stopping accessibility bugs.',
    id: 'critical',
    label: 'Critical',
  },
  {
    description: 'Features required to close the sprint plan.',
    id: 'high',
    label: 'High',
  },
  {
    description: 'Backlog items ready for parallel delivery.',
    id: 'medium',
    label: 'Medium',
  },
  {
    description: 'Long-tail improvements and non-blocking polish.',
    id: 'low',
    label: 'Low',
  },
  {
    description: 'Deferred item for later planning.',
    disabled: true,
    id: 'deferred',
    label: 'Deferred (disabled)',
  },
]);

const CHANNEL_OPTIONS: readonly ListboxOption[] = Object.freeze([
  {
    description: 'Release notes and external announcements.',
    id: 'changelog',
    label: 'Changelog',
  },
  {
    description: 'Public docs synchronization and snippets.',
    id: 'docs',
    label: 'Docs',
  },
  {
    description: 'Internal team status updates.',
    id: 'team',
    label: 'Team updates',
  },
  {
    description: 'Customer success and support queues.',
    id: 'support',
    label: 'Support',
  },
]);

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
  private readonly documentRef = inject(DOCUMENT);
  private readonly optionLabelById = new Map(
    [...PRIORITY_OPTIONS, ...CHANNEL_OPTIONS].map((option) => [option.id, option.label]),
  );
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );

  protected readonly priorityOptions = PRIORITY_OPTIONS;
  protected readonly channelOptions = CHANNEL_OPTIONS;

  protected readonly headlessValue = signal<readonly string[]>(['critical', 'high']);
  protected readonly plainValue = signal<readonly string[]>(['medium']);
  protected readonly tailwindValue = signal<readonly string[]>(['low']);

  protected readonly channelValueA = signal<readonly string[]>(['docs']);
  protected readonly channelValueB = signal<readonly string[]>(['team']);

  protected readonly headlessSummary = computed(() => this.formatSelection(this.headlessValue()));
  protected readonly plainSummary = computed(() => this.formatSelection(this.plainValue()));
  protected readonly tailwindSummary = computed(() => this.formatSelection(this.tailwindValue()));
  protected readonly channelSummaryA = computed(() => this.formatSelection(this.channelValueA()));
  protected readonly channelSummaryB = computed(() => this.formatSelection(this.channelValueB()));

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'listbox-examples-headless.component.ts',
      code: [
        "readonly value = signal<readonly string[]>(['critical', 'high']);",
        '',
        'onValueChange(value: string | readonly string[] | null): void {',
        '  this.value.set(this.toArray(value));',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'listbox-examples-headless.component.html',
      code: [
        '<div tngListbox tabindex="0" [multiple]="true" [value]="value()" (valueChange)="onValueChange($event)">',
        '  @for (option of options; track option.id) {',
        '    <div tngOption [tngValue]="option.id" [disabled]="option.disabled === true">',
        '      {{ option.label }}',
        '    </div>',
        '  }',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'listbox-examples-headless.component.css',
      code: '.listbox-preview { display: grid; gap: 0.5rem; }',
    },
  ]);

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'listbox-examples-plain-css.component.ts',
      code: [
        "readonly value = signal<readonly string[]>(['medium']);",
        '',
        'onValueChange(value: string | readonly string[] | null): void {',
        '  this.value.set(this.toArray(value));',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'listbox-examples-plain-css.component.html',
      code: [
        '<div class="listbox-preview-shell listbox-preview-shell--plain">',
        '  <div tngListbox tabindex="0" [multiple]="true" [value]="value()">',
        '    @for (option of options; track option.id) {',
        '      <div tngOption [tngValue]="option.id">{{ option.label }}</div>',
        '    }',
        '  </div>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'listbox-examples-plain-css.component.css',
      code: [
        '.listbox-preview-shell--plain {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.8rem;',
        '  padding: 0.9rem;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'listbox-examples-tailwind.component.ts',
      code: [
        "readonly value = signal<readonly string[]>(['low']);",
        '',
        'onValueChange(value: string | readonly string[] | null): void {',
        '  this.value.set(this.toArray(value));',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'listbox-examples-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <div tngListbox tabindex="0" [multiple]="true" [value]="value()">',
        '    @for (option of options; track option.id) {',
        '      <div tngOption [tngValue]="option.id">{{ option.label }}</div>',
        '    }',
        '  </div>',
        '</div>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'listbox-examples-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected onHeadlessValueChange(value: ListboxModel): void {
    this.headlessValue.set(this.toArray(value));
  }

  protected onPlainValueChange(value: ListboxModel): void {
    this.plainValue.set(this.toArray(value));
  }

  protected onTailwindValueChange(value: ListboxModel): void {
    this.tailwindValue.set(this.toArray(value));
  }

  protected onChannelAValueChange(value: ListboxModel): void {
    this.channelValueA.set(this.toArray(value));
  }

  protected onChannelBValueChange(value: ListboxModel): void {
    this.channelValueB.set(this.toArray(value));
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  private toArray(value: ListboxModel): readonly string[] {
    if (value === null) {
      return [];
    }

    if (typeof value === 'string') {
      return [value];
    }

    return value;
  }

  private formatSelection(values: readonly string[]): string {
    const labels = values
      .map((value) => this.optionLabelById.get(value))
      .filter((label): label is string => label !== undefined);
    if (labels.length === 0) {
      return 'none';
    }

    return labels.join(', ');
  }

  private observeCodeThemeChanges(): MutationObserver | null {
    const mutationObserverCtor = this.documentRef.defaultView?.MutationObserver;
    if (mutationObserverCtor === undefined) {
      return null;
    }

    const observer = new mutationObserverCtor(() => {
      this.codeBlockTheme.set(this.resolveCodeBlockTheme());
    });

    observer.observe(this.documentRef.documentElement, {
      attributeFilter: ['style', 'class'],
      attributes: true,
    });

    return observer;
  }

  private resolveCodeBlockTheme(): 'github-dark' | 'github-light' {
    const root = this.documentRef.documentElement;
    const inlineColorScheme = root.style.getPropertyValue('color-scheme').trim().toLowerCase();
    if (inlineColorScheme.includes('dark')) {
      return 'github-dark';
    }

    const computedColorScheme = this.documentRef.defaultView
      ?.getComputedStyle(root)
      .getPropertyValue('color-scheme')
      .trim()
      .toLowerCase();

    return computedColorScheme?.includes('dark') ? 'github-dark' : 'github-light';
  }
}
