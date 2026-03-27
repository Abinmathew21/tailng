import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngTag } from '@tailng-ui/components';
import {
  TngTag as TngTagPrimitive,
  TngTagClose,
  TngTagIcon,
} from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

type TagTone = 'danger' | 'info' | 'neutral' | 'success' | 'warning';
type ExampleVariant = 'headless' | 'plain' | 'tailwind';

type TagItem = Readonly<{
  id: string;
  label: string;
  tone: TagTone;
}>;

const FILTER_DEFAULTS: readonly TagItem[] = Object.freeze([
  { id: 'angular', label: 'Angular', tone: 'info' },
  { id: 'a11y', label: 'A11y', tone: 'success' },
  { id: 'design', label: 'Design', tone: 'warning' },
]);

const STATUS_DEFAULTS: readonly TagItem[] = Object.freeze([
  { id: 'new', label: 'New', tone: 'info' },
  { id: 'beta', label: 'Beta', tone: 'warning' },
  { id: 'error', label: 'Blocked', tone: 'danger' },
  { id: 'stable', label: 'Stable', tone: 'success' },
]);

function createCodeTabs(
  baseName: string,
  tsCode: string,
  htmlCode: string,
  cssCode: string,
): readonly DocsExampleCodeTab[] {
  return Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: `${baseName}.component.ts`,
      code: tsCode,
    },
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
  imports: [
    TngTagPrimitive,
    TngTagClose,
    TngTagIcon,
    TngTag,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './tag-examples-page.component.html',
  styleUrl: './tag-examples-page.component.css',
})
export class TagExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly filterHeadless = signal<readonly TagItem[]>(FILTER_DEFAULTS);
  protected readonly filterPlain = signal<readonly TagItem[]>(FILTER_DEFAULTS);
  protected readonly filterTailwind = signal<readonly TagItem[]>(FILTER_DEFAULTS);

  protected readonly statusHeadless = signal<readonly TagItem[]>(STATUS_DEFAULTS);
  protected readonly statusPlain = signal<readonly TagItem[]>(STATUS_DEFAULTS);
  protected readonly statusTailwind = signal<readonly TagItem[]>(STATUS_DEFAULTS);

  protected readonly filterHeadlessTabs = createCodeTabs(
    'tag-examples-filter-headless',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngTag, TngTagIcon, TngTagClose } from '@tailng-ui/primitives';",
      '',
      'export class TagFilterHeadlessExample {',
      "  readonly tags = signal(['Angular', 'A11y', 'Design']);",
      '}',
      '',
    ].join('\n'),
    [
      '<span tngTag [tngTagRemovable]="true" [tngTagLabel]="tag" (tngTagRemoved)="remove(tag)">',
      '  <span tngTagIcon aria-hidden="true">●</span>',
      '  {{ tag }}',
      '  <button tngTagClose type="button"><span aria-hidden="true">×</span></button>',
      '</span>',
      '',
    ].join('\n'),
    '.tag-chip { display: inline-flex; gap: 0.35rem; }',
  );

  protected readonly filterPlainTabs = createCodeTabs(
    'tag-examples-filter-plain-css',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngTag } from '@tailng-ui/components';",
      '',
      'export class TagFilterPlainCssExample {',
      "  readonly tags = signal(['Angular', 'A11y', 'Design']);",
      '}',
      '',
    ].join('\n'),
    [
      '<tng-tag [tone]="tone" [label]="tag" [removable]="true" (removed)="remove(tag)">',
      '  <span tngTagIcon aria-hidden="true">●</span>',
      '  {{ tag }}',
      '</tng-tag>',
      '',
    ].join('\n'),
    '.tag-stack { display: flex; flex-wrap: wrap; gap: 0.75rem; }',
  );

  protected readonly filterTailwindTabs = createCodeTabs(
    'tag-examples-filter-tailwind',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngTag } from '@tailng-ui/components';",
      '',
      'export class TagFilterTailwindExample {',
      "  readonly tags = signal(['Angular', 'A11y', 'Design']);",
      '}',
      '',
    ].join('\n'),
    [
      '<div class="flex flex-wrap gap-3">',
      '  <tng-tag',
      '    [tone]="tone"',
      '    [label]="tag"',
      '    [removable]="true"',
      '    class="text-slate-900 dark:text-slate-100"',
      '  >',
      '    <span tngTagIcon aria-hidden="true">●</span>',
      '    {{ tag }}',
      '  </tng-tag>',
      '</div>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
  );

  protected readonly statusHeadlessTabs = createCodeTabs(
    'tag-examples-status-headless',
    [
      "import { Component } from '@angular/core';",
      "import { TngTag } from '@tailng-ui/primitives';",
      '',
      'export class TagStatusHeadlessExample {}',
      '',
    ].join('\n'),
    [
      '<span tngTag class="tag-chip tag-tone-info">New</span>',
      '<span tngTag class="tag-chip tag-tone-warning">Beta</span>',
      '<span tngTag class="tag-chip tag-tone-danger">Blocked</span>',
      '<span tngTag class="tag-chip tag-tone-success">Stable</span>',
      '',
    ].join('\n'),
    '.tag-tone-info { color: var(--tng-semantic-accent-brand); }',
  );

  protected readonly statusPlainTabs = createCodeTabs(
    'tag-examples-status-plain-css',
    [
      "import { Component } from '@angular/core';",
      "import { TngTag } from '@tailng-ui/components';",
      '',
      'export class TagStatusPlainCssExample {}',
      '',
    ].join('\n'),
    [
      '<tng-tag tone="info">New</tng-tag>',
      '<tng-tag tone="warning" appearance="outline">Beta</tng-tag>',
      '<tng-tag tone="danger">Blocked</tng-tag>',
      '<tng-tag tone="success" appearance="solid">Stable</tng-tag>',
      '',
    ].join('\n'),
    '.status-row { display: flex; flex-wrap: wrap; gap: 0.75rem; }',
  );

  protected readonly statusTailwindTabs = createCodeTabs(
    'tag-examples-status-tailwind',
    [
      "import { Component } from '@angular/core';",
      "import { TngTag } from '@tailng-ui/components';",
      '',
      'export class TagStatusTailwindExample {}',
      '',
    ].join('\n'),
    [
      '<div class="flex flex-wrap gap-3">',
      '  <tng-tag tone="info" class="text-slate-900 dark:text-slate-100">New</tng-tag>',
      '  <tng-tag tone="warning" appearance="outline" class="text-slate-900 dark:text-slate-100">Beta</tng-tag>',
      '  <tng-tag tone="danger" class="text-slate-900 dark:text-slate-100">Blocked</tng-tag>',
      '  <tng-tag tone="success" appearance="solid" class="text-slate-900 dark:text-slate-100">Stable</tng-tag>',
      '</div>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected removeFilter(scope: ExampleVariant, tagId: string): void {
    if (scope === 'headless') {
      this.filterHeadless.update((tags) => tags.filter((tag) => tag.id !== tagId));
      return;
    }

    if (scope === 'plain') {
      this.filterPlain.update((tags) => tags.filter((tag) => tag.id !== tagId));
      return;
    }

    this.filterTailwind.update((tags) => tags.filter((tag) => tag.id !== tagId));
  }

  protected resetFilters(scope: ExampleVariant): void {
    if (scope === 'headless') {
      this.filterHeadless.set(FILTER_DEFAULTS);
      return;
    }

    if (scope === 'plain') {
      this.filterPlain.set(FILTER_DEFAULTS);
      return;
    }

    this.filterTailwind.set(FILTER_DEFAULTS);
  }

  protected resetStatuses(scope: ExampleVariant): void {
    if (scope === 'headless') {
      this.statusHeadless.set(STATUS_DEFAULTS);
      return;
    }

    if (scope === 'plain') {
      this.statusPlain.set(STATUS_DEFAULTS);
      return;
    }

    this.statusTailwind.set(STATUS_DEFAULTS);
  }

}
