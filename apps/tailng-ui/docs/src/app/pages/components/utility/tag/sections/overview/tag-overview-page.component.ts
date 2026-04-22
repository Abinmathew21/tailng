import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngTag } from '@tailng-ui/components';
import { TngTagIcon } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';

type TagTone = 'danger' | 'info' | 'neutral' | 'success' | 'warning';
type TagVariant = 'plain' | 'tailwind';
type TagItem = Readonly<{ id: string; label: string; tone: TagTone }>;

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
  selector: 'app-tag-overview-page',
  imports: [
    TngTag,
    TngTagIcon,
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
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly componentImportCode = "import { TngTag } from '@tailng-ui/components';";
  protected readonly projectedPrimitiveImportCode =
    "import { TngTagIcon } from '@tailng-ui/primitives';";
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

  protected readonly plainTags = signal<readonly TagItem[]>(PLAIN_DEFAULT_TAGS);
  protected readonly tailwindTags = signal<readonly TagItem[]>(TAILWIND_DEFAULT_TAGS);

  protected readonly plainCodeTabs = createCodeTabs(
    'tag-overview-plain-css',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngTag } from '@tailng-ui/components';",
      "import { TngTagIcon } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-tag-overview-plain-css',",
      '  standalone: true,',
      '  imports: [TngTag, TngTagIcon],',
      "  templateUrl: './tag-overview-plain-css.component.html',",
      "  styleUrl: './tag-overview-plain-css.component.css',",
      '})',
      'export class TagOverviewPlainCssComponent {',
      "  protected readonly tags = signal(['API', 'Docs', 'Release']);",
      '}',
    ].join('\n'),
    [
      '<div class="tag-preview-row">',
      '  <tng-tag tone="neutral" [removable]="true" label="API">',
      '    <span tngTagIcon aria-hidden="true">●</span>',
      '    API',
      '  </tng-tag>',
      '</div>',
      '',
    ].join('\n'),
    '.tag-preview-row { display: flex; flex-wrap: wrap; gap: 0.75rem; }',
  );

  protected readonly tailwindCodeTabs = createCodeTabs(
    'tag-overview-tailwind',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngTag } from '@tailng-ui/components';",
      "import { TngTagIcon } from '@tailng-ui/primitives';",
      '',
      "type TagTone = 'danger' | 'info' | 'neutral' | 'success' | 'warning';",
      "type TagItem = Readonly<{ id: string; label: string; tone: TagTone }>;",
      '',
      'const DEFAULT_TAGS: readonly TagItem[] = [',
      "  { id: 'alpha', label: 'Alpha', tone: 'warning' },",
      "  { id: 'beta', label: 'Beta', tone: 'info' },",
      "  { id: 'ga', label: 'GA', tone: 'success' },",
      '];',
      '',
      '@Component({',
      "  selector: 'app-tag-overview-tailwind',",
      '  standalone: true,',
      '  imports: [TngTag, TngTagIcon],',
      "  templateUrl: './tag-overview-tailwind.component.html',",
      "  styleUrl: './tag-overview-tailwind.component.css',",
      '})',
      'export class TagOverviewTailwindComponent {',
      '  protected readonly tags = signal<readonly TagItem[]>(DEFAULT_TAGS);',
      '',
      '  protected removeTag(tagId: string): void {',
      '    this.tags.update((items) => items.filter((tag) => tag.id !== tagId));',
      '  }',
      '',
      '  protected reset(): void {',
      '    this.tags.set(DEFAULT_TAGS);',
      '  }',
      '',
      '  protected summary(): string {',
      '    return this.tags().map((tag) => tag.label).join(\', \');',
      '  }',
      '}',
    ].join('\n'),
    [
      '<div class="flex flex-col gap-3 rounded-2xl border border-tng-border-subtle bg-tng-bg-surface p-4 text-tng-fg-primary shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--tng-semantic-border-subtle)_55%,transparent)]">',
      '  <div class="flex flex-wrap gap-3">',
      '    @for (tag of tags(); track tag.id) {',
      '      <tng-tag [tone]="tag.tone" [label]="tag.label" [removable]="true" class="text-tng-fg-primary" (removed)="removeTag(tag.id)">',
      '        <span tngTagIcon aria-hidden="true" class="text-[0.7em]">●</span>',
      '        {{ tag.label }}',
      '      </tng-tag>',
      '    }',
      '  </div>',
      '  <div class="flex flex-wrap gap-2">',
      '    <button type="button" class="inline-flex min-h-8 items-center rounded-md border border-[var(--tng-semantic-border-default)] px-3 text-xs font-semibold text-tng-fg-primary transition hover:bg-tng-bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--tng-semantic-focus-ring)_40%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-tng-bg-surface" (click)="reset()">Reset</button>',
      '  </div>',
      '  <p class="m-0 text-sm text-tng-fg-secondary">{{ summary() || \'No tags\' }}</p>',
      '</div>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected removeTag(scope: TagVariant, tagId: string): void {
    if (scope === 'plain') {
      this.plainTags.update((tags) => tags.filter((tag) => tag.id !== tagId));
      return;
    }

    this.tailwindTags.update((tags) => tags.filter((tag) => tag.id !== tagId));
  }

  protected reset(scope: TagVariant): void {
    if (scope === 'plain') {
      this.plainTags.set(PLAIN_DEFAULT_TAGS);
      return;
    }

    this.tailwindTags.set(TAILWIND_DEFAULT_TAGS);
  }

  protected summary(scope: TagVariant): string {
    const labels = (scope === 'plain' ? this.plainTags() : this.tailwindTags()).map((tag) => tag.label);
    return labels.join(', ');
  }
}
