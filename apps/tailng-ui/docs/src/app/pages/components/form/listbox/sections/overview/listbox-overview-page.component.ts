import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngListboxComponent } from '@tailng-ui/components';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../listbox.util';

interface ListboxOption {
  readonly description: string;
  readonly disabled?: boolean;
  readonly id: string;
  readonly label: string;
}

type ListboxModel = string | readonly string[] | null;

type CapabilityId = 'a11y' | 'components' | 'styling' | 'tests' | 'roadmap';

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
    description: 'Wrapper-level composition for richer always-open selection surfaces.',
    disabled: true,
    id: 'roadmap',
    label: 'Wrapper roadmap (disabled)',
  },
]);

function isCapabilityId(value: string): value is CapabilityId {
  return (
    value === 'a11y' ||
    value === 'components' ||
    value === 'styling' ||
    value === 'tests' ||
    value === 'roadmap'
  );
}

@Component({
  selector: 'app-listbox-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngListboxComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './listbox-overview-page.component.html',
  styleUrl: './listbox-overview-page.component.css',
})
export class ListboxOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly optionLabelById = new Map(LISTBOX_OPTIONS.map((option) => [option.id, option.label]));

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);
  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;

  protected readonly options = LISTBOX_OPTIONS;
  protected readonly plainValue = signal<readonly CapabilityId[]>(['components']);
  protected readonly tailwindValue = signal<readonly CapabilityId[]>(['styling']);

  protected readonly plainSummary = computed(() => this.formatSelection(this.plainValue()));
  protected readonly tailwindSummary = computed(() => this.formatSelection(this.tailwindValue()));

  protected readonly wrapperImportCode = [
    "import { TngListboxComponent } from '@tailng-ui/components';",
    '',
  ].join('\n');

  protected readonly wrapperUsageCode = [
    '<tng-listbox',
    '  ariaLabel="Capability checklist"',
    '  [multiple]="true"',
    '  [options]="capabilityOptions"',
    '  [value]="selectedCapabilities()"',
    '  (valueChange)="onSelectedCapabilitiesChange($event)"',
    '></tng-listbox>',
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
        "import { TngListboxComponent } from '@tailng-ui/components';",
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
        "  { id: 'roadmap', label: 'Wrapper roadmap (disabled)', description: 'Wrapper-level composition for richer always-open selection surfaces.', disabled: true },",
        ']);',
        '',
        'function isCapabilityId(value: string): value is CapabilityId {',
        "  return value === 'a11y' || value === 'components' || value === 'styling' || value === 'tests' || value === 'roadmap';",
        '}',
        '',
        '@Component({',
        "  selector: 'app-docs-listbox-overview-plain-css-example',",
        '  standalone: true,',
        '  imports: [TngListboxComponent],',
        "  templateUrl: './listbox-plain-css-overview.component.html',",
        "  styleUrl: './listbox-plain-css-overview.component.css',",
        '})',
        'export class DocsListboxOverviewPlainCssExampleComponent {',
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
        '  onSelectedCapabilitiesChange(value: CapabilityId | readonly CapabilityId[] | null): void {',
        '    this.selectedCapabilities.set(this.toArray(value));',
        '  }',
        '',
        '  private toArray(value: CapabilityId | readonly CapabilityId[] | null): readonly CapabilityId[] {',
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
        '<section class="docs-listbox-overview-example">',
        '  <div class="docs-listbox-overview-example__listbox">',
        '    <tng-listbox',
        '      ariaLabel="Capability checklist"',
        '      [multiple]="true"',
        '      [options]="capabilityOptions"',
        '      [value]="selectedCapabilities()"',
        '      (valueChange)="onSelectedCapabilitiesChange($event)"',
        '    ></tng-listbox>',
        '  </div>',
        '  <p class="docs-listbox-overview-example__summary">',
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
        '.docs-listbox-overview-example {',
        '  display: grid;',
        '  gap: 0.75rem;',
        '  inline-size: min(100%, 30rem);',
        '  margin-inline: auto;',
        '  padding: 1rem;',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 1rem;',
        '  background: var(--tng-semantic-background-surface);',
        '  color: var(--tng-semantic-foreground-primary);',
        '}',
        '',
        '.docs-listbox-overview-example__listbox {',
        '  width: 100%;',
        '  max-width: none;',
        '}',
        '',
        '.docs-listbox-overview-example__listbox tng-listbox {',
        '  width: 100%;',
        '  max-width: none;',
        '}',
        '',
        '.docs-listbox-overview-example__summary {',
        '  margin: 0;',
        '  font-size: 0.82rem;',
        '  color: var(--tng-semantic-foreground-secondary);',
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
        "import { TngListboxComponent } from '@tailng-ui/components';",
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
        "  { id: 'roadmap', label: 'Wrapper roadmap (disabled)', description: 'Wrapper-level composition for richer always-open selection surfaces.', disabled: true },",
        ']);',
        '',
        'function isCapabilityId(value: string): value is CapabilityId {',
        "  return value === 'a11y' || value === 'components' || value === 'styling' || value === 'tests' || value === 'roadmap';",
        '}',
        '',
        '@Component({',
        "  selector: 'app-docs-listbox-overview-tailwind-example',",
        '  standalone: true,',
        '  imports: [TngListboxComponent],',
        "  templateUrl: './listbox-tailwind-overview.component.html',",
        '})',
        'export class DocsListboxOverviewTailwindExampleComponent {',
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
        '  onSelectedCapabilitiesChange(value: CapabilityId | readonly CapabilityId[] | null): void {',
        '    this.selectedCapabilities.set(this.toArray(value));',
        '  }',
        '',
        '  private toArray(value: CapabilityId | readonly CapabilityId[] | null): readonly CapabilityId[] {',
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
        '<section class="grid w-full max-w-[30rem] gap-3 rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-4 text-[var(--tng-semantic-foreground-primary)] shadow-sm">',
        '  <div class="w-full max-w-none rounded-xl">',
        '    <tng-listbox',
        '      ariaLabel="Capability checklist"',
        '      [multiple]="true"',
        '      [options]="capabilityOptions"',
        '      [value]="selectedCapabilities()"',
        '      (valueChange)="onSelectedCapabilitiesChange($event)"',
        '    ></tng-listbox>',
        '  </div>',
        '  <p class="m-0 text-xs text-[var(--tng-semantic-foreground-secondary)]">Selected: {{ selectedSummary() }}</p>',
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

  private toArray(value: ListboxModel): readonly CapabilityId[] {
    if (value === null) {
      return [];
    }

    const values = typeof value === 'string' ? [value] : value;
    return values.filter(isCapabilityId);
  }

  private formatSelection(values: readonly CapabilityId[]): string {
    const labels = values
      .map((value) => this.optionLabelById.get(value))
      .filter((label): label is string => label !== undefined);

    if (labels.length === 0) {
      return 'none';
    }

    return labels.join(', ');
  }
}
