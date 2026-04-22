import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngTag } from '@tailng-ui/components';
import { TngTagIcon } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';

type TagTone = 'danger' | 'info' | 'neutral' | 'success' | 'warning';
type ExampleVariant = 'plain' | 'tailwind';
type TagItem = Readonly<{ id: string; label: string; tone: TagTone }>;

const FILTER_DEFAULTS: readonly TagItem[] = Object.freeze([
  { id: 'angular', label: 'Angular', tone: 'info' },
  { id: 'a11y', label: 'A11y', tone: 'success' },
  { id: 'design', label: 'Design', tone: 'warning' },
]);

const STATUS_DEFAULTS: readonly TagItem[] = Object.freeze([
  { id: 'new', label: 'New', tone: 'info' },
  { id: 'beta', label: 'Beta', tone: 'warning' },
  { id: 'blocked', label: 'Blocked', tone: 'danger' },
  { id: 'stable', label: 'Stable', tone: 'success' },
]);

function createCodeTabs(
  baseName: string,
  tsCode: string,
  htmlCode: string,
  cssCode: string,
): readonly DocsExampleCodeTab[] {
  return Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: `${baseName}.component.ts`, code: tsCode },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: `${baseName}.component.html`,
      code: htmlCode,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: `${baseName}.component.css`,
      code: cssCode,
    },
  ]);
}

