import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { TngTag, TngTagClose, TngTagIcon } from '@tailng-ui/primitives';
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
  { id: 'draft', label: 'Draft', tone: 'info' },
  { id: 'review', label: 'Review', tone: 'warning' },
  { id: 'stable', label: 'Stable', tone: 'success' },
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
  selector: 'app-headless-tag-overview-page',
  imports: [
    TngTag,
    TngTagClose,
    TngTagIcon,
    TngCodeBlockComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './tag-overview-page.component.html',
  styleUrl: './tag-overview-page.component.css',
})
export class HeadlessTagOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly importCode =
    "import { TngTag, TngTagClose, TngTagIcon } from '@tailng-ui/primitives';";
  protected readonly basicUsageCode = [
    '<span',
    '  tngTag',
    '  [tngTagLabel]="status"',
    '  [tngTagRemovable]="true"',
    '  (tngTagRemoved)="removeStatus()"',
    '>',
    '  <span tngTagIcon aria-hidden="true">●</span>',
    '  {{ status }}',
    '  <button type="button" tngTagClose><span aria-hidden="true">×</span></button>',
    '</span>',
    '',
  ].join('\n');

  protected readonly plainTags = signal<readonly TagItem[]>(PLAIN_DEFAULT_TAGS);
  protected readonly tailwindTags = signal<readonly TagItem[]>(TAILWIND_DEFAULT_TAGS);

  protected readonly plainCodeTabs = createCodeTabs(
    'headless-tag-overview-plain-css',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngTag, TngTagClose, TngTagIcon } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-headless-tag-overview-plain-css',",
      '  standalone: true,',
      '  imports: [TngTag, TngTagIcon, TngTagClose],',
      "  templateUrl: './headless-tag-overview-plain-css.component.html',",
      "  styleUrl: './headless-tag-overview-plain-css.component.css',",
      '})',
      'export class HeadlessTagOverviewPlainCssComponent {',
      "  protected readonly tags = signal(['Draft', 'Review', 'Stable']);",
      '}',
    ].join('\n'),
    [
      '<span tngTag [tngTagLabel]="tag" [tngTagRemovable]="true" class="tag-chip">',
      '  <span tngTagIcon aria-hidden="true">●</span>',
      '  {{ tag }}',
      '  <button type="button" tngTagClose><span aria-hidden="true">×</span></button>',
      '</span>',
      '',
    ].join('\n'),
    '.tag-preview-row { display: flex; flex-wrap: wrap; gap: 0.75rem; }',
  );

  protected readonly tailwindCodeTabs = createCodeTabs(
    'headless-tag-overview-tailwind',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngTag, TngTagClose, TngTagIcon } from '@tailng-ui/primitives';",
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
      "  selector: 'app-headless-tag-overview-tailwind',",
      '  standalone: true,',
      '  imports: [TngTag, TngTagIcon, TngTagClose],',
      "  templateUrl: './headless-tag-overview-tailwind.component.html',",
      "  styleUrl: './headless-tag-overview-tailwind.component.css',",
      '})',
      'export class HeadlessTagOverviewTailwindComponent {',
      '  protected readonly tags = signal<readonly TagItem[]>(DEFAULT_TAGS);',
      '',
      '  protected chipTailwindHostClass(tone: TagTone): string {',
      "    const layout = 'inline-flex items-center gap-1 rounded-full border border-transparent px-[0.65rem] py-1 text-xs font-semibold min-h-[1.65rem]';",
      "    switch (tone) {",
      "      case 'neutral':",
      "        return `${layout} bg-tng-bg-muted text-tng-fg-primary`;",
      "      case 'info':",
      "        return `${layout} bg-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_20%,transparent)] text-tng-accent-brand`;",
      "      case 'success':",
      "        return `${layout} bg-[color-mix(in_srgb,var(--tng-semantic-accent-success)_20%,transparent)] text-tng-accent-success`;",
      "      case 'warning':",
      "        return `${layout} bg-[color-mix(in_srgb,var(--tng-semantic-foreground-secondary)_20%,transparent)] text-tng-fg-secondary`;",
      "      case 'danger':",
      "        return `${layout} bg-[color-mix(in_srgb,var(--tng-semantic-accent-danger)_20%,transparent)] text-tng-accent-danger`;",
      '    }',
      '  }',
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
      '      <span',
      '        tngTag',
      '        [tngTagLabel]="tag.label"',
      '        [tngTagRemovable]="true"',
      '        [class]="chipTailwindHostClass(tag.tone)"',
      '        (tngTagRemoved)="removeTag(tag.id)"',
      '      >',
      '        <span tngTagIcon aria-hidden="true" class="text-[0.7em]">●</span>',
      '        {{ tag.label }}',
      '        <button type="button" tngTagClose class="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-current opacity-80 transition hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--tng-semantic-focus-ring)_40%,transparent)] focus-visible:ring-offset-1 focus-visible:ring-offset-[color-mix(in_srgb,var(--tng-semantic-background-surface)_70%,transparent)]">',
      '          <span aria-hidden="true">×</span>',
      '        </button>',
      '      </span>',
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

  protected chipTailwindHostClass(tone: TagTone): string {
    const layout =
      'inline-flex items-center gap-1 rounded-full border border-transparent px-[0.65rem] py-1 text-xs font-semibold min-h-[1.65rem]';
    switch (tone) {
      case 'neutral':
        return `${layout} bg-tng-bg-muted text-tng-fg-primary`;
      case 'info':
        return `${layout} bg-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_20%,transparent)] text-tng-accent-brand`;
      case 'success':
        return `${layout} bg-[color-mix(in_srgb,var(--tng-semantic-accent-success)_20%,transparent)] text-tng-accent-success`;
      case 'warning':
        return `${layout} bg-[color-mix(in_srgb,var(--tng-semantic-foreground-secondary)_20%,transparent)] text-tng-fg-secondary`;
      case 'danger':
        return `${layout} bg-[color-mix(in_srgb,var(--tng-semantic-accent-danger)_20%,transparent)] text-tng-accent-danger`;
    }
  }
}
