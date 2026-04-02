import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { TngListboxDirective, TngOptionDirective } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../listbox.util';

interface ListboxOption {
  readonly description: string;
  readonly disabled?: boolean;
  readonly id: string;
  readonly label: string;
}

type ListboxModel = string | readonly string[] | null;

const LISTBOX_OPTIONS: readonly ListboxOption[] = Object.freeze([
  {
    description: 'Keyboard and ARIA contracts for deterministic interaction behavior.',
    id: 'a11y',
    label: 'Accessibility baseline',
  },
  {
    description: 'Shared primitives and wrappers for TailNG form controls.',
    id: 'components',
    label: 'Components integration',
  },
  {
    description: 'State hooks and CSS contracts for custom product skins.',
    id: 'styling',
    label: 'Styling contracts',
  },
  {
    description: 'Regression suites for keyboard, pointer, and typeahead behavior.',
    id: 'tests',
    label: 'Testing harness',
  },
  {
    description: 'Upcoming wrapper exploration for richer listbox composition.',
    disabled: true,
    id: 'roadmap',
    label: 'Wrapper roadmap (disabled)',
  },
]);

@Component({
  selector: 'app-headless-listbox-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngListboxDirective,
    TngOptionDirective,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './listbox-overview-page.component.html',
  styleUrl: './listbox-overview-page.component.css',
})
export class HeadlessListboxOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly optionLabelById = new Map(LISTBOX_OPTIONS.map((option) => [option.id, option.label]));

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);
  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;

  protected readonly options = LISTBOX_OPTIONS;
  protected readonly plainValue = signal<readonly string[]>(['components']);
  protected readonly tailwindValue = signal<readonly string[]>(['styling']);

  protected readonly plainSummary = computed(() => this.formatSelection(this.plainValue()));
  protected readonly tailwindSummary = computed(() => this.formatSelection(this.tailwindValue()));

  protected readonly primitiveImportCode = [
    "import { TngListboxDirective, TngOptionDirective } from '@tailng-ui/primitives';",
    '',
  ].join('\n');

  protected readonly primitiveUsageCode = [
    '<div',
    '  tngListbox',
    '  tabindex="0"',
    '  [multiple]="true"',
    '  [value]="selectedValues()"',
    '  (valueChange)="selectedValues.set(toArray($event))"',
    '>',
    '  @for (option of options; track option.id) {',
    '    <div tngOption [tngValue]="option.id">{{ option.label }}</div>',
    '  }',
    '</div>',
    '',
  ].join('\n');

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'listbox-plain-css-overview.component.ts',
      code: [
        "import { Component, computed, signal } from '@angular/core';",
        "import { TngListboxDirective, TngOptionDirective } from '@tailng-ui/primitives';",
        '',
        "type CapabilityId = 'a11y' | 'components' | 'styling' | 'tests' | 'roadmap';",
        '',
        'interface CapabilityOption {',
        '  readonly description: string;',
        '  readonly disabled?: boolean;',
        '  readonly id: CapabilityId;',
        '  readonly label: string;',
        '}',
        '',
        'const CAPABILITY_OPTIONS: readonly CapabilityOption[] = Object.freeze([',
        "  { id: 'a11y', label: 'Accessibility baseline', description: 'Keyboard and ARIA contracts for deterministic interaction behavior.' },",
        "  { id: 'components', label: 'Components integration', description: 'Shared primitives and wrappers for TailNG form controls.' },",
        "  { id: 'styling', label: 'Styling contracts', description: 'State hooks and CSS contracts for custom product skins.' },",
        "  { id: 'tests', label: 'Testing harness', description: 'Regression suites for keyboard, pointer, and typeahead behavior.' },",
        "  { id: 'roadmap', label: 'Wrapper roadmap (disabled)', description: 'Upcoming wrapper exploration for richer listbox composition.', disabled: true },",
        ']);',
        '',
        'function isCapabilityId(value: string): value is CapabilityId {',
        "  return value === 'a11y' || value === 'components' || value === 'styling' || value === 'tests' || value === 'roadmap';",
        '}',
        '',
        '@Component({',
        "  selector: 'app-headless-listbox-overview-plain-css-example',",
        '  standalone: true,',
        '  imports: [TngListboxDirective, TngOptionDirective],',
        "  templateUrl: './listbox-plain-css-overview.component.html',",
        "  styleUrl: './listbox-plain-css-overview.component.css',",
        '})',
        'export class HeadlessListboxOverviewPlainCssExampleComponent {',
        '  readonly capabilityOptions = CAPABILITY_OPTIONS;',
        "  readonly selectedCapabilities = signal<readonly CapabilityId[]>(['components']);",
        '  readonly selectedSummary = computed(() => {',
        '    const labels = this.selectedCapabilities()',
        '      .map((value) => this.capabilityOptions.find((option) => option.id === value)?.label)',
        "      .filter((label): label is string => label !== undefined);",
        '',
        "    return labels.length > 0 ? labels.join(', ') : 'none';",
        '  });',
        '',
        '  onSelectedCapabilitiesChange(value: string | readonly string[] | null): void {',
        '    this.selectedCapabilities.set(this.toArray(value));',
        '  }',
        '',
        '  private toArray(value: string | readonly string[] | null): readonly CapabilityId[] {',
        '    if (value === null) {',
        '      return [];',
        '    }',
        '',
        "    const values = typeof value === 'string' ? [value] : value;",
        '    return values.filter(isCapabilityId);',
        '  }',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'listbox-plain-css-overview.component.html',
      code: [
        '<section class="headless-listbox-overview-example">',
        '  <div',
        '    tngListbox',
        '    tabindex="0"',
        '    class="headless-listbox-overview-example__listbox"',
        '    [multiple]="true"',
        '    [value]="selectedCapabilities()"',
        '    (valueChange)="onSelectedCapabilitiesChange($event)"',
        '  >',
        '    @for (option of capabilityOptions; track option.id) {',
        '      <div',
        '        tngOption',
        '        class="headless-listbox-overview-example__option"',
        '        [tngValue]="option.id"',
        '        [disabled]="option.disabled === true"',
        '      >',
        '        <p class="headless-listbox-overview-example__title">{{ option.label }}</p>',
        '        <p class="headless-listbox-overview-example__description">{{ option.description }}</p>',
        '      </div>',
        '    }',
        '  </div>',
        '  <p class="headless-listbox-overview-example__summary">',
        '    Selected: {{ selectedSummary() }}',
        '  </p>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'listbox-plain-css-overview.component.css',
      code: [
        '.headless-listbox-overview-example {',
        '  display: grid;',
        '  gap: 0.75rem;',
        '  inline-size: min(100%, 30rem);',
        '  margin-inline: auto;',
        '  padding: 1rem;',
        '  border: 1px solid var(--tng-semantic-border-subtle, #cbd5e1);',
        '  border-radius: 1rem;',
        '  background: var(--tng-semantic-background-surface, #ffffff);',
        '  color: var(--tng-semantic-foreground-primary, #0f172a);',
        '  color-scheme: light;',
        '}',
        '',
        '.headless-listbox-overview-example__listbox {',
        '  display: grid;',
        '  gap: 0.5rem;',
        '  padding: 0.75rem;',
        '  border: 1px solid var(--tng-semantic-border-subtle, #cbd5e1);',
        '  border-radius: 0.85rem;',
        '  background: var(--tng-semantic-background-canvas, #f8fafc);',
        '  outline: none;',
        '}',
        '',
        '.headless-listbox-overview-example__listbox:focus {',
        '  border-color: var(--tng-semantic-accent-brand, #2563eb);',
        '  box-shadow: 0 0 0 2px color-mix(in srgb, var(--tng-semantic-accent-brand, #2563eb) 28%, transparent);',
        '}',
        '',
        '.headless-listbox-overview-example__option {',
        '  display: grid;',
        '  gap: 0.25rem;',
        '  padding: 0.7rem 0.8rem;',
        '  border: 1px solid var(--tng-semantic-border-subtle, #cbd5e1);',
        '  border-radius: 0.75rem;',
        '  background: var(--tng-semantic-background-surface, #ffffff);',
        '  cursor: pointer;',
        '  transition:',
        '    border-color 120ms ease,',
        '    background-color 120ms ease,',
        '    opacity 120ms ease;',
        '}',
        '',
        '.headless-listbox-overview-example__option[data-active] {',
        '  border-color: var(--tng-semantic-accent-brand, #2563eb);',
        '}',
        '',
        '.headless-listbox-overview-example__option[data-selected] {',
        '  background: color-mix(in srgb, var(--tng-semantic-accent-brand, #2563eb) 15%, white);',
        '}',
        '',
        '.headless-listbox-overview-example__option[data-disabled] {',
        '  cursor: not-allowed;',
        '  opacity: 0.56;',
        '}',
        '',
        '.headless-listbox-overview-example__title {',
        '  margin: 0;',
        '  font-size: 0.92rem;',
        '  font-weight: 600;',
        '  color: var(--tng-semantic-foreground-primary, #0f172a);',
        '}',
        '',
        '.headless-listbox-overview-example__description {',
        '  margin: 0;',
        '  font-size: 0.82rem;',
        '  color: var(--tng-semantic-foreground-secondary, #475569);',
        '}',
        '',
        '.headless-listbox-overview-example__summary {',
        '  margin: 0;',
        '  font-size: 0.82rem;',
        '  color: var(--tng-semantic-foreground-secondary, #475569);',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'listbox-tailwind-overview.component.ts',
      code: [
        "import { Component, computed, signal } from '@angular/core';",
        "import { TngListboxDirective, TngOptionDirective } from '@tailng-ui/primitives';",
        '',
        "type CapabilityId = 'a11y' | 'components' | 'styling' | 'tests' | 'roadmap';",
        '',
        'interface CapabilityOption {',
        '  readonly description: string;',
        '  readonly disabled?: boolean;',
        '  readonly id: CapabilityId;',
        '  readonly label: string;',
        '}',
        '',
        'const CAPABILITY_OPTIONS: readonly CapabilityOption[] = Object.freeze([',
        "  { id: 'a11y', label: 'Accessibility baseline', description: 'Keyboard and ARIA contracts for deterministic interaction behavior.' },",
        "  { id: 'components', label: 'Components integration', description: 'Shared primitives and wrappers for TailNG form controls.' },",
        "  { id: 'styling', label: 'Styling contracts', description: 'State hooks and CSS contracts for custom product skins.' },",
        "  { id: 'tests', label: 'Testing harness', description: 'Regression suites for keyboard, pointer, and typeahead behavior.' },",
        "  { id: 'roadmap', label: 'Wrapper roadmap (disabled)', description: 'Upcoming wrapper exploration for richer listbox composition.', disabled: true },",
        ']);',
        '',
        'function isCapabilityId(value: string): value is CapabilityId {',
        "  return value === 'a11y' || value === 'components' || value === 'styling' || value === 'tests' || value === 'roadmap';",
        '}',
        '',
        '@Component({',
        "  selector: 'app-headless-listbox-overview-tailwind-example',",
        '  standalone: true,',
        '  imports: [TngListboxDirective, TngOptionDirective],',
        "  templateUrl: './listbox-tailwind-overview.component.html',",
        '})',
        'export class HeadlessListboxOverviewTailwindExampleComponent {',
        '  readonly capabilityOptions = CAPABILITY_OPTIONS;',
        "  readonly selectedCapabilities = signal<readonly CapabilityId[]>(['styling']);",
        '  readonly selectedSummary = computed(() => {',
        '    const labels = this.selectedCapabilities()',
        '      .map((value) => this.capabilityOptions.find((option) => option.id === value)?.label)',
        "      .filter((label): label is string => label !== undefined);",
        '',
        "    return labels.length > 0 ? labels.join(', ') : 'none';",
        '  });',
        '',
        '  onSelectedCapabilitiesChange(value: string | readonly string[] | null): void {',
        '    this.selectedCapabilities.set(this.toArray(value));',
        '  }',
        '',
        '  private toArray(value: string | readonly string[] | null): readonly CapabilityId[] {',
        '    if (value === null) {',
        '      return [];',
        '    }',
        '',
        "    const values = typeof value === 'string' ? [value] : value;",
        '    return values.filter(isCapabilityId);',
        '  }',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'listbox-tailwind-overview.component.html',
      code: [
        '<section class="grid w-full max-w-[30rem] gap-3 rounded-xl border border-slate-200 bg-white p-4 text-slate-900 shadow-sm [color-scheme:light]">',
        '  <div',
        '    tngListbox',
        '    tabindex="0"',
        '    class="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"',
        '    [multiple]="true"',
        '    [value]="selectedCapabilities()"',
        '    (valueChange)="onSelectedCapabilitiesChange($event)"',
        '  >',
        '    @for (option of capabilityOptions; track option.id) {',
        '      <div',
        '        tngOption',
        '        class="grid gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2.5 transition data-[active]:border-blue-500 data-[selected]:border-blue-200 data-[selected]:bg-blue-50 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60"',
        '        [tngValue]="option.id"',
        '        [disabled]="option.disabled === true"',
        '      >',
        '        <p class="m-0 text-sm font-semibold text-slate-900">{{ option.label }}</p>',
        '        <p class="m-0 text-sm leading-6 text-slate-600">{{ option.description }}</p>',
        '      </div>',
        '    }',
        '  </div>',
        '  <p class="m-0 text-xs text-slate-600">Selected: {{ selectedSummary() }}</p>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'listbox-tailwind-overview.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected onPlainValueChange(value: ListboxModel): void {
    this.plainValue.set(this.toArray(value));
  }

  protected onTailwindValueChange(value: ListboxModel): void {
    this.tailwindValue.set(this.toArray(value));
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

}
