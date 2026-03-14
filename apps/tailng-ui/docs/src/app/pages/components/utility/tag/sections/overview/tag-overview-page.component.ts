import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngTag } from '@tailng-ui/components';
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

type TagVariant = 'headless' | 'plain' | 'tailwind';

type TagItem = Readonly<{
  id: string;
  label: string;
  tone: TagTone;
}>;

const HEADLESS_DEFAULT_TAGS: readonly TagItem[] = Object.freeze([
  { id: 'draft', label: 'Draft', tone: 'info' },
  { id: 'review', label: 'Review', tone: 'warning' },
  { id: 'stable', label: 'Stable', tone: 'success' },
]);

const PLAIN_DEFAULT_TAGS: readonly TagItem[] = Object.freeze([
  { id: 'api', label: 'API', tone: 'neutral' },
  { id: 'docs', label: 'Docs', tone: 'info' },
  { id: 'release', label: 'Release', tone: 'danger' },
]);

const TAILWIND_DEFAULT_TAGS: readonly TagItem[] = Object.freeze([
  { id: 'alpha', label: 'Alpha', tone: 'warning' },
  { id: 'beta', label: 'Beta', tone: 'info' },
  { id: 'ga', label: 'GA', tone: 'success' },
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
  selector: 'app-tag-overview-page',
  imports: [
    TngTagPrimitive,
    TngTagIcon,
    TngTagClose,
    TngTag,
    TngCodeBlockComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './tag-overview-page.component.html',
  styleUrl: './tag-overview-page.component.css',
})
export class TagOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  protected readonly primitiveImportCode = [
    "import { TngTag, TngTagIcon, TngTagClose } from '@tailng-ui/primitives';",
    '',
  ].join('\n');

  protected readonly componentImportCode = [
    "import { TngTag } from '@tailng-ui/components';",
    '',
  ].join('\n');

  protected readonly primitiveUsageCode = [
    '<span',
    '  tngTag',
    '  [tngTagLabel]="status"',
    '  [tngTagRemovable]="true"',
    '  (tngTagRemoved)="removeStatus()"',
    '>',
    '  <span tngTagIcon aria-hidden="true">●</span>',
    '  {{ status }}',
    '  <button tngTagClose type="button"><span aria-hidden="true">×</span></button>',
    '</span>',
    '',
  ].join('\n');

  protected readonly componentUsageCode = [
    '<tng-tag',
    '  tone="info"',
    '  [removable]="true"',
    '  label="Beta"',
    '  (removed)="onRemoved()"',
    '>',
    '  <span tngTagIcon aria-hidden="true">●</span>',
    '  Beta',
    '</tng-tag>',
    '',
  ].join('\n');

  protected readonly headlessTags = signal<readonly TagItem[]>(HEADLESS_DEFAULT_TAGS);
  protected readonly plainTags = signal<readonly TagItem[]>(PLAIN_DEFAULT_TAGS);
  protected readonly tailwindTags = signal<readonly TagItem[]>(TAILWIND_DEFAULT_TAGS);

  protected readonly headlessCodeTabs = createCodeTabs(
    'tag-overview-headless',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngTag, TngTagIcon, TngTagClose } from '@tailng-ui/primitives';",
      '',
      'export class TagOverviewHeadlessComponent {',
      "  readonly tags = signal(['Draft', 'Review', 'Stable']);",
      '}',
      '',
    ].join('\n'),
    [
      '<span',
      '  tngTag',
      '  [tngTagRemovable]="true"',
      '  [tngTagLabel]="tag"',
      '  (tngTagRemoved)="removeTag(tag)"',
      '>',
      '  <span tngTagIcon aria-hidden="true">●</span>',
      '  {{ tag }}',
      '  <button tngTagClose type="button"><span aria-hidden="true">×</span></button>',
      '</span>',
      '',
    ].join('\n'),
    [
      '.tag-chip {',
      '  border-radius: 9999px;',
      '  display: inline-flex;',
      '  gap: 0.35rem;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly plainCodeTabs = createCodeTabs(
    'tag-overview-plain-css',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngTag } from '@tailng-ui/components';",
      '',
      'export class TagOverviewPlainCssComponent {',
      "  readonly tags = signal(['API', 'Docs', 'Release']);",
      '}',
      '',
    ].join('\n'),
    [
      '<tng-tag',
      '  [tone]="tone"',
      '  [removable]="true"',
      '  [label]="tag"',
      '  (removed)="removeTag(tag)"',
      '>',
      '  <span tngTagIcon aria-hidden="true">●</span>',
      '  {{ tag }}',
      '</tng-tag>',
      '',
    ].join('\n'),
    [
      '.tag-shell {',
      '  border: 1px solid var(--tng-semantic-border-subtle);',
      '  border-radius: 0.85rem;',
      '  padding: 0.95rem;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly tailwindCodeTabs = createCodeTabs(
    'tag-overview-tailwind',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngTag } from '@tailng-ui/components';",
      '',
      'export class TagOverviewTailwindComponent {',
      "  readonly tags = signal(['Alpha', 'Beta', 'GA']);",
      '}',
      '',
    ].join('\n'),
    [
      '<div class="flex flex-wrap gap-3">',
      '  <tng-tag',
      '    tone="info"',
      '    [removable]="true"',
      '    [label]="tag"',
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

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected removeTag(scope: TagVariant, tagId: string): void {
    if (scope === 'headless') {
      this.headlessTags.update((tags) => tags.filter((tag) => tag.id !== tagId));
      return;
    }

    if (scope === 'plain') {
      this.plainTags.update((tags) => tags.filter((tag) => tag.id !== tagId));
      return;
    }

    this.tailwindTags.update((tags) => tags.filter((tag) => tag.id !== tagId));
  }

  protected reset(scope: TagVariant): void {
    if (scope === 'headless') {
      this.headlessTags.set(HEADLESS_DEFAULT_TAGS);
      return;
    }

    if (scope === 'plain') {
      this.plainTags.set(PLAIN_DEFAULT_TAGS);
      return;
    }

    this.tailwindTags.set(TAILWIND_DEFAULT_TAGS);
  }

  protected summary(scope: TagVariant): string {
    if (scope === 'headless') {
      return this.headlessTags()
        .map((tag) => tag.label)
        .join(', ');
    }

    if (scope === 'plain') {
      return this.plainTags()
        .map((tag) => tag.label)
        .join(', ');
    }

    return this.tailwindTags()
      .map((tag) => tag.label)
      .join(', ');
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