@Component({
  selector: 'app-tag-examples-page',
  imports: [TngTag, TngTagIcon, DocsExampleTabsSectionComponent, DocsExampleVariantDirective],
  templateUrl: './tag-examples-page.component.html',
  styleUrl: './tag-examples-page.component.css',
})
export class TagExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly filterPlain = signal<readonly TagItem[]>(FILTER_DEFAULTS);
  protected readonly filterTailwind = signal<readonly TagItem[]>(FILTER_DEFAULTS);

  protected readonly filterPlainTabs = createCodeTabs(
    'tag-examples-filter-plain-css',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngTag } from '@tailng-ui/components';",
      "import { TngTagIcon } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-tag-examples-filter-plain-css',",
      '  standalone: true,',
      '  imports: [TngTag, TngTagIcon],',
      "  templateUrl: './tag-examples-filter-plain-css.component.html',",
      "  styleUrl: './tag-examples-filter-plain-css.component.css',",
      '})',
      'export class TagExamplesFilterPlainCssComponent {',
      "  protected readonly tags = signal(['Angular', 'A11y', 'Design']);",
      '}',
    ].join('\n'),
    [
      '<div class="tag-example-row">',
      '  <tng-tag tone="info" [removable]="true" label="Angular">',
      '    <span tngTagIcon aria-hidden="true">●</span>',
      '    Angular',
      '  </tng-tag>',
      '</div>',
      '',
    ].join('\n'),
    '.tag-example-row { display: flex; flex-wrap: wrap; gap: 0.75rem; }',
  );

  protected readonly filterTailwindTabs = createCodeTabs(
    'tag-examples-filter-tailwind',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngTag } from '@tailng-ui/components';",
      "import { TngTagIcon } from '@tailng-ui/primitives';",
      '',
      "type TagTone = 'danger' | 'info' | 'neutral' | 'success' | 'warning';",
      "type TagItem = Readonly<{ id: string; label: string; tone: TagTone }>;",
      '',
      'const FILTER_TAGS: readonly TagItem[] = [',
      "  { id: 'angular', label: 'Angular', tone: 'info' },",
      "  { id: 'a11y', label: 'A11y', tone: 'success' },",
      "  { id: 'design', label: 'Design', tone: 'warning' },",
      '];',
      '',
      '@Component({',
      "  selector: 'app-tag-examples-filter-tailwind',",
      '  standalone: true,',
      '  imports: [TngTag, TngTagIcon],',
      "  templateUrl: './tag-examples-filter-tailwind.component.html',",
      "  styleUrl: './tag-examples-filter-tailwind.component.css',",
      '})',
      'export class TagExamplesFilterTailwindComponent {',
      '  protected readonly tags = signal<readonly TagItem[]>(FILTER_TAGS);',
      '',
      '  protected removeFilter(tagId: string): void {',
      '    this.tags.update((items) => items.filter((tag) => tag.id !== tagId));',
      '  }',
      '',
      '  protected resetFilters(): void {',
      '    this.tags.set(FILTER_TAGS);',
      '  }',
      '}',
    ].join('\n'),
    [
      '<div class="flex flex-col gap-3 rounded-2xl border border-tng-border-subtle bg-tng-bg-surface p-4 text-tng-fg-primary shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--tng-semantic-border-subtle)_55%,transparent)]">',
      '  <div class="flex flex-wrap gap-3">',
      '    @for (tag of tags(); track tag.id) {',
      '      <tng-tag [tone]="tag.tone" [label]="tag.label" [removable]="true" class="text-tng-fg-primary" (removed)="removeFilter(tag.id)">',
      '        <span tngTagIcon aria-hidden="true" class="text-[0.7em]">●</span>',
      '        {{ tag.label }}',
      '      </tng-tag>',
      '    }',
      '  </div>',
      '  <button type="button" class="inline-flex w-fit min-h-8 items-center rounded-md border border-[var(--tng-semantic-border-default)] px-3 text-xs font-semibold text-tng-fg-primary transition hover:bg-tng-bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--tng-semantic-focus-ring)_40%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-tng-bg-surface" (click)="resetFilters()">Reset filters</button>',
      '</div>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
  );

  protected readonly statusPlainTabs = createCodeTabs(
    'tag-examples-status-plain-css',
    [
      "import { Component } from '@angular/core';",
      "import { TngTag } from '@tailng-ui/components';",
      '',
      '@Component({',
      "  selector: 'app-tag-examples-status-plain-css',",
      '  standalone: true,',
      '  imports: [TngTag],',
      "  templateUrl: './tag-examples-status-plain-css.component.html',",
      "  styleUrl: './tag-examples-status-plain-css.component.css',",
      '})',
      'export class TagExamplesStatusPlainCssComponent {}',
    ].join('\n'),
    [
      '<div class="tag-example-row">',
      '  <tng-tag tone="info">New</tng-tag>',
      '  <tng-tag tone="warning" appearance="outline">Beta</tng-tag>',
      '  <tng-tag tone="danger">Blocked</tng-tag>',
      '  <tng-tag tone="success" appearance="solid">Stable</tng-tag>',
      '</div>',
      '',
    ].join('\n'),
    '.tag-example-row { display: flex; flex-wrap: wrap; gap: 0.75rem; }',
  );

  protected readonly statusTailwindTabs = createCodeTabs(
    'tag-examples-status-tailwind',
    [
      "import { Component } from '@angular/core';",
      "import { TngTag } from '@tailng-ui/components';",
      '',
      "type TagTone = 'danger' | 'info' | 'neutral' | 'success' | 'warning';",
      "type TagItem = Readonly<{ id: string; label: string; tone: TagTone }>;",
      '',
      'const STATUSES: readonly TagItem[] = [',
      "  { id: 'new', label: 'New', tone: 'info' },",
      "  { id: 'beta', label: 'Beta', tone: 'warning' },",
      "  { id: 'blocked', label: 'Blocked', tone: 'danger' },",
      "  { id: 'stable', label: 'Stable', tone: 'success' },",
      '];',
      '',
      '@Component({',
      "  selector: 'app-tag-examples-status-tailwind',",
      '  standalone: true,',
      '  imports: [TngTag],',
      "  templateUrl: './tag-examples-status-tailwind.component.html',",
      "  styleUrl: './tag-examples-status-tailwind.component.css',",
      '})',
      'export class TagExamplesStatusTailwindComponent {',
      '  protected readonly statuses = STATUSES;',
      '',
      '  protected appearanceFor(tone: TagTone): \'outline\' | \'soft\' | \'solid\' {',
      "    if (tone === 'warning') return 'outline';",
      "    if (tone === 'success') return 'solid';",
      "    return 'soft';",
      '  }',
      '}',
    ].join('\n'),
    [
      '<div class="flex flex-col gap-3 rounded-2xl border border-tng-border-subtle bg-tng-bg-surface p-4 text-tng-fg-primary shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--tng-semantic-border-subtle)_55%,transparent)]">',
      '  <div class="flex flex-wrap gap-3">',
      '    @for (tag of statuses; track tag.id) {',
      '      <tng-tag [tone]="tag.tone" [appearance]="appearanceFor(tag.tone)" class="text-tng-fg-primary">{{ tag.label }}</tng-tag>',
      '    }',
      '  </div>',
      '</div>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected removeFilter(scope: ExampleVariant, tagId: string): void {
    if (scope === 'plain') {
      this.filterPlain.update((tags) => tags.filter((tag) => tag.id !== tagId));
      return;
    }

    this.filterTailwind.update((tags) => tags.filter((tag) => tag.id !== tagId));
  }

  protected resetFilters(scope: ExampleVariant): void {
    if (scope === 'plain') {
      this.filterPlain.set(FILTER_DEFAULTS);
      return;
    }

    this.filterTailwind.set(FILTER_DEFAULTS);
  }

  protected readonly statuses = STATUS_DEFAULTS;
}
